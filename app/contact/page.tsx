"use client";
import Link from "next/link";

const ContactPage = () => {
  const channels = [
    {
      id: "01",
      title: "General Support",
      content:
        "Need help with your archive? Send us an email and we'll get to you as fast as we can.",
      actionText: "support@biasing.com",
      href: "mailto:support@biasing.com",
    },
    {
      id: "02",
      title: "Bug Reporting",
      content: "Found a bug? Open an issue directly on our GitHub repository!",
      actionText: "https://github.com/valezks2/biasing",
      href: "https://github.com/valezks2/biasing",
    },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground font-sans selection:bg-foreground selection:text-background">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col lg:flex-row justify-between items-start gap-12">
          <div className="max-w-3xl lg:sticky lg:top-20">
            <h1 className="text-[12vw] lg:text-[140px] font-bold leading-[0.85] tracking-tighter mb-12 select-none uppercase">
              Get in
              <br />
              Touch.
            </h1>
            <p className="text-xl lg:text-2xl font-medium leading-tight max-w-sm">
              We are all ears.
              <span className="text-foreground/50">
                {" "}
                Whether you found a bug or need help with your account.
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
              {channels.map((channel) => (
                <div key={channel.id} className="group">
                  <div className="flex items-baseline gap-4 mb-6 border-b border-foreground/10 pb-2">
                    <span className="text-[10px] font-black text-foreground/30 group-hover:text-foreground transition-colors">
                      {channel.id}
                    </span>
                    <h2 className="text-2xl font-bold uppercase tracking-tighter">
                      {channel.title}
                    </h2>
                  </div>
                  <p className="text-foreground/70 leading-relaxed font-light text-lg mb-4">
                    {channel.content}
                  </p>
                  <a
                    href={channel.href}
                    target={
                      channel.href.startsWith("http") ? "_blank" : undefined
                    }
                    rel="noopener noreferrer"
                    className="inline-block text-xs font-bold uppercase tracking-widest underline decoration-1 underline-offset-4 cursor-pointer hover:text-foreground/50 transition-colors"
                  >
                    {channel.actionText}
                  </a>
                </div>
              ))}

              <div className="pt-12 border-t border-foreground/20">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-foreground/40">
                  Response Time: Within 24-48 Hours
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default ContactPage;
