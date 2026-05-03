import { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getBlogById, deleteBlog } from "../services/blogServices";
import { useAuth } from "../context/AuthContext";
import { Loader } from "../components/Loader";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  Pencil,
  Trash2,
  Copy,
  Check,
  ExternalLink,
  Tag,
  BookOpen,
} from "lucide-react";

let hljsReady = false;
function loadHljs(cb) {
  if (hljsReady || window.hljs) {
    hljsReady = true;
    cb();
    return;
  }
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href =
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css";
  document.head.appendChild(link);
  const script = document.createElement("script");
  script.src =
    "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js";
  script.onload = () => {
    hljsReady = true;
    cb();
  };
  document.head.appendChild(script);
}

const CAT_STYLE = {
  DSA: "bg-blue-50 text-blue-700 border-blue-200",
  FRONTEND: "bg-violet-50 text-violet-700 border-violet-200",
  BACKEND: "bg-orange-50 text-orange-700 border-orange-200",
  FULLSTACK: "bg-indigo-50 text-indigo-700 border-indigo-200",
  MOBILE: "bg-pink-50 text-pink-700 border-pink-200",
  DATA_SCIENCE: "bg-teal-50 text-teal-700 border-teal-200",
  AI_ML: "bg-purple-50 text-purple-700 border-purple-200",
  CYBER_SECURITY: "bg-red-50 text-red-700 border-red-200",
  DEVOPS: "bg-cyan-50 text-cyan-700 border-cyan-200",
  CLOUD_COMPUTING: "bg-sky-50 text-sky-700 border-sky-200",
  UI_UX: "bg-rose-50 text-rose-700 border-rose-200",
  OTHER: "bg-gray-100 text-gray-600 border-gray-200",
};

