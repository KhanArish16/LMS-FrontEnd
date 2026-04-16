import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../services/api";

function CourseDetail() {
  const { id } = useParams();
  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourse();
  }, [id]);

  const fetchCourse = async () => {
    try {
      const res = await API.get(`/courses/${id}`);
      setCourse(res.data);
    } catch (error) {
      console.error("Error fetching course:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;

  if (!course) return <p>Course not found</p>;

  return (
    <div>
      {/* HEADER */}
      <div className="bg-white p-6 rounded-xl shadow">
        <h1 className="text-3xl font-bold">{course.title}</h1>

        <p className="text-gray-500 mt-2">{course.description}</p>

        <div className="flex gap-3 mt-4">
          <span className="bg-blue-100 px-3 py-1 rounded text-sm">
            {course.category}
          </span>

          <span className="bg-gray-100 px-3 py-1 rounded text-sm">
            {course.level}
          </span>
        </div>

        <p className="mt-4 text-sm text-gray-600">
          Instructor: {course.instructor?.name}
        </p>
      </div>

      {/* PLACEHOLDER FOR NEXT */}
      <div className="mt-6 bg-white p-6 rounded-xl shadow">
        <h2 className="text-xl font-semibold">Course Content</h2>

        <p className="text-gray-500 mt-2">
          Modules and lessons will appear here...
        </p>
      </div>
    </div>
  );
}

export default CourseDetail;
