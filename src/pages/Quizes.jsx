import { useEffect, useState } from "react";
import { getQuizes } from "../services/courseServices";
import QuizPlayer from "../components/QuizPlayer";
import SearchFilter from "../components/SearchFilter";
import { Loader } from "../components/Loader";
import useDebounce from "../hooks/useDebounce";
import { HelpCircle, ArrowLeft, ArrowRight, BookOpen } from "lucide-react";

const CAT_STYLE = {
  DSA: "bg-blue-50   text-blue-500   border-blue-200",
  FRONTEND: "bg-violet-50 text-violet-500 border-violet-200",
  BACKEND: "bg-orange-50 text-orange-500 border-orange-200",
  FULLSTACK: "bg-indigo-50 text-indigo-500 border-indigo-200",
  MOBILE: "bg-pink-50   text-pink-500   border-pink-200",
  DATA_SCIENCE: "bg-teal-50   text-teal-500   border-teal-200",
  AI_ML: "bg-purple-50 text-purple-500 border-purple-200",
  CYBER_SECURITY: "bg-red-50    text-red-500    border-red-200",
  DEVOPS: "bg-cyan-50   text-cyan-500   border-cyan-200",
  CLOUD_COMPUTING: "bg-sky-50    text-sky-500    border-sky-200",
  UI_UX: "bg-rose-50   text-rose-500   border-rose-200",
  OTHER: "bg-gray-100  text-gray-600   border-gray-200",
};

function catCls(cat) {
  return CAT_STYLE[cat] ?? CAT_STYLE.OTHER;
}

export default function Quizzes() {
  const [quizzes, setQuizzes] = useState([]);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [level, setLevel] = useState("");
  const [sort, setSort] = useState("");

  const debounceSearch = useDebounce(search, 500);

  useEffect(() => {
    fetchQuizzes();
  }, [category, debounceSearch]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const res = await getQuizes({ type: "QUIZ", search, category });
      setQuizzes(res.data?.data || []);
    } catch (err) {
      console.error("Quiz fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (selectedQuiz) {
    return (
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSelectedQuiz(null)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          >
            <ArrowLeft size={13} /> Back
          </button>
          <div className="flex-1 min-w-0">
            <h1 className="text-sm font-bold text-gray-900 truncate">
              {selectedQuiz.title}
            </h1>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {selectedQuiz.category?.replace(/_/g, " ")}
            </p>
          </div>

          <span
            className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-bold border shrink-0 ${catCls(selectedQuiz.category)}`}
          >
            <HelpCircle size={10} /> QUIZ
          </span>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
          <QuizPlayer lessonId={selectedQuiz._id} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="sticky top-0 z-20 bg-gray-50/95 backdrop-blur-md pb-3 border-b border-gray-100">
        <div className="flex items-center justify-between mb-3 pt-1">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quizzes</h1>
            <p className="text-xs text-gray-400 mt-0.5">
              {quizzes.length > 0
                ? `${quizzes.length} quiz${quizzes.length !== 1 ? "zes" : ""} available`
                : "Test your knowledge"}
            </p>
          </div>
          {quizzes.length > 0 && (
            <span className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 border border-amber-100 rounded-xl text-[11px] font-bold text-amber-600">
              <HelpCircle size={12} /> {quizzes.length} Quiz
              {quizzes.length !== 1 ? "zes" : ""}
            </span>
          )}
        </div>

        <SearchFilter
          search={search}
          setSearch={setSearch}
          category={category}
          setCategory={setCategory}
          level={level}
          setLevel={setLevel}
          sort={sort}
          setSort={setSort}
        />
      </div>

      <div
        className="flex-1 overflow-y-auto pt-4 pb-6"
        style={{ scrollbarWidth: "none" }}
      >
        {loading && (
          <div className="flex items-center justify-center py-20">
            <Loader />
          </div>
        )}

        {!loading && quizzes.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 gap-3 bg-white border border-gray-100 rounded-2xl">
            <div className="w-14 h-14 rounded-2xl bg-amber-50 flex items-center justify-center">
              <HelpCircle size={26} className="text-amber-400" />
            </div>
            <p className="text-sm font-semibold text-gray-500">
              No quizzes found
            </p>
            <p className="text-xs text-gray-400">
              {search || category
                ? "Try adjusting your filters"
                : "Check back later for new quizzes"}
            </p>
          </div>
        )}

        {!loading && quizzes.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {quizzes.map((quiz) => {
              const cls = catCls(quiz.category);
              return (
                <div
                  key={quiz._id}
                  onClick={() => setSelectedQuiz(quiz)}
                  className="group bg-white border border-gray-100 rounded-2xl p-4 cursor-pointer hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col gap-3"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="w-10 h-10 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center shrink-0">
                      <HelpCircle size={18} className="text-amber-500" />
                    </div>

                    <span
                      className={`text-[10px] font-black tracking-widest border px-2 py-0.5 mt-0.5 ${cls}`}
                      style={{ borderRadius: "4px" }}
                    >
                      {(quiz.category ?? "OTHER").replace(/_/g, " ")}
                    </span>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-sm font-bold text-gray-900 leading-snug line-clamp-2">
                      {quiz.title}
                    </h3>
                    {quiz.module?.title && (
                      <p className="text-[11px] text-gray-400 mt-1 flex items-center gap-1 truncate">
                        <BookOpen size={10} className="shrink-0" />
                        {quiz.module.title}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                    <span className="flex items-center gap-1 text-[11px] font-bold text-amber-600 bg-amber-50 px-2 py-1 rounded-lg">
                      <HelpCircle size={10} /> QUIZ
                    </span>
                    <span className="flex items-center gap-1 text-[11px] font-bold text-blue-600 group-hover:gap-2 transition-all">
                      Start <ArrowRight size={11} />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
