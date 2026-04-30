import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export default function SortableBlock({
  block,
  index,
  removeBlock,
  updateBlock,
  handleImageUpload,
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="border p-4 rounded bg-gray-50 mb-4"
    >
      <div className="flex justify-between mb-2">
        <span {...attributes} {...listeners} className="cursor-grab">
          ⠿ {block.type}
        </span>

        <button
          onClick={() => removeBlock(index)}
          className="text-red-500 text-xs"
        >
          Remove
        </button>
      </div>

      {block.type === "TEXT" && (
        <textarea
          value={block.value}
          onChange={(e) => updateBlock(index, "value", e.target.value)}
          className="w-full border p-2 rounded"
        />
      )}

      {block.type === "IMAGE" && (
        <>
          <input
            type="file"
            onChange={(e) => handleImageUpload(index, e.target.files[0])}
          />

          {(block.preview || block.value) && (
            <img src={block.preview || block.value} className="mt-2 rounded" />
          )}
        </>
      )}

      {block.type === "CODE" && (
        <>
          <input
            placeholder="Language"
            value={block.language || ""}
            onChange={(e) => updateBlock(index, "language", e.target.value)}
            className="w-full border p-2 mb-2"
          />

          <textarea
            value={block.value}
            onChange={(e) => updateBlock(index, "value", e.target.value)}
            className="w-full border p-2 bg-black text-green-400 rounded"
          />
        </>
      )}

      {block.type === "YOUTUBE" && (
        <>
          <input
            value={block.value}
            onChange={(e) => updateBlock(index, "value", e.target.value)}
            className="w-full border p-2"
          />

          {block.value && (
            <iframe src={block.value} className="w-full h-60 mt-2 rounded" />
          )}
        </>
      )}

      {block.type === "LINK" && (
        <input
          value={block.value}
          onChange={(e) => updateBlock(index, "value", e.target.value)}
          className="w-full border p-2"
        />
      )}
    </div>
  );
}
