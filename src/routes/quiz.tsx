import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowLeft,
  ArrowRight,
  Award,
  CheckCircle2,
  Clock3,
  Copy,
  RotateCcw,
  Sparkles,
  Trophy,
  XCircle,
} from "lucide-react";
import { toast } from "sonner";
import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/quiz")({
  component: CadSkillQuizPage,
  head: () => ({
    meta: [{ title: "CAD & GD&T Skill Assessment Quiz | R2G Learn CAD" }],
  }),
});

interface QuizQuestion {
  q: string;
  options: string[];
  answer: number;
  explanation: string;
}

const questions: QuizQuestion[] = [
  {
    q: "In First-Angle Projection (ISO standard), where is the Top View placed relative to the Front View?",
    options: ["Above the Front View", "Below the Front View", "To the right of the Front View", "Inside the Front View"],
    answer: 1,
    explanation: "In ISO First-Angle Projection, the object sits between the observer and projection plane, placing the Top View below the Front View.",
  },
  {
    q: "Which GD&T symbol controls how flat a surface must be regardless of any datum reference?",
    options: ["Perpendicularity", "Flatness", "True Position", "Concentricity"],
    answer: 1,
    explanation: "Flatness is a form tolerance and never uses a datum reference frame.",
  },
  {
    q: "In SolidWorks Sheet Metal, what does the 'K-Factor' represent?",
    options: [
      "Ratio of neutral axis location to material thickness",
      "Maximum tensile stress of sheet steel",
      "Laser cutting feed rate",
      "Minimum hole diameter",
    ],
    answer: 0,
    explanation: "K-Factor = t / T (distance from inside bend face to neutral sheet divided by material thickness).",
  },
  {
    q: "Which CAD surface continuity ensures matching tangent direction AND identical radius of curvature?",
    options: ["G0 (Position)", "G1 (Tangency)", "G2 (Curvature)", "G3 (Acceleration)"],
    answer: 2,
    explanation: "G2 continuity is required for automotive Class-A exterior body panels to avoid light reflection breaks.",
  },
  {
    q: "In FDM 3D printing, which layer height produces the smoothest vertical surface finish?",
    options: ["0.30 mm", "0.20 mm", "0.10 mm", "0.40 mm"],
    answer: 2,
    explanation: "Smaller layer heights (0.10 mm) reduce stair-stepping artifacts on curved surfaces.",
  },
  {
    q: "What is the primary purpose of 'Draft Angle' in injection-molded plastic part design?",
    options: [
      "Increase electrical conductivity",
      "Allow easy ejection of the part from the mold cavity",
      "Reduce part weight by 50%",
      "Eliminate cooling channels",
    ],
    answer: 1,
    explanation: "A 1°–3° draft angle prevents friction and drag marks when ejecting molded parts.",
  },
  {
    q: "In ANSYS FEA, what does a 'Factor of Safety (FoS) < 1.0' indicate under static yield criteria?",
    options: [
      "The component is over-designed",
      "Material yielding / structural failure is predicted",
      "Mesh size is too coarse",
      "Zero thermal expansion",
    ],
    answer: 1,
    explanation: "When maximum von Mises stress exceeds yield strength, FoS drops below 1.0, indicating permanent deformation.",
  },
  {
    q: "Which AutoCAD command creates a parallel copy of a line, circle, or polyline at a specified distance?",
    options: ["TRIM (TR)", "FILLET (F)", "OFFSET (O)", "CHAMFER (CHA)"],
    answer: 2,
    explanation: "OFFSET (O) generates concentric circles or parallel curves at an exact distance.",
  },
];

