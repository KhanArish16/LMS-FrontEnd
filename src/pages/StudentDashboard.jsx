import { useEffect, useState } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function StudentDashboard() {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [progressMap, setProgressMap] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    if (user?._id) fetchData();
  }, [user]);

  const fetchData = async () => {
    try {
      const res = await API.get("/courses");

      const userId = user._id;

      const enrolled = res.data.filter((course) =>
        course.students?.some((student) => student._id === userId),
      );

      setCourses(enrolled);

      const progressPromises = enrolled.map(async (course) => {
        const p = await API.get(`/progress/course/${course._id}`);
        return { id: course._id, progress: p.data.progress };
      });

      const progressData = await Promise.all(progressPromises);

      const map = {};
      progressData.forEach((p) => {
        map[p.id] = p.progress;
      });

      setProgressMap(map);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Welcome Back 👋</h1>

      <div className="mb-8">
        <h2 className="font-semibold mb-3">Continue Learning</h2>

        <div className="grid grid-cols-3 gap-6">
          {courses.slice(0, 3).map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/courses/${course._id}`)}
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition"
            >
              <h3 className="font-semibold">{course.title}</h3>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{progressMap[course._id] || 0}%</span>
                </div>

                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-500"
                    style={{
                      width: `${progressMap[course._id] || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h2 className="font-semibold mb-3">My Courses</h2>

        <div className="grid grid-cols-3 gap-6">
          {courses.map((course) => (
            <div
              key={course._id}
              onClick={() => navigate(`/courses/${course._id}`)}
              className="bg-white p-4 rounded-xl shadow cursor-pointer hover:shadow-md transition"
            >
              <h3 className="font-semibold">{course.title}</h3>

              <p className="text-sm text-gray-500 mt-1">{course.description}</p>

              <div className="mt-3">
                <div className="flex justify-between text-xs mb-1">
                  <span>Progress</span>
                  <span>{progressMap[course._id] || 0}%</span>
                </div>

                <div className="h-2 bg-gray-200 rounded">
                  <div
                    className="h-2 bg-blue-500"
                    style={{
                      width: `${progressMap[course._id] || 0}%`,
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
