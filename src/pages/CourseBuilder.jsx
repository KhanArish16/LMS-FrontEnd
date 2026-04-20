import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";
import ModuleModal from "../components/ModuleModal";
import LessonModal from "../components/LessonModal";

export default function CourseBuilder() {
  const { courseId } = useParams();

  const [modules, setModules] = useState([]);
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
    try {
      const res = await API.get(`/modules/${courseId}`);
      const modulesData = res.data?.data || [];

      const modulesWithLessons = await Promise.all(
        modulesData.map(async (module) => {
          try {
            const lessonsRes = await API.get(`/lessons?moduleId=${module._id}`);

            return {
              ...module,
              lessons: lessonsRes.data?.data || [],
            };
          } catch {
            return { ...module, lessons: [] };
          }
        }),
      );

      setModules(modulesWithLessons);
    } catch (err) {
      console.log("Fetch Modules Error:", err);
    }
  };

  const handleSubmit = async (form) => {
    try {
      if (editingModule) {
        await API.put(`/modules/${editingModule._id}`, form);
      } else {
        await API.post("/modules", {
          ...form,
          courseId,
        });
      }

      setEditingModule(null);
      fetchModules();
    } catch (err) {
      console.log("Module Submit Error:", err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete module?")) return;

    try {
      await API.delete(`/modules/${id}`);
      fetchModules();
    } catch (err) {
      console.log("Delete Module Error:", err);
    }
  };

  const handleAddLesson = (moduleId) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(null);
    setShowLessonModal(true);
  };

  const handleEditLesson = (lesson, moduleId) => {
    setSelectedModuleId(moduleId);
    setEditingLesson(lesson);
    setShowLessonModal(true);
  };

  const handleDeleteLesson = async (lessonId) => {
    if (!window.confirm("Delete lesson?")) return;

    try {
      await API.delete(`/lessons/${lessonId}`);
      fetchModules();
    } catch (err) {
      console.log("Delete Lesson Error:", err);
    }
  };

  const handleLessonSubmit = async (payload) => {
    try {
      if (editingLesson) {
        await API.put(`/lessons/${editingLesson._id}`, payload);
      } else {
        await API.post("/lessons", payload);
      }

      setShowLessonModal(false);
      fetchModules();
    } catch (err) {
      console.log("Lesson Submit Error:", err.response?.data);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Course Builder</h1>

        <button
          onClick={() => {
            setEditingModule(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Add Module
        </button>
      </div>

      <div className="space-y-4">
        {Array.isArray(modules) &&
          modules.map((module) => (
            <div key={module._id} className="bg-white p-4 rounded-xl shadow">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-semibold">{module.title}</h3>
                  <p className="text-sm text-gray-500">{module.description}</p>
                  <p className="text-xs text-gray-400">Order: {module.order}</p>
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => handleAddLesson(module._id)}
                    className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
                  >
                    + Lesson
                  </button>

                  <button
                    onClick={() => {
                      setEditingModule(module);
                      setShowModal(true);
                    }}
                    className="px-3 py-1 bg-gray-200 rounded text-sm"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => handleDelete(module._id)}
                    className="px-3 py-1 bg-red-500 text-white rounded text-sm"
                  >
                    Delete
                  </button>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between">
                <button
                  onClick={() =>
                    setExpandedModule(
                      expandedModule === module._id ? null : module._id,
                    )
                  }
                  className="text-sm font-medium text-blue-600 hover:underline"
                >
                  {expandedModule === module._id
                    ? "Hide Lessons ▲"
                    : "Show Lessons ▼"}
                </button>

                <span className="text-xs text-gray-400">
                  {(module.lessons || []).length} lessons
                </span>
              </div>

              {expandedModule === module._id && (
                <div className="mt-4 border-t pt-3 space-y-2">
                  {(module.lessons || []).length === 0 && (
                    <p className="text-sm text-gray-400">No lessons yet</p>
                  )}

                  {(module.lessons || []).map((lesson) => (
                    <div
                      key={lesson._id}
                      className="flex justify-between items-center bg-gray-50 p-2 rounded"
                    >
                      <div>
                        <p className="text-sm font-medium">{lesson.title}</p>
                        <p className="text-xs text-gray-400">{lesson.type}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditLesson(lesson, module._id)}
                          className="px-2 py-1 bg-gray-200 rounded text-xs"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteLesson(lesson._id)}
                          className="px-2 py-1 bg-red-500 text-white rounded text-xs"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
      </div>

      <ModuleModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
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
