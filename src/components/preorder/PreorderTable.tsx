"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { togglePreorderStatusAction, deletePreorderAction } from "@/actions/preorder";

interface Preorder {
  id: string;
  name: string;
  products: number;
  preorderWhen: string;
  startsAt: string;
  endsAt: string | null;
  active: boolean;
}

interface PreorderTableProps {
  preorders: Preorder[];
}

export function PreorderTable({ preorders }: PreorderTableProps) {
  const router = useRouter();
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [activeActions, setActiveActions] = useState<Record<string, boolean>>({});
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedIds(preorders.map((p) => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectRow = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedIds((prev) => [...prev, id]);
    } else {
      setSelectedIds((prev) => prev.filter((rowId) => rowId !== id));
    }
  };

  const handleToggleStatus = async (id: string, currentActive: boolean) => {
    const newActive = !currentActive;
    
    setActiveActions((prev) => ({ ...prev, [id]: newActive }));

    const res = await togglePreorderStatusAction(id, newActive);

    if (res.success) {
      toast.success(`Preorder status updated to ${newActive ? "Active" : "Inactive"}`);
    } else {
      toast.error(res.error || "Failed to update status");
      setActiveActions((prev) => ({ ...prev, [id]: currentActive }));
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    setIsDeleting(true);

    const res = await deletePreorderAction(deleteConfirmId);

    setIsDeleting(false);
    setDeleteConfirmId(null);

    if (res.success) {
      toast.success("Preorder deleted successfully");
      setSelectedIds((prev) => prev.filter((id) => id !== deleteConfirmId));
    } else {
      toast.error(res.error || "Failed to delete preorder");
    }
  };

  const allSelected = preorders.length > 0 && selectedIds.length === preorders.length;

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 bg-gray-50/50">
              <th className="p-4 w-12 min-w-[48px]">
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                />
              </th>
              <th className="p-4 font-semibold text-gray-500 min-w-[180px]">Name</th>
              <th className="p-4 font-semibold text-gray-500 min-w-[90px]">Products</th>
              <th className="p-4 font-semibold text-gray-500 min-w-[150px]">Preorder when</th>
              <th className="p-4 font-semibold text-gray-500 min-w-[170px]">Starts at</th>
              <th className="p-4 font-semibold text-gray-500 min-w-[170px]">Ends at</th>
              <th className="p-4 font-semibold text-gray-500 text-center min-w-[80px]">Status</th>
              <th className="p-4 font-semibold text-gray-500 text-right min-w-[100px]">Actions</th>
            </tr>
          </thead>
          <tbody>
            {preorders.length === 0 ? (
              <tr>
                <td colSpan={8} className="p-8 text-center">
                  <div className="flex flex-col items-center justify-center space-y-3 py-10">
                    <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-400">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-base font-semibold text-gray-900">No preorders found</p>
                      <p className="text-sm text-gray-500">Get started by creating your first preorder.</p>
                    </div>
                    <button
                      onClick={() => router.push("/preorder/create")}
                      className="mt-2 inline-flex items-center px-4 py-2 text-sm font-semibold rounded-lg bg-black text-white hover:bg-gray-800 transition-colors shadow-sm"
                    >
                      Create Preorder
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              preorders.map((preorder) => {
                const isSelected = selectedIds.includes(preorder.id);
                const isActive = activeActions[preorder.id] !== undefined 
                  ? activeActions[preorder.id] 
                  : preorder.active;

                return (
                  <tr
                    key={preorder.id}
                    className={`border-b border-gray-100 text-sm transition-colors hover:bg-gray-50/50 ${
                      isSelected ? "bg-gray-50/30" : ""
                    }`}
                  >
                    <td className="p-4">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(preorder.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                      />
                    </td>
                    <td className="p-4 font-bold text-gray-900">{preorder.name}</td>
                    <td className="p-4 text-gray-600 font-medium">{preorder.products}</td>
                    <td className="p-4 text-gray-500 font-medium">{preorder.preorderWhen}</td>
                    <td className="p-4 text-gray-500 font-medium">
                      {preorder.startsAt}
                    </td>
                    <td className="p-4 text-gray-500 font-medium">
                      {preorder.endsAt || ""}
                    </td>
                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(preorder.id, isActive)}
                          className={`w-9 h-5 rounded-full p-0.5 transition-colors relative outline-none ${
                            isActive ? "bg-black" : "bg-gray-200"
                          }`}
                          aria-label="Toggle preorder status"
                        >
                          <span
                            className={`block w-4 h-4 bg-white rounded-full transition-transform shadow-sm ${
                              isActive ? "translate-x-4" : "translate-x-0"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/preorder/${preorder.id}`)}
                          className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors"
                          title="Edit Preorder"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmId(preorder.id)}
                          className="p-1.5 border border-gray-200 rounded-md hover:bg-red-50 text-gray-600 hover:text-red-600 hover:border-red-100 transition-colors"
                          title="Delete Preorder"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {deleteConfirmId && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1 w-full">
                  <h3 className="text-lg font-bold text-gray-900">Delete Preorder</h3>
                  <p className="text-sm text-gray-500">
                    Are you sure you want to delete this preorder? This action cannot be undone and will permanently remove this record from the database.
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors flex items-center justify-center shadow-sm disabled:opacity-50"
              >
                {isDeleting ? "Deleting..." : "Delete Preorder"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
