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

export default function StudentAnalytics() {
  const { user } = useAuth();

  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    if (user?._id) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    try {
      const res = await API.get("/analytics/student");
      setStats(res.data);

      const coursesRes = await API.get("/courses");

      const userId = user._id;

      const enrolled = coursesRes.data.filter((course) =>
        course.students?.some((s) => s._id === userId),
      );

      const chart = await Promise.all(
        enrolled.map(async (course) => {
          const p = await API.get(`/progress/course/${course._id}`);

          return {
            name: course.title.slice(0, 12),
            progress: Number(p.data.progress),
          };
        }),
      );

      setChartData(chart);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Analytics</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Courses</p>
          <h2 className="text-xl font-bold">{stats.totalCourses}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Lessons Completed</p>
          <h2 className="text-xl font-bold">{stats.completedLessons}</h2>
        </div>

        <div className="bg-white p-4 rounded-xl shadow">
          <p className="text-sm text-gray-500">Progress</p>
          <h2 className="text-xl font-bold">{stats.progress}%</h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-xl shadow">
        <h2 className="mb-4 font-semibold">Course Progress</h2>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="progress" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
