"use client";
import { useState } from "react";
import Link from "next/link";
import { createClient } from "../../../lib/supabase/client";

export default function ForgotPasswordPage() {
  const supabase = createClient();

  const [email, setEmail] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/update-password`,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Check your email for the reset link!");
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12 min-h-[70vh]">
          <div className="max-w-3xl">
            <h1 className="text-[10vw] lg:text-[100px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Forgot
              <br />
              Password?
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-xs">
              Enter your email to receive a reset link.
              <span className="text-neutral-400">
                {" "}
                You will have access to your account again shortly.
              </span>
            </p>
          </div>

          <div className="w-full lg:w-[400px] mt-12 lg:mt-0">
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  className="w-full border-b border-black py-4 text-lg focus:outline-none focus:border-neutral-400 transition-colors bg-transparent"
                  required
                />
              </div>

              {errorMsg && (
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-3">
                    {errorMsg}
                  </p>
                </div>
              )}

              {successMsg && (
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-emerald-500 border-l-2 border-emerald-500 pl-3">
                    {successMsg}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-black bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </button>

                <div className="flex flex-col items-center gap-4 mt-8 border-t border-black/5 pt-8">
                  <Link href="/auth/login">
                    <span className="text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer">
                      ← Back to Login
                    </span>
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </section>
      </main>
    </div>
  );
}
