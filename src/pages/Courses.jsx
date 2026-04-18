import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import CourseCard from "../components/CourseCard";
import SearchFilter from "../components/SearchFilter";
import { getCourses } from "../services/courseServices";
import useDebounce from "../hooks/useDebounce";

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

      setCourses(res.data || res);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
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

      {loading && (
        <div className="flex justify-center items-center mt-10">
          <p className="text-gray-500">Loading courses...</p>
        </div>
      )}

      {!loading && courses.length === 0 && (
        <div className="text-center mt-10 text-gray-500">
          <p>No courses found</p>
          <p className="text-sm mt-1">Try changing filters or search keyword</p>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-4">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
