import { Suspense } from "react";
import { createClient } from "../lib/supabase/server";
import HomeGuest from "../components/home/HomeGuest";
import HomeUser from "../components/home/HomeUser";

async function MainContent() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return <HomeUser user={user} />;
  }

  return <HomeGuest />;
}

export default function Page() {
  return (
    <Suspense fallback={<HomeSkeleton />}>
      <MainContent />
    </Suspense>
  );
}

function HomeSkeleton() {
  return (
    <div className="min-h-screen bg-white flex items-center justify-center font-sans">
      <div className="animate-pulse text-center">
        <h1 className="text-4xl font-bold tracking-tighter text-neutral-200">
          BIAS
          <br />
          ING.
        </h1>
      </div>
    </div>
  );
}
