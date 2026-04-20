import { useState, useEffect } from "react";

export default function ModuleModal({
  isOpen,
  onClose,
  onSubmit,
  editingModule,
}) {
  const [form, setForm] = useState({
    title: "",
    description: "",
    order: 1,
  });

  const [error, setError] = useState("");

  useEffect(() => {
    if (editingModule) {
      setForm({
        title: editingModule.title || "",
        description: editingModule.description || "",
        order: editingModule.order || 1,
      });
    } else {
      setForm({
        title: "",
        description: "",
        order: 1,
      });
    }
  }, [editingModule, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title) {
      return setError("Title is required");
    }

    setError("");
    await onSubmit(form);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-md">
        <h2 className="font-semibold mb-4">
          {editingModule ? "Edit Module" : "Create Module"}
        </h2>

        {error && <p className="text-red-500 text-sm mb-2">{error}</p>}

        <input
          placeholder="Module Title"
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

        <input
          type="number"
          placeholder="Order"
          className="input mt-2"
          value={form.order}
          onChange={(e) => setForm({ ...form, order: Number(e.target.value) })}
        />

        <button onClick={handleSubmit} className="btn-primary mt-4 w-full">
          Save
        </button>
      </div>
    </div>
  );
}
