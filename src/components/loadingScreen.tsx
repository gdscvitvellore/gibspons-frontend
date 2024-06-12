"use client";

import { useLoadingStore } from "@/store/loading";

export default function LoadingScreen({
  loading,
}: Readonly<{
  loading?: boolean;
}>) {
  const { isLoading } = useLoadingStore();

  return (
    <div
      className={`w-full h-full flex-row bg-black transition-colors duration-100 opacity-0 absolute z-50 items-center justify-center ${
        isLoading || loading ? "flex" : "hidden"
      }`}
    >
      <div className="w-24 h-24 rounded-full animate-spin border-t-2 border-b-2 rotate-180"></div>
    </div>
  );
}
