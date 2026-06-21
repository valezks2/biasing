export default function ProfileSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans animate-pulse">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col md:flex-row items-center md:items-end gap-8 border-b border-border pb-12 mb-16">
          <div className="w-40 h-40 bg-border/20 border border-border flex-shrink-0" />
          <div className="flex-1 w-full flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div className="space-y-4">
              <div className="h-20 w-64 bg-border/40" />
              <div className="h-6 w-32 bg-border/20" />
            </div>

            <div className="flex items-center gap-8">
              <div className="h-12 w-32 bg-border/20" />
              <div className="h-12 w-24 bg-foreground/10" />
            </div>
          </div>
        </section>

        <div className="space-y-24">
          {[1, 2].map((section) => (
            <section key={section}>
              <div className="mb-10">
                <div className="h-10 w-48 bg-border/40" />
                <div className="h-1 w-12 bg-border mt-2" />
              </div>
              <div className="space-y-16">
                {[1, 2].map((cat) => (
                  <div key={cat} className="space-y-6">
                    <div className="h-6 w-32 bg-border/20" />
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
                      {[...Array(6)].map((_, i) => (
                        <div
                          key={i}
                          className="aspect-[3/4] bg-border/10 border border-border/5"
                        />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </main>
    </div>
  );
}
