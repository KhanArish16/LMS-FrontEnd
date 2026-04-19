import { ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

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

export default function CourseCard({ course }) {
  const navigate = useNavigate();
  const lvl = levelStyle[course.level] ?? {
    bg: "bg-gray-100",
    text: "text-gray-600",
    dot: "bg-gray-400",
  };
  return (
    <div
      onClick={() => navigate(`/courses/${course._id}`)}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden h-40 sm:h-44 bg-gray-100">
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
          <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${lvl.dot}`} />
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

        <h3 className="font-bold text-sm text-gray-900 line-clamp-1 leading-snug">
          {course.title}
        </h3>

        <p className="text-xs text-gray-400 line-clamp-2 mt-1 leading-relaxed">
          {course.description}
        </p>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 text-[11px] text-gray-400 font-medium">
            <BookOpen size={12} className="text-gray-300" />
            <span>{course.instructor?.name ?? "Instructor"}</span>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:gap-2 transition-all">
            View <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </div>
  );
}
