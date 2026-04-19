import { useEffect, useState } from "react";
import API from "../services/api";

export default function InstructorDashboard() {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetchInstructorCourses();
  }, []);

  const fetchInstructorCourses = async () => {
    try {
      const res = await API.get("/courses");
      setCourses(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Instructor Dashboard</h1>

      <div className="grid grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Total Courses</p>
          <h2 className="text-xl font-bold">{courses.length}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Students</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Revenue</p>
          <h2 className="text-xl font-bold">--</h2>
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">Your Courses</h2>

        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id} className="bg-white p-4 rounded-xl shadow">
              <h3 className="font-semibold">{course.title}</h3>
              <p className="text-sm text-gray-500">{course.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
