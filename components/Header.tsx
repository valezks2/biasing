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
  const [avatarUrl, setAvatarUrl] = useState<string>("/placeholder.png");
  const [loading, setLoading] = useState(true);

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const [hasNotifications, setHasNotifications] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notifRef = useRef<HTMLDivElement>(null);

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
        setAvatarUrl("/placeholder.png");
      }
      setLoading(false);
    });

    let channel: ReturnType<typeof supabase.channel>;

    if (user) {
      channel = supabase
        .channel("notifications")
        .on(
          "postgres_changes",
          {
            event: "INSERT",
            schema: "public",
            table: "notifications",
            filter: `user_id=eq.${user.id}`,
          },
          () => setHasNotifications(true),
        )
        .subscribe();
    }

    return () => {
      subscription.unsubscribe();
      window.removeEventListener("open-search", handleOpenSearch);
      if (channel) {
        supabase.removeChannel(channel);
      }
    };
  }, [supabase, user?.id]);

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

      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setNotifOpen(false);
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

  const fetchNotifications = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from("notifications")
      .select(
        `
      id, 
      created_at,
      sender_profiles:sender_id (
        username, 
        display_name, 
        avatar_url
      )
    `,
      )
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    if (data) setNotifications(data);
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
              className={`flex items-center h-10 border transition-all duration-300 ease-in-out ${isSearchOpen ? "w-full max-w-xl px-4 gap-3 bg-background border-border" : "w-10 px-3 bg-transparent border-transparent sm:hover:bg-foreground/5 cursor-pointer"}`}
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

        <div className="relative" ref={notifRef}>
          <button
            onClick={() => {
              setNotifOpen(!notifOpen);
              if (!notifOpen) {
                fetchNotifications();
                setHasNotifications(false);
              }
            }}
            className="relative w-10 h-10 flex items-center justify-center hover:bg-foreground/5 transition-all cursor-pointer"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
              />
            </svg>

            {hasNotifications && (
              <span className="absolute top-3 right-3 w-2 h-2 bg-red-500 rounded-full border-2 border-background" />
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 mt-3 w-80 bg-background border border-border z-50 flex flex-col">
              <div className="px-6 py-4 border-b border-border text-[10px] font-black uppercase tracking-widest text-foreground">
                Notifications
              </div>

              <div className="max-h-[300px] overflow-y-auto">
                {notifications.length > 0 ? (
                  notifications.map((n: any) => (
                    <Link
                      href={`/${n.sender_profiles?.username}`}
                      key={n.id}
                      onClick={() => setNotifOpen(false)}
                      className="flex items-center gap-3 px-6 py-4 border-b border-border/50 hover:bg-foreground/5 transition-all group"
                    >
                      <div className="w-10 h-10 bg-muted border border-border shrink-0 overflow-hidden">
                        <img
                          src={
                            n.sender_profiles?.avatar_url || "/placeholder.png"
                          }
                          alt={n.sender_profiles?.username}
                          className="w-full h-full object-cover grayscale group-hover:grayscale-0"
                        />
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[11px] font-bold text-foreground">
                          {n.sender_profiles?.display_name ||
                            n.sender_profiles?.username}
                        </span>
                        <span className="text-[10px] text-foreground/60">
                          started following you!
                        </span>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="px-6 py-8 text-[10px] text-center text-foreground/40 font-black uppercase tracking-widest">
                    No new notifications
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

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
