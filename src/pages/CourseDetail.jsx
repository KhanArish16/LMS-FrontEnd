import { useEffect, useState, useRef, useCallback } from "react";
import { useParams } from "react-router-dom";
import {
  getCourseById,
  getModules,
  getLessons,
} from "../services/courseServices";
import API from "../services/api";
import {
  PlayCircle,
  FileText,
  HelpCircle,
  ChevronDown,
  ChevronRight,
  BookOpen,
  User,
  BarChart2,
  Layers,
} from "lucide-react";
import { Loader } from "../components/Loader";
import { useAuth } from "../context/AuthContext";

const iconMap = {
  VIDEO: PlayCircle,
  BLOG: FileText,
  QUIZ: HelpCircle,
  YOUTUBE: PlayCircle,
};

const typeStyle = {
  VIDEO: { bg: "bg-blue-50 text-blue-600", dot: "bg-blue-500" },
  BLOG: { bg: "bg-emerald-50 text-emerald-600", dot: "bg-emerald-500" },
  QUIZ: { bg: "bg-amber-50 text-amber-600", dot: "bg-amber-500" },
  YOUTUBE: { bg: "bg-red-50 text-red-600", dot: "bg-red-500" },
};

function getYouTubeId(url = "") {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&?/\s]{11})/,
    /youtube\.com\/shorts\/([^&?/\s]{11})/,
  ];
  for (const p of patterns) {
    const m = url.match(p);
    if (m) return m[1];
  }
  return null;
}

