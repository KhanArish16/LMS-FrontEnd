import { useState, useEffect } from "react";

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
  }, [editingCourse, isOpen]);

  if (!isOpen) return null;

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file) return;

    setForm({
      ...form,
      thumbnailFile: file,
      preview: URL.createObjectURL(file),
    });
  };

  const handleSubmit = async () => {
    if (!form.title || !form.description || !form.category || !form.level) {
      return setError("All fields are required");
    }

    if (!editingCourse && !form.thumbnailFile) {
      return setError("Thumbnail is required");
    }

    setError("");

    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("description", form.description);
    formData.append("category", form.category);
    formData.append("level", form.level);

    if (form.thumbnailFile) {
      formData.append("thumbnail", form.thumbnailFile);
    }

    await onSubmit(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg">
        <h2 className="font-semibold mb-4">
          {editingCourse ? "Edit Course" : "Create Course"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <input
          placeholder="Title"
          className="input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <textarea
          placeholder="Description"
          className="input mt-2"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <select
          className="input mt-2"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          className="input mt-2"
          value={form.level}
          onChange={(e) => setForm({ ...form, level: e.target.value })}
        >
          {levels.map((lvl) => (
            <option key={lvl}>{lvl}</option>
          ))}
        </select>

        <div
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
          className="mt-4 border-2 border-dashed border-gray-300 rounded-lg p-4 text-center cursor-pointer hover:border-black transition"
        >
          <p className="text-sm text-gray-500">
            {editingCourse
              ? "Drag & drop to replace thumbnail"
              : "Drag & drop thumbnail here"}
          </p>

          <input
            type="file"
            className="mt-2"
            onChange={(e) => {
              const file = e.target.files[0];
              if (!file) return;

              setForm({
                ...form,
                thumbnailFile: file,
                preview: URL.createObjectURL(file),
              });
            }}
          />
        </div>

        {form.preview && (
          <div className="mt-3">
            <img
              src={form.preview}
              className="h-32 w-full rounded object-cover"
            />
            {editingCourse && (
              <p className="text-xs text-gray-500 mt-1">
                Upload a new image to replace current thumbnail
              </p>
            )}
          </div>
        )}

        <button
          onClick={handleSubmit}
          className="btn-primary mt-4 w-full cursor-pointer"
        >
          Save
        </button>
      </div>
    </div>
  );
}
