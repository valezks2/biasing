export default function HomeUserSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground font-sans animate-pulse">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20 space-y-24">
        <div className="border border-border p-10 space-y-12">
          <div className="h-4 w-48 bg-foreground/10" />
          <div className="space-y-8">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex justify-between items-baseline border-b border-border/40 pb-6 last:border-none last:pb-0"
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
