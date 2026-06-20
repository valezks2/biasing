"use client";
import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { ModalEdit } from "@/components/ui/ModalEdit";
import { ModalDelete } from "@/components/ui/ModalDelete";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY || "";
const supabase = createClient(supabaseUrl, supabaseAnonKey);

interface ProfileData {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface DbItem {
  id: string;
  name: string;
  image_url: string;
  since: string;
  category: string;
  type: "group" | "bias";
}

const ProfilePage = () => {
  const params = useParams();
  const usernameParam = params?.username as string;

  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<ProfileData | null>(null);
  const [currentSessionUser, setCurrentSessionUser] = useState<any>(null);
  const [groups, setGroups] = useState<any[]>([]);
  const [biases, setBiases] = useState<any[]>([]);

  const [query, setQuery] = useState("");
  const [results, setResults] = useState<{ name: string; image: string }[]>([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [selectedType, setSelectedType] = useState<"group" | "bias">("group");
  const [selectedCategory, setSelectedCategory] = useState("Ults of Ults");

  const [customMonth, setCustomMonth] = useState(
    (new Date().getMonth() + 1).toString().padStart(2, "0"),
  );
  const [customYear, setCustomYear] = useState(
    new Date().getFullYear().toString(),
  );

  const [editingItem, setEditingItem] = useState<DbItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<DbItem | null>(null);

  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const currentYearNum = new Date().getFullYear();
  const yearsRange = Array.from({ length: currentYearNum - 2004 }, (_, i) =>
    (currentYearNum - i).toString(),
  );

  const monthsRange = [
    { value: "01", label: "Ene" },
    { value: "02", label: "Feb" },
    { value: "03", label: "Mar" },
    { value: "04", label: "Abr" },
    { value: "05", label: "May" },
    { value: "06", label: "Jun" },
    { value: "07", label: "Jul" },
    { value: "08", label: "Ago" },
    { value: "09", label: "Sep" },
    { value: "10", label: "Oct" },
    { value: "11", label: "Nov" },
    { value: "12", label: "Dic" },
  ];

  const baseGroupCategories = [
    { title: "Ults of Ults", items: [] },
    { title: "Ults", items: [] },
    { title: "Semi Ults", items: [] },
    { title: "Regular", items: [] },
    { title: "Stan", items: [] },
    { title: "Like", items: [] },
    { title: "Casual Listener", items: [] },
  ];

  const baseBiasCategories = [
    { title: "Ults of Ults", items: [] },
    { title: "Ults", items: [] },
    { title: "Semi Ults", items: [] },
    { title: "Regular", items: [] },
    { title: "Solo Stan", items: [] },
    { title: "Like", items: [] },
  ];

  const mapItemsToCategories = (items: DbItem[]) => {
    const filledGroups = baseGroupCategories.map((cat) => ({
      ...cat,
      items: items.filter(
        (i) => i.type === "group" && i.category === cat.title,
      ),
    }));
    const filledBiases = baseBiasCategories.map((cat) => ({
      ...cat,
      items: items.filter((i) => i.type === "bias" && i.category === cat.title),
    }));
    setGroups(filledGroups);
    setBiases(filledBiases);
  };

  const refreshItems = async () => {
    if (!user) return;
    const { data: items } = await supabase
      .from("profile_items")
      .select("*")
      .eq("profile_id", user.id);
    if (items) mapItemsToCategories(items);
  };

  const fetchProfileData = async () => {
    if (!usernameParam) return;
    setLoading(true);
    try {
      const { data: sessionData } = await supabase.auth.getUser();
      setCurrentSessionUser(sessionData?.user || null);

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("username", usernameParam)
        .single();
      if (profileError || !profile) {
        setUser(null);
        return;
      }
      setUser(profile);

      const { data: items, error: itemsError } = await supabase
        .from("profile_items")
        .select("*")
        .eq("profile_id", profile.id);
      if (!itemsError && items) mapItemsToCategories(items);
    } catch (error) {
      console.error("Error cargando perfil:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, [usernameParam]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (val.length < 2) return setResults([]);
    setSearchLoading(true);
    try {
      const res = await fetch(`/api/kpop?query=${encodeURIComponent(val)}`);
      const data = await res.json();
      setResults(Array.isArray(data) ? data : []);
    } catch (e) {
      setResults([
        { name: `${val} (Test Group)`, image: "https://placehold.co/150" },
        { name: `${val} - Bias Test`, image: "https://placehold.co/150" },
      ]);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSaveItem = async (itemName: string, itemImage: string) => {
    if (!user) return;
    const sinceString = `${customMonth}/${customYear}`;
    try {
      const { error } = await supabase.from("profile_items").insert([
        {
          profile_id: user.id,
          type: selectedType,
          category: selectedCategory,
          name: itemName,
          image_url: itemImage,
          since: sinceString,
        },
      ]);
      if (error) throw error;
      await refreshItems();
      setQuery("");
      setResults([]);
    } catch (error) {
      alert("Error guardando en la base de datos.");
    }
  };

  const handleUpdateItem = async (category: string, since: string) => {
    if (!editingItem) return;
    try {
      const { error } = await supabase
        .from("profile_items")
        .update({ category, since })
        .eq("id", editingItem.id);

      if (error) throw error;
      await refreshItems();
      setEditingItem(null);
    } catch (e) {
      alert("Error actualizando el ítem.");
    }
  };

  const handleDeleteItem = async () => {
    if (!deletingItem) return;
    try {
      const { error } = await supabase
        .from("profile_items")
        .delete()
        .eq("id", deletingItem.id);
      if (error) throw error;
      await refreshItems();
      setDeletingItem(null);
    } catch (e) {
      alert("Error eliminando el ítem.");
    }
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
        <span className="text-xs font-black uppercase tracking-[0.3em] animate-pulse">
          Cargando Perfil...
        </span>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white text-black font-sans">
        <span className="text-xs font-black uppercase tracking-[0.3em]">
          Usuario no encontrado
        </span>
      </div>
    );
  }

  const isOwnProfile = true;

  const RenderCategories = ({ categories }: { categories: any[] }) => (
    <div className="space-y-16">
      {categories.map((cat, index) => (
        <div key={cat.title} className="group">
          <div className="flex items-baseline gap-4 mb-6 border-b border-black/5 pb-2">
            <span className="text-[10px] font-black text-neutral-300">
              0{index + 1}
            </span>
            <h3 className="text-xl font-bold uppercase tracking-tighter text-neutral-800">
              {cat.title}
            </h3>
          </div>

          {cat.items.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-2">
              {cat.items.map((item: DbItem) => (
                <div
                  key={item.id}
                  className="relative aspect-[3/4] bg-neutral-100 border border-black/10 overflow-hidden group/card"
                >
                  <img
                    src={item.image_url || "/placeholder.jpg"}
                    alt={item.name}
                    className="w-full h-full object-cover group-hover/card:scale-105 transition-all duration-500"
                  />

                  {isOwnProfile && (
                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity duration-200 z-30">
                      <button
                        onClick={() => setEditingItem(item)}
                        className="p-2 bg-white text-black border border-black hover:bg-black hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                      >
                        ✎
                      </button>
                      <button
                        onClick={() => setDeletingItem(item)}
                        className="p-2 bg-white text-red-600 border border-black hover:bg-red-600 hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                      >
                        ✕
                      </button>
                    </div>
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
                    {item.since && (
                      <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                        Since {item.since}
                      </p>
                    )}
                    <h4 className="text-white text-lg font-bold leading-none tracking-tighter uppercase">
                      {item.name}
                    </h4>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-24 border border-dashed border-neutral-200 flex items-center justify-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-neutral-300">
                Empty List
              </span>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-white text-[#111] font-sans relative">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col md:flex-row items-center md:items-end gap-8 border-b border-black pb-12 mb-16">
          <div className="w-40 h-40 bg-neutral-100 border border-black overflow-hidden flex-shrink-0">
            <img
              src={user.avatar_url || "/icon.jpg"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-center md:text-left w-full">
            <div>
              <h1 className="text-6xl lg:text-[100px] font-bold tracking-tighter leading-none uppercase mb-2">
                {user.display_name || user.username}
              </h1>
              <p className="text-xl font-bold tracking-widest text-neutral-400 uppercase">
                @{user.username}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 lg:gap-8 mt-4 lg:mt-0">
              <div className="flex gap-6 border-y md:border-y-0 md:border-x border-black/10 py-2 md:py-0 md:px-6">
                <div className="text-center md:text-left">
                  <span className="block text-2xl font-black tracking-tighter leading-none">
                    {followersCount}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Followers
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-2xl font-black tracking-tighter leading-none">
                    0
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Following
                  </span>
                </div>
              </div>
              <button
                onClick={handleFollowToggle}
                className={`w-full sm:w-auto px-8 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 border border-black cursor-pointer ${isFollowing ? "bg-neutral-100 text-neutral-400 border-neutral-200" : "bg-black text-white hover:bg-neutral-900 active:scale-95"}`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </section>

        {isOwnProfile && (
          <section className="mb-16 p-6 border-2 border-black bg-neutral-50 max-w-xl">
            <h3 className="text-xs font-black uppercase tracking-widest mb-4">
              (TEST) Add
            </h3>
            <div className="flex gap-4 mb-3">
              <select
                value={selectedType}
                onChange={(e) => {
                  setSelectedType(e.target.value as "group" | "bias");
                  setSelectedCategory("Ults of Ults");
                }}
                className="border border-black p-2 text-[10px] font-bold uppercase tracking-wider bg-white focus:outline-none"
              >
                <option value="group">Group</option>
                <option value="bias">Bias (Idol)</option>
              </select>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="border border-black p-2 text-[10px] font-bold uppercase tracking-wider bg-white focus:outline-none flex-1"
              >
                {(selectedType === "group"
                  ? baseGroupCategories
                  : baseBiasCategories
                ).map((cat) => (
                  <option key={cat.title} value={cat.title}>
                    {cat.title}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-4 mb-4 items-center">
              <span className="text-[9px] font-black uppercase tracking-wider text-neutral-500">
                Stan Since:
              </span>
              <select
                value={customMonth}
                onChange={(e) => setCustomMonth(e.target.value)}
                className="border border-black p-2 text-[10px] font-bold uppercase tracking-wider bg-white focus:outline-none flex-1"
              >
                {monthsRange.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={customYear}
                onChange={(e) => setCustomYear(e.target.value)}
                className="border border-black p-2 text-[10px] font-bold uppercase tracking-wider bg-white focus:outline-none flex-1"
              >
                {yearsRange.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>

            <input
              type="text"
              value={query}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={`Search a ${selectedType === "group" ? "group" : "member"}...`}
              className="w-full border border-black p-3 text-[10px] uppercase font-black tracking-widest bg-white focus:outline-none"
            />

            <div className="mt-2 divide-y divide-black border border-black bg-white max-h-60 overflow-y-auto">
              {searchLoading && (
                <div className="p-3 text-[10px] font-bold tracking-widest uppercase text-neutral-400 animate-pulse">
                  Searching...
                </div>
              )}
              {!searchLoading && query.length >= 2 && results.length === 0 && (
                <div className="p-3 text-[10px] font-bold tracking-widest uppercase text-neutral-400">
                  No results found
                </div>
              )}
              {!searchLoading &&
                results.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    onClick={() => handleSaveItem(item.name, item.image)}
                    className="w-full p-3 flex items-center gap-4 hover:bg-black hover:text-white transition-all text-left group text-[10px] font-black uppercase tracking-wider cursor-pointer bg-white"
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-8 h-8 object-cover border border-black bg-neutral-100"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/150";
                      }}
                    />
                    <div className="flex flex-col">
                      <span>{item.name}</span>
                      <span className="text-[8px] text-neutral-400 group-hover:text-neutral-300 font-normal">
                        [Añadir con fecha {customMonth}/{customYear}]
                      </span>
                    </div>
                  </button>
                ))}
            </div>
          </section>
        )}

        <div className="space-y-24">
          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-900">
                Groups
              </h2>
              <div className="h-1 w-12 bg-black mt-2"></div>
            </div>
            <RenderCategories categories={groups} />
          </section>
          <hr className="border-neutral-200" />
          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-900">
                Biases
              </h2>
              <div className="h-1 w-12 bg-black mt-2"></div>
            </div>
            <RenderCategories categories={biases} />
          </section>
        </div>
      </main>

      {editingItem && (
        <ModalEdit
          item={editingItem}
          onClose={() => setEditingItem(null)}
          onUpdate={handleUpdateItem}
          baseGroupCategories={baseGroupCategories}
          baseBiasCategories={baseBiasCategories}
          monthsRange={monthsRange}
          yearsRange={yearsRange}
        />
      )}

      {deletingItem && (
        <ModalDelete
          item={deletingItem}
          onClose={() => setDeletingItem(null)}
          onDelete={handleDeleteItem}
        />
      )}
    </div>
  );
};

export default ProfilePage;
