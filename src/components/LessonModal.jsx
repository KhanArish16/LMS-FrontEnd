import { useState, useEffect } from "react";
import { uploadVideoToCloudinary } from "../utils/cloudinaryUpload";

export default function LessonModal({
  isOpen,
  onClose,
  onSubmit,
  moduleId,
  editingLesson,
}) {
  const [form, setForm] = useState({
    title: "",
    type: "VIDEO",
    category: "FULLSTACK",
    content: "",
    contentUrl: "",
    file: null,
  });

  useEffect(() => {
    if (editingLesson) {
      setForm({
        title: editingLesson.title || "",
        type: editingLesson.type || "VIDEO",
        category: editingLesson.category || "FULLSTACK",
        content: editingLesson.content || "",
        contentUrl: editingLesson.contentUrl || "",
        file: null,
      });
    } else {
      resetForm();
    }
  }, [editingLesson, isOpen]);

  const resetForm = () => {
    setForm({
      title: "",
      type: "VIDEO",
      category: "FULLSTACK",
      content: "",
      contentUrl: "",
      file: null,
    });
  };

  if (!isOpen) return null;

  const handleSubmit = async () => {
    if (!form.title) return alert("Title required");

    let uploadedUrl = form.contentUrl;

    try {
      if (form.type === "VIDEO") {
        if (!editingLesson && !form.file) {
          return alert("Upload video");
        }

        if (form.file) {
          uploadedUrl = await uploadVideoToCloudinary(form.file);
        }

        if (!uploadedUrl) {
          return alert("Video URL missing");
        }
      }

      if (form.type === "YOUTUBE" && !form.contentUrl) {
        return alert("Add YouTube URL");
      }

      if ((form.type === "BLOG" || form.type === "QUIZ") && !form.content) {
        return alert("Content required");
      }

      const payload = {
        title: form.title,
        type: form.type,
        category: form.category,
        moduleId,
      };

      if (form.type === "VIDEO") {
        payload.contentUrl = uploadedUrl;
      }

      if (form.type === "YOUTUBE") {
        payload.contentUrl = form.contentUrl;
      }

      if (form.type === "BLOG" || form.type === "QUIZ") {
        payload.content = form.content;
      }

      await onSubmit(payload);

      onClose();
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    }
  };

  const renderContentInput = () => {
    switch (form.type) {
      case "VIDEO":
        return (
          <div>
            <input
              type="file"
              accept="video/*"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            />
            {editingLesson && (
              <p className="text-xs text-gray-400 mt-1">
                Upload to replace existing video
              </p>
            )}
          </div>
        );

      case "YOUTUBE":
        return (
          <input
            placeholder="YouTube URL"
            className="input"
            value={form.contentUrl}
            onChange={(e) => setForm({ ...form, contentUrl: e.target.value })}
          />
        );

      case "BLOG":
      case "QUIZ":
        return (
          <textarea
            placeholder="Enter content..."
            className="input mt-2"
            rows={5}
            value={form.content}
            onChange={(e) => setForm({ ...form, content: e.target.value })}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg space-y-4">
        <h2 className="font-bold text-lg">
          {editingLesson ? "Edit Lesson" : "Create Lesson"}
        </h2>

        <input
          placeholder="Lesson Title"
          className="input"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
        />

        <select
          className="input"
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
        >
          <option value="VIDEO">VIDEO</option>
          <option value="YOUTUBE">YOUTUBE</option>
          <option value="BLOG">BLOG</option>
          <option value="QUIZ">QUIZ</option>
        </select>

        <select
          className="input"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        >
          <option value="DSA">DSA</option>
          <option value="FRONTEND">FRONTEND</option>
          <option value="BACKEND">BACKEND</option>
          <option value="FULLSTACK">FULLSTACK</option>
          <option value="WEB">WEB</option>
        </select>

        {renderContentInput()}

        <div className="flex gap-2 pt-3">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 border rounded p-2"
          >
            Cancel
          </button>

          <button
            onClick={handleSubmit}
            className="flex-1 bg-black text-white rounded p-2"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
