import { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  AlignLeft,
  Tag,
  BarChart2,
  ImagePlus,
  CheckCircle,
} from "lucide-react";

const categories = [
  "DSA",
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "MOBILE",
  "DATA_SCIENCE",
  "AI_ML",
  "CYBER_SECURITY",
  "DEVOPS",
  "CLOUD_COMPUTING",
  "UI_UX",
  "OTHER",
];

const levels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"];

const levelStyle = {
  BEGINNER: "bg-emerald-50 text-emerald-700 border-emerald-200",
  INTERMEDIATE: "bg-amber-50 text-amber-700 border-amber-200",
  ADVANCED: "bg-red-50 text-red-700 border-red-200",
};

export default function CourseModal({
  isOpen,
  onClose,
  editingCourse,
  onSubmit,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "DSA",
    level: "BEGINNER",
    thumbnailFile: null,
    preview: "",
  });
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (editingCourse) {
      setForm({
        title: editingCourse.title || "",
        description: editingCourse.description || "",
        category: editingCourse.category || "DSA",
        level: editingCourse.level || "BEGINNER",
        thumbnailFile: null,
        preview: editingCourse.thumbnail || "",
      });
    } else {
      setForm({
        title: "",
        description: "",
        category: "DSA",
        level: "BEGINNER",
        thumbnailFile: null,
        preview: "",
      });
    }
    setError("");
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const setFile = (file) => {
    if (!file) return;
    setForm((f) => ({
      ...f,
      thumbnailFile: file,
      preview: URL.createObjectURL(file),
    }));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setFile(e.dataTransfer.files[0]);
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.level)
      return setError("All fields are required");
    if (!editingCourse && !form.thumbnailFile)
      return setError("Thumbnail is required");
    setError("");
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", form.title);
      fd.append("description", form.description);
      fd.append("category", form.category);
      fd.append("level", form.level);
      if (form.thumbnailFile) fd.append("thumbnail", form.thumbnailFile);
      await onSubmit(fd);
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

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-200">
              <BookOpen size={14} className="text-white" />
            </div>
            <h2 className="text-sm font-bold text-gray-900">
              {editingCourse ? "Edit Course" : "New Course"}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
          >
            <X size={13} className="text-gray-500" />
          </button>
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-5 space-y-4">
          {error && (
            <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
              <p className="text-xs text-red-600 font-medium">{error}</p>
            </div>
          )}

          <Field label="Title" icon={BookOpen}>
            <input
              placeholder="e.g. Complete React Bootcamp"
              className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
          </Field>

          <Field label="Description" icon={AlignLeft} align="top">
            <textarea
              placeholder="What will students learn in this course?"
              rows={3}
              className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 resize-none"
              value={form.description}
              onChange={(e) =>
                setForm({ ...form, description: e.target.value })
              }
            />
          </Field>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setForm({ ...form, category: cat })}
                  className={`px-2.5 py-1 text-[10px] font-black tracking-widest border transition-all ${
                    form.category === cat
                      ? "bg-gray-900 border-gray-900 text-white"
                      : "bg-white border-gray-200 text-gray-500 hover:border-gray-400 hover:text-gray-700"
                  }`}
                  style={{ borderRadius: "4px" }}
                >
                  {cat.replace(/_/g, " ")}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Level
            </label>
            <div className="flex gap-2">
              {levels.map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => setForm({ ...form, level: lvl })}
                  className={`flex-1 py-2 rounded-xl text-[11px] font-bold border transition-all ${
                    form.level === lvl
                      ? levelStyle[lvl]
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Thumbnail{" "}
              {editingCourse && (
                <span className="text-gray-400 normal-case font-normal">
                  (optional — upload to replace)
                </span>
              )}
            </label>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setDragging(true);
              }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl transition-all overflow-hidden ${
                dragging
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 bg-gray-50"
              }`}
            >
              {form.preview ? (
                <div className="relative">
                  <img
                    src={form.preview}
                    alt="Preview"
                    className="w-full h-36 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                    <label className="cursor-pointer flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-lg text-xs font-semibold text-gray-800">
                      <ImagePlus size={13} /> Replace image
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => setFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                    <CheckCircle size={11} className="text-emerald-500" />
                    <span className="text-[10px] font-semibold text-gray-700">
                      Image set
                    </span>
                  </div>
                </div>
              ) : (
                <label className="cursor-pointer flex flex-col items-center gap-2 py-8">
                  <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                    <ImagePlus size={18} className="text-gray-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">
                      Drop image here
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      or click to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setFile(e.target.files[0])}
                  />
                </label>
              )}
            </div>
          </div>
        </div>

        <div className="flex gap-2.5 px-6 pb-5 pt-2 shrink-0 border-t border-gray-100">
          <button
            onClick={onClose}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {saving
              ? "Saving…"
              : editingCourse
                ? "Update Course"
                : "Create Course"}
          </button>
        </div>
      </div>
    </div>
  );
}

function Field({ label, icon: Icon, children, align = "center" }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
        {label}
      </label>
      <div
        className={`flex ${align === "top" ? "items-start" : "items-center"} gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all`}
      >
        <Icon
          size={13}
          className={`text-gray-400 shrink-0 ${align === "top" ? "mt-0.5" : ""}`}
        />
        {children}
      </div>
    </div>
  );
}
