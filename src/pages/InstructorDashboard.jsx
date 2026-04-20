import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import CourseModal from "../components/CourseModal";
import { useNavigate } from "react-router-dom";
import {
  Plus,
  Pencil,
  Trash2,
  Settings,
  BookOpen,
  BarChart2,
  ArrowRight,
} from "lucide-react";

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

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    if (user?._id) fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await API.get("/courses");
      const all = res.data?.data || res.data || [];
      setCourses(all.filter((c) => c.instructor?._id === user?._id));
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (formData) => {
    if (editingCourse) await API.put(`/courses/${editingCourse._id}`, formData);
    else await API.post("/courses", formData);
    setShowModal(false);
    setEditingCourse(null);
    fetchCourses();
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this course and all its content?")) return;
    setDeleting(id);
    try {
      await API.delete(`/courses/${id}`);
      fetchCourses();
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-gray-900">My Courses</h1>
          <p className="text-xs text-gray-400 mt-0.5">
            {courses.length} course{courses.length !== 1 ? "s" : ""} published
          </p>
        </div>
        <button
          onClick={() => {
            setEditingCourse(null);
            setShowModal(true);
          }}
          className="flex items-center gap-1.5 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-xl hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200"
        >
          <Plus size={14} /> Create Course
        </button>
      </div>

      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-3">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
            <BookOpen size={26} className="text-blue-400" />
          </div>
          <p className="text-sm font-semibold text-gray-500">No courses yet</p>
          <p className="text-xs text-gray-400">
            Click "Create Course" to publish your first course
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => {
          const lvl = levelStyle[course.level] ?? {
            bg: "bg-gray-100",
            text: "text-gray-600",
            dot: "bg-gray-400",
          };
          return (
            <div
              key={course._id}
              className="group bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
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
                <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center gap-2 mt-4 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => {
                      setEditingCourse(course);
                      setShowModal(true);
                    }}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-gray-100 hover:bg-gray-200 text-[11px] font-bold text-gray-600 transition-colors"
                  >
                    <Pencil size={11} /> Edit
                  </button>

                  <button
                    onClick={() => navigate(`/course-builder/${course._id}`)}
                    className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-[11px] font-bold text-blue-600 transition-colors"
                  >
                    <Settings size={11} /> Manage
                  </button>

                  <div className="flex-1" />

                  <button
                    onClick={() => handleDelete(course._id)}
                    disabled={deleting === course._id}
                    className="w-7 h-7 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors disabled:opacity-50"
                  >
                    <Trash2 size={12} className="text-red-500" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <CourseModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setEditingCourse(null);
        }}
        onSubmit={handleSubmit}
        editingCourse={editingCourse}
      />
    </div>
  );
}
