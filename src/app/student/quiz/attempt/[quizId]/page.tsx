"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { toast } from "sonner";

type Option = { id: string; text: string };
type Question = { id: string; text: string; options: Option[]; marks: number };
type Quiz = { id: string; title: string; durationMinutes: number; questions: Question[] };

export default function TakeQuizPage() {
  const { quizId } = useParams();
  const router = useRouter();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [questionId: string]: string }>({});
  const [loading, setLoading] = useState(true);
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  
  const [attemptId, setAttemptId] = useState<string | null>(null);

  const studentId = "student-id-from-auth"; 

  const finishQuiz = useCallback(async () => {
    try {
      const currentQuestion = quiz?.questions[currentIndex];
      
      const res = await axios.post("/api/quiz/attempt", {
        quizId,
        studentId,
        questionId: currentQuestion?.id,
        selectedOption: selectedAnswers[currentQuestion?.id || ""],
        isLastQuestion: true
      });

      console.log("data: " + res.data) //@ts-ignore
      toast(`Quiz Finished! Your score: ${res.data.score}/${res.data.totalQuizMarks}`);
      router.push("/student/dashboard");
    } catch (err) {
      console.error("Finish error:", err);
      toast("Failed to submit quiz");
    }
  }, [quizId, selectedAnswers, router, quiz, currentIndex, studentId]);

  useEffect(() => {
    async function fetchQuiz() {
      if (!quizId) return;
      try {
        const res = await axios.get(`/api/quiz/${quizId}`); //@ts-ignore
        if (res.data.success) {//@ts-ignore
          setQuiz(res.data.quiz);//@ts-ignore
          setTimeLeft(res.data.quiz.durationMinutes * 60);
        }
      } catch (err) {
        console.error("Load error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuiz();
  }, [quizId]);

  useEffect(() => {
    if (timeLeft === null) return;
    if (timeLeft <= 0) { finishQuiz(); return; }
    if (timeLeft == 10 * 60) {toast("10 min remaining")}
    if (timeLeft == 5 * 60) {toast("5 min remaining")}
    if (timeLeft == 4 * 60) {toast("4 min remaining")}
    if (timeLeft == 3 * 60) {toast("3 min remaining")}
    if (timeLeft == 2 * 60) {toast("2 min remaining")}
    if (timeLeft == 1 * 60) {toast("1 min remaining")}

    const timerId = setInterval(() => setTimeLeft((p) => (p !== null ? p - 1 : null)), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, finishQuiz]);

  const handleOptionSelect = async (questionId: string, optionText: string) => {
    setSelectedAnswers((prev) => ({ ...prev, [questionId]: optionText }));

    try {
      const res = await axios.post("/api/quiz/attempt", {
        quizId,
        studentId,
        questionId,
        selectedOption: optionText,
        isLastQuestion: false
      });
      //@ts-ignore
      if (res.data.attemptId) {//@ts-ignore
        setAttemptId(res.data.attemptId);
      }
    } catch (err) {
      console.error("Auto-save failed:", err);
    }
  };

  const nextQuestion = () => {
    if (quiz && currentIndex < quiz.questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? "0" : ""}${secs}`;
  };

  if (loading) return <div className="p-10 text-center h-screen flex items-center justify-center">Loading quiz...</div>;
  if (!quiz) return <div className="p-10 text-center h-screen flex items-center justify-center">Quiz not found.</div>;

  const currentQuestion = quiz.questions[currentIndex];
  const isLastQuestion = currentIndex === quiz.questions.length - 1;
  const progressPercent = ((currentIndex + 1) / quiz.questions.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto bg-white border border-gray-200 rounded-lg p-8 relative">
        
        <div className={`fixed top-4 right-4 px-4 py-2 rounded-full font-mono font-bold shadow-sm border ${
          timeLeft && timeLeft < 60 ? "bg-red-50 text-red-600 border-red-200 animate-pulse" : "bg-white text-gray-700 border-gray-200"
        }`}>
          {timeLeft !== null ? formatTime(timeLeft) : "--:--"}
        </div>

        <div className="mb-8">
          <h1 className="text-xl font-bold text-gray-800">{quiz.title}</h1>
          <div className="w-full bg-gray-100 h-1.5 mt-4 rounded-full overflow-hidden">
            <div className="bg-blue-600 h-full transition-all" style={{ width: `${progressPercent}%` }}></div>
          </div>
        </div>

        <div className="mb-10">
          <p className="text-lg font-medium text-gray-900 mb-6">
            {currentQuestion.text}
          </p>

          <div className="space-y-3">
            {currentQuestion.options.map((option) => (
              <label 
                key={option.id}
                className={`flex items-center p-4 border rounded-md cursor-pointer transition-all ${
                  selectedAnswers[currentQuestion.id] === option.text
                    ? "border-blue-500 bg-blue-50"
                    : "border-gray-200 hover:bg-gray-50"
                }`}
              >
                <input
                  type="radio"
                  className="hidden"
                  onChange={() => handleOptionSelect(currentQuestion.id, option.text)}
                  checked={selectedAnswers[currentQuestion.id] === option.text}
                />
                <div className={`w-4 h-4 rounded-full border mr-3 flex items-center justify-center ${
                  selectedAnswers[currentQuestion.id] === option.text ? "border-blue-500" : "border-gray-300"
                }`}>
                  {selectedAnswers[currentQuestion.id] === option.text && <div className="w-2 h-2 bg-blue-500 rounded-full"></div>}
                </div>
                <span>{option.text}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex justify-between items-center border-t pt-6">
          <div className="text-sm text-gray-400">
            Question {currentIndex + 1} of {quiz.questions.length}
          </div>

          {isLastQuestion ? (
            <button
              onClick={finishQuiz}
              disabled={!selectedAnswers[currentQuestion.id]}
              className="bg-green-600 text-white px-8 py-2 rounded font-bold hover:bg-green-700 disabled:opacity-50"
            >
              Finish Quiz
            </button>
          ) : (
            <button
              onClick={nextQuestion}
              disabled={!selectedAnswers[currentQuestion.id]}
              className="bg-blue-600 text-white px-8 py-2 rounded font-bold hover:bg-blue-700 disabled:opacity-50"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}