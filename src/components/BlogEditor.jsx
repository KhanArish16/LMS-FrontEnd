import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { createBlog, updateBlog, getBlogById } from "../services/blogServices";
import { Loader } from "./Loader";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import SortableBlock from "../components/SortableBlock";
import {
  BookOpen,
  Tag,
  ImagePlus,
  CheckCircle,
  X,
  Plus,
  Type,
  Code,
  Image,
  Link,
  FileText,
  Eye,
  EyeOff,
  ChevronDown,
  PlayCircle,
} from "lucide-react";

const CATEGORIES = ["GENERAL", "DSA", "FRONTEND", "BACKEND", "FULLSTACK"];

const CAT_STYLE = {
  GENERAL: "bg-gray-100  text-gray-700   border-gray-300",
  DSA: "bg-blue-50   text-blue-700   border-blue-200",
  FRONTEND: "bg-violet-50 text-violet-700 border-violet-200",
  BACKEND: "bg-orange-50 text-orange-700 border-orange-200",
  FULLSTACK: "bg-indigo-50 text-indigo-700 border-indigo-200",
};

const BLOCK_TYPES = [
  {
    type: "TEXT",
    label: "Text",
    icon: Type,
    color: "bg-gray-50    text-gray-600   border-gray-200",
  },
  {
    type: "CODE",
    label: "Code",
    icon: Code,
    color: "bg-blue-50    text-blue-600   border-blue-200",
  },
  {
    type: "IMAGE",
    label: "Image",
    icon: Image,
    color: "bg-emerald-50 text-emerald-600 border-emerald-200",
  },
  {
    type: "YOUTUBE",
    label: "YouTube",
    icon: PlayCircle,
    color: "bg-red-50     text-red-600    border-red-200",
  },
  {
    type: "LINK",
    label: "Link",
    icon: Link,
    color: "bg-amber-50   text-amber-600  border-amber-200",
  },
];

function Field({ label, children, hint }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
        {label}
      </label>
      {children}
      {hint && <p className="text-[10px] text-gray-400 mt-1">{hint}</p>}
    </div>
  );
}

function Input({ className = "", ...props }) {
  return (
    <input
      className={`w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all ${className}`}
      {...props}
    />
  );
}

