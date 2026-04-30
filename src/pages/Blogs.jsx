import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getBlogs } from "../services/blogServices";
import BlogCard from "../components/BlogCard";
import SearchFilter from "../components/SearchFilter";
import useDebounce from "../hooks/useDebounce";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import { Plus, BookOpen, UserCheck, Globe } from "lucide-react";

export default function Blogs() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const userId = user?._id || user?.id;

  const [blogs, setBlogs] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [sort, setSort] = useState("");
  const [level, setLevel] = useState("");
  const [myBlogs, setMyBlogs] = useState(false);
  const [loading, setLoading] = useState(false);

  const debouncedSearch = useDebounce(search, 400);

  const fetchBlogs = async () => {
    setLoading(true);
    try {
      const res = await getBlogs({ search: debouncedSearch, category, sort });
      let data = res.data?.data || [];
      if (myBlogs && userId) {
        data = data.filter((b) => String(b.author?._id) === String(userId));
      }
      setBlogs(data);
    } catch (err) {
      console.error("Blog fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [debouncedSearch, category, sort, myBlogs, userId]);

  return (
    <div className="flex flex-col h-full">
      <div className="shrink-0 sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 pb-3 pt-2">
        <div className="flex items-center gap-3 mb-3">
          <div className="flex-1 min-w-0">
            <h1 className="text-xl font-bold text-gray-900 leading-tight">
              Blogs
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5 hidden sm:block">
              {blogs.length > 0
                ? `${blogs.length} article${blogs.length !== 1 ? "s" : ""}`
                : "Discover articles from the community"}
            </p>
          </div>

          <button
            onClick={() => setMyBlogs((v) => !v)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl border text-[11px] font-bold transition-all shrink-0 ${
              myBlogs
                ? "bg-blue-600 border-blue-600 text-white"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100 hover:border-gray-300"
            }`}
          >
            {myBlogs ? <Globe size={12} /> : <UserCheck size={12} />}
            <span>{myBlogs ? "All Blogs" : "My Blogs"}</span>
          </button>

          <button
            onClick={() => navigate("/blogs/create")}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-blue-600 text-white text-[11px] font-bold hover:bg-blue-700 transition-colors shadow-sm shadow-blue-200 shrink-0"
          >
            <Plus size={12} />
            <span className="hidden sm:inline">Create Blog</span>
            <span className="sm:hidden">New</span>
          </button>
        </div>

        <SearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          level={level}
          setLevel={setLevel}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div
        className="flex-1 overflow-y-auto pt-4 pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        )}

        {!loading && blogs.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-blue-50 flex items-center justify-center">
              <BookOpen size={26} className="text-blue-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              {myBlogs ? "You haven't written any blogs yet" : "No blogs found"}
            </p>
            <p className="text-xs text-gray-400 text-center px-4">
              {myBlogs
                ? 'Click "Create Blog" to share your first article'
                : search || category
                  ? "Try adjusting your filters"
                  : "Check back later for new articles"}
            </p>
            {myBlogs && (
              <button
                onClick={() => navigate("/blogs/create")}
                className="mt-1 flex items-center gap-1.5 px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-xl hover:bg-blue-700 transition-colors"
              >
                <Plus size={12} /> Create Blog
              </button>
            )}
          </div>
        )}

        {!loading && blogs.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
