"use client";
import React, { useState, useEffect } from "react";
import Link from "next/link";
import { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";

interface HomeUserProps {
  user: User;
}

interface ActivityItem {
  id: string;
  friend: string;
  action: string;
  target: string;
  time: string;
}

interface TrendingItem {
  name: string;
  count: number;
}

export default function HomeUser({ user }: HomeUserProps) {
  const supabase = createClient();
  const [friendActivity, setFriendActivity] = useState<ActivityItem[]>([]);
  const [trendingGroups, setTrendingGroups] = useState<TrendingItem[]>([]);
  const [trendingBiases, setTrendingBiases] = useState<TrendingItem[]>([]);
  const [loading, setLoading] = useState(true);

  const formatTimeAgo = (dateString: string) => {
    const now = new Date();
    const created = new Date(dateString);
    const diffInMs = now.getTime() - created.getTime();

    const diffInMins = Math.floor(diffInMs / (1000 * 60));
    const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
    const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

    if (diffInMins < 60) return `${Math.max(1, diffInMins)}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${diffInDays}d ago`;
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);

        // 1. OBTENER ACTIVIDAD RECIENTE (UPDATES)
        const { data: followedUsers, error: followError } = await supabase
          .from("follows")
          .select("following_id")
          .eq("follower_id", user.id);

        if (followError) throw followError;

        if (followedUsers && followedUsers.length > 0) {
          const followingIds = followedUsers.map((f) => f.following_id);

          const { data: items, error: itemsError } = await supabase
            .from("profile_items")
            .select(
              `
              id,
              name,
              type,
              category,
              created_at,
              profiles:profile_id (
                username
              )
            `,
            )
            .in("profile_id", followingIds)
            .order("created_at", { ascending: false })
            .limit(3);

          if (itemsError) throw itemsError;

          if (items) {
            const mappedActivities: ActivityItem[] = items.map((item: any) => {
              const username = item.profiles?.username || "unknown";
              const typeLabel = item.type === "group" ? "group" : "member";
              const actionText = `added a new ${typeLabel} to their ${item.category.toLowerCase()} list:`;

              return {
                id: item.id,
                friend: username,
                action: actionText,
                target: item.name,
                time: formatTimeAgo(item.created_at),
              };
            });
            setFriendActivity(mappedActivities);
          }
        }

        // 2. OBTENER DATOS DE TENDENCIA (TRENDING GLOBAL)
        // Traemos los nombres y tipos de todos los ítems guardados en la plataforma
        const { data: allItems, error: trendingError } = await supabase
          .from("profile_items")
          .select("name, type");

        if (trendingError) throw trendingError;

        if (allItems) {
          const groupCounts: { [key: string]: number } = {};
          const biasCounts: { [key: string]: number } = {};

          // Contar frecuencias en el cliente de manera eficiente
          allItems.forEach((item) => {
            if (item.type === "group") {
              groupCounts[item.name] = (groupCounts[item.name] || 0) + 1;
            } else if (item.type === "bias") {
              biasCounts[item.name] = (biasCounts[item.name] || 0) + 1;
            }
          });

          // Formatear, ordenar de mayor a menor y tomar los 4 mejores
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
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) {
      fetchDashboardData();
    }
  }, [user?.id]);

  if (loading) {
    return <HomeUserSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background text-foreground font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col gap-24">
          <div className="relative group">
            <div className="absolute -top-6 right-0 text-[16vw] md:text-[100px] font-black opacity-[0.03] select-none uppercase tracking-tighter leading-none pointer-events-none">
              Updates
            </div>

            <div className="grid grid-cols-1 bg-border border border-border">
              <div className="bg-background p-10">
                <div className="flex justify-between items-center mb-12">
                  <div className="flex items-center gap-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                      Activity / Recent
                    </span>
                    <h3 className="text-sm font-bold uppercase tracking-widest text-foreground">
                      Friends Updates
                    </h3>
                  </div>
                </div>

                <div className="space-y-8">
                  {friendActivity.length > 0 ? (
                    friendActivity.map((act) => (
                      <Link
                        key={act.id}
                        href={`/${act.friend}`}
                        className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 pb-6 border-b border-border/40 last:border-none last:pb-0 group/item cursor-pointer block"
                      >
                        <div className="flex flex-col gap-1">
                          <span className="text-4xl font-bold tracking-tighter text-foreground hover:text-foreground/40 transition-colors duration-200">
                            @{act.friend}
                          </span>
                          <p className="text-sm text-foreground/60 font-light leading-none">
                            {act.action}{" "}
                            <span className="font-medium text-foreground tracking-tight">
                              {act.target}
                            </span>
                          </p>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40 whitespace-nowrap">
                          {act.time} →
                        </span>
                      </Link>
                    ))
                  ) : (
                    <div className="h-24 border border-dashed border-border flex items-center justify-center">
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">
                        No recent updates from your friends
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute -top-6 right-0 text-[16vw] md:text-[100px] font-black opacity-[0.03] select-none uppercase tracking-tighter leading-none pointer-events-none">
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
                  {trendingGroups.length > 0 ? (
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
                      No group data available
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
                  {trendingBiases.length > 0 ? (
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
                      No bias data available
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

export function HomeUserSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans animate-pulse p-20">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 space-y-24">
        <div className="border border-border p-10 space-y-12">
          <div className="h-4 w-48 bg-foreground/10" />
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-baseline border-b border-border/40 pb-6"
              >
                <div className="space-y-2">
                  <div className="h-8 w-32 bg-foreground/10" />
                  <div className="h-4 w-64 bg-foreground/5" />
                </div>
                <div className="h-3 w-16 bg-foreground/10" />
              </div>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-border border border-border">
          {[1, 2].map((section) => (
            <div key={section} className="bg-background p-10 space-y-12">
              <div className="h-4 w-32 bg-foreground/10" />
              <div className="space-y-8">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="flex justify-between items-baseline">
                    <div className="h-8 w-40 bg-foreground/10" />
                    <div className="h-3 w-20 bg-foreground/5" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
