"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";
import { Suspense } from "react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const supabase = createClient();
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) return;

    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("id, username, display_name, avatar_url")
        .ilike("username", `%${query}%`);

      if (!error && data) {
        setResults(data);
      }
      setLoading(false);
    };

    fetchUsers();
  }, [query, supabase]);

  return (
    <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 text-foreground bg-background">
      <h1 className="text-xs font-black uppercase tracking-[0.4em] text-foreground/40 mb-8">
        Search Results for: <span className="text-foreground">"{query}"</span>
      </h1>

      {loading ? (
        <SearchSkeleton />
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((profile) => (
            <Link
              key={profile.id}
              href={`/${profile.username}`}
              className="border border-border p-4 flex justify-between items-center bg-background text-foreground hover:bg-foreground hover:text-background transition-all group cursor-pointer"
            >
              <div className="flex items-center gap-4">
                <div className="relative w-12 h-12 bg-muted border border-border shrink-0 overflow-hidden">
                  <img
                    src={profile.avatar_url || "/placeholder.png"}
                    alt={profile.username}
                    className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all"
                  />
                </div>

                <div className="flex flex-col min-w-0">
                  <span className="font-black text-sm uppercase tracking-wider truncate">
                    {profile.display_name || "No Name"}
                  </span>
                  <span className="text-xs text-foreground/60 group-hover:text-background/60 truncate">
                    @{profile.username}
                  </span>
                </div>
              </div>

              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity shrink-0 ml-4 hidden sm:inline">
                View profile &rarr;
              </span>
            </Link>
          ))}
        </div>
      ) : (
        <p className="text-[11px] font-black tracking-widest text-foreground/40">
          NO USERS FOUND.
        </p>
      )}
    </main>
  );
}

function SearchSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 animate-pulse">
      {[...Array(6)].map((_, i) => (
        <div
          key={i}
          className="border border-border p-4 flex justify-between items-center bg-background"
        >
          <div className="flex items-center gap-4 w-full">
            <div className="w-12 h-12 bg-muted border border-border shrink-0" />

            <div className="flex flex-col gap-2 w-full max-w-[150px]">
              <div className="h-4 bg-muted w-3/4" />
              <div className="h-3 bg-muted/60 w-1/2" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 text-foreground bg-background">
          <div className="h-4 bg-muted w-48 mb-8 animate-pulse" />
          <SearchSkeleton />
        </main>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
