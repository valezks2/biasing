"use client";
import React, { useEffect, useState } from "react";

interface ModalDeleteAccountProps {
  onClose: () => void;
  onDelete: (password: string) => Promise<void>;
  isDeleting: boolean;
}

export const ModalDeleteAccount = ({
  onClose,
  onDelete,
  isDeleting,
}: ModalDeleteAccountProps) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "unset";
    };
  }, []);

  const handleConfirm = async () => {
    if (!password) {
      setError("Please enter your password to confirm");
      return;
    }

    try {
      setError(null);
      await onDelete(password);
    } catch (err: any) {
      setError(err.message || "An error occurred");
    }
  };

  return (
    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-background border border-border p-6 w-full max-w-sm shadow-xl">
        <h3 className="text-sm font-black uppercase tracking-wider text-red-500 mb-2">
          Delete Account
        </h3>

        <p className="text-[9px] text-foreground/50 uppercase tracking-widest mb-6">
          Are you sure? This action is permanent and cannot be undone. Please
          enter your password to confirm.
        </p>

        <input
          type="password"
          placeholder="ENTER PASSWORD"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border border-border p-3 bg-background text-xs font-bold uppercase tracking-wider mb-4 focus:outline-none"
        />

        {error && (
          <p className="text-[10px] font-black uppercase tracking-widest text-red-500 border-l-2 border-red-500 pl-3 mb-4">
            {error}
          </p>
        )}

        <div className="flex gap-2">
          <button
            onClick={handleConfirm}
            disabled={isDeleting}
            className="flex-1 bg-red-600 text-white p-3 text-[10px] font-black uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {isDeleting ? "DELETING..." : "CONFIRM DELETE"}
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
