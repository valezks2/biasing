"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

const Footer = () => {
  const [year, setYear] = useState<number | null>(null);
  const [username, setUsername] = useState<string | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
    const supabase = createClient();

    const fetchUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username")
          .eq("id", user.id)
          .single();
        if (profile) setUsername(profile.username);
      }
    };
    fetchUser();
  }, []);

  const linkStyles =
    "text-foreground/50 hover:text-foreground transition-colors cursor-pointer";

  return (
    <footer className="bg-background text-foreground border-t border-border mt-24">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 pt-20 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-16 md:gap-8">
          <div className="md:col-span-6 space-y-8">
            <Link href="/" className="inline-block">
              <h2 className="text-4xl font-bold tracking-tighter text-foreground">
                BIASING.
              </h2>
            </Link>
            <p className="max-w-xs text-sm text-foreground/50 leading-relaxed font-light">
              The ultimate archive for k-pop fans. Record every memory by saving
              your favorite groups and idols.
            </p>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70 dark:text-foreground/40">
              Navigation
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/" className={linkStyles}>
                  Home
                </Link>
              </li>
              <li>
                <button
                  onClick={() => window.dispatchEvent(new Event("open-search"))}
                  className={linkStyles}
                >
                  Explore
                </button>
              </li>
              <li>
                <Link
                  href={username ? `/${username}` : "/"}
                  className={linkStyles}
                >
                  Profile
                </Link>
              </li>
            </ul>
          </div>

          <div className="md:col-span-3 space-y-6">
            <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/70 dark:text-foreground/40">
              Connect
            </h3>
            <ul className="space-y-4 text-sm font-medium">
              <li>
                <Link href="/about" className={linkStyles}>
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className={linkStyles}>
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/privacy-policy" className={linkStyles}>
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms" className={linkStyles}>
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-border flex justify-center items-center">
          <span className="text-[10px] font-black uppercase tracking-widest text-foreground/30">
            © {year ?? ""} BIASING INC. ALL RIGHTS RESERVED.
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
