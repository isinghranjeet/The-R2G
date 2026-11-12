import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  Link,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
  type ErrorComponentProps,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";
import {
  AlertTriangle,
  ArrowLeft,
  Compass,
  Cuboid,
  GraduationCap,
  Printer,
  RefreshCw,
  Trophy,
} from "lucide-react";

import appCss from "../styles.css?url";
import { reportAppError } from "../lib/error-reporting";
import { CadBlueprintBackdrop } from "../components/CadBlueprintBackdrop";

function ScrollProgressRibbon() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight =
        document.documentElement.scrollHeight - document.documentElement.clientHeight;
      setProgress(docHeight > 0 ? Math.min(100, Math.round((scrollTop / docHeight) * 100)) : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed top-0 right-0 left-0 z-50 h-[2px] bg-transparent"
    >
      <div
        className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-sky-400 transition-[width] duration-100"
        style={{ width: `${progress}%` }}
      />
    </div>
  );
}

function NotFoundComponent() {
  return (
    <div className="r2g-site relative flex min-h-screen items-center justify-center overflow-hidden bg-[#060b14] px-4 text-slate-100">
      <div className="hero-grid-overlay" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-lg rounded-2xl border border-slate-800 bg-[#091222]/90 p-8 text-center shadow-2xl backdrop-blur-xl">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-amber-400/30 bg-amber-400/15 text-amber-400">
          <Compass className="h-7 w-7" />
        </div>
        <span className="mt-4 inline-block font-mono text-xs font-bold tracking-widest text-amber-400">
          CAD DIAGNOSTIC · ERROR 404
        </span>
        <h1 className="mt-2 text-4xl font-bold text-white">Geometry Not Found</h1>
        <p className="mt-2 text-sm leading-relaxed text-slate-400">
          The route or blueprint coordinate you requested doesn&apos;t exist in the R2G Learn CAD workspace.
        </p>

        <div className="mt-6 grid grid-cols-2 gap-2.5 text-left text-xs">
          <Link
            to="/courses"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <GraduationCap className="h-4 w-4 text-amber-400" /> All CAD Courses
          </Link>
          <Link
            to="/printing"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <Printer className="h-4 w-4 text-sky-400" /> 3D .STL Print Lab
          </Link>
          <Link
            to="/quiz"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <Trophy className="h-4 w-4 text-emerald-400" /> Scholarship Quiz
          </Link>
          <Link
            to="/student-portal"
            className="flex items-center gap-2 rounded-xl border border-slate-800 bg-slate-950/70 p-3 text-slate-200 transition hover:border-amber-400/50 hover:text-amber-300"
          >
            <Cuboid className="h-4 w-4 text-amber-400" /> Student Portal
          </Link>
        </div>

        <div className="mt-6">
          <Link
            to="/"
            className="gold-button inline-flex items-center justify-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold"
          >
            <ArrowLeft className="h-4 w-4" /> Return to Main Studio
          </Link>
        </div>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: ErrorComponentProps) {
  console.error(error);
  const router = useRouter();
  useEffect(() => {
    reportAppError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="r2g-site flex min-h-screen items-center justify-center bg-[#060b14] px-4 text-slate-100">
      <div className="w-full max-w-md rounded-2xl border border-rose-500/30 bg-[#0a1220] p-8 text-center shadow-2xl">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-rose-500/15 text-rose-400">
          <AlertTriangle className="h-6 w-6" />
        </div>
        <span className="mt-3 inline-block font-mono text-[11px] font-semibold tracking-wider text-rose-400">
          RUNTIME EXCEPTION INTERRUPT
        </span>
        <h1 className="mt-1.5 text-xl font-bold text-white">Viewport Failed to Render</h1>
        <p className="mt-2 text-xs leading-relaxed text-slate-400">
          A temporary rendering error occurred. Reload the workspace or return to the home studio.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button
            type="button"
            onClick={() => {
              router.invalidate();
              reset();
            }}
            className="gold-button inline-flex items-center gap-1.5 rounded-lg px-4 py-2 text-xs font-bold"
          >
            <RefreshCw className="h-3.5 w-3.5" /> Reinitialize View
          </button>
          <a
            href="/"
            className="inline-flex items-center justify-center rounded-lg border border-slate-700 bg-slate-900 px-4 py-2 text-xs font-semibold text-slate-200 transition hover:border-amber-400"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "R2G Learn CAD | Institute of Design & Drafting · Faridabad" },
      {
        name: "description",
        content:
          "Hands-on practical training on SolidWorks, AutoCAD 2D/3D, Siemens NX, Creo, CATIA, ANSYS & 3D Printing with ISO 9001:2015 certification.",
      },
      { name: "author", content: "R2G Learn CAD" },
      { property: "og:title", content: "R2G Learn CAD | Institute of Design & Drafting" },
      {
        property: "og:description",
        content:
          "Master Industrial CAD/CAM & 3D Printing with real-world engineering projects and placement support in Faridabad.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <ScrollProgressRibbon />
      <CadBlueprintBackdrop />
      <Outlet />
    </QueryClientProvider>
  );
}