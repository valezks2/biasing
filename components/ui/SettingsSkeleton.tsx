export default function SettingsSkeleton() {
  return (
    <div className="max-w-[800px] mx-auto px-6 py-12 animate-pulse">
      <div className="h-8 w-64 bg-foreground/10 mb-8" />

      {[1, 2, 3].map((i) => (
        <div key={i} className="mb-12">
          <div className="h-4 w-32 bg-foreground/10 mb-4" />
          <div className="border border-border p-6 space-y-4">
            <div className="h-10 w-full bg-foreground/5" />
            <div className="h-10 w-3/4 bg-foreground/5" />
          </div>
        </div>
      ))}

      <div className="border-t border-border pt-8">
        <div className="h-4 w-32 bg-red-500/10 mb-4" />
        <div className="h-20 w-full bg-red-500/5" />
      </div>
    </div>
  );
}
