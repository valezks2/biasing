import { createClient } from "@supabase/supabase-js";
import ProfileView from "@/components/ProfileView";
import { Suspense, use } from "react";
import ProfileSkeleton from "@/components/ui/ProfileSkeleton";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";

async function ProfileLoader({
  paramsPromise,
}: {
  paramsPromise: Promise<{ username: string }>;
}) {
  const resolvedParams = await paramsPromise;
  const username = resolvedParams.username;

  const supabase = createClient(supabaseUrl, supabaseAnonKey);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .single();

  let initialItems: any[] = [];

  if (profile) {
    const { data: items } = await supabase
      .from("profile_items")
      .select("*")
      .eq("profile_id", profile.id);

    if (items) {
      initialItems = items;
    }
  }

  return (
    <ProfileView
      initialProfile={profile}
      initialItems={initialItems}
      usernameParam={username}
    />
  );
}

export default function Page({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  return (
    <Suspense fallback={<ProfileSkeleton />}>
      <ProfileLoader paramsPromise={params} />
    </Suspense>
  );
}
