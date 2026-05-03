import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { useState, useRef } from "react";
import {
  GripVertical,
  Trash2,
  Type,
  Code,
  Image as ImageIcon,
  Link,
  ChevronDown,
  ChevronUp,
  ImagePlus,
  CheckCircle,
  PlayCircle,
} from "lucide-react";

const TYPE_CONFIG = {
  TEXT: { label: "Text", icon: Type, color: "bg-gray-100   text-gray-600" },
  CODE: { label: "Code", icon: Code, color: "bg-blue-50    text-blue-600" },
  IMAGE: {
    label: "Image",
    icon: ImageIcon,
    color: "bg-emerald-50 text-emerald-600",
  },
  YOUTUBE: {
    label: "YouTube",
    icon: PlayCircle,
    color: "bg-red-50     text-red-600",
  },
  LINK: { label: "Link", icon: Link, color: "bg-amber-50   text-amber-600" },
};

const inputCls =
  "w-full bg-white border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-800 placeholder:text-gray-400 outline-none focus:border-blue-300 focus:ring-2 focus:ring-blue-50 transition-all";

function toEmbed(url = "") {
  if (url.includes("/embed/")) return url;
  const m = url.match(/(?:v=|youtu\.be\/)([^&?/\s]{11})/);
  return m ? `https://www.youtube.com/embed/${m[1]}` : url;
}

