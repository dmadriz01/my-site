import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen animate-fade-in">
      {/* Hero */}
      <section className="mx-auto max-w-5xl px-6 pt-16 pb-12 md:pt-24">
        <div className="grid items-center gap-8 md:grid-cols-2">
          <div>
            <span className="inline-block rounded-full px-3 py-1 text-xs tracking-wide text-zinc-600">
              Data Science · ML · Analytics
            </span>
            <h1 className="mt-4 text-4xl md:text-5xl font-extrabold tracking-tight text-zinc-900">
              David Madriz
            </h1>
            <p className="mt-3 max-w-prose text-lg leading-relaxed text-zinc-600">
              I build data products and write about modeling, experimentation, and analytics.
              Explore my projects and notes below.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/projects"
                className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-zinc-900 hover:shadow-md transition"
              >
                View Projects
              </Link>
              <Link
                href="/blog"
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition"
              >
                Read Blog
              </Link>
              <a
                href="/resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border px-4 py-2 text-sm font-medium hover:bg-zinc-100 transition"
              >
                Résumé (PDF)
              </a>
            </div>
          </div>

          {/* Hero art placeholder */}
          <div className="h-56 md:h-72" />
        </div>
      </section>

      {/* Quick sections */}
      <section className="mx-auto max-w-5xl px-6 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          <article className="p-5 transition-colors">
            <h3 className="text-lg font-semibold">Recent Project</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Highlight a recent ML or analytics build with a one-liner outcome.
            </p>
            <Link href="/projects" className="mt-3 inline-block text-sm underline">
              See projects →
            </Link>
          </article>

          <article className="p-5 transition-colors">
            <h3 className="text-lg font-semibold">Latest Post</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Tease your newest blog post, tutorial, or analysis note.
            </p>
            <Link href="/blog" className="mt-3 inline-block text-sm underline">
              Read the blog →
            </Link>
          </article>

          <article className="p-5 transition-colors">
            <h3 className="text-lg font-semibold">About</h3>
            <p className="mt-1 text-sm text-zinc-600">
              Short bio and how to reach me for collaborations and opportunities.
            </p>
            <Link href="/about" className="mt-3 inline-block text-sm underline">
              More about me →
            </Link>
          </article>
        </div>
      </section>
    </main>
  );
}