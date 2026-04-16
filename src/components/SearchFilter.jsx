import { Search, SlidersHorizontal, Code, Briefcase } from "lucide-react";

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
    <div className="sticky top-0  z-10 pb-4">
      <div className="flex gap-4 items-center">
        <div className="flex items-center bg-white rounded-full px-4 py-3 w-full shadow-sm cursor-pointer">
          <Search className="text-gray-400 mr-2 " size={18} />
          <input
            placeholder="Search courses..."
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border px-4 py-3 rounded-lg bg-white">
          <SlidersHorizontal size={16} />
          <select
            className="outline-none text-sm bg-transparent cursor-pointer"
            value={level}
            onChange={(e) => setLevel(e.target.value)}
          >
            <option value="">All Level</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>

        <div className="flex items-center gap-2 border px-4 py-3 rounded-lg bg-white">
          <select
            className="outline-none text-sm bg-transparent cursor-pointer"
            value={sort}
            onChange={(e) => setSort(e.target.value)}
          >
            <option value="">Sort</option>
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-4 flex-wrap">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-full text-sm  cursor-pointer ${
            !category ? "bg-blue-100 text-blue-600" : "bg-white"
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm  cursor-pointer ${
                category === cat ? "bg-blue-100 text-blue-600" : "bg-white"
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
