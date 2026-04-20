import { useEffect, useState } from "react";
import API from "../services/api";
import { useAuth } from "../context/AuthContext";
import CourseModal from "../components/CourseModal";
import { useNavigate } from "react-router-dom";

export default function InstructorDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);

  useEffect(() => {
    if (user?._id) fetchCourses();
  }, [user]);

  const fetchCourses = async () => {
    const res = await API.get("/courses");

    const coursesArray = res.data?.data || res.data || [];

    const myCourses = coursesArray.filter(
      (course) => course.instructor?._id === user?._id,
    );

    setCourses(myCourses);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingCourse) {
        await API.put(`/courses/${editingCourse._id}`, formData);
      } else {
        await API.post("/courses", formData);
      }

      setShowModal(false);
      setEditingCourse(null);
      fetchCourses();
    } catch (err) {
      console.log(err);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete course?")) return;

    await API.delete(`/courses/${id}`);
    fetchCourses();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Instructor Dashboard</h1>

        <button
          onClick={() => {
            setEditingCourse(null);
            setShowModal(true);
          }}
          className="bg-black text-white px-4 py-2 rounded-lg"
        >
          + Create Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div key={course._id} className="bg-white p-4 rounded-xl shadow">
            <h3 className="font-semibold">{course.title}</h3>
            <p className="text-sm text-gray-500">{course.description}</p>

            <div className="flex gap-2 mt-4">
              <button
                onClick={() => {
                  setEditingCourse(course);
                  setShowModal(true);
                }}
                className="px-3 py-1 bg-gray-200 rounded text-sm"
              >
                Edit
              </button>

              <button
                onClick={() => navigate(`/course-builder/${course._id}`)}
                className="px-3 py-1 bg-blue-500 text-white rounded text-sm"
              >
                Manage
              </button>

              <button
                onClick={() => handleDelete(course._id)}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <CourseModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleSubmit}
        editingCourse={editingCourse}
      />
    </div>
  );
}
