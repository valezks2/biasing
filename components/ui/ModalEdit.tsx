"use client";
import React, { useEffect, useState } from "react";

interface DbItem {
  id: string;
  name: string;
  image_url: string;
  since: string;
  category: string;
  type: "group" | "bias";
}

interface ModalEditProps {
  item: DbItem;
  onClose: () => void;
  onUpdate: (category: string, since: string) => Promise<void>;
  baseGroupCategories: { title: string }[];
  baseBiasCategories: { title: string }[];
  monthsRange: { value: string; label: string }[];
  yearsRange: string[];
}

export const ModalEdit = ({
  item,
  onClose,
  onUpdate,
  baseGroupCategories,
  baseBiasCategories,
  monthsRange,
  yearsRange,
}: ModalEditProps) => {
  const [category, setCategory] = useState(item.category);
  const [loading, setLoading] = useState(false);

  const dateParts = item.since?.split("/") || [];
  const [month, setMonth] = useState(dateParts[0] || "01");
  const [year, setYear] = useState(
    dateParts[1] || new Date().getFullYear().toString(),
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleSave = async () => {
    try {
      setLoading(true);
      await onUpdate(category, `${month}/${year}`);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const categories =
    item.type === "group" ? baseGroupCategories : baseBiasCategories;

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-wider mb-2 text-foreground">
          Edit {item.name}
        </h3>
        <p className="text-[9px] text-foreground/50 uppercase tracking-widest mb-4">
          Update the category or date of this item.
        </p>

        <div className="space-y-4">
          <div>
            <label className="block text-[9px] font-black uppercase mb-1 text-foreground">
              Move to list:
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full border border-border p-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none bg-background text-foreground"
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
              Modify Date:
            </label>
            <div className="flex gap-2">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="flex-1 border border-border p-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none bg-background text-foreground"
              >
                {monthsRange.map((m) => (
                  <option key={m.value} value={m.value}>
                    {m.label}
                  </option>
                ))}
              </select>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="flex-1 border border-border p-2 text-[10px] font-bold uppercase tracking-wider focus:outline-none bg-background text-foreground"
              >
                {yearsRange.map((yr) => (
                  <option key={yr} value={yr}>
                    {yr}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleSave}
            disabled={loading}
            className="flex-1 bg-foreground text-background border border-foreground p-3 text-[10px] font-black uppercase tracking-widest hover:bg-background hover:text-foreground transition-all cursor-pointer disabled:opacity-50"
          >
            {loading ? "SAVING..." : "SAVE"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-background text-foreground border border-border p-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 transition-all cursor-pointer"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
