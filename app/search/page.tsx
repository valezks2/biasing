"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function SearchPage() {
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
        .select("id, username")
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
        <p className="text-[11px] font-black tracking-widest animate-pulse text-foreground">
          LOADING PERFILES...
        </p>
      ) : results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {results.map((profile) => (
            <Link
              key={profile.id}
              href={`/${profile.username}`}
              className="border border-border p-6 flex justify-between items-center bg-background text-foreground hover:bg-foreground hover:text-background transition-all group cursor-pointer"
            >
              <span className="font-black text-sm uppercase tracking-wider">
                @{profile.username}
              </span>
              <span className="text-[10px] font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
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
