"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Trash2, Calendar, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import { togglePreorderStatusAction, deletePreorderAction, deleteMultiplePreordersAction } from "@/actions/preorder";

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
  const [deleteConfirmIds, setDeleteConfirmIds] = useState<string[]>([]);
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
    if (deleteConfirmIds.length === 0) return;
    setIsDeleting(true);

    let res;
    if (deleteConfirmIds.length === 1) {
      res = await deletePreorderAction(deleteConfirmIds[0]);
    } else {
      res = await deleteMultiplePreordersAction(deleteConfirmIds);
    }

    setIsDeleting(false);

    if (res.success) {
      toast.success(
        deleteConfirmIds.length === 1
          ? "Preorder deleted successfully"
          : `${deleteConfirmIds.length} preorders deleted successfully`
      );
      setSelectedIds((prev) => prev.filter((id) => !deleteConfirmIds.includes(id)));
      setDeleteConfirmIds([]);
    } else {
      toast.error(res.error || "Failed to delete preorder(s)");
    }
  };

  const allSelected = preorders.length > 0 && selectedIds.length === preorders.length;

  return (
    <div className="w-full">
      {preorders.length > 0 && (
        <div className="md:hidden p-4 px-5 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <input
              type="checkbox"
              checked={allSelected}
              onChange={(e) => handleSelectAll(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
            />
            <span className="text-sm font-semibold text-gray-500">
              {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select All"}
            </span>
          </div>
          {selectedIds.length > 0 && (
            <button
              onClick={() => setDeleteConfirmIds(selectedIds)}
              className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 cursor-pointer shadow-sm select-none"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              Delete Selected
            </button>
          )}
        </div>
      )}

      {preorders.length === 0 ? (
        <div className="md:hidden p-8 text-center">
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
        </div>
      ) : (
        <div className="md:hidden divide-y divide-gray-100">
          {preorders.map((preorder) => {
            const isSelected = selectedIds.includes(preorder.id);
            const isActive = activeActions[preorder.id] !== undefined
              ? activeActions[preorder.id]
              : preorder.active;

            return (
              <div key={preorder.id} className="p-5 flex flex-col space-y-3 bg-white hover:bg-gray-50/30 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3 min-w-0 flex-1">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => handleSelectRow(preorder.id, e.target.checked)}
                      className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black flex-shrink-0"
                    />
                    <span className="font-bold text-gray-900 truncate text-base tracking-tight">
                      {preorder.name}
                    </span>
                  </div>
                  <div className="flex items-center flex-shrink-0 ml-4">
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(preorder.id, isActive)}
                      className={`w-9 h-5 rounded-md transition-colors relative outline-none cursor-pointer flex-shrink-0 ${
                        isActive ? "bg-black" : "bg-gray-200"
                      }`}
                      aria-label="Toggle preorder status"
                    >
                      <span
                        className={`absolute top-[2px] w-4 h-4 bg-white rounded-sm transition-all shadow-sm ${
                          isActive ? "left-[18px]" : "left-[2px]"
                        }`}
                      />
                    </button>
                  </div>
                </div>

                <div className="pl-7 flex flex-wrap gap-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold bg-gray-100 text-gray-700">
                    {preorder.products} {preorder.products === 1 ? "product" : "products"}
                  </span>
                  <span
                    className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold ${
                      preorder.preorderWhen === "out-of-stock"
                        ? "bg-amber-50 text-amber-700 border border-amber-100"
                        : "bg-blue-50 text-blue-700 border border-blue-100"
                    }`}
                  >
                    {preorder.preorderWhen}
                  </span>
                </div>

                <div className="pl-7 pt-1.5 flex items-center justify-between text-xs text-gray-500 border-t border-gray-50">
                  <div className="flex items-center space-x-1.5 text-gray-500 font-medium truncate flex-1 mr-4">
                    <Calendar className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
                    <span className="truncate">
                      {preorder.startsAt} {preorder.endsAt ? `→ ${preorder.endsAt}` : ""}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 flex-shrink-0">
                    <button
                      onClick={() => router.push(`/preorder/${preorder.id}`)}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer bg-white"
                      title="Edit Preorder"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmIds([preorder.id])}
                      className="p-2 border border-gray-200 rounded-lg hover:bg-red-50 text-gray-600 hover:text-red-600 hover:border-red-100 transition-colors cursor-pointer bg-white"
                      title="Delete Preorder"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            {selectedIds.length > 0 ? (
              <tr className="border-b border-gray-100 text-sm font-semibold bg-gray-50/70 transition-colors">
                <th className="p-4 w-12 min-w-[48px] align-middle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                  />
                </th>
                <th colSpan={7} className="p-4 align-middle">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-900 font-bold text-sm">
                      {selectedIds.length} item(s) selected
                    </span>
                    <button
                      onClick={() => setDeleteConfirmIds(selectedIds)}
                      className="inline-flex items-center px-3 py-1.5 text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-100 cursor-pointer shadow-sm select-none"
                    >
                      <Trash2 className="w-3.5 h-3.5 mr-1" />
                      Delete Selected
                    </button>
                  </div>
                </th>
              </tr>
            ) : (
              <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 bg-gray-50/50">
                <th className="p-4 w-12 min-w-[48px] align-middle">
                  <input
                    type="checkbox"
                    checked={allSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                  />
                </th>
                <th className="p-4 font-semibold text-gray-500 min-w-[180px] align-middle">Name</th>
                <th className="p-4 font-semibold text-gray-500 min-w-[90px] align-middle">Products</th>
                <th className="p-4 font-semibold text-gray-500 min-w-[150px] align-middle">Preorder when</th>
                <th className="p-4 font-semibold text-gray-500 min-w-[170px] align-middle">Starts at</th>
                <th className="p-4 font-semibold text-gray-500 min-w-[170px] align-middle">Ends at</th>
                <th className="p-4 font-semibold text-gray-500 text-center min-w-[80px] align-middle">Status</th>
                <th className="p-4 font-semibold text-gray-500 text-right min-w-[100px] align-middle">Actions</th>
              </tr>
            )}
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
                    <td className="p-4 align-middle">
                      <input
                        type="checkbox"
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(preorder.id, e.target.checked)}
                        className="w-4 h-4 rounded border-gray-300 text-black focus:ring-black cursor-pointer accent-black"
                      />
                    </td>
                    <td className="p-4 font-bold text-gray-900 align-middle">{preorder.name}</td>
                    <td className="p-4 text-gray-600 font-medium align-middle">{preorder.products}</td>
                    <td className="p-4 text-gray-500 font-medium align-middle">{preorder.preorderWhen}</td>
                    <td className="p-4 text-gray-500 font-medium align-middle">{preorder.startsAt}</td>
                    <td className="p-4 text-gray-500 font-medium align-middle">{preorder.endsAt || ""}</td>
                    <td className="p-4 text-center align-middle">
                      <div className="flex items-center justify-center">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(preorder.id, isActive)}
                          className={`w-9 h-5 rounded-md transition-colors relative outline-none cursor-pointer flex-shrink-0 ${
                            isActive ? "bg-black" : "bg-gray-200"
                          }`}
                          aria-label="Toggle preorder status"
                        >
                          <span
                            className={`absolute top-[2px] w-4 h-4 bg-white rounded-sm transition-all shadow-sm ${
                              isActive ? "left-[18px]" : "left-[2px]"
                            }`}
                          />
                        </button>
                      </div>
                    </td>
                    <td className="p-4 text-right align-middle">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => router.push(`/preorder/${preorder.id}`)}
                          className="p-1.5 border border-gray-200 rounded-md hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
                          title="Edit Preorder"
                        >
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmIds([preorder.id])}
                          className="p-1.5 border border-gray-200 rounded-md hover:bg-red-50 text-gray-600 hover:text-red-600 hover:border-red-100 transition-colors cursor-pointer"
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

      {deleteConfirmIds.length > 0 && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden border border-gray-100 animate-in fade-in zoom-in duration-200">
            <div className="p-6">
              <div className="flex items-start space-x-3">
                <div className="w-10 h-10 rounded-full bg-red-50 flex items-center justify-center flex-shrink-0 text-red-600">
                  <AlertCircle className="w-5 h-5" />
                </div>
                <div className="space-y-1 w-full">
                  <h3 className="text-lg font-bold text-gray-900">
                    {deleteConfirmIds.length === 1 ? "Delete Preorder" : "Delete Selected Preorders"}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {deleteConfirmIds.length === 1
                      ? "Are you sure you want to delete this preorder? This action cannot be undone and will permanently remove this record from the database."
                      : `Are you sure you want to delete the ${deleteConfirmIds.length} selected preorders? This action cannot be undone and will permanently remove these records from the database.`}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 flex items-center justify-end space-x-3 border-t border-gray-100">
              <button
                disabled={isDeleting}
                onClick={() => setDeleteConfirmIds([])}
                className="px-4 py-2 border border-gray-200 rounded-lg text-sm font-semibold text-gray-700 hover:bg-gray-100 bg-white transition-colors disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                disabled={isDeleting}
                onClick={handleDelete}
                className="px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-semibold transition-colors flex items-center justify-center shadow-sm disabled:opacity-50 cursor-pointer"
              >
                {isDeleting
                  ? "Deleting..."
                  : deleteConfirmIds.length === 1
                  ? "Delete Preorder"
                  : "Delete Selected"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
