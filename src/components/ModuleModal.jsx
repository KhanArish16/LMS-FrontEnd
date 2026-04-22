import { useState, useEffect } from "react";
import { X, Layers, AlignLeft, Hash } from "lucide-react";

export default function ModuleModal({
  isOpen,
  onClose,
  onSubmit,
  editingModule,
}) {
  const [form, setForm] = useState({ title: "", description: "", order: 1 });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (editingModule) {
      setForm({
        title: editingModule.title || "",
        description: editingModule.description || "",
        order: editingModule.order || 1,
      });
    } else {
      setForm({ title: "", description: "", order: 1 });
    }
    setError("");
  }, [editingModule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Module title is required");
    setError("");
    setSaving(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-md border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <Layers size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">
              {editingModule ? "Edit Module" : "New Module"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-gray-500" />
          </button>
        </div>

        <div className="px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Title
            </label>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <Layers size={13} className="text-gray-400 shrink-0" />
              <input
                placeholder="e.g. Introduction to React"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Description{" "}
              <span className="text-gray-400 normal-case font-normal">
                (optional)
              </span>
            </label>
            <div className="flex gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <AlignLeft size={13} className="text-gray-400 shrink-0 mt-0.5" />
              <textarea
                placeholder="Briefly describe what this module covers…"
                rows={3}
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 resize-none"
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Order
            </label>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all w-28">
              <Hash size={13} className="text-gray-400 shrink-0" />
              <input
                type="number"
                min={1}
                className="bg-transparent outline-none text-sm text-gray-800 w-full font-medium"
                value={form.order}
                onChange={(e) =>
                  setForm({ ...form, order: Number(e.target.value) })
                }
              />
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 px-6 pb-5">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving
              ? "Saving…"
              : editingModule
                ? "Update Module"
                : "Create Module"}
          </button>
        </div>
      </div>
    </div>
  );
}
