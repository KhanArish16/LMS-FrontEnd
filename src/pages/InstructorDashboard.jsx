import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    if (user?._id) fetchInstructorCourses();
  }, [user]);

  const fetchInstructorCourses = async () => {
    try {
      const res = await API.get("/courses");

      const userId = user._id;

      const myCourses = res.data.filter(
        (course) => course.instructor?._id === userId,
      );

      setCourses(myCourses);
    } catch (err) {
      console.log(err);
    }
  };

  const totalStudents = courses.reduce(
    (acc, course) => acc + (course.students?.length || 0),
    0,
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Courses</p>
          <h2 className="text-xl font-bold">{courses.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Students</p>
          <h2 className="text-xl font-bold">{totalStudents}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Your Courses</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold">{course.title}</h3>

              <p className="text-sm text-gray-500 mt-1">{course.description}</p>

              <p className="text-xs text-gray-400 mt-2">
                {course.students?.length || 0} students enrolled
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
