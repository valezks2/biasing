"use client";
import Link from "next/link";

const AboutPage = () => {
  const values = [
    {
      id: "01",
      title: "The Archive",
      content:
        "We believe every fan deserves an organized space to document their journey with their favorite groups and artists. Biasing isn't just a site for lists, it's a digital archive of your evolution as a fan.",
    },
    {
      id: "02",
      title: "Community Driven",
      content:
        "Built by and for k-pop fans, so we focus on what we know you care about most: aesthetic visuals, organized lists, top trends and connecting with people who share your interests.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="max-w-3xl lg:sticky lg:top-20">
            <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              About
              <br />
              Biasing.
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-sm">
              Defining a new standard for the fan experience.
              <span className="text-foreground/50">
                {" "}
                Built with you in mind.
              </span>
            </p>

            <div className="mt-12">
              <Link href="/">
                <button className="border border-foreground text-foreground px-8 py-4 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all cursor-pointer bg-transparent">
                  Back to Home
                </button>
              </Link>
            </div>
          </div>

          <div className="w-full lg:w-[600px] mt-12 lg:mt-0 pb-32">
            <div className="space-y-20 mb-32">
              {values.map((item) => (
                <div key={item.id} className="group">
                  <div className="flex items-baseline gap-4 mb-6 border-b border-foreground/10 pb-2">
                    <span className="text-[10px] font-black text-foreground/30 group-hover:text-foreground transition-colors">
                      {item.id}
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">
                      {item.title}
                    </h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed font-light text-lg">
                    {item.content}
                  </p>
                </div>
              ))}
            </div>

            <section className="relative py-12 border-t border-border">
              <div className="absolute top-0 right-0 text-[12vw] font-black opacity-[0.03] dark:opacity-[0.015] select-none uppercase tracking-tighter leading-none -z-10">
                Archive
              </div>
              <div className="max-w-xl">
                <h3 className="text-4xl font-bold tracking-tighter uppercase mb-8">
                  Ready to start your own archive?
                </h3>
                <Link href="/auth/sign-up">
                  <button className="border border-foreground bg-foreground text-background px-12 py-6 text-sm font-bold uppercase tracking-widest hover:bg-background hover:text-foreground transition-all cursor-pointer w-full sm:w-auto">
                    Join Now
                  </button>
                </Link>
              </div>
            </section>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
