// src/app/api/collect/route.ts
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { z } from "zod";
import { getPool } from "../../../lib/db"; // keep this import

// ------------ Inline schema (temporary to unblock) ------------
const EventType = z.enum(["page_view", "click", "custom"]);

const CommonProps = z.object({
  page_url: z.string().url().optional(),
  page_path: z.string().min(1).optional(),
  page_title: z.string().optional(),
  referrer: z.string().optional(),
  utm_source: z.string().optional(),
  utm_medium: z.string().optional(),
  utm_campaign: z.string().optional(),
  utm_term: z.string().optional(),
  utm_content: z.string().optional(),
  viewport_w: z.number().int().optional(),
  viewport_h: z.number().int().optional(),
  locale: z.string().optional(),
});
const PageViewProps = CommonProps.extend({
  scroll_pct_max: z.number().int().min(0).max(100).optional(),
  engagement_ms: z.number().int().min(0).optional(),
});
const ClickProps = CommonProps.extend({
  selector: z.string().max(128).optional(),
  text_sample: z.string().max(64).optional(),
});
const CustomProps = z.record(z.any()).default({});

const Envelope = z
  .object({
    event_id: z.string().uuid(),
    event_type: EventType,
    schema_version: z.number().int().min(1).default(1),
    sent_at: z.string().datetime(),
    source: z.enum(["web_client", "web_server"]),
    user_id: z.string().min(1).optional().nullable(),
    device_id: z.string().min(1),
    session_id: z.string().min(1),
    user_agent: z.string().min(1).max(512),
    privacy_mode: z.enum(["consented", "anonymous"]).default("consented"),
    props: z.union([CustomProps, PageViewProps, ClickProps]).default({}),
  })
  .superRefine((val, ctx) => {
    if (val.event_type === "page_view" && !PageViewProps.safeParse(val.props).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid props for page_view" });
    }
    if (val.event_type === "click" && !ClickProps.safeParse(val.props).success) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Invalid props for click" });
    }
  })
  .refine((d) => !!(d.user_id || d.device_id), {
    message: "Either user_id or device_id must be present",
  });
// --------------------------------------------------------------

// Accept up to 50KB per event
const MAX_BODY_BYTES = 50 * 1024;

export async function GET() {
  return NextResponse.json({ ok: true, route: "/api/collect" });
}

export async function POST(req: NextRequest) {
  const received_at = new Date();

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) {
    return NextResponse.json({ ok: false, error: "payload too large" }, { status: 413 });
  }

  let parsed: z.infer<typeof Envelope>;
  try {
    parsed = Envelope.parse(JSON.parse(raw));
  } catch (e: any) {
    return NextResponse.json(
      { ok: false, error: "invalid schema", detail: e?.message ?? String(e) },
      { status: 400 }
    );
  }

  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "";
  const salt = process.env.HASH_SALT || "dev_salt_change_me";
  const ip_hash = crypto.createHash("sha256").update(ip + salt).digest("hex");

  const props: Record<string, any> = {};
  for (const [k, v] of Object.entries(parsed.props || {})) {
    props[k] = typeof v === "string" ? v.slice(0, 1024) : v;
  }
  delete props.email;
  delete props.name;
  delete props.phone;

  const enriched = {
    ...parsed,
    props,
    received_at: received_at.toISOString(),
    ip_hash,
  };

  try {
    const pool = getPool();
    await pool.query(
      `INSERT INTO bronze_events(event_id, source, payload, received_at)
       VALUES ($1, $2, $3, $4)
       ON CONFLICT (event_id) DO NOTHING`,
      [enriched.event_id, enriched.source ?? "web_client", enriched as any, received_at]
    );
  } catch (err) {
    console.error("bronze insert failed", err);
  }

  return NextResponse.json({ ok: true });
}