function CadSkillQuizPage() {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [finished, setFinished] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(8 * 60);

  useEffect(() => {
    if (finished) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          setFinished(true);
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [finished]);

  const currentQ = questions[currentIdx]!;
  const mins = String(Math.floor(secondsLeft / 60)).padStart(2, "0");
  const secs = String(secondsLeft % 60).padStart(2, "0");

  function handleNext() {
    if (selectedOption === null) return;
    const isCorrect = selectedOption === currentQ.answer;
    const nextScore = isCorrect ? score + 1 : score;
    setScore(nextScore);

    if (currentIdx + 1 < questions.length) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
    } else {
      setFinished(true);
    }
  }

  function restartQuiz() {
    setCurrentIdx(0);
    setSelectedOption(null);
    setScore(0);
    setFinished(false);
    setSecondsLeft(8 * 60);
  }

  const percentage = Math.round((score / questions.length) * 100);
  const earnedCoupon = percentage >= 60 ? "CADPRO20" : "R2G2026";

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />
      <Navbar />

      <div className="site-container max-w-3xl py-14">
        <Link to="/" className="inline-flex items-center gap-2 text-xs text-amber-400 hover:underline">
          <ArrowLeft className="h-3.5 w-3.5" /> Back to Home
        </Link>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="eyebrow section-eyebrow">ENGINEERING APTITUDE CHALLENGE</span>
            <h1 className="mt-1 text-3xl font-bold sm:text-4xl">
              CAD &amp; GD&amp;T <span className="text-amber-400">Scholarship Quiz</span>
            </h1>
          </div>

          {!finished && (
            <div className="flex items-center gap-2 rounded-xl border border-amber-400/30 bg-amber-400/10 px-4 py-2 font-mono text-sm font-bold text-amber-300">
              <Clock3 className="h-4 w-4" /> {mins}:{secs}
            </div>
          )}
        </div>

        {!finished ? (
          <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/75 p-6 sm:p-8">
            <div className="flex items-center justify-between text-xs text-slate-400">
              <span>
                QUESTION {currentIdx + 1} OF {questions.length}
              </span>
              <span>SCORE: {score}</span>
            </div>

            <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-800">
              <div
                className="h-full bg-amber-400 transition-all"
                style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
              />
            </div>

            <h2 className="mt-6 text-lg font-bold leading-snug text-white sm:text-xl">{currentQ.q}</h2>

            <div className="mt-5 space-y-3">
              {currentQ.options.map((opt, idx) => {
                const isChosen = selectedOption === idx;
                const isRight = idx === currentQ.answer;
                let style = "border-slate-800 bg-slate-950/70 text-slate-200 hover:border-slate-700";

                if (selectedOption !== null) {
                  if (isRight) style = "border-emerald-500 bg-emerald-500/15 text-emerald-200";
                  else if (isChosen) style = "border-rose-500 bg-rose-500/15 text-rose-200";
                }

                return (
                  <button
                    key={opt}
                    type="button"
                    disabled={selectedOption !== null}
                    onClick={() => setSelectedOption(idx)}
                    className={`flex w-full items-center justify-between rounded-xl border p-4 text-left text-sm transition ${style}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isRight && <CheckCircle2 className="h-4 w-4 text-emerald-400" />}
                    {selectedOption !== null && isChosen && !isRight && <XCircle className="h-4 w-4 text-rose-400" />}
                  </button>
                );
              })}
            </div>

            {selectedOption !== null && (
              <div className="mt-5 rounded-xl border border-slate-700 bg-slate-950/90 p-4 text-xs leading-relaxed text-slate-300">
                <b className="text-amber-400">Engineering Note:</b> {currentQ.explanation}
              </div>
            )}

            <div className="mt-6 flex justify-end">
              <Button className="gold-button" disabled={selectedOption === null} onClick={handleNext}>
                {currentIdx + 1 === questions.length ? "Finish & View Scholarship" : "Next Question"}{" "}
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Button>
            </div>
          </div>
        ) : (
          <div className="mt-8 rounded-2xl border border-amber-400/40 bg-slate-900/85 p-8 text-center">
            <Trophy className="mx-auto h-12 w-12 text-amber-400" />
            <h2 className="mt-3 text-3xl font-bold text-white">
              You Scored {score} / {questions.length} ({percentage}%)
            </h2>
            <p className="mt-2 text-sm text-slate-300">
              {percentage >= 75
                ? "Outstanding CAD/GD&T fundamentals! You qualify for our Advanced SolidWorks / CATIA Fast-Track."
                : "Great effort! Our 12-week practical studio track will build your GD&T and 3D modeling mastery from scratch."}
            </p>

            <div className="mx-auto mt-6 max-w-md rounded-xl border border-emerald-500/40 bg-emerald-500/10 p-5">
              <span className="text-xs font-bold tracking-wider text-emerald-300">
                <Sparkles className="mr-1 inline h-3.5 w-3.5" /> UNLOCKED SCHOLARSHIP VOUCHER
              </span>
              <div className="mt-2 flex items-center justify-center gap-3">
                <b className="font-mono text-2xl text-white">{earnedCoupon}</b>
                <Button
                  size="sm"
                  variant="outline"
                  className="border-emerald-400/40 text-xs text-emerald-300"
                  onClick={() => {
                    navigator.clipboard?.writeText(earnedCoupon);
                    toast.success(`Coupon ${earnedCoupon} copied!`);
                  }}
                >
                  <Copy className="mr-1 h-3.5 w-3.5" /> Copy
                </Button>
              </div>
              <p className="mt-1 text-xs text-slate-400">
                Apply this code on the Courses page EMI/Fee calculator for instant fee waiver.
              </p>
            </div>

            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <Button className="gold-button" asChild>
                <Link to="/courses">Apply Voucher on Courses</Link>
              </Button>
              <Button variant="outline" className="border-slate-700" onClick={restartQuiz}>
                <RotateCcw className="mr-1.5 h-4 w-4" /> Retake Assessment
              </Button>
            </div>
          </div>
        )}
      </div>

      <SiteFooter onOpenOtp={() => {}} />
    </main>
  );
}