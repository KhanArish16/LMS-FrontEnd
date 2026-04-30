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
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  const removeTag = (tag) => {
    setTags(tags.filter((t) => t !== tag));
  };

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

  const addBlock = (type) => {
    setContent([
      ...content,
      { type, value: "", file: null, preview: "", language: "" },
    ]);
  };

  const removeBlock = (i) => {
    setContent(content.filter((_, index) => index !== i));
  };

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
    setLoading(true);

    try {
      const fd = new FormData();

      fd.append("title", title);
      fd.append("category", category);
      fd.append("isPublished", isPublished);

      fd.append("tags", JSON.stringify(tags));

      if (thumbnailFile) {
        fd.append("thumbnail", thumbnailFile);
      }

      const cleanContent = content.map((block) => ({
        type: block.type,
        value: block.value || "",
        language: block.language || "",
      }));

      fd.append("content", JSON.stringify(cleanContent));

      content.forEach((block, i) => {
        if (block.type === "IMAGE" && block.file) {
          fd.append(`image_${i}`, block.file);
        }
      });

      if (mode === "create") {
        await createBlog(fd);
      } else {
        await updateBlog(id, fd);
      }

      navigate("/blogs");
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Loader />;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <input
        placeholder="Blog Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      />

      <select
        value={category}
        onChange={(e) => setCategory(e.target.value)}
        className="w-full border p-3 rounded mb-4"
      >
        <option>GENERAL</option>
        <option>FRONTEND</option>
        <option>BACKEND</option>
        <option>FULLSTACK</option>
        <option>DSA</option>
      </select>

      <div className="mb-4">
        <div className="flex flex-wrap gap-2 mb-2">
          {tags.map((tag, i) => (
            <div key={i} className="bg-gray-200 px-2 py-1 rounded flex gap-1">
              {tag}
              <button onClick={() => removeTag(tag)}>×</button>
            </div>
          ))}
        </div>

        <input
          value={tagInput}
          onChange={(e) => setTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="Press Enter to add tag"
          className="border p-2 w-full"
        />
      </div>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed p-4 mb-6 ${
          dragging ? "border-blue-400 bg-blue-50" : ""
        }`}
      >
        {thumbnailPreview ? (
          <img src={thumbnailPreview} className="w-full h-40 object-cover" />
        ) : (
          <input
            type="file"
            onChange={(e) => setThumbnail(e.target.files[0])}
          />
        )}
      </div>

      <div className="flex gap-2 mb-4 flex-wrap">
        <button onClick={() => addBlock("TEXT")}>+ Text</button>
        <button onClick={() => addBlock("IMAGE")}>+ Image</button>
        <button onClick={() => addBlock("CODE")}>+ Code</button>
        <button onClick={() => addBlock("YOUTUBE")}>+ YouTube</button>
      </div>

      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;
          if (!over || active.id === over.id) return;

          const oldIndex = active.id;
          const newIndex = over.id;

          const updated = [...content];
          const [moved] = updated.splice(oldIndex, 1);
          updated.splice(newIndex, 0, moved);

          setContent(updated);
        }}
      >
        <SortableContext
          items={content.map((_, i) => i)}
          strategy={verticalListSortingStrategy}
        >
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
        </SortableContext>
      </DndContext>

      <button
        onClick={handleSubmit}
        className="bg-black text-white px-5 py-2 mt-4"
      >
        {mode === "create" ? "Create Blog" : "Update Blog"}
      </button>
    </div>
  );
}
