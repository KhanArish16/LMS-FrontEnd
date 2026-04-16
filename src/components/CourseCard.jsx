export default function CourseCard({ course }) {
  return (
    <div className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden cursor-pointer">
      <img
        src={course.thumbnail || "https://via.placeholder.com/400x200"}
        className="w-full h-40 object-cover"
      />

      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-1">{course.title}</h3>

        <p className="text-sm text-gray-500 line-clamp-2 mt-1">
          {course.description}
        </p>

        <div className="flex justify-between items-center mt-3">
          <span className="text-xs bg-blue-100 px-2 py-1 rounded">
            {course.category}
          </span>

          <span className="text-xs text-gray-400">{course.level}</span>
        </div>
      </div>
    </div>
  );
}
