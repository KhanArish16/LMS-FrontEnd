import { ArrowRight, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

const CAT_STYLE = {
  DSA: "bg-blue-50   text-blue-700   border-blue-200",
  FRONTEND: "bg-violet-50 text-violet-700 border-violet-200",
  BACKEND: "bg-orange-50 text-orange-700 border-orange-200",
  FULLSTACK: "bg-indigo-50 text-indigo-700 border-indigo-200",
  MOBILE: "bg-pink-50   text-pink-700   border-pink-200",
  DATA_SCIENCE: "bg-teal-50   text-teal-700   border-teal-200",
  AI_ML: "bg-purple-50 text-purple-700 border-purple-200",
  CYBER_SECURITY: "bg-red-50    text-red-700    border-red-200",
  DEVOPS: "bg-cyan-50   text-cyan-700   border-cyan-200",
  CLOUD_COMPUTING: "bg-sky-50    text-sky-700    border-sky-200",
  UI_UX: "bg-rose-50   text-rose-700   border-rose-200",
  OTHER: "bg-gray-100  text-gray-600   border-gray-200",
};

export default function BlogCard({ blog }) {
  const navigate = useNavigate();
  const catCls = CAT_STYLE[blog.category] ?? CAT_STYLE.OTHER;
  const initials = blog.author?.name?.slice(0, 2).toUpperCase() ?? "AU";

  return (
    <div
      onClick={() => navigate(`/blogs/${blog._id}`)}
      className="group bg-white border border-gray-100 rounded-2xl overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md hover:-translate-y-0.5"
    >
      <div className="relative overflow-hidden h-40 sm:h-44 bg-gray-100">
        <img
          src={
            blog.thumbnail ||
            "https://placehold.co/400x200/f1f5f9/94a3b8?text=Blog"
          }
          alt={blog.title}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
      </div>

      <div className="p-4">
        <span
          className={`inline-block px-2 py-0.5 mb-2 text-[10px] font-black tracking-widest border ${catCls}`}
          style={{ borderRadius: "4px" }}
        >
          {(blog.category ?? "OTHER").replace(/_/g, " ")}
        </span>

        <h3 className="font-bold text-sm text-gray-900 line-clamp-2 leading-snug">
          {blog.title}
        </h3>

        <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5 min-w-0">
            {blog.author?.profilePic ? (
              <img
                src={blog.author.profilePic}
                alt={blog.author.name}
                className="w-5 h-5 rounded-full object-cover shrink-0"
              />
            ) : (
              <div className="w-5 h-5 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
                <span className="text-[7px] font-bold text-white leading-none">
                  {initials}
                </span>
              </div>
            )}
            <span className="text-[11px] text-gray-400 font-medium truncate">
              {blog.author?.name ?? "Author"}
            </span>
          </div>

          <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 shrink-0 group-hover:gap-2 transition-all">
            Read <ArrowRight size={11} />
          </span>
        </div>
      </div>
    </div>
  );
}
