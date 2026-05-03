import { useEffect, useState } from "react";
import API from "../services/api";
import { Loader } from "../components/Loader";
import toast from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  User,
  Mail,
  ImagePlus,
  CheckCircle,
  BookOpen,
  BarChart2,
  Pencil,
  Trash2,
  GraduationCap,
  Presentation,
  ArrowRight,
  FileText,
  Plus,
} from "lucide-react";

const CAT_STYLE = {
  DSA: "bg-blue-50   text-blue-700   border-blue-200",
  FRONTEND: "bg-violet-50 text-violet-700 border-violet-200",
  BACKEND: "bg-orange-50 text-orange-700 border-orange-200",
  FULLSTACK: "bg-indigo-50 text-indigo-700 border-indigo-200",
  MOBILE: "bg-pink-50   text-pink-700   border-pink-200",
  DATA_SCIENCE: "bg-teal-50   text-teal-700   border-teal-200",
  AI_ML: "bg-purple-50 text-purple-700 border-purple-200",
  CYBER_SECURITY: "bg-red-50    text-red-700    border-red-200",
  DEVOPS: "bg-cyan-50   text-cyan-700   border-cyan-200",
  CLOUD_COMPUTING: "bg-sky-50    text-sky-700    border-sky-200",
  UI_UX: "bg-rose-50   text-rose-700   border-rose-200",
  GENERAL: "bg-gray-100  text-gray-600   border-gray-200",
  OTHER: "bg-gray-100  text-gray-600   border-gray-200",
};

function catCls(cat) {
  return CAT_STYLE[cat] ?? CAT_STYLE.OTHER;
}

function Field({ label, icon: Icon, children }) {
  return (
    <div>
      <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
        {label}
      </label>
      <div className="flex items-center gap-2.5 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 focus-within:border-blue-300 focus-within:ring-2 focus-within:ring-blue-50 transition-all">
        {Icon && <Icon size={14} className="text-gray-400 shrink-0" />}
        {children}
      </div>
    </div>
  );
}

function QuickLink({
  icon: Icon,
  title,
  sub,
  onClick,
  color = "bg-blue-50 text-blue-600",
}) {
  return (
    <button
      onClick={onClick}
      className="group w-full flex items-center gap-3 p-3.5 bg-white border border-gray-100 rounded-2xl hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 text-left"
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={16} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-bold text-gray-900 leading-tight">{title}</p>
        <p className="text-[11px] text-gray-400 mt-0.5">{sub}</p>
      </div>
      <ArrowRight
        size={14}
        className="text-gray-300 group-hover:text-gray-500 group-hover:translate-x-0.5 transition-all shrink-0"
      />
    </button>
  );
}

