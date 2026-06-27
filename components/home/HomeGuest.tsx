"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

interface TrendingItem {
  name: string;
  count: number;
}

export default function HomeGuest() {
  const supabase = createClient();
  const [trendingGroups, setTrendingGroups] = useState<TrendingItem[]>([]);
  const [trendingBiases, setTrendingBiases] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingData = async () => {
      try {
        setLoading(true);

        const { data: allItems, error } = await supabase
          .from("profile_items")
          .select("name, type");

        if (error) throw error;

        if (allItems) {
          const groupCounts: { [key: string]: number } = {};
          const biasCounts: { [key: string]: number } = {};

          allItems.forEach((item) => {
            if (item.type === "group") {
              groupCounts[item.name] = (groupCounts[item.name] || 0) + 1;
            } else if (item.type === "bias") {
              biasCounts[item.name] = (biasCounts[item.name] || 0) + 1;
            }
          });

          const sortedGroups = Object.keys(groupCounts)
            .map((name) => ({ name, count: groupCounts[name] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

          const sortedBiases = Object.keys(biasCounts)
            .map((name) => ({ name, count: biasCounts[name] }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 4);

          setTrendingGroups(sortedGroups);
          setTrendingBiases(sortedBiases);
        }
      } catch (error) {
        console.error("Error fetching trending data for guests:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingData();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="border-b border-border pb-24 mb-24">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl">
              <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase text-foreground">
                BIAS
                <br />
                ING.
              </h1>
              <p className="text-xl lg:text-2xl font-medium leading-tight max-w-sm text-foreground">
                The ultimate archive for k-pop fans.{" "}
                <span className="text-foreground/40">Record every memory.</span>
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-72">
              <Link href="/auth/sign-up" className="w-full">
                <button className="w-full border border-border bg-foreground text-background py-5 text-sm font-bold uppercase tracking-widest hover:bg-background hover:text-foreground transition-all cursor-pointer">
                  Create an Account
                </button>
              </Link>
              <Link href="/auth/login" className="w-full">
                <button className="w-full border border-border py-5 text-sm font-bold uppercase tracking-widest hover:bg-foreground hover:text-background transition-all cursor-pointer">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 mb-32">
          {[
            {
              title: "Favorites Management",
              desc: "Organize your profile using specific lists to categorize your favorite groups and members.",
              label: "01 / Archive",
            },
            {
              title: "Favorites History",
              desc: "Save the exact date you started liking your favorite artists in your profile.",
              label: "02 / Timeline",
            },
            {
              title: "Social Circle",
              desc: "Follow your friends. Search and find people who share your interests.",
              label: "03 / Community",
            },
          ].map((item, idx) => (
            <div key={idx} className="lg:col-span-4 space-y-6">
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                {item.label}
              </span>
              <h2 className="text-3xl font-bold tracking-tight text-foreground">
                {item.title}
              </h2>
              <p className="text-foreground/60 leading-relaxed font-light">
                {item.desc}
              </p>
            </div>
          ))}
        </section>

        <section className="relative group">
          <div className="absolute -top-6 right-0 text-[16vw] md:text-[100px] font-black opacity-[0.03] select-none uppercase tracking-tighter leading-none text-foreground pointer-events-none">
            Trending
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border">
            <div className="bg-background p-10">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                  Top / 01
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Most Popular Groups
                </h3>
              </div>

              <div className="space-y-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-baseline animate-pulse"
                    >
                      <div className="h-8 w-44 bg-foreground/10" />
                      <div className="h-3 w-14 bg-foreground/5" />
                    </div>
                  ))
                ) : trendingGroups.length > 0 ? (
                  trendingGroups.map((group) => (
                    <div
                      key={group.name}
                      className="flex justify-between items-baseline group/item select-none"
                    >
                      <span className="text-4xl font-bold tracking-tighter text-foreground hover:text-foreground/40 transition-colors duration-200">
                        {group.name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                        {group.count} {group.count === 1 ? "Save" : "Saves"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-bold uppercase tracking-widest text-foreground/20 py-4">
                    No data logged yet
                  </div>
                )}
              </div>
            </div>

            <div className="bg-background p-10">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                  Top / 02
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                  Most Biased Members
                </h3>
              </div>

              <div className="space-y-8">
                {loading ? (
                  Array.from({ length: 4 }).map((_, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-baseline animate-pulse"
                    >
                      <div className="h-8 w-36 bg-foreground/10" />
                      <div className="h-3 w-14 bg-foreground/5" />
                    </div>
                  ))
                ) : trendingBiases.length > 0 ? (
                  trendingBiases.map((bias) => (
                    <div
                      key={bias.name}
                      className="flex justify-between items-baseline group/item select-none"
                    >
                      <span className="text-4xl font-bold tracking-tighter text-foreground hover:text-foreground/40 transition-colors duration-200">
                        {bias.name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                        {bias.count} {bias.count === 1 ? "Save" : "Saves"}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs font-bold uppercase tracking-widest text-foreground/20 py-4">
                    No data logged yet
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