export default function SortableBlock({
  block,
  index,
  removeBlock,
  updateBlock,
  handleImageUpload,
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: index });

  const [collapsed, setCollapsed] = useState(false);
  const [textRows, setTextRows] = useState(5);
  const [imgDragOver, setImgDragOver] = useState(false);
  const fileInputRef = useRef(null);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : "auto",
  };

  const cfg = TYPE_CONFIG[block.type] ?? TYPE_CONFIG.TEXT;
  const Icon = cfg.icon;

  const applyImageFile = (file) => {
    if (!file || !file.type.startsWith("image/")) return;
    handleImageUpload(index, file);
  };

  const handleImgDrop = (e) => {
    e.preventDefault();
    setImgDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      applyImageFile(file);
      return;
    }
    const url = e.dataTransfer.getData("text/plain");
    if (url) updateBlock(index, "value", url);
  };

  const handleImgPaste = (e) => {
    const item = Array.from(e.clipboardData?.items ?? []).find((i) =>
      i.type.startsWith("image/"),
    );
    if (item) {
      e.preventDefault();
      applyImageFile(item.getAsFile());
    }
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-2xl overflow-hidden transition-shadow ${
        isDragging ? "shadow-xl border-blue-300" : "border-gray-100 shadow-sm"
      }`}
    >
      <div className="flex items-center gap-2 px-3 py-2.5 bg-gray-50 border-b border-gray-100">
        <button
          {...attributes}
          {...listeners}
          className="flex items-center justify-center w-6 h-6 rounded-lg text-gray-300 hover:text-gray-500 hover:bg-gray-200 transition-colors cursor-grab active:cursor-grabbing shrink-0 touch-none"
        >
          <GripVertical size={14} />
        </button>

        <span
          className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-black tracking-widest ${cfg.color} shrink-0`}
        >
          <Icon size={10} />
          {cfg.label}
        </span>

        <span className="text-[10px] text-gray-400 font-mono shrink-0">
          #{index + 1}
        </span>

        <div className="flex-1" />

        <button
          onClick={() => setCollapsed((v) => !v)}
          className="w-6 h-6 rounded-lg bg-white border border-gray-200 hover:bg-gray-100 flex items-center justify-center transition-colors shrink-0"
        >
          {collapsed ? (
            <ChevronDown size={12} className="text-gray-400" />
          ) : (
            <ChevronUp size={12} className="text-gray-400" />
          )}
        </button>

        <button
          onClick={() => removeBlock(index)}
          className="w-6 h-6 rounded-lg bg-red-50 hover:bg-red-100 flex items-center justify-center transition-colors shrink-0"
        >
          <Trash2 size={11} className="text-red-500" />
        </button>
      </div>

      {!collapsed && (
        <div className="p-3">
          {block.type === "TEXT" && (
            <div className="space-y-1.5">
              <textarea
                value={block.value}
                onChange={(e) => updateBlock(index, "value", e.target.value)}
                rows={textRows}
                placeholder="Write your paragraph here…"
                className={`${inputCls} resize-none leading-relaxed`}
                style={{ minHeight: "120px" }}
                onFocus={() => setTextRows((r) => Math.max(r, 8))}
              />
              <div className="flex items-center gap-2 justify-end">
                <span className="text-[10px] text-gray-400">
                  {block.value?.length ?? 0} chars
                </span>
                <button
                  onClick={() => setTextRows((r) => Math.max(3, r - 3))}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  ↑ Less
                </button>
                <button
                  onClick={() => setTextRows((r) => r + 3)}
                  className="text-[10px] text-gray-400 hover:text-gray-600 font-medium transition-colors"
                >
                  ↓ More
                </button>
              </div>
            </div>
          )}

          {block.type === "CODE" && (
            <div className="space-y-2">
              <select
                value={block.language || "javascript"}
                onChange={(e) => updateBlock(index, "language", e.target.value)}
                className={`${inputCls} text-[11px] font-bold`}
              >
                {[
                  "javascript",
                  "typescript",
                  "python",
                  "go",
                  "rust",
                  "java",
                  "c",
                  "cpp",
                  "css",
                  "html",
                  "bash",
                  "sql",
                  "json",
                  "yaml",
                  "jsx",
                  "tsx",
                ].map((l) => (
                  <option key={l} value={l}>
                    {l}
                  </option>
                ))}
              </select>

              <div className="rounded-xl overflow-hidden border border-gray-700">
                <div
                  className="flex items-center gap-1.5 px-3 py-2 border-b border-gray-700"
                  style={{ background: "#1e1e2e" }}
                >
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#ff5f57" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#febc2e" }}
                  />
                  <span
                    className="w-2 h-2 rounded-full"
                    style={{ background: "#28c840" }}
                  />
                  <span
                    className="text-[10px] font-mono ml-1"
                    style={{ color: "#6c7086" }}
                  >
                    {block.language || "javascript"}
                  </span>
                </div>
                <textarea
                  value={block.value}
                  onChange={(e) => updateBlock(index, "value", e.target.value)}
                  rows={8}
                  placeholder={`// ${block.language || "code"} here…`}
                  spellCheck={false}
                  className="w-full outline-none resize-none text-xs leading-relaxed p-3 font-mono"
                  style={{
                    background: "#1e1e2e",
                    color: "#cdd6f4",
                    minHeight: "160px",
                    tabSize: 2,
                  }}
                />
              </div>
            </div>
          )}

          {block.type === "IMAGE" && (
            <div className="space-y-2">
              {block.preview || block.value ? (
                <div className="relative rounded-xl overflow-hidden border border-gray-100">
                  <img
                    src={block.preview || block.value}
                    alt="block"
                    className="w-full object-cover"
                    style={{ maxHeight: "220px" }}
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                    <label className="cursor-pointer flex items-center gap-1.5 bg-white/90 px-3 py-1.5 rounded-xl text-xs font-bold text-gray-800">
                      <ImagePlus size={13} /> Replace
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => applyImageFile(e.target.files[0])}
                      />
                    </label>
                  </div>
                  <div className="absolute top-2 right-2 flex items-center gap-1 bg-white/90 px-2 py-1 rounded-lg">
                    <CheckCircle size={10} className="text-emerald-500" />
                    <span className="text-[9px] font-bold text-gray-700">
                      Set
                    </span>
                  </div>
                </div>
              ) : (
                <div
                  onDragOver={(e) => {
                    e.preventDefault();
                    setImgDragOver(true);
                  }}
                  onDragLeave={() => setImgDragOver(false)}
                  onDrop={handleImgDrop}
                  onPaste={handleImgPaste}
                  tabIndex={0}
                  className={`flex flex-col items-center gap-2.5 py-10 border-2 border-dashed rounded-xl transition-all outline-none cursor-pointer ${
                    imgDragOver
                      ? "border-emerald-400 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300 hover:bg-emerald-50/50"
                  }`}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${imgDragOver ? "bg-emerald-100" : "bg-gray-100"}`}
                  >
                    <ImagePlus
                      size={18}
                      className={
                        imgDragOver ? "text-emerald-600" : "text-gray-400"
                      }
                    />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-semibold text-gray-600">
                      {imgDragOver ? "Drop to upload" : "Drop, paste or click"}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      Supports PNG, JPG, GIF, WebP
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-1">
                    <kbd className="px-2 py-0.5 bg-gray-100 border border-gray-200 rounded text-[10px] font-bold text-gray-500">
                      Ctrl+V
                    </kbd>
                    <span className="text-[10px] text-gray-400">to paste</span>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => applyImageFile(e.target.files[0])}
                  />
                </div>
              )}
            </div>
          )}

          {block.type === "YOUTUBE" && (
            <div className="space-y-2.5">
              <input
                value={block.value}
                onChange={(e) => updateBlock(index, "value", e.target.value)}
                placeholder="https://youtube.com/watch?v=… or embed URL"
                className={inputCls}
              />
              {block.value?.trim() && (
                <div
                  className="rounded-xl overflow-hidden border border-gray-100"
                  style={{
                    position: "relative",
                    paddingBottom: "56.25%",
                    height: 0,
                  }}
                >
                  <iframe
                    src={toEmbed(block.value)}
                    title="YouTube preview"
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
              )}
            </div>
          )}

          {block.type === "LINK" && (
            <div className="space-y-2">
              <input
                value={block.value}
                onChange={(e) => updateBlock(index, "value", e.target.value)}
                placeholder="https://example.com"
                className={inputCls}
              />
              {block.value?.trim() && (
                <a
                  href={block.value}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-bold text-amber-700 hover:bg-amber-100 transition-colors"
                  style={{ wordBreak: "break-all" }}
                >
                  <Link size={10} />
                  {block.value}
                </a>
              )}
            </div>
          )}
        </div>
      )}

      {collapsed && block.value && (
        <div className="px-4 py-2 border-t border-gray-100">
          <p className="text-[11px] text-gray-400 truncate font-mono">
            {block.value.slice(0, 80)}
            {block.value.length > 80 ? "…" : ""}
          </p>
        </div>
      )}
    </div>
  );
}
