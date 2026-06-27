"use client";
import Link from "next/link";

const PrivacyPolicy = () => {
  const sections = [
    {
      id: "01",
      title: "Data Collection",
      content:
        "We collect the information you provide directly when creating an account, such as your name, username, email address and password. While using Biasing, we will also store the k-pop groups and members you add to your lists, your profile picture and interaction data, such as who you follow and who follows you.",
    },
    {
      id: "02",
      title: "How We Use Data",
      content:
        "We use your data to manage your profile, send notifications, allow username searches and generate anonymous top trend statistics. We will never sell your personal information to third parties.",
    },
    {
      id: "03",
      title: "Public Profile",
      content:
        "By default, your profile (including your name, username, profile picture, and your lists) is public and visible to any visitor or user of the platform.",
    },
    {
      id: "04",
      title: "Data Security",
      content:
        "We use Supabase to securely manage authentication and encrypt passwords for data storage. We strive to keep your personal information safe and secure at all times.",
    },
    {
      id: "05",
      title: "Your Rights",
      content:
        "You have full control over your data. Through your account settings, you can edit your lists, update your name, email, password, and profile picture, or permanently delete your account and all associated data at any time.",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="max-w-3xl lg:sticky lg:top-20">
            <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Privacy
              <br />
              Policy.
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-sm">
              Our data policy.
              <span className="text-foreground/50">
                {" "}
                Learn what we collect, how your data is stored, and how you
                control it.
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

export default PrivacyPolicy;
