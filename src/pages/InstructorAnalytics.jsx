import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

export default function InstructorAnalytics() {
  const { user } = useAuth();

  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await API.get("/analytics/instructor");
      setStats(res.data);

      const coursesRes = await API.get("/courses");

      const userId = user._id;

      const myCourses = coursesRes.data.filter(
        (course) => course.instructor?._id === userId,
      );

      const chart = myCourses.map((course) => ({
        name: course.title.slice(0, 12),
        students: course.students?.length || 0,
      }));

      setChartData(chart);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Instructor Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Courses</p>
          <h2 className="text-xl font-bold">{stats.totalCourses}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Students</p>
          <h2 className="text-xl font-bold">{stats.totalStudents}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Completion Rate</p>
          <h2 className="text-xl font-bold">{stats.completionRate}%</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="mb-4 font-semibold">Course Popularity</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="students" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
