import React from "react";

export default function Loading() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center bg-[#050505] text-[#EDEDEB] space-y-4 select-none">
      <div className="w-8 h-8 rounded-full border border-white/20 border-t-white animate-spin" />
      <span className="font-mono text-[10px] tracking-[0.35em] text-neutral-400 uppercase animate-pulse">
        LOADING ARCHIVE...
      </span>
    </div>
  );
}
