"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createClient } from "../lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

const Header = () => {
  const supabase = createClient();
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    };

    getUser();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-black/5">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between">
        <Link href="/" className="group">
          <span className="text-2xl font-black tracking-tighter transition-all group-hover:tracking-widest">
            BIASING.
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-12">
          {["Trending", "Community"].map((item) => (
            <Link
              key={item}
              href={`/${item.toLowerCase()}`}
              className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400 hover:text-black transition-colors"
            >
              {item}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          {loading ? (
            <div className="w-10 h-10 bg-neutral-100 animate-pulse rounded-full" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative w-10 h-10 border border-black focus:outline-none transition-transform active:scale-95 overflow-hidden flex items-center justify-center bg-neutral-100 group cursor-pointer"
              >
                <Image
                  src="/icon.jpg"
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all select-none pointer-events-none"
                />
              </button>

              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-white border border-black  z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href="/trending"
                    onClick={() => setDropdownOpen(false)}
                    className="md:hidden w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white transition-all text-left border-b border-black cursor-pointer"
                  >
                    Trending
                  </Link>
                  <Link
                    href="/community"
                    onClick={() => setDropdownOpen(false)}
                    className="md:hidden w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white transition-all text-left border-b border-black cursor-pointer"
                  >
                    Community
                  </Link>

                  <Link
                    href="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white transition-all text-left border-b border-black cursor-pointer"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-black hover:bg-black hover:text-white transition-all text-left border-b border-black cursor-pointer"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-600 hover:bg-black hover:text-white transition-all text-left cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link
                href="/auth/login"
                className="hidden sm:block border border-black px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-black hover:text-white transition-all cursor-pointer"
              >
                Login
              </Link>
              <Link href="/auth/sign-up">
                <button className="bg-black border border-black text-white px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-white hover:text-black transition-all cursor-pointer">
                  Join Now
                </button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
