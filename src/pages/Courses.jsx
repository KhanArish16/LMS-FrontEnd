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
  }, [debouncedSearch, category, level]);

  useEffect(() => {
    fetchCourses();
  }, [debouncedSearch, category, level, sort]);

  const fetchCourses = async () => {
    try {
      setLoading(true);

      const data = await getCourses({
        search: debouncedSearch,
        category,
        level,
        sort,
      });

      setCourses(data);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {/* <h1 className="text-2xl font-bold mb-4">All Courses</h1> */}

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

      {loading && <p>Loading courses...</p>}

      {!loading && courses.length === 0 && <p>No courses found</p>}

      <div className="grid grid-cols-3 gap-6 ">
        {courses.map((course) => (
          <CourseCard key={course._id} course={course} />
        ))}
      </div>
    </div>
  );
}
