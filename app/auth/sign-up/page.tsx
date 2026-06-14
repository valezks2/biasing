"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "../../../lib/supabase/client";

export default function Page() {
  const supabase = createClient();
  const router = useRouter();

  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!name.trim()) {
      setErrorMsg("The name cannot be empty.");
      return;
    }

    if (!username.trim()) {
      setErrorMsg("Please choose a username.");
      return;
    }

    if (!email.trim()) {
      setErrorMsg("Please enter your email.");
      return;
    }

    const strongPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,\-_])(?=.{8,})/;
    if (!strongPasswordRegex.test(password)) {
      setErrorMsg(
        "The password must have at least 8 characters, including uppercase, lowercase, a number and a symbol.",
      );
      return;
    }

    if (!acceptedPolicy) {
      setErrorMsg("You must accept the Privacy Policy to continue.");
      return;
    }

    setLoading(true);

    const { data: existingUser } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", username)
      .single();

    if (existingUser) {
      setErrorMsg("This username is already taken.");
      setLoading(false);
      return;
    }

    const {
      data: { user },
      error,
    } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          display_name: name,
          username: username,
        },
      },
    });

    setLoading(false);

    if (error) {
      setErrorMsg(
        error.message || "Something went wrong. Please try again later.",
      );
      return;
    }

    if (user) {
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="max-w-3xl lg:sticky lg:top-20">
            <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Sign
              <br />
              Up.
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-sm">
              Start the journey.
              <span className="text-neutral-400">
                {" "}
                Create your personal archive and save your favorites.
              </span>
            </p>
          </div>

          <div className="w-full lg:w-[450px] mt-12 lg:mt-0">
            <form onSubmit={handleSubmit} className="space-y-8" noValidate>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Name
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Name"
                    className="w-full border-b border-black py-4 text-lg focus:outline-none focus:border-neutral-400 transition-colors bg-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Username
                  </label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="username"
                    className="w-full border-b border-black py-4 text-lg focus:outline-none focus:border-neutral-400 transition-colors bg-transparent"
                  />
                </div>
              </div>

              <div className="space-y-2">
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

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full border-b border-black py-4 text-lg focus:outline-none focus:border-neutral-400 transition-colors bg-transparent"
                />
              </div>

              {errorMsg && (
                <div className="pt-2">
                  <p className="text-[10px] font-black uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-3">
                    {errorMsg}
                  </p>
                </div>
              )}

              <label className="pt-4 text-[11px] text-neutral-500 leading-relaxed flex items-center gap-3 cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="accent-black cursor-pointer"
                  checked={acceptedPolicy}
                  onChange={(e) => setAcceptedPolicy(e.target.checked)}
                />
                <span className="flex-1">
                  {" "}
                  By creating an account, you agree to our{" "}
                  <Link
                    href="/terms"
                    className="text-black underline hover:text-neutral-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Terms of Service
                  </Link>{" "}
                  and{" "}
                  <Link
                    href="/privacy-policy"
                    className="text-black underline hover:text-neutral-600 transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Privacy Policy
                  </Link>
                  .
                </span>
              </label>

              <div className="flex flex-col gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full border border-black bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-all cursor-pointer disabled:opacity-50"
                >
                  {loading ? "Creating Account..." : "Create Account"}
                </button>

                <div className="flex flex-col items-center gap-4 mt-8 border-t border-black/5 pt-8">
                  <p className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                    Already part of biasing?
                  </p>
                  <Link href="/auth/login" className="w-full">
                    <button
                      type="button"
                      className="w-full border border-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer"
                    >
                      Log In Instead
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
