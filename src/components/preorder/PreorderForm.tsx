"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { preorderFormSchema, PreorderFormValues } from "@/lib/validations";
import { createPreorderAction, updatePreorderAction } from "@/actions/preorder";
import { toDatetimeLocal } from "@/lib/date";

interface PreorderFormProps {
  mode: "create" | "edit";
  id?: string;
  initialData?: {
    name: string;
    products: number;
    preorderWhen: "out-of-stock" | "regardless-of-stock";
    startsAt: string;
    endsAt: string | null;
    active: boolean;
  };
}

export function PreorderForm({ mode, id, initialData }: PreorderFormProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<PreorderFormValues>({
    resolver: zodResolver(preorderFormSchema),
    defaultValues: {
      name: initialData?.name || "",
      products: initialData?.products ?? 1,
      preorderWhen: initialData?.preorderWhen || "regardless-of-stock",
      startsAt: toDatetimeLocal(initialData?.startsAt),
      endsAt: toDatetimeLocal(initialData?.endsAt) || null,
      active: initialData?.active ?? true,
    },
  });

  const activeValue = watch("active");
  const startsAtValue = watch("startsAt");

  const onSubmit = (data: PreorderFormValues) => {
    const payload = {
      ...data,
      endsAt: data.endsAt || null,
    };

    startTransition(async () => {
      let res;
      if (mode === "create") {
        res = await createPreorderAction(payload);
      } else {
        if (!id) return;
        res = await updatePreorderAction(id, payload);
      }

      if (res.success) {
        toast.success(
          mode === "create" ? "Preorder created successfully" : "Preorder updated successfully"
        );
        router.push("/");
        router.refresh();
      } else {
        toast.error(res.error || "Something went wrong. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 max-w-4xl mx-auto w-full px-4 md:px-0">
      <div className="flex items-center justify-between pb-2">
        <button
          type="button"
          onClick={() => router.push("/")}
          className="inline-flex items-center px-3 py-1.5 border border-gray-200 rounded-lg bg-white text-sm font-semibold text-gray-700 hover:bg-gray-50 transition-colors shadow-sm"
        >
          <ChevronLeft className="w-4 h-4 mr-1 text-gray-500" />
          Back
        </button>

        <div className="flex items-center space-x-3">
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 min-w-[120px] justify-center"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">Preorder details</h2>
          <p className="text-sm text-gray-400 mt-1 font-medium">These values appear in the preorders list.</p>
        </div>

        <div className="divide-y divide-gray-100">
          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <label htmlFor="name" className="text-sm font-bold text-gray-900">
                Name <span className="text-red-500">*</span>
              </label>
              <p className="text-xs text-gray-400 font-medium">A label to recognize this preorder by.</p>
            </div>
            <div className="md:col-span-2">
              <input
                id="name"
                type="text"
                {...register("name")}
                placeholder="Name"
                className={`w-full max-w-lg px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black placeholder-gray-300 transition-all ${
                  errors.name ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                }`}
              />
              {errors.name && (
                <p className="text-xs font-semibold text-red-500 mt-1">{errors.name.message}</p>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <label htmlFor="products" className="text-sm font-bold text-gray-900">Products</label>
              <p className="text-xs text-gray-400 font-medium">Number of products covered by this preorder.</p>
            </div>
            <div className="md:col-span-2 flex items-center space-x-3">
              <input
                id="products"
                type="number"
                min="1"
                {...register("products")}
                className={`w-24 px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all ${
                  errors.products ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                }`}
              />
              <span className="text-sm text-gray-500 font-semibold">product(s)</span>
              {errors.products && (
                <p className="text-xs font-semibold text-red-500 mt-1">{errors.products.message}</p>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <label htmlFor="preorderWhen" className="text-sm font-bold text-gray-900">Preorder when</label>
              <p className="text-xs text-gray-400 font-medium">When customers are allowed to preorder.</p>
            </div>
            <div className="md:col-span-2">
              <select
                id="preorderWhen"
                {...register("preorderWhen")}
                className="w-full max-w-lg px-3.5 py-2.5 rounded-lg border border-gray-200 bg-white text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black cursor-pointer appearance-none relative pr-10"
                style={{
                  backgroundImage: `url("data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='m6 8 4 4 4-4'/%3E%3C/svg%3E")`,
                  backgroundPosition: "right 0.75rem center",
                  backgroundSize: "1.25rem 1.25rem",
                  backgroundRepeat: "no-repeat",
                }}
              >
                <option value="regardless-of-stock">regardless-of-stock</option>
                <option value="out-of-stock">out-of-stock</option>
              </select>
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <label htmlFor="startsAt" className="text-sm font-bold text-gray-900">Starts at</label>
              <p className="text-xs text-gray-400 font-medium">When the preorder window opens.</p>
            </div>
            <div className="md:col-span-2">
              <input
                id="startsAt"
                type="datetime-local"
                {...register("startsAt")}
                className={`w-full max-w-lg px-3.5 py-2.5 rounded-lg border text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all ${
                  errors.startsAt ? "border-red-300 focus:ring-red-500 focus:border-red-500" : "border-gray-200"
                }`}
              />
              {errors.startsAt && (
                <p className="text-xs font-semibold text-red-500 mt-1">{errors.startsAt.message}</p>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <label htmlFor="endsAt" className="text-sm font-bold text-gray-900">Ends at</label>
              <p className="text-xs text-gray-400 font-medium">Leave empty for no end date.</p>
            </div>
            <div className="md:col-span-2">
              <input
                id="endsAt"
                type="datetime-local"
                min={startsAtValue || undefined}
                {...register("endsAt")}
                className="w-full max-w-lg px-3.5 py-2.5 rounded-lg border border-gray-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-black focus:border-black transition-all"
              />
              {errors.endsAt && (
                <p className="text-xs font-semibold text-red-500 mt-1">{errors.endsAt.message}</p>
              )}
            </div>
          </div>

          <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4 items-start">
            <div className="space-y-1">
              <span className="text-sm font-bold text-gray-900">Status</span>
              <p className="text-xs text-gray-400 font-medium">Active preorders are visible to customers.</p>
            </div>
            <div className="md:col-span-2 flex items-center space-x-3 py-1">
              <button
                type="button"
                onClick={() => setValue("active", !activeValue)}
                className={`w-9 h-5 rounded-md p-0.5 transition-colors relative outline-none ${
                  activeValue ? "bg-black" : "bg-gray-200"
                }`}
              >
                <span
                  className={`block w-4 h-4 bg-white rounded-sm transition-transform shadow-sm ${
                    activeValue ? "translate-x-4" : "translate-x-0"
                  }`}
                />
              </button>
              <span className="text-sm font-semibold text-gray-700">
                {activeValue ? "Active" : "Inactive"}
              </span>
            </div>
          </div>
        </div>

        <div className="bg-gray-50/50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-100">
          <button
            type="button"
            onClick={() => router.push("/")}
            disabled={isPending}
            className="px-4 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={isPending}
            className="inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-sm disabled:opacity-50 min-w-[120px] justify-center"
          >
            {isPending ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              "Save changes"
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