export default function BlogEditor({ mode }) {
  const navigate = useNavigate();
  const { id } = useParams();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("GENERAL");
  const [tagInput, setTagInput] = useState("");
  const [tags, setTags] = useState([]);
  const [isPublished, setIsPublished] = useState(true);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState("");
  const [content, setContent] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [dragging, setDragging] = useState(false);

  useEffect(() => {
    if (mode === "edit" && id) fetchBlog();
  }, [mode, id]);

  const fetchBlog = async () => {
    setLoading(true);
    try {
      const res = await getBlogById(id);
      const blog = res.data.data;
      setTitle(blog.title);
      setCategory(blog.category || "GENERAL");
      setTags(blog.tags || []);
      setIsPublished(blog.isPublished ?? true);
      setThumbnailPreview(blog.thumbnail);
      setContent(blog.content);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTag = (e) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) setTags([...tags, tagInput.trim()]);
      setTagInput("");
    }
  };
  const removeTag = (tag) => setTags(tags.filter((t) => t !== tag));

  const setThumbnail = (file) => {
    if (!file) return;
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };
  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    setThumbnail(e.dataTransfer.files[0]);
  };

  const addBlock = (type) =>
    setContent([
      ...content,
      { type, value: "", file: null, preview: "", language: "" },
    ]);
  const removeBlock = (i) => setContent(content.filter((_, idx) => idx !== i));
  const updateBlock = (i, field, value) => {
    const updated = [...content];
    updated[i][field] = value;
    setContent(updated);
  };
  const handleImageUpload = (i, file) => {
    const updated = [...content];
    updated[i].file = file;
    updated[i].preview = URL.createObjectURL(file);
    setContent(updated);
  };

  const handleSubmit = async () => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("title", title);
      fd.append("category", category);
      fd.append("isPublished", isPublished);
      fd.append("tags", JSON.stringify(tags));
      if (thumbnailFile) fd.append("thumbnail", thumbnailFile);

      const cleanContent = content.map((block) => ({
        type: block.type,
        value: block.value || "",
        language: block.language || "",
      }));
      fd.append("content", JSON.stringify(cleanContent));

      content.forEach((block, i) => {
        if (block.type === "IMAGE" && block.file)
          fd.append(`image_${i}`, block.file);
      });

      if (mode === "create") await createBlog(fd);
      else await updateBlog(id, fd);

      navigate("/blogs");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <Loader />
      </div>
    );

  return (
    <div className="w-full max-w-3xl mx-auto pb-16 space-y-5">
      <div className="flex items-center justify-between pt-2 pb-1">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-sm shadow-blue-200">
            <BookOpen size={15} className="text-white" />
          </div>
          <h1 className="text-lg font-bold text-gray-900">
            {mode === "create" ? "New Blog Post" : "Edit Blog Post"}
          </h1>
        </div>

        <button
          onClick={() => setIsPublished((v) => !v)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all ${
            isPublished
              ? "bg-emerald-50 border-emerald-200 text-emerald-700"
              : "bg-gray-100 border-gray-200 text-gray-500"
          }`}
        >
          {isPublished ? <Eye size={12} /> : <EyeOff size={12} />}
          {isPublished ? "Published" : "Draft"}
        </button>
      </div>

      <Field label="Blog Title">
        <Input
          placeholder="e.g. How to build a REST API with Node.js"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </Field>

      <Field label="Category">
        <div className="flex flex-wrap gap-1.5">
          {CATEGORIES.map((cat) => {
            const isActive = category === cat;
            return (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`px-3 py-1.5 text-[11px] font-black tracking-widest border transition-all ${
                  isActive
                    ? CAT_STYLE[cat]
                    : "bg-white border-gray-200 text-gray-400 hover:border-gray-400 hover:text-gray-700"
                }`}
                style={{ borderRadius: "6px" }}
              >
                {cat}
              </button>
            );
          })}
        </div>
      </Field>

      <Field label="Tags" hint="Press Enter to add a tag">
        <div
          className={`bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all ${tags.length > 0 ? "pb-2" : ""}`}
        >
          {tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mb-2">
              {tags.map((tag, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1 px-2 py-0.5 bg-blue-50 border border-blue-100 text-blue-700 text-[11px] font-bold"
                  style={{ borderRadius: "6px" }}
                >
                  {tag}
                  <button
                    onClick={() => removeTag(tag)}
                    className="text-blue-400 hover:text-blue-700 transition-colors leading-none"
                  >
                    <X size={10} />
                  </button>
                </span>
              ))}
            </div>
          )}
          <div className="flex items-center gap-2">
            <Tag size={13} className="text-gray-400 shrink-0" />
            <input
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              onKeyDown={handleAddTag}
              placeholder="Type a tag and press Enter…"
              className="bg-transparent outline-none text-sm text-gray-800 placeholder:text-gray-400 w-full"
            />
          </div>
        </div>
      </Field>

      <Field
        label="Thumbnail"
        hint={
          mode === "edit"
            ? "Upload a new image to replace the current thumbnail"
            : undefined
        }
      >
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setDragging(true);
          }}
          onDragLeave={() => setDragging(false)}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl overflow-hidden transition-all ${
            dragging
              ? "border-blue-400 bg-blue-50"
              : "border-gray-200 hover:border-gray-300 bg-gray-50"
          }`}
        >
          {thumbnailPreview ? (
            <div className="relative">
              <img
                src={thumbnailPreview}
                alt="Thumbnail"
                className="w-full object-cover"
                style={{ maxHeight: "220px" }}
              />

              <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                <label className="cursor-pointer flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800">
                  <ImagePlus size={13} /> Replace image
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => setThumbnail(e.target.files[0])}
                  />
                </label>
              </div>

              <div className="absolute top-2.5 right-2.5 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                <CheckCircle size={11} className="text-emerald-500" />
                <span className="text-[10px] font-semibold text-gray-700">
                  Set
                </span>
              </div>
            </div>
          ) : (
            <label className="cursor-pointer flex flex-col items-center gap-2 py-10">
              <div className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
                <ImagePlus size={18} className="text-gray-400" />
              </div>
              <div className="text-center">
                <p className="text-sm font-semibold text-gray-600">
                  Drop image here
                </p>
                <p className="text-xs text-gray-400 mt-0.5">
                  or click to browse
                </p>
              </div>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => setThumbnail(e.target.files[0])}
              />
            </label>
          )}
        </div>
      </Field>

      <div>
        <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-2 block">
          Content Blocks
        </label>

        <div className="flex flex-wrap gap-2 mb-4">
          {BLOCK_TYPES.map(({ type, label, icon: Icon, color }) => (
            <button
              key={type}
              onClick={() => addBlock(type)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-[11px] font-bold transition-all hover:opacity-80 ${color}`}
            >
              <Icon size={12} /> + {label}
            </button>
          ))}
        </div>

        {content.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 border-2 border-dashed border-gray-200 rounded-2xl gap-2">
            <FileText size={24} className="text-gray-300" />
            <p className="text-sm text-gray-400 font-medium">No blocks yet</p>
            <p className="text-xs text-gray-400">
              Click a button above to add content
            </p>
          </div>
        ) : (
          <DndContext
            collisionDetection={closestCenter}
            onDragEnd={({ active, over }) => {
              if (!over || active.id === over.id) return;
              const updated = [...content];
              const [moved] = updated.splice(active.id, 1);
              updated.splice(over.id, 0, moved);
              setContent(updated);
            }}
          >
            <SortableContext
              items={content.map((_, i) => i)}
              strategy={verticalListSortingStrategy}
            >
              <div className="space-y-2">
                {content.map((block, i) => (
                  <SortableBlock
                    key={i}
                    index={i}
                    block={block}
                    removeBlock={removeBlock}
                    updateBlock={updateBlock}
                    handleImageUpload={handleImageUpload}
                  />
                ))}
              </div>
            </SortableContext>
          </DndContext>
        )}
      </div>

      <div className="flex items-center gap-3 pt-2 border-t border-gray-100">
        <button
          onClick={() => navigate("/blogs")}
          className="flex-1 py-3 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="flex-1 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {saving
            ? "Saving…"
            : mode === "create"
              ? "Publish Blog"
              : "Update Blog"}
        </button>
      </div>
    </div>
  );
}