export default function Profile() {
  const { user, setUser } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", email: "", role: "" });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);
  const [blogs, setBlogs] = useState([]);
  const [courses, setCourses] = useState([]);
  const [blogLoading, setBlogLoading] = useState(false);
  const [courseLoading, setCourseLoading] = useState(false);
  const [deletingBlog, setDeletingBlog] = useState(null);
  const [becomeInstructor, setBecomeInstructor] = useState(false);

  const isInstructor = user?.role === "INSTRUCTOR";
  const initials = user?.name?.slice(0, 2).toUpperCase() ?? "ME";

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "", role: "" });
      setPreview(user.profilePic || "");
      fetchMyBlogs();
      if (isInstructor) fetchMyCourses();
    }
  }, [user]);

  const fetchMyBlogs = async () => {
    setBlogLoading(true);
    try {
      const res = await API.get("/blogs");
      const all = res.data?.data || [];
      setBlogs(all.filter((b) => String(b.author?._id) === String(user._id)));
    } catch (err) {
      console.error(err);
    } finally {
      setBlogLoading(false);
    }
  };

  const fetchMyCourses = async () => {
    setCourseLoading(true);
    try {
      const res = await API.get("/courses");
      const all = res.data?.data || res.data || [];
      setCourses(all.filter((c) => c.instructor?._id === user._id));
    } catch (err) {
      console.error(err);
    } finally {
      setCourseLoading(false);
    }
  };

  const handleImage = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      data.append("name", form.name);
      data.append("email", form.email);
      if (image) data.append("profilePic", image);
      if (becomeInstructor) data.append("role", "INSTRUCTOR");
      const res = await API.put("/users/me", data, {
        headers: { "Content-Type": undefined },
      });
      setUser(res.data.data);
      toast.success("Profile updated");
      setBecomeInstructor(false);
    } catch (err) {
      toast.error(err?.response?.data?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const deleteBlog = async (id) => {
    setDeletingBlog(id);
    try {
      await API.delete(`/blogs/${id}`);
      toast.success("Blog deleted");
      fetchMyBlogs();
    } catch {
      toast.error("Delete failed");
    } finally {
      setDeletingBlog(null);
    }
  };

  if (!user)
    return (
      <div className="flex justify-center items-center h-64">
        <Loader />
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto pb-16 space-y-6">
      <div className="pt-2">
        <h1 className="text-xl font-bold text-gray-900">My Profile</h1>
        <p className="text-xs text-gray-400 mt-0.5">
          {isInstructor ? "Instructor account" : "Student account"}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 items-start">
        <div className="lg:col-span-1 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5 flex flex-col items-center gap-3">
            <div className="relative">
              {preview ? (
                <img
                  src={preview}
                  alt="Avatar"
                  className="w-20 h-20 rounded-2xl object-cover ring-4 ring-gray-100"
                />
              ) : (
                <div className="w-20 h-20 rounded-2xl bg-Linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center ring-4 ring-blue-100">
                  <span className="text-xl font-bold text-white">
                    {initials}
                  </span>
                </div>
              )}
              <label className="absolute -bottom-1.5 -right-1.5 w-7 h-7 rounded-xl bg-white border border-gray-200 shadow-sm flex items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors">
                <ImagePlus size={13} className="text-gray-500" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleImage}
                />
              </label>
            </div>

            <div className="text-center">
              <p className="font-bold text-gray-900">{user.name}</p>
              <p className="text-xs text-gray-400 mt-0.5">{user.email}</p>
              <span
                className={`inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold border ${
                  isInstructor
                    ? "bg-indigo-50 text-indigo-700 border-indigo-200"
                    : "bg-blue-50 text-blue-700 border-blue-200"
                }`}
              >
                {isInstructor ? (
                  <Presentation size={10} />
                ) : (
                  <GraduationCap size={10} />
                )}
                {user.role}
              </span>
            </div>
          </div>

          <div className="space-y-2">
            {isInstructor ? (
              <>
                <QuickLink
                  icon={BookOpen}
                  title="My Courses"
                  sub="Manage your courses"
                  onClick={() => navigate("/")}
                  color="bg-indigo-50 text-indigo-600"
                />
                <QuickLink
                  icon={BarChart2}
                  title="Analytics"
                  sub="View your course stats"
                  onClick={() => navigate("/analytics")}
                  color="bg-emerald-50 text-emerald-600"
                />
              </>
            ) : (
              <>
                <QuickLink
                  icon={BookOpen}
                  title="My Learning"
                  sub="Continue your courses"
                  onClick={() => navigate("/")}
                  color="bg-blue-50 text-blue-600"
                />
                <QuickLink
                  icon={BarChart2}
                  title="Progress"
                  sub="Track your learning"
                  onClick={() => navigate("/analytics")}
                  color="bg-emerald-50 text-emerald-600"
                />
              </>
            )}
          </div>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <h2 className="text-sm font-bold text-gray-900 mb-4">
              Edit Profile
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <Field label="Full Name" icon={User}>
                <input
                  name="name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="Your full name"
                  className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                />
              </Field>

              <Field label="Email Address" icon={Mail}>
                <input
                  name="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="your@email.com"
                  type="email"
                  className="bg-transparent outline-none text-sm text-gray-800 w-full placeholder:text-gray-400 font-medium"
                />
              </Field>

              {!isInstructor && (
                <div>
                  <label className="text-[11px] font-bold text-gray-500 uppercase tracking-widest mb-1.5 block">
                    Role
                  </label>
                  <button
                    type="button"
                    onClick={() => setBecomeInstructor((v) => !v)}
                    className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 text-left transition-all ${
                      becomeInstructor
                        ? "border-indigo-400 bg-indigo-50"
                        : "border-gray-200 bg-gray-50 hover:border-indigo-200"
                    }`}
                  >
                    <span
                      className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${becomeInstructor ? "bg-indigo-100" : "bg-gray-100"}`}
                    >
                      <Presentation
                        size={16}
                        className={
                          becomeInstructor ? "text-indigo-600" : "text-gray-400"
                        }
                      />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-sm font-bold leading-tight ${becomeInstructor ? "text-indigo-900" : "text-gray-700"}`}
                      >
                        Become an Instructor
                      </p>
                      <p
                        className={`text-[11px] mt-0.5 ${becomeInstructor ? "text-indigo-600" : "text-gray-400"}`}
                      >
                        {becomeInstructor
                          ? "Will upgrade your account on save"
                          : "Create and publish courses"}
                      </p>
                    </div>
                    {becomeInstructor && (
                      <CheckCircle
                        size={16}
                        className="text-indigo-600 shrink-0"
                      />
                    )}
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Saving…" : "Save Changes"}
              </button>
            </form>
          </div>

          {isInstructor && (
            <div className="bg-white border border-gray-100 rounded-2xl p-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-bold text-gray-900">My Courses</h2>
                <button
                  onClick={() => navigate("/")}
                  className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
                >
                  <Plus size={11} /> New
                </button>
              </div>

              {courseLoading ? (
                <div className="flex justify-center py-8">
                  <Loader />
                </div>
              ) : courses.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 gap-2">
                  <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <BookOpen size={20} className="text-indigo-400" />
                  </div>
                  <p className="text-sm text-gray-500 font-medium">
                    No courses yet
                  </p>
                  <button
                    onClick={() => navigate("/")}
                    className="text-xs text-blue-600 font-bold hover:underline"
                  >
                    Create your first course
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {courses.map((course) => (
                    <div
                      key={course._id}
                      onClick={() => navigate(`/course-builder/${course._id}`)}
                      className="group border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <div className="h-24 bg-gray-100 overflow-hidden">
                        <img
                          src={
                            course.thumbnail ||
                            "https://placehold.co/400x200/f1f5f9/94a3b8?text=Course"
                          }
                          alt={course.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>
                      <div className="p-2.5">
                        <span
                          className={`inline-block px-1.5 py-0.5 mb-1.5 text-[9px] font-black tracking-widest border ${catCls(course.category)}`}
                          style={{ borderRadius: "3px" }}
                        >
                          {(course.category ?? "").replace(/_/g, " ")}
                        </span>
                        <p className="text-xs font-bold text-gray-800 line-clamp-1">
                          {course.title}
                        </p>
                        <p className="text-[10px] text-gray-400 mt-0.5">
                          {course.level}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">My Blogs</h2>
              <button
                onClick={() => navigate("/blogs/create")}
                className="flex items-center gap-1 text-[11px] font-bold text-blue-600 hover:text-blue-700 transition-colors"
              >
                <Plus size={11} /> Write
              </button>
            </div>

            {blogLoading ? (
              <div className="flex justify-center py-8">
                <Loader />
              </div>
            ) : blogs.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-2">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                  <FileText size={20} className="text-blue-400" />
                </div>
                <p className="text-sm text-gray-500 font-medium">
                  No blogs yet
                </p>
                <button
                  onClick={() => navigate("/blogs/create")}
                  className="text-xs text-blue-600 font-bold hover:underline"
                >
                  Write your first blog
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {blogs.map((blog) => (
                  <div
                    key={blog._id}
                    className="group border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    onClick={() => navigate(`/blogs/${blog._id}`)}
                  >
                    {blog.thumbnail && (
                      <div className="h-24 bg-gray-100 overflow-hidden">
                        <img
                          src={blog.thumbnail}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                        />
                      </div>
                    )}
                    <div className="p-2.5">
                      {blog.category && (
                        <span
                          className={`inline-block px-1.5 py-0.5 mb-1.5 text-[9px] font-black tracking-widest border ${catCls(blog.category)}`}
                          style={{ borderRadius: "3px" }}
                        >
                          {blog.category.replace(/_/g, " ")}
                        </span>
                      )}
                      <p className="text-xs font-bold text-gray-800 line-clamp-2 leading-snug">
                        {blog.title}
                      </p>
                      <div
                        className="flex items-center gap-1.5 mt-2"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <button
                          onClick={() => navigate(`/blogs/${blog._id}/edit`)}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-gray-100 hover:bg-gray-200 text-[10px] font-bold text-gray-600 transition-colors"
                        >
                          <Pencil size={9} /> Edit
                        </button>
                        <button
                          onClick={() => deleteBlog(blog._id)}
                          disabled={deletingBlog === blog._id}
                          className="flex items-center gap-1 px-2 py-1 rounded-lg bg-red-50 hover:bg-red-100 text-[10px] font-bold text-red-600 transition-colors disabled:opacity-50"
                        >
                          <Trash2 size={9} />
                          {deletingBlog === blog._id ? "…" : "Delete"}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
