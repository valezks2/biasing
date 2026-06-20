import Link from "next/link";
import { User } from "@supabase/supabase-js";

interface HomeUserProps {
  user: User;
}

export default function HomeUser({ user }: HomeUserProps) {
  const friendActivity = [
    {
      id: 1,
      friend: "example1",
      action: "added a new member to their ults:",
      target: "Felix",
      time: "2h ago",
    },
    {
      id: 2,
      friend: "example2",
      action: "added a new favorite group to their likes:",
      target: "Twice",
      time: "5h ago",
    },
    {
      id: 3,
      friend: "example3",
      action: "added a new member to their regulars:",
      target: "Hanni",
      time: "1d ago",
    },
  ];

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
                  {friendActivity.map((act) => (
                    <div
                      key={act.id}
                      className="flex flex-col sm:flex-row sm:justify-between sm:items-baseline gap-2 pb-6 border-b border-border/40 last:border-none last:pb-0 group/item cursor-pointer"
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
                    </div>
                  ))}
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
                  {["NewJeans", "BTS", "Stray Kids", "Twice"].map((name) => (
                    <div
                      key={name}
                      className="flex justify-between items-baseline group/item cursor-pointer"
                    >
                      <span className="text-4xl font-bold tracking-tighter text-foreground hover:text-foreground/40 transition-colors duration-200">
                        {name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                        2k Saves →
                      </span>
                    </div>
                  ))}
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
                  {["Hanni", "Jungkook", "Felix", "Momo"].map((name) => (
                    <div
                      key={name}
                      className="flex justify-between items-baseline group/item cursor-pointer"
                    >
                      <span className="text-4xl font-bold tracking-tighter text-foreground hover:text-foreground/40 transition-colors duration-200">
                        {name}
                      </span>
                      <span className="text-[10px] font-black uppercase tracking-widest text-foreground/40">
                        1.2k Saves →
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
