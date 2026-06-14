"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

export default function UpdatePasswordPage() {
  const supabase = createClient();
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!password || !confirmPassword) {
      setErrorMsg("Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg("Passwords do not match.");
      return;
    }

    if (password.length < 6) {
      setErrorMsg("Password must be at least 6 characters.");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({
      password: password,
    });

    setLoading(false);

    if (error) {
      setErrorMsg(error.message);
      return;
    }

    setSuccessMsg("Password updated successfully! Redirecting...");

    setTimeout(() => {
      router.push("/auth/login");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12 min-h-[70vh]">
          <div className="max-w-3xl">
            <h1 className="text-[10vw] lg:text-[100px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Update
              <br />
              Password
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-xs">
              Create a new secure password.
              <span className="text-neutral-400">
                {" "}
                Make sure it's something you haven't used before.
              </span>
            </p>
          </div>

          <div className="w-full lg:w-[400px] mt-12 lg:mt-0">
            <form onSubmit={handleSubmit} className="space-y-10" noValidate>
              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  New Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-black py-4 text-lg focus:outline-none focus:border-neutral-400 transition-colors bg-transparent"
                  required
                />
              </div>

              <div className="space-y-2 group">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
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
                <div className="border border-black bg-neutral-50 p-4">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-black">
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
                  {loading ? "Updating..." : "Update Password"}
                </button>

                <div className="flex flex-col items-center gap-4 mt-8 border-t border-black/5 pt-8">
                  <Link href="/auth/login">
                    <span className="text-[10px] font-black uppercase tracking-widest hover:underline cursor-pointer">
                      ← Cancel and return to Login
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
