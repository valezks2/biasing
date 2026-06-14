"use client";
import React, { useState } from "react";

interface BiasItem {
  id: string;
  name: string;
  imageUrl: string;
  since: string;
}

const ProfilePage = () => {
  const [isFollowing, setIsFollowing] = useState(false);
  const [followersCount, setFollowersCount] = useState(0);

  const userData = {
    name: "Vale",
    username: "@valezks2",
    profilePic: "/icon.jpg",
    followingCount: 0,
  };

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
    setFollowersCount((prev) => (isFollowing ? prev - 1 : prev + 1));
  };

  const groupCategories = [
    {
      title: "Ults of Ults",
      items: [
        {
          id: "g1",
          name: "NewJeans",
          imageUrl: "/newjeans.jpg",
          since: "2023",
        },
      ],
    },
    { title: "Ults", items: [] },
    { title: "Semi Ults", items: [] },
    { title: "Regular", items: [] },
    { title: "Stan", items: [] },
    { title: "Like", items: [] },
    { title: "Casual Listener", items: [] },
  ];

  const biasCategories = [
    {
      title: "Ults of Ults",
      items: [
        {
          id: "b1",
          name: "Jeonghan",
          imageUrl: "/jeonghan.jpg",
          since: "July 2023",
        },
      ],
    },
    { title: "Ults", items: [] },
    { title: "Semi Ults", items: [] },
    { title: "Regular", items: [] },
    { title: "Solo Stan", items: [] },
    { title: "Like", items: [] },
  ];

  const RenderCategories = ({
    categories,
  }: {
    categories: typeof groupCategories;
  }) => (
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
              {cat.items.map((item) => (
                <div
                  key={item.id}
                  className="relative aspect-[3/4] bg-neutral-100 border border-black/10 overflow-hidden group/card"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-full h-full object-cover grayscale group-hover/card:grayscale-0 group-hover/card:scale-105 transition-all duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                    <p className="text-white text-[10px] font-black uppercase tracking-[0.2em] mb-1">
                      Since {item.since}
                    </p>
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
    <div className="min-h-screen bg-white text-[#111] font-sans">
      <main className="max-w-[1400px] mx-auto px-6 lg:px-12 py-20">
        <section className="flex flex-col md:flex-row items-center md:items-end gap-8 border-b border-black pb-12 mb-16">
          <div className="w-40 h-40 bg-neutral-100 border border-black overflow-hidden flex-shrink-0">
            <img
              src={userData.profilePic}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 flex flex-col lg:flex-row lg:items-end justify-between gap-6 text-center md:text-left w-full">
            <div>
              <h1 className="text-6xl lg:text-[100px] font-bold tracking-tighter leading-none uppercase mb-2">
                {userData.name}
              </h1>
              <p className="text-xl font-bold tracking-widest text-neutral-400 uppercase">
                {userData.username}
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
                    {userData.followingCount}
                  </span>
                  <span className="text-[10px] font-bold tracking-widest text-neutral-400 uppercase">
                    Following
                  </span>
                </div>
              </div>

              <button
                onClick={handleFollowToggle}
                className={`w-full sm:w-auto px-8 py-3 text-xs font-black uppercase tracking-widest transition-all duration-200 border border-black cursor-pointer ${
                  isFollowing
                    ? "bg-neutral-100 text-neutral-400 border-neutral-200"
                    : "bg-black text-white hover:bg-neutral-900 active:scale-95"
                }`}
              >
                {isFollowing ? "Following" : "Follow"}
              </button>
            </div>
          </div>
        </section>

        <div className="space-y-24">
          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-900">
                Groups
              </h2>
              <div className="h-1 w-12 bg-black mt-2"></div>
            </div>
            <RenderCategories categories={groupCategories} />
          </section>

          <hr className="border-neutral-200" />

          <section>
            <div className="mb-10">
              <h2 className="text-4xl font-black uppercase tracking-tight text-neutral-900">
                Biases
              </h2>
              <div className="h-1 w-12 bg-black mt-2"></div>
            </div>
            <RenderCategories categories={biasCategories} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
