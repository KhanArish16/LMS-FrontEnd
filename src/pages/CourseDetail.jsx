import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  getCourseById,
  getModules,
  getLessons,
} from "../services/courseServices";

import { PlayCircle, FileText, HelpCircle, CheckCircle } from "lucide-react";

const iconMap = {
  VIDEO: PlayCircle,
  BLOG: FileText,
  QUIZ: HelpCircle,
};

export default function CourseDetail() {
  const { id } = useParams();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openModule, setOpenModule] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const courseRes = await getCourseById(id);
      setCourse(courseRes.data);

      const modulesRes = await getModules(id);
      const modulesWithLessons = await Promise.all(
        modulesRes.data.map(async (module, index) => {
          const lessonsRes = await getLessons(module._id);
          if (index === 0 && lessonsRes.data.length > 0) {
            setOpenModule(module._id);
            setSelectedLesson(lessonsRes.data[0]);
          }

          return {
            ...module,
            lessons: lessonsRes.data,
          };
        }),
      );

      setModules(modulesWithLessons);
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!course) return <p>Course not found</p>;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div>
        <div className="bg-white p-6 rounded-xl shadow mb-4">
          <h1 className="text-xl font-bold">{course.title}</h1>

          <p className="text-gray-500 mt-2 text-sm">{course.description}</p>

          <div className="flex gap-2 mt-3">
            <span className="bg-blue-100 px-2 py-1 rounded text-xs">
              {course.category}
            </span>

            <span className="bg-gray-100 px-2 py-1 rounded text-xs">
              {course.level}
            </span>
          </div>

          <p className="mt-3 text-xs text-gray-600">
            Instructor: {course.instructor?.name}
          </p>
        </div>

        <div className="space-y-3 max-h-[80vh] overflow-y-auto pr-2">
          {modules.map((module, index) => (
            <div key={module._id} className="bg-white rounded-xl shadow-sm">
              <div
                onClick={() =>
                  setOpenModule(openModule === module._id ? null : module._id)
                }
                className="p-4 font-semibold cursor-pointer flex justify-between items-center hover:bg-gray-50"
              >
                <span>{module.title}</span>
                <span className="text-xs text-gray-400">
                  {module.lessons.length} Lessons
                </span>
              </div>

              {openModule === module._id && (
                <div className="border-t">
                  {module.lessons.map((lesson) => {
                    const Icon = iconMap[lesson.type];

                    const isActive = selectedLesson?._id === lesson._id;

                    return (
                      <div
                        key={lesson._id}
                        onClick={() => setSelectedLesson(lesson)}
                        className={`flex items-center gap-3 p-3 cursor-pointer text-sm transition-all ${
                          isActive
                            ? "bg-blue-100 text-blue-600 border-l-4 border-blue-600"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div>{Icon && <Icon size={16} />}</div>

                        <div className="flex-1">
                          <p className="font-medium">{lesson.title}</p>
                          <p className="text-xs text-gray-400">{lesson.type}</p>
                        </div>

                        <span className="text-xs text-gray-400">
                          {index + 1}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="col-span-2 bg-white p-6 rounded-xl shadow">
        {!selectedLesson ? (
          <p className="text-gray-500 text-center mt-20">
            Select a lesson to start learning 🚀
          </p>
        ) : (
          <>
            <div className="mb-4 border-b pb-3">
              <h2 className="text-2xl font-semibold mb-4">
                {selectedLesson.title}
              </h2>
              <p className="text-sm text-gray-400">{selectedLesson.type}</p>
            </div>

            {selectedLesson.type === "VIDEO" && (
              <video
                src={selectedLesson.contentUrl}
                controls
                className="w-full rounded-lg"
              />
            )}

            {selectedLesson.type === "BLOG" && (
              <div
                dangerouslySetInnerHTML={{
                  __html: selectedLesson.content,
                }}
              />
            )}

            {selectedLesson.type === "QUIZ" && <p>Quiz UI coming next...</p>}
          </>
        )}
      </div>
    </div>
  );
}
