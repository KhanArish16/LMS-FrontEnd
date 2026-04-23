import { useEffect, useState } from "react";
import API from "../services/api";

export default function QuizPlayer({ lessonId }) {
  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchQuiz = async () => {
      try {
        const res = await API.get(`/quiz/${lessonId}`);
        const data = res.data?.data;

        setQuiz(data);
        setAnswers(new Array(data.questions.length).fill(null));
      } catch (err) {
        console.error("Failed to load quiz:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchQuiz();
  }, [lessonId]);

  const handleSelect = (qIndex, optionIndex) => {
    if (submitted) return;

    const updated = [...answers];
    updated[qIndex] = optionIndex;
    setAnswers(updated);
  };

  const handleSubmit = async () => {
    try {
      const res = await API.post(`/quiz/${lessonId}/submit`, {
        answers,
      });

      setResult(res.data);
      setSubmitted(true);
    } catch (err) {
      console.error("Submit failed:", err);
    }
  };

  if (loading) return <p>Loading quiz...</p>;
  if (!quiz) return <p>No quiz found</p>;

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white rounded-xl shadow">
      <h2 className="text-xl font-bold mb-6">Quiz</h2>

      {quiz.questions.map((q, qIndex) => (
        <div key={qIndex} className="mb-6">
          <p className="font-semibold mb-3">
            {qIndex + 1}. {q.question}
          </p>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              const isSelected = answers[qIndex] === i;
              const isCorrect = submitted && q.correctAnswer === i;
              const isWrong = submitted && isSelected && q.correctAnswer !== i;

              return (
                <button
                  key={i}
                  onClick={() => handleSelect(qIndex, i)}
                  className={`w-full text-left px-4 py-2 rounded border
                    ${isSelected ? "bg-blue-100" : ""}
                    ${isCorrect ? "bg-green-200" : ""}
                    ${isWrong ? "bg-red-200" : ""}
                  `}
                >
                  {opt}
                </button>
              );
            })}
          </div>
        </div>
      ))}

      {!submitted ? (
        <button
          onClick={handleSubmit}
          className="mt-4 w-full bg-black text-white py-2 rounded"
        >
          Submit Quiz
        </button>
      ) : (
        <div className="mt-6 p-4 bg-gray-100 rounded">
          <h3 className="font-bold text-lg">
            Score: {result.score} / {result.total}
          </h3>
          <p className="text-sm text-gray-600">
            {result.percentage.toFixed(2)}%
          </p>
        </div>
      )}
    </div>
  );
}
