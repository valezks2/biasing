"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { User } from "@supabase/supabase-js";
import Image from "next/image";

type ThemeType = "light" | "dark" | "system";
type MessageType = { type: "success" | "error"; text: string } | null;

export default function SettingsPage() {
  const supabase = createClient();
  const router = useRouter();

  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [profileMessage, setProfileMessage] = useState<MessageType>(null);
  const [emailMessage, setEmailMessage] = useState<MessageType>(null);
  const [passwordMessage, setPasswordMessage] = useState<MessageType>(null);

  const [displayName, setDisplayName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("/icon.jpg");
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const [newPassword, setNewPassword] = useState("");
  const [theme, setTheme] = useState<ThemeType>("system");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as ThemeType;
    if (savedTheme) {
      setTheme(savedTheme);
    }

    const getProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        router.push("/auth/login");
        return;
      }

      setUser(user);
      setEmail(user.email || "");

      const { data: profile, error } = await supabase
        .from("profiles")
        .select("username, display_name, avatar_url")
        .eq("id", user.id)
        .single();

      if (!error && profile) {
        setDisplayName(profile.display_name || "");
        setUsername(profile.username || "");
        if (profile.avatar_url) setAvatarUrl(profile.avatar_url);
      }
      setLoading(false);
    };

    getProfile();
  }, [supabase, router]);

  const changeTheme = (selectedTheme: ThemeType) => {
    setTheme(selectedTheme);
    localStorage.setItem("theme", selectedTheme);

    const root = window.document.documentElement;
    if (selectedTheme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.remove("light", "dark");
      root.classList.add(systemTheme);
    } else {
      root.classList.remove("light", "dark");
      root.classList.add(selectedTheme);
    }
  };

  const handleUpdateProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setProfileMessage(null);

    if (!username.trim()) {
      setProfileMessage({ type: "error", text: "Please choose a username." });
      return;
    }

    if (!displayName.trim()) {
      setProfileMessage({ type: "error", text: "The name cannot be empty." });
      return;
    }

    setUpdating(true);
    const cleanUsername = username.trim().toLowerCase();

    const { data: existingUser, error: searchError } = await supabase
      .from("profiles")
      .select("id")
      .eq("username", cleanUsername)
      .neq("id", user.id)
      .maybeSingle();

    if (searchError) {
      setProfileMessage({
        type: "error",
        text: "Error verifying username availability.",
      });
      setUpdating(false);
      return;
    }

    if (existingUser) {
      setProfileMessage({
        type: "error",
        text: "This username is already taken.",
      });
      setUpdating(false);
      return;
    }

    let finalAvatarUrl = avatarUrl;

    if (avatarFile) {
      setUploadingImage(true);
      const fileExt = avatarFile.name.split(".").pop();
      const filePath = `${user.id}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from("avatars")
        .upload(filePath, avatarFile, { upsert: true });

      if (uploadError) {
        setProfileMessage({
          type: "error",
          text: `Storage error: ${uploadError.message}`,
        });
        setUploadingImage(false);
        setUpdating(false);
        return;
      }

      const {
        data: { publicUrl },
      } = supabase.storage.from("avatars").getPublicUrl(filePath);

      finalAvatarUrl = publicUrl;
      setUploadingImage(false);
    }

    const { error } = await supabase.from("profiles").upsert({
      id: user.id,
      username: cleanUsername,
      display_name: displayName.trim(),
      avatar_url: finalAvatarUrl,
      updated_at: new Date().toISOString(),
    });

    if (error) {
      setProfileMessage({
        type: "error",
        text: "Error updating profile metadata.",
      });
    } else {
      setProfileMessage({
        type: "success",
        text: "Profile updated successfully!",
      });
      setAvatarFile(null);
      setAvatarUrl(finalAvatarUrl);
    }
    setUpdating(false);
  };

  const handleUpdateAccount = async (type: "email" | "password") => {
    if (type === "email") {
      setEmailMessage(null);
      if (!email.trim()) {
        setEmailMessage({ type: "error", text: "Please enter your email." });
        return;
      }
    }

    if (type === "password") {
      setPasswordMessage(null);
      const strongPasswordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*.,\-_])(?=.{8,})/;
      if (!strongPasswordRegex.test(newPassword)) {
        setPasswordMessage({
          type: "error",
          text: "The password must have at least 8 characters, including uppercase, lowercase, a number and a symbol.",
        });
        return;
      }
    }

    setUpdating(true);

    let error;
    if (type === "email") {
      ({ error } = await supabase.auth.updateUser({ email: email.trim() }));
    } else {
      ({ error } = await supabase.auth.updateUser({ password: newPassword }));
    }

    if (error) {
      if (type === "email")
        setEmailMessage({ type: "error", text: error.message });
      if (type === "password")
        setPasswordMessage({ type: "error", text: error.message });
    } else {
      if (type === "email") {
        setEmailMessage({
          type: "success",
          text: "Confirmation link sent to your new email.",
        });
      } else {
        setPasswordMessage({
          type: "success",
          text: "Password updated successfully!",
        });
        setNewPassword("");
      }
    }
    setUpdating(false);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0 || !user) return;
    const file = e.target.files[0];
    setAvatarFile(file);
    const previewUrl = URL.createObjectURL(file);
    setAvatarUrl(previewUrl);
  };

  const handleDeleteAccount = async () => {
    const confirmDelete = confirm(
      "ARE YOU SURE YOU WANT TO PERMANENTLY DELETE YOUR ACCOUNT? THIS CANNOT BE UNDONE.",
    );
    if (!confirmDelete || !user) return;

    setUpdating(true);
    const { error } = await supabase
      .from("profiles")
      .delete()
      .eq("id", user.id);

    if (!error) {
      await supabase.auth.signOut();
      router.push("/");
      router.refresh();
    } else {
      setProfileMessage({
        type: "error",
        text: "Could not complete account deletion.",
      });
      setUpdating(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-[800px] mx-auto px-6 py-20 text-[11px] font-black tracking-widest animate-pulse text-foreground">
        LOADING SETTINGS...
      </div>
    );
  }

  return (
    <main className="max-w-[800px] mx-auto px-6 py-12 text-foreground bg-background">
      <h1 className="text-2xl font-black uppercase tracking-wider mb-8 border-b border-border pb-4">
        Account Settings
      </h1>

      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-4">
          01. Appearance
        </h2>
        <div className="border border-border p-6 flex flex-col sm:flex-row justify-between sm:items-center gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider">
              Interface Theme
            </p>
            <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wide">
              Select your application visual interface
            </p>
          </div>
          <div className="flex border border-border overflow-hidden bg-background">
            {(["light", "dark", "system"] as ThemeType[]).map((t) => (
              <button
                key={t}
                onClick={() => changeTheme(t)}
                className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-r last:border-r-0 border-border cursor-pointer ${
                  theme === t
                    ? "bg-foreground text-background"
                    : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-4">
          02. Profile Information
        </h2>

        <div className="border border-border p-6 flex flex-col sm:flex-row items-center gap-6 mb-6">
          <div className="relative w-16 h-16 border border-border overflow-hidden bg-foreground/10 flex-shrink-0">
            <Image
              src={avatarUrl}
              alt="Avatar Preview"
              fill
              className="object-cover"
            />
          </div>
          <div className="flex-1 text-center sm:text-left">
            <p className="text-xs font-black uppercase tracking-wider mb-1">
              Profile Picture
            </p>
            <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wide mb-3">
              PNG or JPG. Max 2MB.
            </p>
            <label className="border border-border px-4 py-2 text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-background hover:text-foreground transition-all cursor-pointer inline-block">
              {uploadingImage ? "UPLOADING..." : "UPLOAD NEW IMAGE"}
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                disabled={updating || uploadingImage}
                className="hidden"
              />
            </label>
          </div>
        </div>

        <form onSubmit={handleUpdateProfile} className="space-y-6" noValidate>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest">
                Username
              </label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="border border-border p-3 bg-background text-xs font-bold uppercase tracking-wider focus:outline-none text-foreground"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-[10px] font-black uppercase tracking-widest">
                Display Name
              </label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="border border-border p-3 bg-background text-xs font-bold uppercase tracking-wider focus:outline-none text-foreground"
              />
            </div>
          </div>

          <div>
            {profileMessage && (
              <div className="py-4">
                <p
                  className={`text-[10px] font-black uppercase tracking-widest border-l-2 pl-3 ${
                    profileMessage.type === "success"
                      ? "text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                      : "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400"
                  }`}
                >
                  {profileMessage.text}
                </p>
              </div>
            )}

            <button
              type="submit"
              disabled={updating || uploadingImage}
              className="w-full bg-foreground text-background p-4 text-[10px] font-black uppercase tracking-[0.2em] border border-border hover:bg-background hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              {updating ? "SAVING..." : "SAVE PROFILE CHANGES"}
            </button>
          </div>
        </form>
      </section>

      <section className="mb-12 space-y-6">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-foreground/40 mb-4">
          03. Security & Credentials
        </h2>

        <div>
          <div className="border border-border p-6 flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest">
              Update Email Address
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 border border-border p-3 bg-background text-xs font-bold tracking-wide focus:outline-none text-foreground"
              />
              <button
                type="button"
                onClick={() => handleUpdateAccount("email")}
                disabled={updating || uploadingImage}
                className="border border-border px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-background hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
              >
                Update Email
              </button>
            </div>
          </div>

          {emailMessage && (
            <div className="py-4">
              <p
                className={`text-[10px] font-black uppercase tracking-widest border-l-2 pl-3 ${
                  emailMessage.type === "success"
                    ? "text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                    : "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400"
                }`}
              >
                {emailMessage.text}
              </p>
            </div>
          )}
        </div>

        <div>
          <div className="border border-border p-6 flex flex-col gap-4">
            <label className="text-[10px] font-black uppercase tracking-widest">
              Change Password
            </label>
            <div className="flex flex-col sm:flex-row gap-3">
              <input
                type="password"
                placeholder="ENTER NEW PASSWORD"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="flex-1 border border-border p-3 bg-background text-xs font-bold tracking-wide focus:outline-none placeholder-foreground/30 text-foreground"
              />
              <button
                type="button"
                onClick={() => handleUpdateAccount("password")}
                disabled={updating || uploadingImage}
                className="border border-border px-6 py-3 text-[10px] font-black uppercase tracking-widest bg-foreground text-background hover:bg-background hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
              >
                Change Password
              </button>
            </div>
          </div>

          {passwordMessage && (
            <div className="py-4">
              <p
                className={`text-[10px] font-black uppercase tracking-widest border-l-2 pl-3 ${
                  passwordMessage.type === "success"
                    ? "text-green-600 dark:text-green-400 border-green-600 dark:border-green-400"
                    : "text-red-500 dark:text-red-400 border-red-500 dark:border-red-400"
                }`}
              >
                {passwordMessage.text}
              </p>
            </div>
          )}
        </div>
      </section>

      <section className="border-t border-border pt-8">
        <h2 className="text-xs font-black uppercase tracking-[0.3em] text-red-500 dark:text-red-400 mb-4">
          04. Danger Zone
        </h2>
        <div className="border border-red-500/20 p-6 bg-red-500/5 flex flex-col sm:flex-row justify-between items-center gap-4">
          <div>
            <p className="text-xs font-black uppercase tracking-wider text-red-500">
              Delete Account Permanently
            </p>
            <p className="text-[10px] text-foreground/40 font-bold uppercase tracking-wide">
              All data, profile and any associated records will be erased.
            </p>
          </div>
          <button
            onClick={handleDeleteAccount}
            disabled={updating || uploadingImage}
            className="border border-red-500 text-red-500 bg-background px-6 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-background transition-all cursor-pointer"
          >
            Delete Account
          </button>
        </div>
      </section>
    </main>
  );
}
