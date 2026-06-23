"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useTransition } from "react";

export function FilterTabs() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const currentStatus = searchParams.get("status") || "all";

  const handleStatusChange = (status: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status === "all") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    params.delete("page");
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const tabs = [
    { label: "All", value: "all" },
    { label: "Active", value: "active" },
    { label: "Inactive", value: "inactive" },
  ];

  return (
    <div className={`flex bg-[#f1f2f4] p-1 rounded-lg w-fit text-sm border border-gray-200 transition-opacity duration-200 ${
      isPending ? "opacity-60" : ""
    }`}>
      {tabs.map((tab) => {
        const isActive = currentStatus === tab.value;
        return (
          <button
            key={tab.value}
            onClick={() => handleStatusChange(tab.value)}
            className={`px-4 py-1.5 rounded-md font-semibold transition-all ${
              isActive
                ? "bg-white text-gray-900 shadow-sm border border-gray-100"
                : "text-gray-500 hover:text-gray-900"
            }`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
}
