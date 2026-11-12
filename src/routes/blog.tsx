import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, BookOpen, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/blog")({
  component: BlogPage,
  head: () => ({
    meta: [{ title: "Engineering Blog & CAD Guides | R2G Learn CAD" }],
  }),
});

const articles = [
  {
    id: 1,
    tag: "CAREER GUIDE",
    title: "SolidWorks vs CATIA V5: Which Should Mechanical Freshers Learn First?",
    date: "Nov 10, 2026",
    readTime: "4 min read",
    excerpt: "Compare part modeling speed, Class-A surface workflows, and OEM hiring demand across Delhi-NCR automotive suppliers.",
    content: "Start with SolidWorks if you are targeting machine design, automation, or consumer products. Move to CATIA V5 if your goal is automotive Body-in-White (BIW) or aerospace surface engineering.",
  },
  {
    id: 2,
    tag: "3D PRINTING",
    title: "FDM vs SLA 3D Printing: Choosing Materials for Functional Prototypes",
    date: "Nov 04, 2026",
    readTime: "5 min read",
    excerpt: "How infill percentage, layer height (0.1mm vs 0.2mm), and filament choice impact mechanical strength and surface finish.",
    content: "Use PETG or Carbon-Fiber reinforced nylon for load-bearing brackets, and Tough SLA Resin when fine dimensional accuracy and smooth aesthetics are critical.",
  },
  {
    id: 3,
    tag: "DRAFTING STANDARDS",
    title: "Top 7 GD&T Mistakes Freshers Make in Production Drawings",
    date: "Oct 26, 2026",
    readTime: "6 min read",
    excerpt: "Avoid over-tolerancing, missing datum reference frames, and ambiguous section views before sending drawings to CNC vendors.",
    content: "Always establish primary, secondary, and tertiary datums based on how the part mounts in the final assembly rather than arbitrary edges.",
  },
];

function BlogPage() {
  const [selectedId, setSelectedId] = useState<number | null>(null);

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <div className="site-container py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mt-6">
          <span className="eyebrow section-eyebrow">R2G ENGINEERING JOURNAL</span>
          <h1 className="mt-2 text-4xl font-bold">CAD/CAM &amp; Prototyping <span className="text-amber-400">Insights.</span></h1>
        </div>

        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {articles.map((post) => (
            <article key={post.id} className="flex flex-col justify-between rounded-xl border border-slate-800 bg-slate-900/70 p-6">
              <div>
                <span className="text-xs font-semibold tracking-wider text-amber-400">{post.tag}</span>
                <h2 className="mt-2 text-xl font-bold leading-snug">{post.title}</h2>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-400">
                  <span className="flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {post.date}</span>
                  <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {post.readTime}</span>
                </div>
                <p className="mt-3 text-sm text-slate-300">{post.excerpt}</p>
                {selectedId === post.id && (
                  <p className="mt-3 rounded-lg border border-amber-400/30 bg-amber-400/10 p-3 text-sm text-amber-100">
                    {post.content}
                  </p>
                )}
              </div>
              <Button
                variant="outline"
                size="sm"
                className="mt-6 w-full border-slate-700"
                onClick={() => setSelectedId(selectedId === post.id ? null : post.id)}
              >
                <BookOpen className="mr-1.5 h-4 w-4" />
                {selectedId === post.id ? "Close Summary" : "Read Key Takeaway"}
              </Button>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}