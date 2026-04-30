import { useEffect, useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog } from "../services/blogServices";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import toast from "react-hot-toast";
import Prism from "prismjs";
import "prismjs/themes/prism-tomorrow.css";
import "prismjs/components/prism-javascript";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Tag,
  User,
  BookOpen,
} from "lucide-react";

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

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const userId = useMemo(() => user?._id || user?.id || null, [user]);
  const isOwner = blog && userId && String(blog.author?._id) === String(userId);
  const catCls = CAT_STYLE[blog?.category] ?? CAT_STYLE.OTHER;
  const initials = blog?.author?.name?.slice(0, 2).toUpperCase() ?? "AU";

  useEffect(() => {
    let mounted = true;
    const fetchBlog = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBlogById(id);
        if (mounted) setBlog(res.data?.data || null);
      } catch (err) {
        console.error("Fetch blog error:", err);
        if (mounted) setError("Failed to load blog");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchBlog();
    return () => {
      mounted = false;
    };
  }, [id]);

  useEffect(() => {
    if (blog?.content?.length) Prism.highlightAll();
  }, [blog]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(id);
      toast.success("Blog deleted");
      navigate("/blogs");
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete blog");
    } finally {
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const copyCode = (code, i) => {
    navigator.clipboard.writeText(code || "");
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  /* ── States ── */
  if (loading || authLoading)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );

  if (error)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <BookOpen size={22} className="text-red-400" />
        </div>
        <p className="text-sm font-semibold text-gray-500">{error}</p>
        <button
          onClick={() => navigate("/blogs")}
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          ← Back to blogs
        </button>
      </div>
    );

  if (!blog)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-3">
        <p className="text-sm text-gray-400">Blog not found.</p>
        <button
          onClick={() => navigate("/blogs")}
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          ← Back to blogs
        </button>
      </div>
    );

  return (
    <div className="max-w-3xl mx-auto pb-16">
      <div className="flex flex-wrap items-center gap-2 py-4 mb-2">
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 transition-colors shrink-0"
        >
          <ArrowLeft size={13} /> Back
        </button>

        {isOwner && (
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <button
              onClick={() => navigate(`/blogs/${id}/edit`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors"
            >
              <Pencil size={12} />
              <span>Edit</span>
            </button>

            {!confirmDelete ? (
              <button
                onClick={() => setConfirmDelete(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 border border-red-100 transition-colors"
              >
                <Trash2 size={12} />
                <span>Delete</span>
              </button>
            ) : (
              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="text-xs text-gray-500 font-medium shrink-0">
                  Are you sure?
                </span>
                <button
                  onClick={handleDelete}
                  disabled={deleting}
                  className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-60 shrink-0"
                >
                  {deleting ? "Deleting…" : "Yes, delete"}
                </button>
                <button
                  onClick={() => setConfirmDelete(false)}
                  className="px-3 py-1.5 rounded-xl bg-gray-100 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-colors shrink-0"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <div className="mb-6">
        {blog.category && (
          <span
            className={`inline-block px-2 py-0.5 mb-3 text-[10px] font-black tracking-widest border ${catCls}`}
            style={{ borderRadius: "4px" }}
          >
            {blog.category.replace(/_/g, " ")}
          </span>
        )}

        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 leading-tight mb-4">
          {blog.title}
        </h1>

        <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
          {blog.author?.profilePic ? (
            <img
              src={blog.author.profilePic}
              alt={blog.author.name}
              className="w-8 h-8 rounded-full object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-[10px] font-bold text-white">
                {initials}
              </span>
            </div>
          )}
          <div>
            <p className="text-sm font-semibold text-gray-800 leading-none">
              {blog.author?.name ?? "Author"}
            </p>
            {blog.createdAt && (
              <p className="text-[11px] text-gray-400 mt-0.5">
                {new Date(blog.createdAt).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            )}
          </div>
        </div>
      </div>

      {blog.thumbnail && (
        <div className="rounded-2xl overflow-hidden mb-8 border border-gray-100">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full object-cover max-h-80 sm:max-h-96"
          />
        </div>
      )}

      <div className="space-y-6">
        {blog.content?.map((block, i) => {
          switch (block.type) {
            case "TEXT":
              return (
                <p
                  key={i}
                  className="text-[15px] text-gray-700 leading-[1.85] font-normal"
                >
                  {block.value}
                </p>
              );

            case "CODE":
              return (
                <div
                  key={i}
                  className="relative rounded-2xl overflow-hidden border border-gray-200"
                >
                  <div className="flex items-center justify-between px-4 py-2.5 bg-gray-900 border-b border-gray-700">
                    <div className="flex items-center gap-1.5">
                      <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                      <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                    </div>
                    <span className="text-[10px] text-gray-500 font-mono uppercase tracking-widest">
                      {block.language || "javascript"}
                    </span>
                    <button
                      onClick={() => copyCode(block.value, i)}
                      className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedIndex === i ? (
                        <>
                          <Check size={11} className="text-emerald-400" />{" "}
                          Copied
                        </>
                      ) : (
                        <>
                          <Copy size={11} /> Copy
                        </>
                      )}
                    </button>
                  </div>
                  <pre
                    className={`language-${block.language || "javascript"} rounded-none! m-0! border-0! text-sm overflow-x-auto`}
                  >
                    <code
                      className={`language-${block.language || "javascript"}`}
                    >
                      {block.value}
                    </code>
                  </pre>
                </div>
              );

            case "IMAGE":
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-gray-100"
                >
                  <img
                    src={block.value}
                    alt="blog content"
                    className="w-full object-cover"
                  />
                </div>
              );

            case "YOUTUBE":
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-gray-100 aspect-video"
                >
                  <iframe
                    src={block.value}
                    title="YouTube embed"
                    className="w-full h-full"
                    allowFullScreen
                  />
                </div>
              );

            case "LINK":
              return (
                <a
                  key={i}
                  href={block.value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
                >
                  {block.value} <ExternalLink size={13} />
                </a>
              );

            default:
              return null;
          }
        })}
      </div>

      {blog.tags?.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2 flex-wrap">
            <Tag size={13} className="text-gray-400 shrink-0" />
            {blog.tags.map((tag, i) => (
              <span
                key={i}
                className="px-2.5 py-1 text-[11px] font-bold text-gray-600 bg-gray-100 border border-gray-200 hover:bg-gray-200 transition-colors cursor-default"
                style={{ borderRadius: "6px" }}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="mt-10 p-4 bg-white border border-gray-100 rounded-2xl flex items-center gap-4">
        {blog.author?.profilePic ? (
          <img
            src={blog.author.profilePic}
            alt={blog.author.name}
            className="w-12 h-12 rounded-xl object-cover shrink-0"
          />
        ) : (
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-white">{initials}</span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs text-gray-400 font-medium mb-0.5">Written by</p>
          <p className="text-sm font-bold text-gray-900 truncate">
            {blog.author?.name ?? "Author"}
          </p>
          {blog.author?.role && (
            <p className="text-[11px] text-gray-400 mt-0.5">
              {blog.author.role}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
