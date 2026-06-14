import Link from "next/link";

export default function HomeGuest() {
  return (
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="border-b border-black/5 pb-24 mb-24">
          <div className="flex flex-col lg:flex-row justify-between items-end gap-12">
            <div className="max-w-3xl">
              <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none">
                BIAS
                <br />
                ING.
              </h1>
              <p className="text-xl lg:text-2xl font-medium leading-tight max-w-md">
                The ultimate archive for k-pop fans.
                <span className="text-neutral-400"> Record every memory.</span>
              </p>
            </div>

            <div className="flex flex-col gap-4 w-full lg:w-72">
              <Link href="/auth/sign-up" className="w-full">
                <button className="w-full border border-black bg-black text-white py-5 text-sm font-bold uppercase tracking-widest hover:bg-white hover:text-black transition-colors cursor-pointer">
                  Create an Account
                </button>
              </Link>
              <Link href="/auth/login" className="w-full">
                <button className="w-full border border-black py-5 text-sm font-bold uppercase tracking-widest hover:bg-black hover:text-white transition-all cursor-pointer">
                  Login
                </button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-y-16 gap-x-8 mb-32">
          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
              01 / Archive
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Favorites Management
            </h2>
            <p className="text-neutral-600 leading-relaxed font-light">
              Organize your profile using specific lists to categorize your
              favorite groups and members.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
              02 / Timeline
            </span>
            <h2 className="text-3xl font-bold tracking-tight">
              Favorites History
            </h2>
            <p className="text-neutral-600 leading-relaxed font-light">
              Save the exact date the exact date you started liking your
              favorite artists in your profile.
            </p>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
              03 / Community
            </span>
            <h2 className="text-3xl font-bold tracking-tight">Social Circle</h2>
            <p className="text-neutral-600 leading-relaxed font-light">
              Follow your friends. Search and find people who share your
              interests.
            </p>
          </div>
        </section>

        <section className="relative group">
          <div className="absolute -top-6 right-0 text-[16vw] md:text-[100px] font-black opacity-[0.03] select-none uppercase tracking-tighter leading-none">
            Trending
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-px bg-black/10 border border-black/10">
            <div className="bg-white p-10">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                  Top / 01
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Most Popular Groups
                </h3>
              </div>

              <div className="space-y-8">
                {["NewJeans", "BTS", "Stray Kids", "Twice"].map((name) => (
                  <div
                    key={name}
                    className="flex justify-between items-baseline group/item cursor-pointer"
                  >
                    <span className="text-4xl font-bold tracking-tighter text-black hover:text-neutral-400 transition-colors duration-200">
                      {name}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      2k Saves →
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-10">
              <div className="flex items-center gap-4 mb-12">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-neutral-400">
                  Top / 02
                </span>
                <h3 className="text-sm font-bold uppercase tracking-widest">
                  Most Biased Members
                </h3>
              </div>

              <div className="space-y-8">
                {["Hanni", "Jungkook", "Felix", "Momo"].map((name) => (
                  <div
                    key={name}
                    className="flex justify-between items-baseline group/item cursor-pointer"
                  >
                    <span className="text-4xl font-bold tracking-tighter text-black hover:text-neutral-400 transition-colors duration-200">
                      {name}
                    </span>
                    <span className="text-[10px] font-black uppercase tracking-widest text-neutral-400">
                      1.2k Saves →
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
