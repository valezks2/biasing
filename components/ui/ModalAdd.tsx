"use client";
import React, { useEffect, useState } from "react";

interface KpopSearchResult {
  name: string;
  image: string;
}

interface ModalAddProps {
  onClose: () => void;
  onAdd: (
    name: string,
    category: string,
    date: string,
    type: "group" | "bias",
    imageUrl: string,
  ) => Promise<void>;
  baseGroupCategories: { title: string }[];
  baseBiasCategories: { title: string }[];
  monthsRange: { value: string; label: string }[];
}

export const ModalAdd = ({
  onClose,
  onAdd,
  baseGroupCategories,
  baseBiasCategories,
  monthsRange,
}: ModalAddProps) => {
  const [name, setName] = useState("");
  const [type, setType] = useState<"group" | "bias">("group");
  const [category, setCategory] = useState("");
  const [month, setMonth] = useState("01");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const [searchResults, setSearchResults] = useState<KpopSearchResult[]>([]);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");
  const [searching, setSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    const currentCategories =
      type === "group" ? baseGroupCategories : baseBiasCategories;
    if (currentCategories.length > 0) {
      setCategory(currentCategories[0].title);
    }
  }, [type, baseGroupCategories, baseBiasCategories]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  useEffect(() => {
    if (!name.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    if (selectedImageUrl) {
      return;
    }

    const delayDebounceFn = setTimeout(async () => {
      setSearching(true);
      try {
        const res = await fetch(
          `/api/kpop?query=${encodeURIComponent(name.trim())}`,
        );
        const data = await res.json();
        if (Array.isArray(data)) {
          setSearchResults(data);
          setShowDropdown(data.length > 0);
        } else {
          setSearchResults([]);
        }
      } catch (error) {
        console.error("Error fetching kpop info:", error);
      } finally {
        setSearching(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [name, selectedImageUrl]);

  const handleSelectIdol = (item: KpopSearchResult) => {
    setName(item.name);
    setSelectedImageUrl(item.image);
    setShowDropdown(false);
  };

  const handleYearChange = (val: string) => {
    setErrorMsg(null);
    const currentYear = new Date().getFullYear();
    const numericVal = parseInt(val, 10);

    if (val === "") {
      setYear("");
      return;
    }

    if (!isNaN(numericVal)) {
      if (numericVal > currentYear) {
        return;
      }

      if (val.length >= 4) {
        if (numericVal < 1990) {
          setYear("1990");
          return;
        }
        if (val.length > 4) {
          return;
        }
      }
    }

    setYear(val);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !category) return;
    setErrorMsg(null);

    const currentYear = new Date().getFullYear();
    const numericYear = parseInt(year, 10);

    if (!year || year.length < 4 || isNaN(numericYear)) {
      setErrorMsg("Please enter a valid 4-digit year.");
      return;
    }

    if (numericYear < 1990 || numericYear > currentYear) {
      setErrorMsg(`Year must be between 1990 and ${currentYear}.`);
      return;
    }

    let finalImg = selectedImageUrl;
    if (!finalImg) {
      if (searchResults.length > 0) {
        finalImg = searchResults[0].image;
      } else {
        finalImg = "/placeholder.png";
      }
    }

    try {
      setLoading(true);
      await onAdd(name.trim(), category, `${month}/${year}`, type, finalImg);
      onClose();
    } catch (e) {
      console.error("Error adding item:", e);
      setErrorMsg("Failed to save. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const categories =
    type === "group" ? baseGroupCategories : baseBiasCategories;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border p-6 w-full max-w-sm shadow-xl animate-in fade-in zoom-in-95 duration-150 relative">
        <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-foreground">
          Add New
        </h3>
        <p className="text-[9px] text-foreground/50 uppercase tracking-widest mb-4">
          Add a new idol or group into your record.
        </p>

        <form onSubmit={handleSave} className="space-y-4" noValidate>
          <div>
            <label className="block text-[9px] font-black uppercase mb-1 text-foreground">
              Type:
            </label>
            <div className="flex border border-border overflow-hidden bg-background">
              {(["group", "bias"] as const).map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => {
                    setType(t);
                    setName("");
                    setSelectedImageUrl("");
                  }}
                  className={`flex-1 py-2 text-[10px] font-black uppercase tracking-widest transition-all border-r last:border-r-0 border-border cursor-pointer ${
                    type === t
                      ? "bg-foreground text-background"
                      : "hover:bg-foreground/5 text-foreground/70 hover:text-foreground"
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-1 relative">
            <div className="flex justify-between items-center">
              <label className="text-[9px] font-black uppercase text-foreground">
                Name:
              </label>
              {searching && (
                <span className="text-[8px] font-black uppercase text-foreground/40 animate-pulse">
                  Searching...
                </span>
              )}
            </div>
            <input
              type="text"
              required
              placeholder={type === "group" ? "E.G. TWICE" : "E.G. MOMO"}
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setSelectedImageUrl("");
              }}
              onFocus={() => {
                if (searchResults.length > 0) setShowDropdown(true);
              }}
              className="w-full border border-border p-2 bg-background text-[10px] font-bold uppercase tracking-wider focus:outline-none placeholder-foreground/20 text-foreground"
            />

            {showDropdown && (
              <div className="absolute top-[100%] left-0 w-full bg-background border border-border mt-1 max-h-40 overflow-y-auto z-50 shadow-2xl divide-y divide-border">
                {searchResults.map((item, idx) => (
                  <div
                    key={idx}
                    onClick={() => handleSelectIdol(item)}
                    className="flex items-center gap-3 p-2 hover:bg-foreground hover:text-background cursor-pointer transition-colors group"
                  >
                    <div className="relative w-6 h-6 border border-border overflow-hidden bg-foreground/10 flex-shrink-0">
                      <img
                        src={item.image || "/placeholder.png"}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-wider truncate">
                      {item.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase mb-1 text-foreground">
              Assign to list:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-border p-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none bg-background text-foreground cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat.title} value={cat.title}>
                  {cat.title}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[9px] font-black uppercase mb-1 text-foreground">
              Since Date:
            </label>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="flex-1 border border-border p-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none bg-background text-foreground cursor-pointer"
              >
                {monthsRange.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <input
                type="number"
                min="1990"
                max={new Date().getFullYear().toString()}
                value={year}
                onChange={(e) => handleYearChange(e.target.value)}
                className="flex-1 border border-border p-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none bg-background text-foreground"
              />
            </div>
          </div>

          {errorMsg && (
            <div className="pt-2 animate-in fade-in duration-200">
              <p className="text-[10px] font-black uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-3">
                {errorMsg}
              </p>
            </div>
          )}

          <div className="flex gap-2 pt-2">
            <button
              type="submit"
              disabled={loading || !name.trim()}
              className="flex-1 bg-foreground text-background border border-foreground p-3 text-[10px] font-black uppercase tracking-widest hover:bg-background hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
            >
              {loading ? "ADDING..." : "ADD"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-background text-foreground border border-border p-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 transition-all cursor-pointer"
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