function CodeBlock({ value, language, isCopied, onCopy }) {
  const codeRef = useRef(null);

  useEffect(() => {
    loadHljs(() => {
      if (
        codeRef.current &&
        window.hljs &&
        !codeRef.current.dataset.highlighted
      ) {
        window.hljs.highlightElement(codeRef.current);
      }
    });
  }, [value]);

  return (
    <div className="rounded-xl border border-gray-200 overflow-hidden my-2">
      <div
        className="flex items-center justify-between px-3 py-2 border-b border-gray-700"
        style={{ background: "#282c34" }}
      >
        <div className="flex items-center gap-1.5">
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#ff5f57" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#febc2e" }}
          />
          <span
            className="w-2.5 h-2.5 rounded-full"
            style={{ background: "#28c840" }}
          />
        </div>
        <span
          className="text-[10px] font-mono uppercase tracking-widest"
          style={{ color: "#6b7280" }}
        >
          {language || "code"}
        </span>
        <button
          onClick={onCopy}
          className="flex items-center gap-1 text-[11px] font-semibold transition-colors"
          style={{ color: isCopied ? "#86efac" : "#9ca3af" }}
        >
          {isCopied ? (
            <>
              <Check size={11} /> Copied
            </>
          ) : (
            <>
              <Copy size={11} /> Copy
            </>
          )}
        </button>
      </div>

      <div
        style={{
          background: "#282c34",
          overflowX: "auto",
          overflowY: "hidden",
          WebkitOverflowScrolling: "touch",
        }}
      >
        <pre
          style={{
            margin: 0,
            padding: "1rem",
            background: "transparent",
            minWidth: "fit-content",
          }}
        >
          <code
            ref={codeRef}
            className={language ? `language-${language}` : ""}
            style={{
              fontFamily: "ui-monospace, Menlo, monospace",
              fontSize: "13px",
              lineHeight: 1.6,
              background: "transparent",
            }}
          >
            {value}
          </code>
        </pre>
      </div>
    </div>
  );
}

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
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await getBlogById(id);
        if (mounted) setBlog(res.data?.data ?? null);
      } catch {
        if (mounted) setError("Failed to load blog");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [id]);

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteBlog(id);
      toast.success("Blog deleted");
      navigate("/blogs");
    } catch {
      toast.error("Failed to delete blog");
      setDeleting(false);
      setConfirmDelete(false);
    }
  };

  const copyCode = (code, i) => {
    navigator.clipboard.writeText(code || "");
    setCopiedIndex(i);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

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
          className="text-xs text-blue-600 font-bold hover:underline mt-1"
        >
          ← Back to blogs
        </button>
      </div>
    );

  if (!blog)
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-2">
        <p className="text-sm text-gray-400">Blog not found.</p>
        <button
          onClick={() => navigate("/blogs")}
          className="text-xs text-blue-600 font-bold hover:underline"
        >
          ← Back
        </button>
      </div>
    );

  return (
    <div className="w-full min-w-0 max-w-3xl mx-auto pb-16">
      <div className="flex flex-wrap items-center gap-2 py-4 mb-2">
        <button
          onClick={() => navigate("/blogs")}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-600 transition-colors shrink-0"
        >
          <ArrowLeft size={13} /> Back
        </button>

        {isOwner && !confirmDelete && (
          <div className="flex items-center gap-2 ml-auto">
            <button
              onClick={() => navigate(`/blogs/${id}/edit`)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-xs font-bold text-gray-700 transition-colors shrink-0"
            >
              <Pencil size={12} /> Edit
            </button>
            <button
              onClick={() => setConfirmDelete(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-xs font-bold text-red-600 border border-red-100 transition-colors shrink-0"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        )}

        {isOwner && confirmDelete && (
          <div className="flex items-center gap-2 ml-auto flex-wrap">
            <span className="text-xs text-gray-500 font-medium shrink-0">
              Sure?
            </span>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-3 py-1.5 rounded-xl bg-red-500 text-white text-xs font-bold hover:bg-red-600 transition-colors disabled:opacity-60 shrink-0"
            >
              {deleting ? "Deleting…" : "Yes"}
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

      <div className="mb-6">
        <div className="flex items-center gap-2.5 mb-4">
          {blog.author?.profilePic ? (
            <img
              src={blog.author.profilePic}
              alt={blog.author.name}
              className="w-9 h-9 rounded-full object-cover shrink-0 ring-2 ring-gray-100"
            />
          ) : (
            <div className="w-9 h-9 rounded-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shrink-0">
              <span className="text-[11px] font-bold text-white">
                {initials}
              </span>
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-gray-800 leading-none truncate">
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

        {blog.category && (
          <div className="mb-3">
            <span
              className={`inline-block px-2 py-0.5 text-[10px] font-black tracking-widest border ${catCls}`}
              style={{ borderRadius: "4px" }}
            >
              {blog.category.replace(/_/g, " ")}
            </span>
          </div>
        )}

        <h1
          className="font-bold text-gray-900 leading-snug pb-5 border-b border-gray-100"
          style={{ fontSize: "clamp(1.125rem, 4vw, 1.875rem)" }}
        >
          {blog.title}
        </h1>
      </div>

      {blog.thumbnail && (
        <div className="rounded-2xl overflow-hidden mb-8 border border-gray-100">
          <img
            src={blog.thumbnail}
            alt={blog.title}
            className="w-full h-auto object-cover"
            style={{ maxHeight: "clamp(160px, 45vw, 420px)" }}
          />
        </div>
      )}

      <div className="space-y-5">
        {blog.content?.map((block, i) => {
          switch (block.type) {
            case "TEXT":
              return (
                <p
                  key={i}
                  className="text-gray-700 leading-relaxed"
                  style={{ fontSize: "clamp(13px, 2.5vw, 15px)" }}
                >
                  {block.value}
                </p>
              );

            case "CODE":
              return (
                <CodeBlock
                  key={i}
                  value={block.value}
                  language={block.language}
                  isCopied={copiedIndex === i}
                  onCopy={() => copyCode(block.value, i)}
                />
              );

            case "IMAGE":
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-gray-100"
                >
                  <img
                    src={block.value}
                    alt="content"
                    className="w-full h-auto"
                  />
                </div>
              );

            case "YOUTUBE": {
              const src = block.value.includes("embed")
                ? block.value
                : block.value.replace("watch?v=", "embed/");
              return (
                <div
                  key={i}
                  className="rounded-2xl overflow-hidden border border-gray-100"
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={src}
                    title="YouTube"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </div>
              );
            }

            case "LINK":
              return (
                <div
                  key={i}
                  style={{ wordBreak: "break-word", overflowWrap: "anywhere" }}
                >
                  <a
                    key={i}
                    href={block.value}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-start gap-1.5 text-sm font-semibold text-blue-600 hover:text-blue-700 underline underline-offset-2 transition-colors"
                  >
                    <span>{block.value}</span>
                    <ExternalLink size={13} className="shrink-0 mt-0.5" />
                  </a>
                </div>
              );

            default:
              return null;
          }
        })}
      </div>

      {blog.tags?.length > 0 && (
        <div className="mt-10 pt-6 border-t border-gray-100 flex flex-wrap items-center gap-2">
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
      )}
    </div>
  );
}
