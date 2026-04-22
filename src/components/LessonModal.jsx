import { useState, useEffect } from "react";
import {
  X,
  BookOpen,
  PlayCircle,
  FileText,
  HelpCircle,
  Link,
  Upload,
  Plus,
  Trash2,
  CheckCircle,
} from "lucide-react";
import { uploadVideoToCloudinary } from "../utils/cloudinaryUpload";

const TYPES = [
  {
    value: "VIDEO",
    label: "Video",
    icon: PlayCircle,
    color: "bg-blue-50 text-blue-600 border-blue-200",
  },
  {
    value: "YOUTUBE",
    label: "YouTube",
    icon: PlayCircle,
    color: "bg-red-50 text-red-600 border-red-200",
  },
  {
    value: "BLOG",
    label: "Blog",
    icon: FileText,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    value: "QUIZ",
    label: "Quiz",
    icon: HelpCircle,
    color: "bg-amber-50 text-amber-600 border-amber-200",
  },
];

const CATEGORIES = ["DSA", "FRONTEND", "BACKEND", "FULLSTACK", "WEB", "OTHER"];

const emptyQuestion = () => ({
  question: "",
  options: ["", "", "", ""],
  correctAnswer: 0,
});

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

  const [quiz, setQuiz] = useState([emptyQuestion()]);

  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
      if (
        editingLesson.type === "QUIZ" &&
        editingLesson.quiz?.questions?.length
      ) {
        setQuiz(editingLesson.quiz.questions);
      } else {
        setQuiz([emptyQuestion()]);
      }
    } else {
      resetForm();
    }
    setError("");
    setUploadProgress(0);
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
    setQuiz([emptyQuestion()]);
  };

  if (!isOpen) return null;

  const updateQuestion = (qi, field, value) => {
    setQuiz((prev) =>
      prev.map((q, i) => (i === qi ? { ...q, [field]: value } : q)),
    );
  };
  const updateOption = (qi, oi, value) => {
    setQuiz((prev) =>
      prev.map((q, i) => {
        if (i !== qi) return q;
        const opts = [...q.options];
        opts[oi] = value;
        return { ...q, options: opts };
      }),
    );
  };
  const removeQuestion = (qi) =>
    setQuiz((prev) => prev.filter((_, i) => i !== qi));
  const addQuestion = () => setQuiz((prev) => [...prev, emptyQuestion()]);

  const handleSubmit = async () => {
    if (!form.title.trim()) return setError("Lesson title is required");

    if (form.type === "VIDEO") {
      if (!editingLesson && !form.file)
        return setError("Please upload a video file");
    }
    if (form.type === "YOUTUBE" && !form.contentUrl.trim())
      return setError("YouTube URL is required");
    if (form.type === "BLOG" && !form.content.trim())
      return setError("Blog content is required");
    if (form.type === "QUIZ") {
      for (const q of quiz) {
        if (!q.question.trim()) return setError("All questions must have text");
        if (q.options.some((o) => !o.trim()))
          return setError("All options must be filled in");
      }
    }

    setError("");
    setSaving(true);

    try {
      let uploadedUrl = form.contentUrl;

      if (form.type === "VIDEO" && form.file) {
        setUploading(true);
        uploadedUrl = await uploadVideoToCloudinary(form.file, (p) =>
          setUploadProgress(p),
        );
        setUploading(false);
        if (!uploadedUrl) {
          setError("Video upload failed");
          return;
        }
      }

      const payload = {
        title: form.title,
        type: form.type,
        category: form.category,
        moduleId,
      };

      if (form.type === "VIDEO" || form.type === "YOUTUBE")
        payload.contentUrl = uploadedUrl;
      if (form.type === "BLOG") payload.content = form.content;
      if (form.type === "QUIZ") payload.quiz = quiz;

      await onSubmit(payload);
      onClose();
    } catch (err) {
      console.error(err);
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const activeType = TYPES.find((t) => t.value === form.type);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/30 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-100 overflow-hidden max-h-[90vh] flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center border ${activeType?.color ?? "bg-blue-50 text-blue-600 border-blue-200"}`}
            >
              {activeType && <activeType.icon size={14} />}
            </div>
            <h2 className="text-sm font-bold text-gray-900">
              {editingLesson ? "Edit Lesson" : "New Lesson"}
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

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Lesson Title
            </label>
            <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
              <BookOpen size={13} className="text-gray-400 shrink-0" />
              <input
                placeholder="e.g. Introduction to Hooks"
                className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Lesson Type
            </label>
            <div className="grid grid-cols-4 gap-2">
              {TYPES.map(({ value, label, icon: Icon, color }) => (
                <button
                  key={value}
                  onClick={() =>
                    setForm({
                      ...form,
                      type: value,
                      content: "",
                      contentUrl: "",
                      file: null,
                    })
                  }
                  className={`flex flex-col items-center gap-1.5 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                    form.type === value
                      ? color
                      : "bg-gray-50 border-gray-200 text-gray-500 hover:border-gray-300"
                  }`}
                >
                  <Icon size={15} /> {label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Category
            </label>
            <div className="flex flex-wrap gap-1.5">
              {CATEGORIES.map((cat) => (
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
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
              Content
            </label>

            {form.type === "VIDEO" && (
              <>
                <label
                  className={`flex flex-col items-center gap-2 py-7 border-2 border-dashed rounded-xl cursor-pointer transition-all ${
                    form.file
                      ? "border-blue-300 bg-blue-50"
                      : "border-gray-200 hover:border-gray-300 bg-gray-50"
                  }`}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center ${form.file ? "bg-blue-100" : "bg-gray-200"}`}
                  >
                    <Upload
                      size={18}
                      className={form.file ? "text-blue-600" : "text-gray-400"}
                    />
                  </div>
                  <div className="text-center">
                    {form.file ? (
                      <>
                        <p className="text-sm font-semibold text-blue-700 truncate max-w-50">
                          {form.file.name}
                        </p>
                        <p className="text-xs text-blue-500 mt-0.5">
                          Click to replace
                        </p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-semibold text-gray-600">
                          {editingLesson
                            ? "Upload new video"
                            : "Upload video file"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          MP4, MOV, AVI supported
                        </p>
                      </>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="video/*"
                    className="hidden"
                    onChange={(e) =>
                      setForm({ ...form, file: e.target.files[0] })
                    }
                  />
                </label>
                {uploading && (
                  <div className="mt-2">
                    <div className="flex justify-between text-[11px] text-gray-500 mb-1">
                      <span>Uploading…</span>
                      <span>{uploadProgress}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{ width: `${uploadProgress}%` }}
                      />
                    </div>
                  </div>
                )}
              </>
            )}

            {form.type === "YOUTUBE" && (
              <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-red-300 focus-within:ring-2 focus-within:ring-red-50 transition-all">
                <Link size={13} className="text-gray-400 shrink-0" />
                <input
                  placeholder="https://youtube.com/watch?v=..."
                  className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400"
                  value={form.contentUrl}
                  onChange={(e) =>
                    setForm({ ...form, contentUrl: e.target.value })
                  }
                />
              </div>
            )}

            {form.type === "BLOG" && (
              <div className="bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                <textarea
                  placeholder="Write your blog content here…"
                  rows={6}
                  className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 resize-none"
                  value={form.content}
                  onChange={(e) =>
                    setForm({ ...form, content: e.target.value })
                  }
                />
              </div>
            )}

            {form.type === "QUIZ" && (
              <div className="space-y-3">
                {quiz.map((q, qi) => (
                  <div
                    key={qi}
                    className="border border-gray-200 rounded-2xl p-4 bg-gray-50 space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black tracking-widest text-gray-500 uppercase">
                        Question {qi + 1}
                      </span>
                      {quiz.length > 1 && (
                        <button
                          onClick={() => removeQuestion(qi)}
                          className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                        >
                          <Trash2 size={11} className="text-red-500" />
                        </button>
                      )}
                    </div>

                    <div className="flex items-center gap-2 bg-white border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
                      <input
                        placeholder={`e.g. What does useState return?`}
                        className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                        value={q.question}
                        onChange={(e) =>
                          updateQuestion(qi, "question", e.target.value)
                        }
                      />
                    </div>

                    <div className="space-y-2">
                      {q.options.map((opt, oi) => {
                        const isCorrect = q.correctAnswer === oi;
                        return (
                          <div
                            key={oi}
                            className={`flex items-center gap-2.5 border rounded-xl px-3 py-2 transition-all ${
                              isCorrect
                                ? "border-emerald-300 bg-emerald-50"
                                : "border-gray-200 bg-white"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() =>
                                updateQuestion(qi, "correctAnswer", oi)
                              }
                              className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                                isCorrect
                                  ? "border-emerald-500 bg-emerald-500"
                                  : "border-gray-300 hover:border-emerald-400"
                              }`}
                            >
                              {isCorrect && (
                                <svg
                                  width="8"
                                  height="8"
                                  viewBox="0 0 8 8"
                                  fill="none"
                                >
                                  <path
                                    d="M1.5 4L3 5.5L6.5 2"
                                    stroke="white"
                                    strokeWidth="1.5"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              )}
                            </button>

                            <input
                              placeholder={`Option ${oi + 1}`}
                              className={`bg-transparent outline-none text-sm w-full font-medium placeholder:text-gray-400 ${
                                isCorrect ? "text-emerald-800" : "text-gray-800"
                              }`}
                              value={opt}
                              onChange={(e) =>
                                updateOption(qi, oi, e.target.value)
                              }
                            />

                            {isCorrect && (
                              <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                                Correct
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                    <p className="text-[10px] text-gray-400">
                      Click the circle next to an option to mark it as correct
                    </p>
                  </div>
                ))}

                <button
                  onClick={addQuestion}
                  className="w-full flex items-center justify-center gap-1.5 py-2.5 border-2 border-dashed border-gray-200 rounded-xl text-xs font-bold text-gray-500 hover:border-blue-300 hover:text-blue-600 transition-all"
                >
                  <Plus size={13} /> Add Question
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="flex gap-2.5 px-6 pb-5 pt-2 shrink-0 border-t border-gray-100">
          <button
            onClick={() => {
              resetForm();
              onClose();
            }}
            className="flex-1 py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={saving || uploading}
            className="flex-1 py-2.5 rounded-xl bg-blue-600 text-white text-sm font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60"
          >
            {uploading
              ? "Uploading…"
              : saving
                ? "Saving…"
                : editingLesson
                  ? "Update Lesson"
                  : "Create Lesson"}
          </button>
        </div>
      </div>
    </div>
  );
}
