import { Search, SlidersHorizontal, Code, Briefcase } from "lucide-react";

const iconMap = {
  "Software Engineering": Code,
  Business: Briefcase,
};

export default function SearchFilter({
  search,
  setSearch,
  category,
  setCategory,
  difficulty,
  setDifficulty,
  categories,
}) {
  return (
    <div className="sticky top-0 bg-gray-100 z-10 pb-4">
      <div className="flex gap-4 items-center">
        <div className="flex items-center bg-white rounded-full px-4 py-3 w-full shadow-sm">
          <Search className="text-gray-400 mr-2" size={18} />
          <input
            placeholder='Search "DSA"'
            className="bg-transparent outline-none w-full text-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 border px-4 py-3 rounded-lg bg-white">
          <SlidersHorizontal size={16} />
          <select
            className="outline-none text-sm bg-transparent"
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="">Difficulty</option>
            <option value="BEGINNER">Beginner</option>
            <option value="INTERMEDIATE">Intermediate</option>
            <option value="ADVANCED">Advanced</option>
          </select>
        </div>
      </div>

      <div className="flex gap-3 mt-4 overflow-x-auto">
        <button
          onClick={() => setCategory("")}
          className={`px-4 py-2 rounded-full text-sm ${
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
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm ${
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
