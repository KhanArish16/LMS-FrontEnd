import {
  Search,
  SlidersHorizontal,
  ArrowDownUp,
  ChevronDown,
  X,
} from "lucide-react";
import { useState } from "react";

const CAT = {
  DSA: {
    inactive: "bg-blue-50   text-blue-400   border-blue-200",
    active: "bg-blue-500   text-white border-blue-500",
  },
  FRONTEND: {
    inactive: "bg-violet-50 text-violet-400 border-violet-200",
    active: "bg-violet-500 text-white border-violet-500",
  },
  BACKEND: {
    inactive: "bg-orange-50 text-orange-400 border-orange-200",
    active: "bg-orange-500 text-white border-orange-500",
  },
  FULLSTACK: {
    inactive: "bg-indigo-50 text-indigo-400 border-indigo-200",
    active: "bg-indigo-500 text-white border-indigo-500",
  },
  MOBILE: {
    inactive: "bg-pink-50   text-pink-400   border-pink-200",
    active: "bg-pink-500   text-white border-pink-500",
  },
  DATA_SCIENCE: {
    inactive: "bg-teal-50   text-teal-400   border-teal-200",
    active: "bg-teal-500   text-white border-teal-500",
  },
  AI_ML: {
    inactive: "bg-purple-50 text-purple-400 border-purple-200",
    active: "bg-purple-500 text-white border-purple-500",
  },
  CYBER_SECURITY: {
    inactive: "bg-red-50    text-red-400    border-red-200",
    active: "bg-red-500    text-white border-red-500",
  },
  DEVOPS: {
    inactive: "bg-cyan-50   text-cyan-400   border-cyan-200",
    active: "bg-cyan-500   text-white border-cyan-500",
  },
  CLOUD_COMPUTING: {
    inactive: "bg-sky-50    text-sky-400    border-sky-200",
    active: "bg-sky-500    text-white border-sky-500",
  },
  UI_UX: {
    inactive: "bg-rose-50   text-rose-400   border-rose-200",
    active: "bg-rose-500   text-white border-rose-500",
  },
  OTHER: {
    inactive: "bg-gray-100  text-gray-400   border-gray-200",
    active: "bg-gray-600   text-white border-gray-600",
  },
};

const CATEGORIES = Object.keys(CAT);
const MOBILE_CAP = 5;

function label(cat) {
  const map = {
    DATA_SCIENCE: "Data Science",
    AI_ML: "AI / ML",
    CYBER_SECURITY: "Cyber Sec",
    CLOUD_COMPUTING: "Cloud",
  };
  return map[cat] ?? cat.replace(/_/g, " ");
}

export default function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  level,
  setLevel,
  sort,
  setSort,
}) {
  const [showAll, setShowAll] = useState(false);

  const mobileCats = showAll ? CATEGORIES : CATEGORIES.slice(0, MOBILE_CAP);

  return (
    <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-md border-b border-gray-100 pb-3 pt-3">
      <div className="flex gap-2 items-center mb-3">
        <div className="flex items-center gap-2 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 flex-1 min-w-0 transition-all focus-within:bg-white focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50">
          <Search size={14} className="text-gray-400 shrink-0" />
          <input
            placeholder="Search courses..."
            className="bg-transparent outline-none w-full text-sm text-blue-600 placeholder:text-gray-400 font-medium min-w-0"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button onClick={() => setSearch("")} className="shrink-0">
              <X
                size={13}
                className="text-gray-400 hover:text-gray-600 transition-colors"
              />
            </button>
          )}
        </div>

        <div className="relative shrink-0">
          <SlidersHorizontal
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
          />
          <ChevronDown
            size={10}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400"
          />
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value)}
            className={`pl-7 pr-6 py-2.5 text-[11px] font-bold rounded-xl border appearance-none cursor-pointer outline-none transition-all w-22 sm:w-26 ${
              level
                ? " border-blue-400 text-blue-400"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white hover:border-blue-400"
            }`}
          >
            <option value="">LEVEL</option>
            <option value="BEGINNER">BEGINNER</option>
            <option value="INTERMEDIATE">INTERMEDIATE</option>
            <option value="ADVANCED">ADVANCED</option>
          </select>
        </div>

        <div className="relative shrink-0 ">
          <ArrowDownUp
            size={12}
            className="absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 "
          />
          <ChevronDown
            size={10}
            className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400 "
          />
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`pl-7 pr-6 py-2.5 text-[11px] font-bold rounded-xl border appearance-none cursor-pointer outline-none transition-all w-19 sm:w-23 hover:border-blue-400 ${
              sort
                ? " border-blue-400 text-blue-400"
                : "bg-gray-50 border-gray-200 text-gray-600 hover:bg-white"
            }`}
          >
            <option value="">SORT</option>
            <option value="latest">LATEST</option>
            <option value="oldest">OLDEST</option>
          </select>
        </div>
      </div>

      <div
        className="hidden md:flex items-center gap-1.5 overflow-x-auto"
        style={{ scrollbarWidth: "none" }}
      >
        <Pill
          label="All"
          active={!category}
          onClick={() => setCategory("")}
          cls={
            !category
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-gray-100 text-gray-600 border-gray-200 hover:border-gray-400 hover:text-gray-800"
          }
        />
        {CATEGORIES.map((cat) => (
          <Pill
            key={cat}
            label={label(cat)}
            active={category === cat}
            onClick={() => setCategory(cat)}
            cls={category === cat ? CAT[cat].active : CAT[cat].inactive}
          />
        ))}
      </div>

      <div className="flex md:hidden flex-wrap gap-1.5">
        <Pill
          label="All"
          active={!category}
          onClick={() => setCategory("")}
          cls={
            !category
              ? "bg-gray-900 text-white border-gray-900"
              : "bg-gray-100 text-gray-600 border-gray-200"
          }
        />

        {mobileCats.map((cat) => (
          <Pill
            key={cat}
            label={label(cat)}
            active={category === cat}
            onClick={() => setCategory(cat)}
            cls={category === cat ? CAT[cat].active : CAT[cat].inactive}
          />
        ))}

        {category && !mobileCats.includes(category) && (
          <Pill
            label={label(category)}
            active
            onClick={() => {}}
            cls={
              CAT[category]?.active ?? "bg-gray-900 text-white border-gray-900"
            }
          />
        )}

        <button
          onClick={() => setShowAll((v) => !v)}
          className="shrink-0 px-2.5 py-1 text-[11px] font-bold text-gray-500 border border-dashed border-gray-300 hover:border-gray-500 hover:text-gray-700 transition-all"
          style={{ borderRadius: "6px" }}
        >
          {showAll ? "Less ↑" : `+${CATEGORIES.length - MOBILE_CAP} more`}
        </button>
      </div>
    </div>
  );
}

function Pill({ label, active, onClick, cls }) {
  return (
    <button
      onClick={onClick}
      className={`shrink-0 px-3 py-1 text-[11px] font-bold tracking-wide border transition-all cursor-pointer ${cls}`}
      style={{ borderRadius: "6px" }}
    >
      {label}
    </button>
  );
}
