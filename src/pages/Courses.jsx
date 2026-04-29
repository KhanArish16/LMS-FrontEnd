import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import SearchFilter from "../components/SearchFilter";
import { getCourses } from "../services/courseServices";
import useDebounce from "../hooks/useDebounce";
import { Loader } from "../components/Loader";
import { Search, HelpCircle } from "lucide-react";

export default function Courses() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [params, setParams] = useSearchParams();
  const [search, setSearch] = useState(params.get("search") || "");
  const [category, setCategory] = useState(params.get("category") || "");
  const [level, setLevel] = useState(params.get("level") || "");
  const [sort, setSort] = useState(params.get("sort") || "");

  const debouncedSearch = useDebounce(search, 500);

  useEffect(() => {
    const newParams = {};
    if (debouncedSearch) newParams.search = debouncedSearch;
    if (category) newParams.category = category;
    if (level) newParams.level = level;
    if (sort) newParams.sort = sort;

    setParams(newParams);
  }, [debouncedSearch, category, level, sort]);

  useEffect(() => {
    fetchCourses();
  }, [debouncedSearch, category, level, sort]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const res = await getCourses({
        search: debouncedSearch,
        category,
        level,
        sort,
      });

      const coursesArray = Array.isArray(res.data)
        ? res.data
        : res.data?.data || [];

      setCourses(coursesArray);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3 pt-1">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Courses</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {courses.length > 0
                ? `${courses.length} course${courses.length !== 1 ? "s" : ""} available`
                : "Test your knowledge"}
            </p>
          </div>
          {courses.length > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-bold text-amber-600">
              <HelpCircle size={12} /> {courses.length} Course
              {courses.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>
        <SearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          level={level}
          setLevel={setLevel}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div
        className="flex-1 overflow-y-auto pt-4 pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        )}

        {!loading && courses.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-gray-100">
            <div className="bg-gray-50 p-4 rounded-full mb-4">
              <Search className="text-gray-300" size={32} />
            </div>
            <p className="font-bold text-gray-900">No courses found</p>
            <p className="text-sm text-gray-500 mt-1">
              Try adjusting your filters or search term
            </p>
            <button
              onClick={() => {
                setSearch("");
                setCategory("");
                setLevel("");
                setSort("");
              }}
              className="mt-6 text-xs font-bold text-indigo-600 hover:underline underline-offset-4"
            >
              Clear all filters
            </button>
          </div>
        )}

        {!loading && courses.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
            {courses.map((course) => (
              <CourseCard key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
