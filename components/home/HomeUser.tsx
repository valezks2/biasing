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
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col gap-24">
          <div className="space-y-12">
            <div className="flex justify-between items-baseline border-b border-black/5 pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest">
                Friends Updates
              </h2>
              <Link
                href="/community"
                className="text-[10px] font-black uppercase tracking-widest text-neutral-400 hover:text-black transition-colors"
              >
                Find Friends →
              </Link>
            </div>

            <div className="space-y-8">
              {friendActivity.map((act) => (
                <div
                  key={act.id}
                  className="border-b border-black/5 pb-6 last:border-none"
                >
                  <div className="flex justify-between items-baseline mb-2">
                    <span className="font-bold text-lg hover:underline cursor-pointer">
                      @{act.friend}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      {act.time}
                    </span>
                  </div>
                  <p className="text-neutral-600 font-light leading-relaxed">
                    {act.action}{" "}
                    <span className="font-medium text-black tracking-tight">
                      {act.target}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-12">
            <div className="flex justify-between items-baseline border-b border-black/5 pb-4">
              <h2 className="text-xl font-black uppercase tracking-widest">
                Trending Now
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-black/10 border border-black/10">
              <div className="bg-white p-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6">
                  Groups
                </h3>
                <div className="space-y-6">
                  {["NewJeans", "BTS", "Stray Kids"].map((name) => (
                    <div
                      key={name}
                      className="flex justify-between items-baseline group/item cursor-pointer"
                    >
                      <span className="text-2xl font-bold tracking-tighter text-black hover:text-neutral-400 transition-colors duration-200">
                        {name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-6">
                <h3 className="text-[10px] font-black uppercase tracking-widest text-neutral-400 mb-6">
                  Members
                </h3>
                <div className="space-y-6">
                  {["Hanni", "Jungkook", "Felix"].map((name) => (
                    <div
                      key={name}
                      className="flex justify-between items-baseline group/item cursor-pointer"
                    >
                      <span className="text-2xl font-bold tracking-tighter text-black hover:text-neutral-400 transition-colors duration-200">
                        {name}
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