function TypeBadge({ type, size = "sm" }) {
  const s = typeStyle[type] ?? { bg: "bg-gray-100 text-gray-500" };
  const Icon = iconMap[type];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full font-medium ${s.bg} ${
        size === "sm" ? "px-2 py-0.5 text-[10px]" : "px-2.5 py-1 text-xs"
      }`}
    >
      {Icon && <Icon size={size === "sm" ? 10 : 12} />}
      {type}
    </span>
  );
}

export default function CourseDetail() {
  const { user } = useAuth();
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [openModule, setOpenModule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mobileDropdownOpen, setMobileDropdownOpen] = useState(false);
  const [progressMap, setProgressMap] = useState({});
  const [courseProgress, setCourseProgress] = useState(0);
  const saveTimeout = useRef(null);
  const [isEnrolled, setIsEnrolled] = useState(false);

  useEffect(() => {
    if (course?.students?.some((s) => s._id === user.id)) {
      setIsEnrolled(true);
    }
  }, [course]);

  const handleEnroll = async () => {
    try {
      await API.post(`/courses/${id}/enroll`);
      setIsEnrolled(true);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  const refreshCoursePercent = useCallback(async () => {
    try {
      const { data } = await API.get(`/progress/course/${id}`);
      setCourseProgress(data.progress ?? 0);
    } catch (err) {
      console.error("refreshCoursePercent:", err.message);
    }
  }, [id]);

  const saveProgress = useCallback(
    (lesson, { watchedSeconds = 0, completed = false } = {}) => {
      clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        try {
          const { data } = await API.post("/progress", {
            lessonId: lesson._id,
            courseId: id,
            watchedSeconds,
            completed,
          });
          setProgressMap((prev) => {
            const wasCompleted = prev[lesson._id]?.completed;
            if (completed && !wasCompleted) refreshCoursePercent();
            return { ...prev, [lesson._id]: data };
          });
        } catch (err) {
          console.error("saveProgress:", err.message);
        }
      }, 2000);
    },
    [id, refreshCoursePercent],
  );

  const markingRef = useRef(new Set());

  const markCompleted = useCallback(
    async (lesson) => {
      if (progressMap[lesson._id]?.completed) return;
      if (markingRef.current.has(lesson._id)) return;
      markingRef.current.add(lesson._id);
      try {
        const { data } = await API.post("/progress", {
          lessonId: lesson._id,
          courseId: id,
          completed: true,
          watchedSeconds: 0,
        });
        setProgressMap((prev) => ({ ...prev, [lesson._id]: data }));
        await refreshCoursePercent();
      } catch (err) {
        console.error("markCompleted:", err.message);
      } finally {
        markingRef.current.delete(lesson._id);
      }
    },
    [id, progressMap, refreshCoursePercent],
  );

  const fetchAllData = async () => {
    try {
      setLoading(true);

      const [courseRes, modulesRes] = await Promise.all([
        getCourseById(id),
        getModules(id),
      ]);
      setCourse(courseRes.data?.data);

      const modulesWithLessons = await Promise.all(
        (modulesRes.data?.data || []).map(async (module) => {
          const lessonsRes = await getLessons(module._id);
          return { ...module, lessons: lessonsRes.data?.data || [] };
        }),
      );
      setModules(modulesWithLessons);

      const { data: summary } = await API.get(`/progress/course/${id}`);
      setCourseProgress(summary.progress ?? 0);

      if (modulesWithLessons[0]?.lessons[0]) {
        setSelectedLesson(modulesWithLessons[0].lessons[0]);
        setOpenModule(modulesWithLessons[0]._id);
      }
    } catch (err) {
      console.error("fetchAllData:", err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLessonSelect = (lesson) => {
    setSelectedLesson(lesson);
    setMobileDropdownOpen(false);
  };

  const totalLessons = modules.reduce(
    (a, m) => a + (m.lessons?.length || 0),
    0,
  );

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );

  if (!course)
    return <p className="p-6 text-gray-400 text-center">Course not found.</p>;

  const SidebarModules = () => (
    <div className="space-y-2">
      {modules.map((module, moduleIndex) => (
        <div
          key={module._id}
          className="rounded-2xl overflow-hidden border border-gray-100 bg-white"
        >
          <button
            onClick={() =>
              setOpenModule(openModule === module._id ? null : module._id)
            }
            className="w-full flex items-center gap-3 px-4 py-3 hover:bg-gray-50 transition-colors text-left"
          >
            <span
              className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold ${
                openModule === module._id
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-500"
              }`}
            >
              {moduleIndex + 1}
            </span>
            <span className="flex-1 text-sm font-semibold text-gray-800 leading-snug">
              {module.title}
            </span>
            <span className="text-[10px] text-gray-400 mr-1">
              {(module.lessons || []).length}
            </span>
            <ChevronDown
              size={14}
              className={`text-gray-400 transition-transform shrink-0 ${openModule === module._id ? "rotate-180" : ""}`}
            />
          </button>

          {openModule === module._id && (
            <div className="border-t border-gray-100">
              {(module.lessons || []).map((lesson) => {
                const isCompleted = progressMap[lesson._id]?.completed;
                const Icon = iconMap[lesson.type];
                const isActive = selectedLesson?._id === lesson._id;
                const ts = typeStyle[lesson.type] ?? { dot: "bg-gray-400" };
                return (
                  <button
                    key={lesson._id}
                    onClick={() => handleLessonSelect(lesson)}
                    className={`w-full flex items-center gap-3 px-4 py-3 text-left transition-all border-l-[3px] ${
                      isActive
                        ? "bg-blue-50 border-blue-500"
                        : "border-transparent hover:bg-gray-50"
                    }`}
                  >
                    <span
                      className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
                    >
                      {Icon && (
                        <Icon
                          size={13}
                          className={
                            isActive ? "text-blue-600" : "text-gray-500"
                          }
                        />
                      )}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs font-medium leading-snug truncate flex items-center gap-1 ${isActive ? "text-blue-700" : "text-gray-700"}`}
                      >
                        {lesson.title}
                        {isCompleted && (
                          <span className="text-green-500 text-[10px]">✔</span>
                        )}
                      </p>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <span
                          className={`w-1.5 h-1.5 rounded-full shrink-0 ${ts.dot}`}
                        />
                        <span className="text-[10px] text-gray-400">
                          {lesson.type}
                        </span>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const LessonContent = ({ compact = false }) => {
    useEffect(() => {
      if (!selectedLesson) return;
      if (["BLOG", "QUIZ", "YOUTUBE"].includes(selectedLesson.type)) {
        markCompleted(selectedLesson);
      }
    }, [selectedLesson?._id]);

    if (!selectedLesson)
      return (
        <div className="flex flex-col items-center justify-center h-56 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <BookOpen size={26} className="text-blue-400" />
          </div>
          <p className="text-sm text-gray-400 font-medium">
            Select a lesson to start learning
          </p>
        </div>
      );

    return (
      <>
        {!isEnrolled && user.role === "STUDENT" && (
          <button
            onClick={handleEnroll}
            className="bg-black text-white px-4 py-2 rounded-lg mt-4"
          >
            Enroll Now
          </button>
        )}
        <div
          className={`flex items-start justify-between gap-3 ${compact ? "mb-3" : "mb-5"}`}
        >
          <div>
            <h2
              className={`font-bold text-gray-900 leading-snug ${compact ? "text-base" : "text-xl"}`}
            >
              {selectedLesson.title}
            </h2>
            <div className="mt-1.5">
              <TypeBadge
                type={selectedLesson.type}
                size={compact ? "sm" : "md"}
              />
            </div>
          </div>
        </div>

        {selectedLesson.type === "VIDEO" && (
          <div className="rounded-2xl overflow-hidden bg-black">
            <video
              key={selectedLesson._id}
              src={selectedLesson.contentUrl}
              controls
              className="w-full max-h-72 object-contain"
              ref={(video) => {
                if (!video) return;
                const saved = progressMap[selectedLesson._id];
                const onMeta = () => {
                  if (saved?.watchedSeconds && video.currentTime < 1) {
                    video.currentTime = saved.watchedSeconds;
                  }
                  video.removeEventListener("loadedmetadata", onMeta);
                };
                video.addEventListener("loadedmetadata", onMeta);
                video.ontimeupdate = () => {
                  const completed =
                    video.duration > 0 &&
                    video.currentTime / video.duration > 0.8;
                  saveProgress(selectedLesson, {
                    watchedSeconds: Math.floor(video.currentTime),
                    completed,
                  });
                };
              }}
            />
          </div>
        )}

        {selectedLesson.type === "YOUTUBE" &&
          (() => {
            const ytId = getYouTubeId(selectedLesson.contentUrl);
            if (!ytId)
              return (
                <div className="flex flex-col items-center justify-center h-32 gap-2 rounded-2xl bg-red-50 border border-red-100">
                  <Youtube size={28} className="text-red-400" />
                  <p className="text-sm text-red-600 font-medium">
                    Invalid YouTube URL
                  </p>
                </div>
              );
            return (
              <div className="rounded-2xl overflow-hidden bg-black aspect-video">
                <iframe
                  key={selectedLesson._id}
                  src={`https://www.youtube.com/embed/${ytId}?rel=0&modestbranding=1`}
                  title={selectedLesson.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            );
          })()}

        {selectedLesson.type === "BLOG" && (
          <div
            className="prose prose-sm max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedLesson.content }}
          />
        )}

        {selectedLesson.type === "QUIZ" && (
          <div className="flex flex-col items-center justify-center h-32 gap-2 rounded-2xl bg-amber-50 border border-amber-100">
            <HelpCircle size={28} className="text-amber-400" />
            <p className="text-sm text-amber-700 font-medium">
              Quiz coming soon…
            </p>
          </div>
        )}
      </>
    );
  };

  const ProgressBar = ({ className = "" }) => (
    <div className={className}>
      <div className="flex justify-between text-[11px] text-gray-400 mb-1">
        <span>Progress</span>
        <span>{courseProgress}%</span>
      </div>
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-blue-500 transition-all duration-500"
          style={{ width: `${courseProgress}%` }}
        />
      </div>
    </div>
  );

  return (
    <>
      <div className="hidden lg:grid grid-cols-3 gap-6 items-start">
        <div className="col-span-1 space-y-4">
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shrink-0 flex items-center justify-center">
                <BookOpen size={18} className="text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-gray-900 leading-snug">
                  {course.title}
                </h1>
                <p className="text-xs text-gray-400 mt-0.5">
                  by {course.instructor?.name}
                </p>
              </div>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed mb-3">
              {course.description}
            </p>
            <div className="flex flex-wrap gap-2 mb-3">
              <span className="bg-blue-50 text-blue-700 px-2.5 py-1 rounded-full text-xs font-semibold">
                {course.category}
              </span>
              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-full text-xs font-semibold">
                {course.level}
              </span>
            </div>
            <ProgressBar className="mb-3" />
            <div className="grid grid-cols-3 gap-2 pt-3 border-t border-gray-100">
              {[
                { icon: Layers, label: "Modules", value: modules.length },
                { icon: BookOpen, label: "Lessons", value: totalLessons },
                {
                  icon: BarChart2,
                  label: "Level",
                  value: course.level?.slice(0, 3) ?? "—",
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center py-1">
                  <Icon size={14} className="text-gray-400 mb-1" />
                  <span className="text-sm font-bold text-gray-800">
                    {value}
                  </span>
                  <span className="text-[10px] text-gray-400">{label}</span>
                </div>
              ))}
            </div>
          </div>
          <SidebarModules />
        </div>

        <div className="col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6 min-h-125">
          <LessonContent />
        </div>
      </div>

      <div
        className="flex flex-col lg:hidden"
        style={{ height: "calc(100dvh - 64px)" }}
      >
        <div className="shrink-0 bg-white border-b border-gray-100 shadow-sm z-30">
          <div className="flex items-center gap-3 px-4 pt-3.5 pb-2.5">
            <div className="flex items-center gap-2.5 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 shrink-0 flex items-center justify-center">
                <BookOpen size={14} className="text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-sm font-bold text-gray-900 leading-tight truncate">
                  {course.title}
                </h1>
                <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                  <span className="bg-blue-50 text-blue-700 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                    {course.category}
                  </span>
                  <span className="bg-gray-100 text-gray-600 px-1.5 py-0.5 rounded-full text-[10px] font-semibold">
                    {course.level}
                  </span>
                  <span className="text-[10px] text-gray-400 flex items-center gap-0.5">
                    <User size={9} className="shrink-0" />
                    <span className="truncate max-w-20">
                      {course.instructor?.name}
                    </span>
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={() => setMobileDropdownOpen((v) => !v)}
              className={`shrink-0 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold transition-all whitespace-nowrap ${
                mobileDropdownOpen
                  ? "bg-blue-600 text-white border-blue-600"
                  : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"
              }`}
            >
              <Layers size={12} />
              <span>{modules.length} Modules</span>
              <ChevronDown
                size={11}
                className={`transition-transform ${mobileDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>
          </div>

          <div className="px-4 pb-2.5">
            <ProgressBar />
          </div>

          {selectedLesson && !mobileDropdownOpen && (
            <div className="px-4 pb-2.5 flex items-center gap-1.5 min-w-0">
              <ChevronRight size={10} className="text-gray-300 shrink-0" />
              <TypeBadge type={selectedLesson.type} size="sm" />
              <span className="text-[11px] text-gray-500 font-medium truncate">
                {selectedLesson.title}
              </span>
            </div>
          )}

          {mobileDropdownOpen && (
            <div
              className="border-t border-gray-100 overflow-y-auto"
              style={{ maxHeight: "52vh" }}
            >
              {modules.map((module, moduleIndex) => (
                <div key={module._id}>
                  <button
                    onClick={() =>
                      setOpenModule(
                        openModule === module._id ? null : module._id,
                      )
                    }
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 bg-gray-50 hover:bg-gray-100 transition-colors sticky top-0 z-10 text-left"
                  >
                    <span className="shrink-0 w-5 h-5 rounded-full bg-white border border-gray-200 flex items-center justify-center text-[9px] font-bold text-gray-500">
                      {moduleIndex + 1}
                    </span>
                    <span className="flex-1 text-[11px] font-bold text-gray-600 uppercase tracking-wide truncate">
                      {module.title}
                    </span>
                    <span className="text-[10px] text-gray-400 shrink-0 mr-1">
                      {module.lessons.length}
                    </span>
                    <ChevronDown
                      size={11}
                      className={`text-gray-400 shrink-0 transition-transform ${openModule === module._id ? "rotate-180" : ""}`}
                    />
                  </button>

                  {openModule === module._id &&
                    module.lessons.map((lesson) => {
                      const isCompleted = progressMap[lesson._id]?.completed;
                      const Icon = iconMap[lesson.type];
                      const isActive = selectedLesson?._id === lesson._id;
                      const ts = typeStyle[lesson.type] ?? {
                        dot: "bg-gray-400",
                      };
                      return (
                        <button
                          key={lesson._id}
                          onClick={() => handleLessonSelect(lesson)}
                          className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-all border-l-[3px] ${
                            isActive
                              ? "bg-blue-50 border-blue-500"
                              : "border-transparent hover:bg-gray-50"
                          }`}
                        >
                          <span
                            className={`shrink-0 w-7 h-7 rounded-xl flex items-center justify-center ${isActive ? "bg-blue-100" : "bg-gray-100"}`}
                          >
                            {Icon && (
                              <Icon
                                size={13}
                                className={
                                  isActive ? "text-blue-600" : "text-gray-500"
                                }
                              />
                            )}
                          </span>
                          <div className="flex-1 min-w-0">
                            <p
                              className={`text-xs font-semibold leading-snug truncate flex items-center gap-1 ${isActive ? "text-blue-700" : "text-gray-700"}`}
                            >
                              {lesson.title}
                              {isCompleted && (
                                <span className="text-green-500 text-[10px]">
                                  ✔
                                </span>
                              )}
                            </p>
                            <div className="flex items-center gap-1.5 mt-0.5">
                              <span
                                className={`w-1.5 h-1.5 rounded-full shrink-0 ${ts.dot}`}
                              />
                              <span className="text-[10px] text-gray-400">
                                {lesson.type}
                              </span>
                            </div>
                          </div>
                          {isActive && (
                            <span className="shrink-0 w-4 h-4 rounded-full bg-blue-500 flex items-center justify-center">
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
                            </span>
                          )}
                        </button>
                      );
                    })}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto bg-gray-50">
          <div className="p-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
              <LessonContent compact />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
