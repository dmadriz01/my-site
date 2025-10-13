// src/lib/db.ts
// Shared Postgres pool for serverless environments (Vercel/Neon)
import { Pool } from "pg";

// Cache the pool on the globalThis object to avoid exhausting connections
const g = globalThis as unknown as { __PG_POOL__?: Pool };

export function getPool() {
  if (!g.__PG_POOL__) {
    const conn = process.env.POSTGRES_URL;
    if (!conn) throw new Error("POSTGRES_URL is not set");
    g.__PG_POOL__ = new Pool({
      connectionString: conn,
      max: 5,
      idleTimeoutMillis: 30_000,
    });
  }
  return g.__PG_POOL__ as Pool;
}