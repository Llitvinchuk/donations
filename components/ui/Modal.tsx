"use client";

import { useEffect } from "react";

export default function Modal({
  open,
  title,
  subtitle,
  onClose,
  onConfirm,
  confirmText,
}: {
  open: boolean;
  title: string;
  subtitle?: string;
  onClose: () => void;
  onConfirm: () => void;
  confirmText: string;
}) {
  useEffect(() => {
    if (!open) return;

    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative w-full max-w-[406px] justify-center flex  rounded-2xl bg-white px-6 py-5 shadow-xl">
        <button
          onClick={onClose}
          aria-label="Закрыть"
          className="absolute right-1 top-1 grid h-9 w-9 place-items-center rounded-full text-[#6B7280]"
        >
          ✕
        </button>

        <div className="text-center">
          <div className="flex flex-col gap-1 justify-center max-w-[296px]">
            <div className="w-full text-center text-xl font-semibold leading-tight">
              {title}
            </div>
            {subtitle ? (
              <div className="text-xs leading-relaxed text-[#6C7286]">
                {subtitle}
              </div>
            ) : null}
          </div>
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              onClick={onClose}
              className="h-10 rounded-xl bg-[#F2F3F7] px-3 text-sm font-medium text-[#111827] hover:bg-[#E5E7EB]"
            >
              Отменить
            </button>
            <button
              onClick={onConfirm}
              className="h-10 rounded-xl bg-[#F2F3F7] px-3 text-sm font-medium text-[#EF4444] hover:bg-[#FECACA]"
            >
              {confirmText}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
