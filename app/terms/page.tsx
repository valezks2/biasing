"use client";
import Link from "next/link";

const TermsOfService = () => {
  const sections = [
    {
      id: "01",
      title: "Acceptance of Terms",
      content:
        "By using Biasing, whether as a registered user or a guest, you agree to these Terms of Service and Privacy Policy. If you do not agree with them, please refrain from using the platform.",
    },
    {
      id: "02",
      title: "User Accounts & Conduct",
      content:
        "Biasing is a safe space for fans. By using the platform, you agree not to harass others, spam, impersonate people, or disrupt the community. If these guidelines are violated, we reserve the right to moderate profiles, suspend accounts, or restrict platform access.",
    },
    {
      id: "03",
      title: "Content & Platform License",
      content:
        "You retain full ownership of your lists and its content. However, since Biasing is a public platform, you allow us to display your profile, use your data anonymously to generate top trend statistics, and power social features like user searches and followers.",
    },
    {
      id: "04",
      title: "Limitations of Liability",
      content:
        "While we strive to maintain the ultimate archive for your k-pop journey, Biasing is provided as-is. We make no promises regarding absolute uptime, platform reliability, or the permanent storage of your lists and profile data.",
    },
    {
      id: "05",
      title: "Modifications to Terms",
      content:
        "We may update these terms from time to time. You'll be notified by email when these changes take place. If you continue to use the platform after an update, it means you agree to the new terms. Otherwise, if you don't agree with them, you can always go to your settings and delete your account.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="max-w-3xl lg:sticky lg:top-20">
            <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Terms of
              <br />
              Service.
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-sm">
              Our terms and conditions.
              <span className="text-foreground/50">
                {" "}
                The legal framework that keeps our community safe and
                transparent.
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
            <div className="space-y-20">
              {sections.map((section) => (
                <div key={section.id} className="group">
                  <div className="flex items-baseline gap-4 mb-6 border-b border-foreground/10 pb-2">
                    <span className="text-[10px] font-black text-foreground/30 group-hover:text-foreground transition-colors">
                      {section.id}
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">
                      {section.title}
                    </h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed font-light text-lg">
                    {section.content}
                  </p>
                </div>
              ))}

              <div className="pt-12 border-t border-border">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                  Last Updated: June 2026
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default TermsOfService;
