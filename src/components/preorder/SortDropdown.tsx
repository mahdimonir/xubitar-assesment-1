"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isOpen, setIsOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const sortBy = searchParams.get("sortBy") || "createdAt";
  const sortOrder = searchParams.get("sortOrder") || "desc";

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSort = (field: string, direction?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (field) {
      params.set("sortBy", field);
    }
    if (direction) {
      params.set("sortOrder", direction);
    }
    
    startTransition(() => {
      router.push(`/?${params.toString()}`);
    });
  };

  const fields = [
    { label: "Name", value: "name" },
    { label: "Created At", value: "createdAt" },
    { label: "Starts At", value: "startsAt" },
    { label: "Ends At", value: "endsAt" },
  ];

  return (
    <div className="relative inline-block text-left" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`flex items-center justify-center w-9 h-9 border border-gray-200 rounded-lg bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-300 transition-opacity duration-200 ${
          isPending ? "opacity-60" : ""
        }`}
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        <ArrowUpDown className="w-4 h-4 text-gray-700" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1 w-52 rounded-xl bg-white shadow-lg border border-gray-200 focus:outline-none z-50 overflow-hidden py-1">
          <div className="px-4 py-2 text-xs font-semibold text-gray-400">
            Sort by
          </div>

          <div className="space-y-0.5">
            {fields.map((field) => {
              const isSelected = sortBy === field.value;
              return (
                <button
                  key={field.value}
                  onClick={() => handleSort(field.value)}
                  className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 text-left transition-colors"
                >
                  <span className={`w-4 h-4 rounded-full border flex items-center justify-center mr-3 transition-colors ${
                    isSelected ? "border-gray-900 bg-white" : "border-gray-300"
                  }`}>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-gray-900" />
                    )}
                  </span>
                  <span className="font-medium">{field.label}</span>
                </button>
              );
            })}
          </div>

          <div className="border-t border-gray-100 my-1" />

          <div className="px-1.5 py-0.5 space-y-0.5">
            <button
              onClick={() => handleSort(sortBy, "asc")}
              className={`flex items-center w-full px-2.5 py-2 text-sm rounded-lg text-left transition-colors ${
                sortOrder === "asc"
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ArrowUp className="w-4 h-4 mr-2" />
              Ascending
            </button>
            <button
              onClick={() => handleSort(sortBy, "desc")}
              className={`flex items-center w-full px-2.5 py-2 text-sm rounded-lg text-left transition-colors ${
                sortOrder === "desc"
                  ? "bg-gray-100 font-semibold text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <ArrowDown className="w-4 h-4 mr-2" />
              Descending
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
