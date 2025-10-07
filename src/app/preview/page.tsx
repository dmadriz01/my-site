"use client";

import React, { useState } from "react";

/** Rough-draft preview page */
export default function PreviewSite() {
  const [active, setActive] = useState<"home"|"projects"|"blog"|"about">("home");
  return (
    <div className="min-h-screen">
      <header className="border-b px-6 py-4 flex gap-3">
        {["home","projects","blog","about"].map(k => (
          <button
            key={k}
            onClick={() => setActive(k as any)}
            className={`rounded px-3 py-1.5 ${active===k ? "bg-black text-white" : "hover:bg-zinc-100"}`}
          >
            {k[0].toUpperCase()+k.slice(1)}
          </button>
        ))}
      </header>

      {active === "home" && (
        <main className="p-6">
          <h1 className="text-3xl font-bold">Home (mock)</h1>
          <p className="text-zinc-600 mt-2">Hero + highlights preview.</p>
        </main>
      )}

      {active === "projects" && (
        <main className="p-6">
          <h1 className="text-3xl font-bold">Projects (mock)</h1>
          <ul className="mt-4 space-y-3">
            <li className="border rounded p-4">Fraud Detection CNN</li>
            <li className="border rounded p-4">Causal Uplift Model</li>
            <li className="border rounded p-4">EDA on SF Transit</li>
          </ul>
        </main>
      )}

      {active === "blog" && (
        <main className="p-6">
          <h1 className="text-3xl font-bold">Blog (mock)</h1>
          <p className="text-zinc-600 mt-2">List of posts preview.</p>
        </main>
      )}

      {active === "about" && (
        <main className="p-6">
          <h1 className="text-3xl font-bold">About (mock)</h1>
          <p className="text-zinc-600 mt-2">Short bio & links preview.</p>
        </main>
      )}
    </div>
  );
}