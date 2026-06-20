"use client";
import React, { useEffect, useState } from "react";

interface DbItem {
  id: string;
  name: string;
}

interface ModalDeleteProps {
  item: DbItem;
  onClose: () => void;
  onDelete: () => Promise<void>;
}

export const ModalDelete = ({ item, onClose, onDelete }: ModalDeleteProps) => {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleConfirm = async () => {
    try {
      setLoading(true);
      await onDelete();
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-wider text-red-500 mb-2">
          Are you sure?
        </h3>
        <p className="text-[10px] font-bold uppercase tracking-wider text-foreground/70">
          This action will permanently remove{" "}
          <span className="underline">{item.name}</span> from your profile.
        </p>

        <div className="flex gap-2 mt-6">
          <button
            onClick={handleConfirm}
            disabled={loading}
            className="flex-1 bg-red-600 text-white border border-red-600 p-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 cursor-pointer disabled:opacity-50 transition-all"
          >
            {loading ? "DELETING..." : "DELETE"}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-background text-foreground border border-border p-3 text-[10px] font-black uppercase tracking-widest hover:bg-foreground/5 cursor-pointer transition-all"
          >
            CANCEL
          </button>
        </div>
      </div>
    </div>
  );
};
