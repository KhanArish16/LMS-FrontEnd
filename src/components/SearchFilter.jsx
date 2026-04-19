import {
  Search,
  SlidersHorizontal,
  Code,
  Briefcase,
  ArrowDownUp,
  ChevronDown,
  X,
} from "lucide-react";

const iconMap = {
  "Software Engineering": Code,
  Business: Briefcase,
};

const categories = [
  "DSA",
  "FRONTEND",
  "BACKEND",
  "FULLSTACK",
  "MOBILE",
  "DATA_SCIENCE",
  "AI_ML",
  "CYBER_SECURITY",
  "DEVOPS",
  "CLOUD_COMPUTING",
  "UI_UX",
  "OTHER",
];

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
  return (
    <div className="sticky top-0 z-20 bg-gray-50/80 backdrop-blur-md pb-6 pt-2">
      <div className="flex flex-col md:flex-row gap-3 items-center">
        <div className="flex items-center bg-white rounded-2xl border border-gray-100 px-4 py-3 w-full md:flex-1 shadow-sm transition-all focus-within:ring-4 focus-within:ring-indigo-50 focus-within:border-indigo-200">
          <Search className="text-gray-400 mr-3" size={18} />
          <input
            placeholder="Search courses..."
            className="bg-transparent outline-none w-full text-sm font-medium text-gray-700 placeholder:text-gray-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="ml-1.5 shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={13} />
            </button>
          )}
        </div>

        <div className="flex flex-row gap-3 items-center">
          <div className="relative flex items-center group">
            <SlidersHorizontal
              size={16}
              className="absolute left-3 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none"
            />
            <select
              className="w-full sm:w-32 pl-9 pr-8 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer hover:border-indigo-400 transition-all outline-none"
              value={level}
              onChange={(e) => setLevel(e.target.value)}
            >
              <option value="">All Levels</option>
              <option value="BEGINNER">Beginner</option>
              <option value="INTERMEDIATE">Intermediate</option>
              <option value="ADVANCED">Advanced</option>
            </select>
          </div>

          <div className="relative flex items-center group">
            <ArrowDownUp
              size={16}
              className="absolute left-3 text-gray-400 group-hover:text-indigo-500 transition-colors pointer-events-none"
            />
            <select
              className="w-full sm:w-32 pl-9 pr-8 py-3 text-sm font-semibold text-gray-700 bg-white border border-gray-200 rounded-xl appearance-none cursor-pointer hover:border-indigo-400 transition-all outline-none"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="">Sort</option>
              <option value="latest">Latest</option>
              <option value="oldest">Oldest</option>
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-4 flex-wrap overflow-x-auto pb-2 ">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-lg text-xs font-bold tracking-wider 
      transition-all border shrink-0 cursor-pointer ${
        !category
          ? "bg-black border-black text-white shadow-md"
          : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
      }`}
        >
          All Domains
        </button>

        {categories.map((cat) => {
          const Icon = iconMap[cat];

          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-bold tracking-wider transition-all border shrink-0 cursor-pointer ${
                category === cat
                  ? "bg-black border-black text-white"
                  : "bg-white border-gray-200 text-gray-500 hover:border-gray-400"
              }`}
            >
              {Icon && <Icon size={14} />}
              {cat}
            </button>
          );
        })}
      </div>
    </div>
  );
}
