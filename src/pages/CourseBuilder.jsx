import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ModuleModal from "../components/ModuleModal";
import LessonModal from "../components/LessonModal";
import {
  Plus,
  ChevronDown,
  Pencil,
  Trash2,
  PlayCircle,
  FileText,
  HelpCircle,
  BookOpen,
  Layers,
} from "lucide-react";

const lessonIcon = {
  VIDEO: PlayCircle,
  YOUTUBE: PlayCircle,
  BLOG: FileText,
  QUIZ: HelpCircle,
};
const lessonStyle = {
  VIDEO: { bg: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  YOUTUBE: { bg: "bg-red-50 text-red-600", dot: "bg-red-500" },
  BLOG: { bg: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  QUIZ: { bg: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
};

export default function CourseBuilder() {
  const { courseId } = useParams();
  const [modules, setModules] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingModule, setEditingModule] = useState(null);
  const [expandedModule, setExpandedModule] = useState(null);
  const [showLessonModal, setShowLessonModal] = useState(false);
  const [selectedModuleId, setSelectedModuleId] = useState(null);
  const [editingLesson, setEditingLesson] = useState(null);

  useEffect(() => {
    fetchModules();
  }, []);

  const fetchModules = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/modules/${courseId}`);
      const modulesData = res.data?.data || [];
      const modulesWithLessons = await Promise.all(
        modulesData.map(async (module) => {
          try {
            const lr = await API.get(`/lessons?moduleId=${module._id}`);
            const lessons = lr.data?.data || [];

            const lessonsWithQuiz = await Promise.all(
              lessons.map(async (lesson) => {
                if (lesson.type !== "QUIZ") return lesson;
                try {
                  const qr = await API.get(`/quiz/${lesson._id}`);
                  return { ...lesson, quiz: qr.data?.data ?? null };
                } catch {
                  return { ...lesson, quiz: null };
                }
              }),
            );
            return { ...module, lessons: lessonsWithQuiz };
          } catch {
            return { ...module, lessons: [] };
          }
        }),
      );
      setModules(modulesWithLessons);
    } catch (err) {
      console.error("fetchModules:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleModuleSubmit = async (form) => {
    if (editingModule) await API.put(`/modules/${editingModule._id}`, form);
    else await API.post("/modules", { ...form, courseId });
    setEditingModule(null);
    fetchModules();
  };

  const handleModuleDelete = async (id) => {
    if (!window.confirm("Delete this module and all its lessons?")) return;
    await API.delete(`/modules/${id}`);
    fetchModules();
  };

  const handleLessonSubmit = async (payload) => {
    try {
      let lessonId;

      if (editingLesson) {
        const res = await API.put(`/lessons/${editingLesson._id}`, {
          title: payload.title,
          type: payload.type,
          category: payload.category,
          moduleId: payload.moduleId,
          content: payload.content || "",
          contentUrl: payload.contentUrl || "",
        });

        lessonId = res.data?.data?._id || editingLesson._id;
      } else {
        const res = await API.post("/lessons", {
          title: payload.title,
          type: payload.type,
          category: payload.category,
          moduleId: payload.moduleId,
          content: payload.content || "",
          contentUrl: payload.contentUrl || "",
        });

        lessonId = res.data?.data?._id;
      }

      if (!lessonId) {
        throw new Error("Lesson ID not returned");
      }

      if (payload.type === "QUIZ") {
        if (!payload.quiz || payload.quiz.length === 0) {
          throw new Error("Quiz questions missing");
        }

        if (editingLesson) {
          await API.put(`/quiz/${lessonId}`, {
            questions: payload.quiz,
          });
        } else {
          await API.post("/quiz", {
            lessonId,
            questions: payload.quiz,
          });
        }
      }

      setShowLessonModal(false);
      setEditingLesson(null);
      fetchModules();
    } catch (err) {
      console.error("Lesson submit error:", err.response?.data || err.message);
    }
  };

  const handleLessonDelete = async (lessonId) => {
    if (!window.confirm("Delete this lesson?")) return;
    await API.delete(`/lessons/${lessonId}`);
    fetchModules();
  };

  const totalLessons = modules.reduce(
    (a, m) => a + (m.lessons?.length ?? 0),
    0,
  );

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Course Builder</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {modules.length} modules · {totalLessons} lessons
          </p>
        </div>
        <button
          onClick={() => {
            setEditingModule(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={14} /> Add Module
        </button>
      </div>

      {!loading && modules.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <Layers size={26} className="text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No modules yet</p>
          <p className="text-xs text-gray-400">
            Click "Add Module" to get started
          </p>
        </div>
      )}

      <div className="space-y-3">
        {modules.map((module, moduleIndex) => {
          const isExpanded = expandedModule === module._id;
          return (
            <div
              key={module._id}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden"
            >
              <div className="flex items-center gap-3 px-4 py-3.5">
                <span className="shrink-0 w-7 h-7 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm shadow-blue-200">
                  {moduleIndex + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-snug truncate">
                    {module.title}
                  </p>
                  {module.description && (
                    <p className="text-[11px] text-gray-400 truncate mt-0.5">
                      {module.description}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    onClick={() => {
                      setSelectedModuleId(module._id);
                      setEditingLesson(null);
                      setShowLessonModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[11px] font-bold hover:bg-blue-100 transition-colors"
                  >
                    <Plus size={11} /> Lesson
                  </button>
                  <button
                    onClick={() => {
                      setEditingModule(module);
                      setShowModal(true);
                    }}
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <Pencil size={12} className="text-gray-500" />
                  </button>
                  <button
                    onClick={() => handleModuleDelete(module._id)}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                  <button
                    onClick={() =>
                      setExpandedModule(isExpanded ? null : module._id)
                    }
                    className="w-7 h-7 rounded-lg bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                  >
                    <ChevronDown
                      size={13}
                      className={`text-gray-500 transition-transform ${isExpanded ? "rotate-180" : ""}`}
                    />
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className="border-t border-gray-100 px-4 py-3 space-y-2">
                  {(module.lessons ?? []).length === 0 ? (
                    <p className="text-xs text-gray-400 py-2 text-center">
                      No lessons yet — add one above
                    </p>
                  ) : (
                    (module.lessons ?? []).map((lesson, li) => {
                      const Icon = lessonIcon[lesson.type] ?? BookOpen;
                      const ls = lessonStyle[lesson.type] ?? {
                        bg: "bg-gray-100 text-gray-500",
                        dot: "bg-gray-400",
                      };
                      return (
                        <div
                          key={lesson._id}
                          className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gray-50 border border-gray-100"
                        >
                          <span
                            className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${ls.bg}`}
                          >
                            <Icon size={13} />
                          </span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-gray-800 truncate">
                              {lesson.title}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full ${ls.dot}`}
                              />
                              <span className="text-[10px] text-gray-400">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                          <span className="text-[10px] text-gray-300 font-mono shrink-0">
                            #{li + 1}
                          </span>
                          <div className="flex gap-1.5 shrink-0">
                            <button
                              onClick={() => {
                                setSelectedModuleId(module._id);
                                setEditingLesson(lesson);
                                setShowLessonModal(true);
                              }}
                              className="w-6 h-6 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors"
                            >
                              <Pencil size={10} className="text-gray-500" />
                            </button>
                            <button
                              onClick={() => handleLessonDelete(lesson._id)}
                              className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors"
                            >
                              <Trash2 size={10} className="text-red-500" />
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {!isExpanded && (module.lessons ?? []).length > 0 && (
                <button
                  onClick={() => setExpandedModule(module._id)}
                  className="w-full flex items-center justify-center gap-1.5 py-2 border-t border-gray-100 text-[11px] text-gray-400 hover:text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <BookOpen size={11} />
                  {module.lessons.length} lesson
                  {module.lessons.length !== 1 ? "s" : ""} — click to expand
                </button>
              )}
            </div>
          );
        })}
      </div>

      <ModuleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleModuleSubmit}
        editingModule={editingModule}
      />
      <LessonModal
        isOpen={showLessonModal}
        onClose={() => setShowLessonModal(false)}
        onSubmit={handleLessonSubmit}
        moduleId={selectedModuleId}
        editingLesson={editingLesson}
      />
    </div>
  );
}
