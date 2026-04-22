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
  CartesianGrid,
  Cell,
  LineChart,
  Line,
} from "recharts";
import { BookOpen, Users, Award, TrendingUp, BarChart2 } from "lucide-react";

const StudentsTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
      <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-bold text-indigo-600">
        {payload[0].value} students
      </p>
    </div>
  );
};

function barColor(count, max) {
  const ratio = max > 0 ? count / max : 0;
  if (ratio >= 0.7) return "#6366f1";
  if (ratio >= 0.4) return "#3b82f6";
  if (ratio >= 0.1) return "#93c5fd";
  return "#e0e7ff";
}

export default function InstructorAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [analyticsRes, coursesRes] = await Promise.all([
        API.get("/analytics/instructor"),
        API.get("/courses"),
      ]);
      setStats(analyticsRes.data);

      const myCourses = (coursesRes.data?.data || coursesRes.data || []).filter(
        (c) => c.instructor?._id === user._id,
      );

      const chart = myCourses.map((course) => ({
        name:
          course.title.length > 14
            ? course.title.slice(0, 14) + "…"
            : course.title,
        fullName: course.title,
        students: course.students?.length ?? 0,
        category: course.category,
      }));
      setChartData(chart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const maxStudents = Math.max(...chartData.map((c) => c.students), 1);

  const statCards = [
    {
      icon: BookOpen,
      label: "Total Courses",
      value: stats.totalCourses ?? "—",
      sub: "Published",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      icon: Users,
      label: "Total Students",
      value: stats.totalStudents ?? "—",
      sub: "Enrolled across all courses",
      color: "bg-indigo-50 text-indigo-600",
      border: "border-indigo-100",
    },
    {
      icon: Award,
      label: "Completion Rate",
      value: stats.completionRate != null ? `${stats.completionRate}%` : "—",
      sub: "Lessons completed on avg",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">
          Instructor Analytics
        </h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Overview of your courses and student engagement
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statCards.map(({ icon: Icon, label, value, sub, color, border }) => (
          <div
            key={label}
            className={`bg-white border rounded-2xl p-5 ${border}`}
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}
              >
                <Icon size={16} />
              </div>
            </div>
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {loading ? "—" : value}
            </p>
            <p className="text-xs font-semibold text-gray-700 mt-1">{label}</p>
            <p className="text-[10px] text-gray-400 mt-0.5">{sub}</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-gray-900">
              Course Popularity
            </h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Number of enrolled students per course
            </p>
          </div>
          <div className="flex items-center gap-2 text-[10px] font-bold text-gray-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-indigo-500" /> High
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-blue-400" /> Med
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-sm bg-blue-200" /> Low
            </span>
          </div>
        </div>

        {!loading && chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <BarChart2 size={28} className="text-gray-200" />
            <p className="text-sm text-gray-400">No courses published yet</p>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={chartData} barSize={32} barCategoryGap="30%">
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="#f1f5f9"
                vertical={false}
              />
              <XAxis
                dataKey="name"
                tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 500 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                width={28}
                allowDecimals={false}
              />
              <Tooltip
                content={<StudentsTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="students" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={barColor(entry.students, maxStudents)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">
            Course Breakdown
          </h2>
          <div className="space-y-3">
            {[...chartData]
              .sort((a, b) => b.students - a.students)
              .map((c) => (
                <div key={c.fullName} className="flex items-center gap-3">
                  <div className="w-32 shrink-0">
                    <p className="text-xs font-semibold text-gray-700 truncate">
                      {c.fullName}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {c.category?.replace(/_/g, " ")}
                    </p>
                  </div>
                  <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{
                        width: `${maxStudents > 0 ? (c.students / maxStudents) * 100 : 0}%`,
                        backgroundColor: barColor(c.students, maxStudents),
                      }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600 w-16 text-right shrink-0">
                    {c.students} {c.students === 1 ? "student" : "students"}
                  </span>
                </div>
              ))}
          </div>
        </div>
      )}
    </div>
  );
}
