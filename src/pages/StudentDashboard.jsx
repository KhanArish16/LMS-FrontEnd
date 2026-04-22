import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  BookOpen,
  ArrowRight,
  Trophy,
  Flame,
  BarChart2,
  CheckCircle,
  Clock,
  Layers,
} from "lucide-react";
import { Loader } from "../components/Loader";

const levelStyle = {
  BEGINNER: {
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
  },
  INTERMEDIATE: {
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-500",
  },
  ADVANCED: { bg: "bg-red-50", text: "text-red-700", dot: "bg-red-500" },
};

function progressColor(p) {
  if (p >= 100) return "bg-emerald-500";
  if (p >= 60) return "bg-blue-500";
  if (p >= 30) return "bg-amber-400";
  return "bg-gray-300";
}

function greeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

export default function StudentDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await API.get("/courses");
      const enrolled = (res.data?.data || []).filter((c) =>
        c.students?.some((s) => s._id === user._id),
      );
      setCourses(enrolled);

      const progressData = await Promise.all(
        enrolled.map(async (course) => {
          const p = await API.get(`/progress/course/${course._id}`);
          return { id: course._id, progress: p.data.progress ?? 0 };
        }),
      );
      const map = {};
      progressData.forEach(({ id, progress }) => {
        map[id] = progress;
      });
      setProgressMap(map);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const totalCourses = courses.length;
  const completed = courses.filter(
    (c) => (progressMap[c._id] ?? 0) >= 100,
  ).length;
  const avgProgress = totalCourses
    ? Math.round(
        courses.reduce((a, c) => a + (progressMap[c._id] ?? 0), 0) /
          totalCourses,
      )
    : 0;
  const inProgress = courses.filter((c) => {
    const p = progressMap[c._id] ?? 0;
    return p > 0 && p < 100;
  });

  const continueLearning = [...courses]
    .filter((c) => (progressMap[c._id] ?? 0) < 100)
    .sort((a, b) => (progressMap[b._id] ?? 0) - (progressMap[a._id] ?? 0))
    .slice(0, 3);

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            {greeting()}
          </p>
          <h1 className="text-2xl font-bold text-gray-900">
            {user?.name?.split(" ")[0] ?? "Student"} 👋
          </h1>
        </div>
        {avgProgress > 0 && (
          <div className="flex items-center gap-2 px-3.5 py-2 bg-blue-50 border border-blue-100 rounded-2xl">
            <Flame size={15} className="text-orange-500" />
            <span className="text-sm font-bold text-blue-700">
              {avgProgress}% avg progress
            </span>
          </div>
        )}
      </div>

      {totalCourses > 0 && (
        <div className="grid grid-cols-3 gap-3">
          {[
            {
              icon: Layers,
              label: "Enrolled",
              value: totalCourses,
              color: "bg-blue-50 text-blue-600",
            },
            {
              icon: Clock,
              label: "In Progress",
              value: inProgress.length,
              color: "bg-amber-50 text-amber-600",
            },
            {
              icon: CheckCircle,
              label: "Completed",
              value: completed,
              color: "bg-emerald-50 text-emerald-600",
            },
          ].map(({ icon: Icon, label, value, color }) => (
            <div
              key={label}
              className="bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3"
            >
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
              >
                <Icon size={16} />
              </div>
              <div>
                <p className="text-xl font-bold text-gray-900 leading-none">
                  {value}
                </p>
                <p className="text-[11px] text-gray-400 mt-0.5">{label}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {continueLearning.length > 0 && (
        <section>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold text-gray-900">
              Continue Learning
            </h2>
            <span className="text-[11px] text-gray-400">
              {continueLearning.length} in progress
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {continueLearning.map((course) => {
              const p = progressMap[course._id] ?? 0;
              const lvl = levelStyle[course.level] ?? {
                bg: "bg-gray-100",
                text: "text-gray-600",
                dot: "bg-gray-400",
              };
              return (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="relative h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://placehold.co/400x200/f1f5f9/94a3b8?text=Course"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />

                    <span
                      className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${lvl.bg} ${lvl.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${lvl.dot}`} />
                      {course.level}
                    </span>

                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/10">
                      <div
                        className={`h-full transition-all ${progressColor(p)}`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <span
                      className="inline-block px-2 py-0.5 mb-2 text-[10px] font-black tracking-widest text-gray-500 bg-gray-100 border border-gray-200"
                      style={{ borderRadius: "4px" }}
                    >
                      {(course.category ?? "").replace(/_/g, " ")}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1 leading-snug">
                      {course.title}
                    </h3>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-gray-400 font-medium">
                          Progress
                        </span>
                        <span className="font-bold text-gray-700">{p}%</span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor(p)}`}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400">
                        {p === 0 ? "Not started" : `${p}% complete`}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:gap-2 transition-all">
                        {p === 0 ? "Start" : "Resume"} <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      <section>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-bold text-gray-900">All Courses</h2>
          <span className="text-[11px] text-gray-400">
            {totalCourses} enrolled
          </span>
        </div>

        {totalCourses === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={26} className="text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              No courses yet
            </p>
            <p className="text-xs text-gray-400">
              Browse the course catalogue to get started
            </p>
            <button
              onClick={() => navigate("/courses")}
              className="mt-1 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
            >
              Browse Courses <ArrowRight size={12} />
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {courses.map((course) => {
              const p = progressMap[course._id] ?? 0;
              const done = p >= 100;
              const lvl = levelStyle[course.level] ?? {
                bg: "bg-gray-100",
                text: "text-gray-600",
                dot: "bg-gray-400",
              };
              return (
                <div
                  key={course._id}
                  onClick={() => navigate(`/courses/${course._id}`)}
                  className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="relative h-36 bg-gray-100 overflow-hidden">
                    <img
                      src={
                        course.thumbnail ||
                        "https://placehold.co/400x200/f1f5f9/94a3b8?text=Course"
                      }
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                    />
                    <span
                      className={`absolute top-2.5 right-2.5 flex items-center gap-1 px-2 py-1 rounded-md text-[10px] font-bold ${lvl.bg} ${lvl.text}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${lvl.dot}`} />
                      {course.level}
                    </span>
                    {done && (
                      <div className="absolute inset-0 bg-emerald-900/30 flex items-center justify-center">
                        <div className="flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl">
                          <Trophy size={13} className="text-emerald-600" />
                          <span className="text-[11px] font-bold text-emerald-700">
                            Completed!
                          </span>
                        </div>
                      </div>
                    )}
                    <div className="absolute bottom-0 inset-x-0 h-1 bg-black/10">
                      <div
                        className={`h-full transition-all ${progressColor(p)}`}
                        style={{ width: `${p}%` }}
                      />
                    </div>
                  </div>

                  <div className="p-4">
                    <span
                      className="inline-block px-2 py-0.5 mb-2 text-[10px] font-black tracking-widest text-gray-500 bg-gray-100 border border-gray-200"
                      style={{ borderRadius: "4px" }}
                    >
                      {(course.category ?? "").replace(/_/g, " ")}
                    </span>
                    <h3 className="text-sm font-bold text-gray-900 line-clamp-1">
                      {course.title}
                    </h3>
                    <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                      {course.description}
                    </p>

                    <div className="mt-3">
                      <div className="flex justify-between text-[11px] mb-1.5">
                        <span className="text-gray-400 font-medium">
                          Progress
                        </span>
                        <span
                          className={`font-bold ${done ? "text-emerald-600" : "text-gray-700"}`}
                        >
                          {p}%
                        </span>
                      </div>
                      <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${progressColor(p)}`}
                          style={{ width: `${p}%` }}
                        />
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-[11px] text-gray-400 flex items-center gap-1">
                        <BarChart2 size={10} />{" "}
                        {course.instructor?.name ?? "Instructor"}
                      </span>
                      <span
                        className={`flex items-center gap-1 text-[11px] font-bold group-hover:gap-2 transition-all ${done ? "text-emerald-600" : "text-blue-600"}`}
                      >
                        {done ? "Review" : p > 0 ? "Resume" : "Start"}{" "}
                        <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
