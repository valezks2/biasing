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
  const [username, setUsername] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrl] = useState<string>("/icon.jpg");
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleOpenSearch = () => setIsSearchOpen(true);
    window.addEventListener("open-search", handleOpenSearch);

    const getUserData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", user.id)
          .single();

        if (profile) {
          setUsername(profile.username);
          if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        }
      }
      setLoading(false);
    };

    getUserData();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      const currentUser = session?.user ?? null;
      setUser(currentUser);
      if (currentUser) {
        const { data: profile } = await supabase
          .from("profiles")
          .select("username, avatar_url")
          .eq("id", currentUser.id)
          .single();
        if (profile) {
          setUsername(profile.username);
          if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
        }
      } else {
        setUsername(null);
        setAvatarUrl("/icon.jpg");
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-search", handleOpenSearch);
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
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (isSearchOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchOpen]);

  const handleSignOut = async () => {
    setDropdownOpen(false);
    await supabase.auth.signOut();
    router.push("/");
    router.refresh();
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background/80 backdrop-blur-md border-b border-border">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 h-20 flex items-center justify-between gap-4">
        <Link
          href="/"
          className={`group flex-shrink-0 ${isSearchOpen ? "hidden sm:block" : "block"}`}
        >
          <span className="text-2xl font-black tracking-tighter transition-all group-hover:tracking-widest text-foreground">
            BIASING.
          </span>
        </Link>

        {!loading && user ? (
          <div ref={searchRef} className="flex-1 flex justify-end items-center">
            <form
              onSubmit={handleSearchSubmit}
              className={`flex items-center h-11 border transition-all duration-300 ease-in-out ${isSearchOpen ? "w-full max-w-xl px-4 gap-3 bg-background border-border" : "w-11 px-3 bg-transparent border-transparent sm:hover:bg-foreground/5 cursor-pointer"}`}
              onClick={() => !isSearchOpen && setIsSearchOpen(true)}
            >
              <svg
                className="w-4 h-4 text-foreground flex-shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              <input
                ref={inputRef}
                type="text"
                placeholder="SEARCH USERS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={`w-full bg-transparent text-[11px] font-black tracking-[0.2em] uppercase focus:outline-none placeholder-foreground/30 text-foreground transition-all duration-200 ${isSearchOpen ? "opacity-100 pointer-events-auto w-full" : "opacity-0 pointer-events-none w-0"}`}
              />
              {isSearchOpen && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-[10px] font-black text-foreground/40 hover:text-foreground uppercase tracking-wider flex-shrink-0 cursor-pointer"
                >
                  [X]
                </button>
              )}
            </form>
          </div>
        ) : (
          <div className="flex-1" />
        )}

        <div className="flex items-center gap-4 flex-shrink-0">
          {loading ? (
            <div className="w-10 h-10 bg-foreground/10 animate-pulse" />
          ) : user ? (
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="relative w-10 h-10 border border-border focus:outline-none transition-transform active:scale-95 overflow-hidden flex items-center justify-center bg-foreground/5 group cursor-pointer"
              >
                <Image
                  src={avatarUrl}
                  alt="User Profile"
                  width={40}
                  height={40}
                  className="object-cover w-full h-full grayscale group-hover:grayscale-0 transition-all select-none pointer-events-none"
                />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-48 bg-background border border-border z-50 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150">
                  <Link
                    href={username ? `/${username}` : "/onboarding"}
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-foreground hover:text-background transition-all text-left border-b border-border cursor-pointer"
                  >
                    My Profile
                  </Link>
                  <Link
                    href="/settings"
                    onClick={() => setDropdownOpen(false)}
                    className="w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-foreground hover:text-background transition-all text-left border-b border-border cursor-pointer"
                  >
                    Settings
                  </Link>
                  <button
                    onClick={handleSignOut}
                    className="w-full px-6 py-4 text-[10px] font-black uppercase tracking-[0.3em] text-red-500 hover:bg-foreground hover:text-background transition-all text-left cursor-pointer"
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
                className="hidden sm:block border border-border px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] text-foreground hover:bg-foreground hover:text-background transition-all cursor-pointer"
              >
                Login
              </Link>
              <Link href="/auth/sign-up">
                <button className="bg-foreground border border-border text-background px-6 py-3 text-[10px] font-black uppercase tracking-[0.3em] hover:bg-background hover:text-foreground transition-all cursor-pointer">
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
