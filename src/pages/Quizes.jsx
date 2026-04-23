import { useEffect, useState } from "react";
import { getQuizes } from "../services/courseServices";
import QuizPlayer from "../components/QuizPlayer";
import SearchFilter from "../components/SearchFilter";
import { Loader } from "../components/Loader";

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");

  useEffect(() => {
    fetchQuizzes();
  }, [search, category]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);

      const res = await getQuizes({
        type: "QUIZ",
        search,
        category,
      });

      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error("Quiz fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedQuiz) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => setSelectedQuiz(null)}
          className="mb-4 text-sm text-blue-600 hover:underline"
        >
          ← Back to all quizzes
        </button>

        <QuizPlayer lessonId={selectedQuiz._id} />
      </div>
    );
  }

  if (loading)
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <Loader />
      </div>
    );

  return (
    <div className="p-6">
      <SearchFilter
        search={search}
        setSearch={setSearch}
        category={category}
        setCategory={setCategory}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-6">
        {!loading && quizzes.length === 0 && (
          <p className="text-gray-500">No quizzes found</p>
        )}

        {quizzes.map((quiz) => (
          <div
            key={quiz._id}
            onClick={() => setSelectedQuiz(quiz)}
            className="bg-white p-5 rounded-xl shadow hover:shadow-lg transition cursor-pointer border border-gray-100"
          >
            <h3 className="font-semibold text-gray-900">{quiz.title}</h3>

            <p className="text-xs text-gray-400 mt-1">{quiz.category}</p>

            <div className="mt-4 flex justify-between items-center">
              <span className="text-xs bg-amber-100 text-amber-700 px-2 py-1 rounded-full">
                QUIZ
              </span>

              <span className="text-xs text-gray-400">Click to start →</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
