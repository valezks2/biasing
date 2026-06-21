"use client";
import React, { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { ModalEdit } from "@/components/ui/ModalEdit";
import { ModalDelete } from "@/components/ui/ModalDelete";
import { ModalAdd } from "@/components/ui/ModalAdd";

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

interface ProfileViewProps {
  initialProfile: ProfileData | null;
  initialItems: DbItem[];
  usernameParam: string;
}

export default function ProfileView({
  initialProfile,
  initialItems,
  usernameParam,
}: ProfileViewProps) {
  const supabase = createClient();

  const [user, setUser] = useState<ProfileData | null>(initialProfile);
  const [groups, setGroups] = useState<any[]>([]);
  const [biases, setBiases] = useState<any[]>([]);

  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<DbItem | null>(null);
  const [deletingItem, setDeletingItem] = useState<DbItem | null>(null);

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);
  const [followingCount, setFollowingCount] = useState(0);

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
    { title: "Like", items: [] },
    { title: "Solo Stan", items: [] },
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

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const {
        data: { user: authUser },
      } = await supabase.auth.getUser();
      if (authUser) {
        setCurrentUserId(authUser.id);
      }
    };
    fetchCurrentUser();
  }, []);

  useEffect(() => {
    if (!user) return;

    const fetchFollowData = async () => {
      const { count: followers, error: errFollowers } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("following_id", user.id);

      if (!errFollowers && followers !== null) setFollowersCount(followers);

      const { count: following, error: errFollowing } = await supabase
        .from("follows")
        .select("*", { count: "exact", head: true })
        .eq("follower_id", user.id);

      if (!errFollowing && following !== null) setFollowingCount(following);

      if (currentUserId) {
        const { data, error } = await supabase
          .from("follows")
          .select("id")
          .eq("follower_id", currentUserId)
          .eq("following_id", user.id)
          .maybeSingle();

        if (data && !error) {
          setIsFollowing(true);
        } else {
          setIsFollowing(false);
        }
      }
    };

    fetchFollowData();
  }, [user, currentUserId]);

  useEffect(() => {
    if (initialItems) {
      mapItemsToCategories(initialItems);
    }
  }, [initialItems]);

  const refreshItems = async () => {
    if (!user) return;
    const { data: items } = await supabase
      .from("profile_items")
      .select("*")
      .eq("profile_id", user.id);
    if (items) mapItemsToCategories(items);
  };

  const handleSaveItem = async (
    itemName: string,
    itemCategory: string,
    sinceDate: string,
    itemType: "group" | "bias",
    imageUrl: string,
  ) => {
    if (!user) return;
    try {
      const { error } = await supabase.from("profile_items").insert([
        {
          profile_id: user.id,
          type: itemType,
          category: itemCategory,
          name: itemName,
          image_url: imageUrl,
          since: sinceDate,
        },
      ]);
      if (error) throw error;
      await refreshItems();
    } catch (error) {
      throw error;
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
      throw e;
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
      throw e;
    }
  };

  const handleFollowToggle = async () => {
    if (!currentUserId || !user) return;

    if (isFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", user.id);

      if (!error) {
        setIsFollowing(false);
        setFollowersCount((prev) => Math.max(0, prev - 1));
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert([{ follower_id: currentUserId, following_id: user.id }]);

      if (!error) {
        setIsFollowing(true);
        setFollowersCount((prev) => prev + 1);
      }
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-foreground font-sans">
        <span className="text-xs font-black uppercase tracking-[0.3em] text-foreground">
          User not found
        </span>
      </div>
    );
  }

  const isOwnProfile = currentUserId !== null && currentUserId === user.id;

  const CategoryRow = ({
    cat,
    index,
    isOwnProfile,
    setEditingItem,
    setDeletingItem,
  }: {
    cat: any;
    index: number;
    isOwnProfile: boolean;
    setEditingItem: (item: DbItem) => void;
    setDeletingItem: (item: DbItem) => void;
  }) => {
    const scrollRef = React.useRef<HTMLDivElement>(null);
    const [showArrows, setShowArrows] = useState(false);

    useEffect(() => {
      const checkScroll = () => {
        if (scrollRef.current) {
          const { scrollWidth, clientWidth } = scrollRef.current;
          setShowArrows(scrollWidth > clientWidth);
        }
      };
      checkScroll();
      window.addEventListener("resize", checkScroll);
      return () => window.removeEventListener("resize", checkScroll);
    }, [cat.items]);

    const scroll = (direction: "left" | "right") => {
      if (scrollRef.current) {
        const { clientWidth } = scrollRef.current;
        const scrollAmount =
          direction === "left" ? -clientWidth * 0.8 : clientWidth * 0.8;
        scrollRef.current.scrollBy({ left: scrollAmount, behavior: "smooth" });
      }
    };

    return (
      <div className="group/row relative">
        <div className="flex items-baseline justify-between mb-6 border-b border-border pb-2">
          <div className="flex items-baseline gap-4">
            <span className="text-[10px] font-black text-foreground/20">
              0{index + 1}
            </span>
            <h3 className="text-xl font-bold uppercase tracking-tighter text-foreground">
              {cat.title}
            </h3>
          </div>
          {showArrows && (
            <div className="flex gap-1">
              <button
                onClick={() => scroll("left")}
                className="px-3 py-1 bg-background border border-border text-foreground hover:bg-foreground hover:text-background transition-all text-xs font-black cursor-pointer active:scale-90 select-none"
              >
                ←
              </button>
              <button
                onClick={() => scroll("right")}
                className="px-3 py-1 bg-background border border-border text-foreground hover:bg-foreground hover:text-background transition-all text-xs font-black cursor-pointer active:scale-90 select-none"
              >
                →
              </button>
            </div>
          )}
        </div>

        {cat.items.length > 0 ? (
          <div
            ref={scrollRef}
            className="flex gap-2 overflow-x-auto scrollbar-none snap-x snap-mandatory scroll-smooth pb-2"
            style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
          >
            {cat.items.map((item: DbItem) => (
              <div
                key={item.id}
                className="relative w-[calc(50%-4px)] sm:w-[calc(33.333%-6px)] md:w-[calc(25%-6px)] lg:w-[calc(16.666%-7px)] flex-shrink-0 aspect-[3/4] bg-background border border-border overflow-hidden group/card snap-start"
              >
                <img
                  src={item.image_url || "/placeholder.png"}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover/card:scale-105 transition-all duration-500"
                />
                {isOwnProfile && (
                  <div className="absolute top-2 right-2 flex gap-1 opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-200 z-30">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 bg-background/80 md:bg-background backdrop-blur-sm md:backdrop-blur-none text-foreground border border-border hover:bg-foreground hover:text-background transition-all text-[10px] font-bold cursor-pointer"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => setDeletingItem(item)}
                      className="p-2 bg-background/80 md:bg-background backdrop-blur-sm md:backdrop-blur-none text-red-500 border border-border hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-100 md:opacity-0 md:group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 z-10">
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
          <div className="h-24 border border-dashed border-border flex items-center justify-center">
            <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">
              Empty List
            </span>
          </div>
        )}
      </div>
    );
  };

  const RenderCategories = ({ categories }: { categories: any[] }) => (
    <div className="space-y-16">
      {categories.map((cat, index) => (
        <CategoryRow
          key={cat.title}
          cat={cat}
          index={index}
          isOwnProfile={isOwnProfile}
          setEditingItem={setEditingItem}
          setDeletingItem={setDeletingItem}
        />
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col md:flex-row items-center md:items-end gap-8 border-b border-border pb-12 mb-16">
          <div className="w-40 h-40 bg-background border border-border overflow-hidden flex-shrink-0">
            <img
              src={user.avatar_url || "/placeholder.png"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-center md:text-left w-full">
            <div>
              <h1 className="text-6xl lg:text-[100px] font-bold tracking-tighter leading-none uppercase mb-2 text-foreground">
                {user.display_name || user.username}
              </h1>
              <p className="text-xl font-bold tracking-widest text-foreground/40 uppercase">
                @{user.username}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 lg:gap-8 mt-4 lg:mt-0">
              <div className="flex gap-6 border-y md:border-y-0 md:border-x border-border py-2 md:py-0 md:px-6">
                <div className="text-center md:text-left">
                  <span className="block text-2xl font-black tracking-tighter leading-none text-foreground">
                    {followersCount}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
                    Followers
                  </span>
                </div>
                <div className="text-center md:text-left">
                  <span className="block text-2xl font-black tracking-tighter leading-none text-foreground">
                    {followingCount}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-foreground/40 uppercase">
                    Following
                  </span>
                </div>
              </div>
              {isOwnProfile ? (
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="w-full sm:w-auto px-8 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 border border-border cursor-pointer bg-foreground text-background hover:bg-background hover:text-foreground active:scale-95"
                >
                  Add Item
                </button>
              ) : (
                <button
                  onClick={handleFollowToggle}
                  disabled={!currentUserId}
                  className={`w-full sm:w-auto px-8 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 border cursor-pointer ${
                    isFollowing
                      ? "bg-background text-foreground/30 border-border"
                      : "bg-foreground text-background border-border hover:bg-background hover:text-foreground active:scale-95"
                  }`}
                >
                  {isFollowing ? "Following" : "Follow"}
                </button>
              )}
            </div>
          </div>
        </section>

        <div className="space-y-24">
          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Groups
              </h2>
              <div className="h-1 w-12 bg-foreground mt-2"></div>
            </div>
            <RenderCategories categories={groups} />
          </section>
          <hr className="border-border" />
          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tight text-foreground">
                Biases
              </h2>
              <div className="h-1 w-12 bg-foreground mt-2"></div>
            </div>
            <RenderCategories categories={biases} />
          </section>
        </div>
      </main>

      {isAddOpen && (
        <ModalAdd
          onClose={() => setIsAddOpen(false)}
          onAdd={handleSaveItem}
          baseGroupCategories={baseGroupCategories}
          baseBiasCategories={baseBiasCategories}
          monthsRange={monthsRange}
          yearsRange={yearsRange}
        />
      )}
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
}
