"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

interface ConnectionUser {
  id: string;
  username: string;
  display_name: string;
  avatar_url: string | null;
}

interface ModalConnectionsProps {
  isOpen: boolean;
  onClose: () => void;
  userId: string;
  currentUserId: string | null;
  type: "followers" | "following";
}

export const ModalConnections = ({
  isOpen,
  onClose,
  userId,
  currentUserId,
  type,
}: ModalConnectionsProps) => {
  const supabase = createClient();
  const [connections, setConnections] = useState<ConnectionUser[]>([]);
  const [followingIds, setFollowingIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isOpen) return;

    const fetchConnectionsAndRegistry = async () => {
      setLoading(true);
      try {
        let formattedUsers: ConnectionUser[] = [];

        if (type === "followers") {
          const { data, error } = await supabase
            .from("follows")
            .select(
              `follower:follower_id ( id, username, display_name, avatar_url )`,
            )
            .eq("following_id", userId);

          if (!error && data) {
            formattedUsers = data
              .map((item: any) => item.follower)
              .filter(Boolean);
          }
        } else {
          const { data, error } = await supabase
            .from("follows")
            .select(
              `following:following_id ( id, username, display_name, avatar_url )`,
            )
            .eq("follower_id", userId);

          if (!error && data) {
            formattedUsers = data
              .map((item: any) => item.following)
              .filter(Boolean);
          }
        }
        setConnections(formattedUsers);

        if (currentUserId && formattedUsers.length > 0) {
          const userIdsToCheck = formattedUsers.map((u) => u.id);

          const { data: followData, error: followError } = await supabase
            .from("follows")
            .select("following_id")
            .eq("follower_id", currentUserId)
            .in("following_id", userIdsToCheck);

          if (!followError && followData) {
            const followedSet = new Set<string>(
              followData.map((f) => f.following_id),
            );
            setFollowingIds(followedSet);
          }
        }
      } catch (err) {
        console.error("Error fetching connections data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConnectionsAndRegistry();
  }, [isOpen, userId, type, currentUserId]);

  const handleRowFollowToggle = async (
    targetUserId: string,
    isCurrentlyFollowing: boolean,
  ) => {
    if (!currentUserId) return;

    if (isCurrentlyFollowing) {
      const { error } = await supabase
        .from("follows")
        .delete()
        .eq("follower_id", currentUserId)
        .eq("following_id", targetUserId);

      if (!error) {
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.delete(targetUserId);
          return next;
        });
      }
    } else {
      const { error } = await supabase
        .from("follows")
        .insert([{ follower_id: currentUserId, following_id: targetUserId }]);

      if (!error) {
        setFollowingIds((prev) => {
          const next = new Set(prev);
          next.add(targetUserId);
          return next;
        });
      }
    }
  };

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col max-h-[80vh]">
        <div className="mb-4">
          <h3 className="text-sm font-black uppercase tracking-wider mb-1 text-foreground">
            {type === "followers" ? "Followers" : "Following"}
          </h3>
          <p className="text-[9px] text-foreground/50 uppercase tracking-widest">
            {type === "followers"
              ? "Users following this account."
              : "Accounts followed by this user."}
          </p>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-border border-y border-border my-2 scrollbar-none">
          {loading ? (
            <div className="animate-pulse space-y-0 divide-y divide-border">
              {[1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="flex items-center justify-between py-3 px-2"
                >
                  <div className="flex items-center gap-3 w-full">
                    <div className="w-8 h-8 border border-border bg-foreground/10 flex-shrink-0" />
                    <div className="flex flex-col gap-2 w-1/2">
                      <div className="h-3 bg-foreground/10 w-full" />
                      <div className="h-2 bg-foreground/5 w-1/2" />
                    </div>
                  </div>
                  <div className="w-16 h-6 bg-foreground/10 border border-border flex-shrink-0" />
                </div>
              ))}
            </div>
          ) : connections.length > 0 ? (
            connections.map((conn) => {
              const isUserFollowing = followingIds.has(conn.id);
              const isMe = currentUserId === conn.id;

              return (
                <div
                  key={conn.id}
                  className="flex items-center justify-between py-3 px-2 hover:bg-foreground/5 transition-colors group"
                >
                  <a
                    href={`/${conn.username}`}
                    className="flex items-center gap-3 flex-1 truncate mr-2"
                  >
                    <div className="w-8 h-8 border border-border overflow-hidden bg-foreground/10 flex-shrink-0">
                      <img
                        src={conn.avatar_url || "/placeholder.png"}
                        alt={conn.username}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex flex-col truncate">
                      <span className="text-[11px] font-black uppercase tracking-wider text-foreground leading-none mb-1 group-hover:underline">
                        {conn.display_name || conn.username}
                      </span>
                      <span className="text-[9px] font-bold text-foreground/40 uppercase tracking-widest leading-none">
                        @{conn.username}
                      </span>
                    </div>
                  </a>

                  {currentUserId && !isMe && (
                    <button
                      onClick={() =>
                        handleRowFollowToggle(conn.id, isUserFollowing)
                      }
                      className={`px-3 py-1 text-[8px] font-black uppercase tracking-widest border transition-all duration-150 cursor-pointer ${
                        isUserFollowing
                          ? "bg-background text-foreground/40 border-border hover:border-red-500 hover:text-red-500"
                          : "bg-foreground text-background border-foreground hover:bg-background hover:text-foreground"
                      }`}
                    >
                      {isUserFollowing ? "Following" : "Follow"}
                    </button>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-8 text-center">
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/20">
                No users found
              </span>
            </div>
          )}
        </div>

        <div className="pt-2">
          <button
            type="button"
            onClick={onClose}
            className="w-full bg-background text-foreground border border-border p-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground hover:text-background transition-all cursor-pointer"
          >
            CLOSE
          </button>
        </div>
      </div>
    </div>
  );
};
