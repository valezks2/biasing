"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function Page() {
  const supabase = createClient();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    if (!password) {
      setErrorMsg("Please enter your password.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg("Invalid email or password.");
      return;
    }

    router.push("/");
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12 min-h-[70vh]">
          <div className="max-w-3xl">
            <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Log
              <br />
              In.
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-xs">
              Welcome back.
              <span className="text-neutral-400"> Your lists are waiting.</span>
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
                />
              </div>

              <div className="space-y-2 group flex flex-col">
                {" "}
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-black py-4 text-lg focus:outline-none focus:border-neutral-400 transition-colors bg-transparent order-none"
                />
                <div className="flex justify-between items-center order-first mb-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Password
                  </label>
                  <Link href="/auth/forgot-password">
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors cursor-pointer">
                      Forgot your password?
                    </span>
                  </Link>
                </div>
              </div>

              {errorMsg && (
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-3">
                    {errorMsg}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-black bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Entering..." : "Enter"}
                </button>

                <div className="flex flex-col items-center gap-4 mt-8 border-t border-black/5 pt-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Don't have an account?
                  </p>
                  <Link href="/auth/sign-up" className="w-full">
                    <button
                      type="button"
                      className="w-full border border-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer"
                    >
                      Create Account
                    </button>
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
