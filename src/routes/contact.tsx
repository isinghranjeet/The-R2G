import { useState, type FormEvent } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Clock, Mail, MapPin, Phone, Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

export const Route = createFileRoute("/contact")({
  component: ContactPage,
  head: () => ({
    meta: [{ title: "Contact & Campus Location | R2G Learn CAD" }],
  }),
});

function ContactPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  function handleSend(e: FormEvent) {
    e.preventDefault();
    toast.success(`Thanks ${name}! Our Faridabad admissions counselor will call you shortly.`);
    setName("");
    setPhone("");
    setMessage("");
  }

  return (
    <main className="r2g-site min-h-screen text-slate-100">
      <Toaster position="top-right" richColors />
      <div className="site-container py-16">
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-amber-400 hover:underline">
          <ArrowLeft className="h-4 w-4" /> Back to Home
        </Link>

        <div className="mt-6 grid gap-10 lg:grid-cols-2">
          <div>
            <span className="eyebrow section-eyebrow">GET IN TOUCH</span>
            <h1 className="mt-2 text-4xl font-bold">Visit Our <span className="text-amber-400">Faridabad Campus.</span></h1>
            <p className="mt-3 text-slate-300">
              Have questions about batch timings, syllabus, or corporate training? Reach out directly or walk in for a free lab tour.
            </p>

            <div className="mt-8 space-y-5 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <b className="block text-white">Campus Address</b>
                  <span className="text-slate-400">Sector 35, Main Mathura Road, Near Ashoka Enclave, Faridabad, Haryana 121003</span>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Phone className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <b className="block text-white">Admissions Helpline</b>
                  <a href="tel:+919876543210" className="text-slate-400 hover:text-white">+91 98765 43210</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Mail className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <b className="block text-white">Email</b>
                  <a href="mailto:admissions@r2glearncad.com" className="text-slate-400 hover:text-white">admissions@r2glearncad.com</a>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="mt-0.5 h-5 w-5 text-amber-400" />
                <div>
                  <b className="block text-white">Lab Hours</b>
                  <span className="text-slate-400">Monday – Sunday: 9:00 AM to 7:00 PM</span>
                </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSend} className="space-y-4 rounded-xl border border-slate-800 bg-slate-900/70 p-6">
            <h2 className="text-xl font-bold">Send an Inquiry</h2>
            <div>
              <label className="block text-xs font-semibold text-slate-400">FULL NAME</label>
              <input required value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Ranjeet Kumar" className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400">MOBILE NUMBER</label>
              <input required type="tel" maxLength={10} value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder="10-digit mobile number" className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-400">MESSAGE / COURSE INTEREST</label>
              <textarea required rows={4} value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us which software or batch you are interested in..." className="mt-1 w-full rounded-md border border-slate-700 bg-slate-950 px-3 py-2 text-sm" />
            </div>
            <Button type="submit" className="gold-button w-full">
              <Send className="mr-1.5 h-4 w-4" /> Send Message
            </Button>
          </form>
        </div>
      </div>
    </main>
  );
}