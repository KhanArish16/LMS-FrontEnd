import { useEffect, useState } from "react";
import API from "../services/api";
import {
  HelpCircle,
  CheckCircle,
  XCircle,
  Trophy,
  RotateCcw,
  ChevronRight,
  AlertCircle,
} from "lucide-react";
import { Loader } from "./Loader";

export default function QuizPlayer({ lessonId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchQuiz = async () => {
      setLoading(true);
      try {
        const res = await API.get(`/quiz/${lessonId}`);
        const data = res.data?.data;
        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        console.error("Failed to load quiz:", err);
        setError("Failed to load quiz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuiz();
  }, [lessonId]);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;
    setAnswers((prev) => prev.map((a, i) => (i === qIndex ? optionIndex : a)));
  };

  const handleSubmit = async () => {
    const unanswered = answers.some((a) => a === null);
    if (unanswered)
      return setError("Please answer all questions before submitting.");
    setError("");
    setSubmitting(true);
    try {
      const res = await API.post(`/quiz/${lessonId}/submit`, { answers });
      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Submission failed. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetry = () => {
    setAnswers(new Array(quiz.questions.length).fill(null));
    setSubmitted(false);
    setResult(null);
    setError("");
  };

  const answeredCount = answers.filter((a) => a !== null).length;
  const totalCount = quiz?.questions?.length ?? 0;

  if (loading)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <Loader />
      </div>
    );

  if (error && !quiz)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-red-50 flex items-center justify-center">
          <AlertCircle size={22} className="text-red-400" />
        </div>
        <p className="text-sm text-gray-500 font-medium">{error}</p>
      </div>
    );

  if (!quiz)
    return (
      <div className="flex flex-col items-center justify-center py-16 gap-3">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center">
          <HelpCircle size={22} className="text-amber-400" />
        </div>
        <p className="text-sm text-gray-500 font-medium">
          No quiz found for this lesson.
        </p>
      </div>
    );

  const scoreColor = result
    ? result.percentage >= 80
      ? "text-emerald-600"
      : result.percentage >= 50
        ? "text-amber-600"
        : "text-red-600"
    : "";

  const scoreBg = result
    ? result.percentage >= 80
      ? "bg-emerald-50 border-emerald-100"
      : result.percentage >= 50
        ? "bg-amber-50 border-amber-100"
        : "bg-red-50 border-red-100"
    : "";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center">
            <HelpCircle size={15} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-bold text-gray-900">Quiz</p>
            <p className="text-[11px] text-gray-400">
              {totalCount} question{totalCount !== 1 ? "s" : ""}
            </p>
          </div>
        </div>

        {!submitted && (
          <span
            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${
              answeredCount === totalCount
                ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                : "bg-gray-100 border-gray-200 text-gray-500"
            }`}
          >
            {answeredCount}/{totalCount} answered
          </span>
        )}
      </div>

      {error && (
        <div className="flex items-center gap-2 px-3 py-2 bg-red-50 border border-red-100 rounded-xl">
          <AlertCircle size={13} className="text-red-500 shrink-0" />
          <p className="text-xs text-red-600 font-medium">{error}</p>
        </div>
      )}

      {submitted && result && (
        <div
          className={`flex items-center gap-4 p-4 rounded-2xl border ${scoreBg}`}
        >
          <div
            className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
              result.percentage >= 80
                ? "bg-emerald-100"
                : result.percentage >= 50
                  ? "bg-amber-100"
                  : "bg-red-100"
            }`}
          >
            <Trophy size={22} className={scoreColor} />
          </div>
          <div className="flex-1 min-w-0">
            <p className={`text-lg font-black leading-none ${scoreColor}`}>
              {result.percentage.toFixed(0)}%
            </p>
            <p className="text-xs text-gray-500 mt-0.5">
              {result.score} of {result.total} correct
              {result.percentage >= 80
                ? " — Excellent work!"
                : result.percentage >= 50
                  ? " — Good effort!"
                  : " — Keep practising!"}
            </p>
          </div>
          <button
            onClick={handleRetry}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
          >
            <RotateCcw size={12} /> Retry
          </button>
        </div>
      )}

      <div className="space-y-4">
        {quiz.questions.map((q, qi) => {
          const selected = answers[qi];
          const isAnswered = selected !== null;
          const isCorrect = submitted && q.correctAnswer === selected;
          const isWrong =
            submitted && isAnswered && q.correctAnswer !== selected;

          return (
            <div
              key={qi}
              className={`bg-white border rounded-2xl overflow-hidden transition-all ${
                submitted
                  ? isCorrect
                    ? "border-emerald-200"
                    : isWrong
                      ? "border-red-200"
                      : "border-gray-100"
                  : "border-gray-100"
              }`}
            >
              <div
                className={`flex items-start gap-3 px-4 py-3.5 ${
                  submitted
                    ? isCorrect
                      ? "bg-emerald-50"
                      : isWrong
                        ? "bg-red-50"
                        : "bg-gray-50"
                    : "bg-gray-50"
                }`}
              >
                <span
                  className={`shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold mt-0.5 ${
                    submitted
                      ? isCorrect
                        ? "bg-emerald-500 text-white"
                        : isWrong
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-gray-600"
                      : isAnswered
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {submitted ? (
                    isCorrect ? (
                      <CheckCircle size={12} />
                    ) : isWrong ? (
                      <XCircle size={12} />
                    ) : (
                      qi + 1
                    )
                  ) : (
                    qi + 1
                  )}
                </span>
                <p className="text-sm font-semibold text-gray-800 leading-snug flex-1">
                  {q.question}
                </p>
              </div>

              <div className="px-4 py-3 space-y-2">
                {q.options.map((opt, oi) => {
                  const isSelected = selected === oi;
                  const isRightAnswer = submitted && q.correctAnswer === oi;
                  const isWrongPick =
                    submitted && isSelected && q.correctAnswer !== oi;

                  let optStyle =
                    "border-gray-200 bg-white text-gray-700 hover:border-gray-300 hover:bg-gray-50";
                  if (!submitted && isSelected)
                    optStyle = "border-blue-400 bg-blue-50 text-blue-800";
                  if (isRightAnswer)
                    optStyle =
                      "border-emerald-400 bg-emerald-50 text-emerald-800";
                  if (isWrongPick)
                    optStyle = "border-red-300 bg-red-50 text-red-700";

                  return (
                    <button
                      key={oi}
                      onClick={() => handleSelect(qi, oi)}
                      disabled={submitted}
                      className={`w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl border text-sm font-medium text-left transition-all ${optStyle} disabled:cursor-not-allowed`}
                    >
                      <span
                        className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                          isRightAnswer
                            ? "border-emerald-500 bg-emerald-500"
                            : isWrongPick
                              ? "border-red-400 bg-red-400"
                              : !submitted && isSelected
                                ? "border-blue-500 bg-blue-500"
                                : "border-gray-300"
                        }`}
                      >
                        {(isRightAnswer || (!submitted && isSelected)) && (
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M1.5 4L3 5.5L6.5 2"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                        )}
                        {isWrongPick && (
                          <svg
                            width="8"
                            height="8"
                            viewBox="0 0 8 8"
                            fill="none"
                          >
                            <path
                              d="M2 2L6 6M6 2L2 6"
                              stroke="white"
                              strokeWidth="1.5"
                              strokeLinecap="round"
                            />
                          </svg>
                        )}
                      </span>

                      <span className="flex-1">{opt}</span>

                      {isRightAnswer && (
                        <span className="text-[10px] font-bold text-emerald-600 shrink-0">
                          Correct
                        </span>
                      )}
                      {isWrongPick && (
                        <span className="text-[10px] font-bold text-red-500 shrink-0">
                          Wrong
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {!submitted && (
        <button
          onClick={handleSubmit}
          disabled={submitting || answeredCount < totalCount}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-sm shadow-blue-200"
        >
          {submitting ? (
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              Submit Quiz
              <ChevronRight size={15} />
            </>
          )}
        </button>
      )}

      {submitted && (
        <button
          onClick={handleRetry}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-gray-200 text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <RotateCcw size={14} /> Try Again
        </button>
      )}
    </div>
  );
}
