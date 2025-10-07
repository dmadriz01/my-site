"use client";

import { useEffect, useState } from "react";

type Theme = "light" | "dark";

function setThemeAttr(next: Theme) {
  // disabled: no SSR theme mutation
  localStorage.setItem("theme", next);
  // ✅ also persist to cookie so SSR matches exactly
  document.cookie = `theme=${next}; path=/; max-age=31536000; samesite=lax`;
}

export default function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    // read cookie first (so it matches SSR)
    const cookieMatch = document.cookie.match(/(?:^|; )theme=(light|dark)/);
    const cookieTheme = (cookieMatch?.[1] as Theme) || null;
    const stored = (localStorage.getItem("theme") as Theme) || null;

    const initial: Theme =
      cookieTheme ?? stored ?? (window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light");

    setTheme(initial);
    setThemeAttr(initial);
    setMounted(true);
  }, []);

  const toggle = () => {
    const next: Theme = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setThemeAttr(next);
  };

  if (!mounted) {
    return (
      <button aria-label="Toggle theme" className="rounded-md border px-3 py-1 text-sm opacity-75" suppressHydrationWarning>
        …
      </button>
    );
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle theme"
      className="rounded-md border px-3 py-1 text-sm hover:bg-zinc-100 dark:hover:bg-zinc-800 transition"
    >
      {theme === "dark" ? "☀️ Light" : "🌙 Dark"}
    </button>
  );
}
