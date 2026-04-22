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
} from "recharts";
import { BookOpen, CheckCircle, BarChart2, TrendingUp } from "lucide-react";

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2">
      <p className="text-[11px] text-gray-400 font-medium mb-0.5">{label}</p>
      <p className="text-sm font-bold text-blue-600">{payload[0].value}%</p>
    </div>
  );
};

function progressColor(p) {
  if (p >= 100) return "#10b981";
  if (p >= 60) return "#3b82f6";
  if (p >= 30) return "#f59e0b";
  return "#e5e7eb";
}

export default function StudentAnalytics() {
  const { user } = useAuth();
  const [stats, setStats] = useState({});
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user?._id) fetchAnalytics();
  }, [user]);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const [analyticsRes, coursesRes] = await Promise.all([
        API.get("/analytics/student"),
        API.get("/courses"),
      ]);
      setStats(analyticsRes.data);

      const enrolled = (coursesRes.data?.data || []).filter((c) =>
        c.students?.some((s) => s._id === user._id),
      );

      const chart = await Promise.all(
        enrolled.map(async (course) => {
          const p = await API.get(`/progress/course/${course._id}`);
          return {
            name:
              course.title.length > 14
                ? course.title.slice(0, 14) + "…"
                : course.title,
            fullName: course.title,
            progress: Number(p.data.progress ?? 0),
          };
        }),
      );
      setChartData(chart);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const statCards = [
    {
      icon: BookOpen,
      label: "Enrolled Courses",
      value: stats.totalCourses ?? "—",
      color: "bg-blue-50 text-blue-600",
      border: "border-blue-100",
    },
    {
      icon: CheckCircle,
      label: "Lessons Completed",
      value: stats.completedLessons ?? "—",
      color: "bg-emerald-50 text-emerald-600",
      border: "border-emerald-100",
    },
    {
      icon: TrendingUp,
      label: "Avg Progress",
      value: stats.progress != null ? `${stats.progress}%` : "—",
      color: "bg-amber-50 text-amber-600",
      border: "border-amber-100",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900">My Analytics</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          Track your learning progress across all courses
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {statCards.map(({ icon: Icon, label, value, color, border }) => (
          <div
            key={label}
            className={`bg-white border rounded-2xl p-4 flex items-center gap-3 ${border}`}
          >
            <div
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${color}`}
            >
              <Icon size={18} />
            </div>
            <div>
              <p className="text-[11px] text-gray-400 font-medium">{label}</p>
              <p className="text-2xl font-bold text-gray-900 leading-tight">
                {loading ? "—" : value}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-sm font-bold text-gray-900">Course Progress</h2>
            <p className="text-[11px] text-gray-400 mt-0.5">
              Progress % per enrolled course
            </p>
          </div>
          <div className="flex items-center gap-3 text-[10px] font-bold">
            {[
              { color: "bg-gray-200", label: "0–29%" },
              { color: "bg-amber-400", label: "30–59%" },
              { color: "bg-blue-500", label: "60–99%" },
              { color: "bg-emerald-500", label: "100%" },
            ].map(({ color, label }) => (
              <span
                key={label}
                className="flex items-center gap-1 text-gray-500"
              >
                <span className={`w-2 h-2 rounded-sm ${color}`} />
                {label}
              </span>
            ))}
          </div>
        </div>

        {!loading && chartData.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-48 gap-2">
            <BarChart2 size={28} className="text-gray-200" />
            <p className="text-sm text-gray-400">No course data yet</p>
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
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "#9ca3af" }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `${v}%`}
                width={36}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "#f8fafc" }}
              />
              <Bar dataKey="progress" radius={[6, 6, 0, 0]}>
                {chartData.map((entry, i) => (
                  <Cell key={i} fill={progressColor(entry.progress)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {chartData.length > 0 && (
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="text-sm font-bold text-gray-900 mb-4">Breakdown</h2>
          <div className="space-y-3">
            {chartData.map((c) => (
              <div key={c.fullName} className="flex items-center gap-3">
                <p className="text-xs font-medium text-gray-700 w-32 truncate shrink-0">
                  {c.fullName}
                </p>
                <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${c.progress}%`,
                      backgroundColor: progressColor(c.progress),
                    }}
                  />
                </div>
                <span className="text-[11px] font-bold text-gray-600 w-8 text-right shrink-0">
                  {c.progress}%
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
