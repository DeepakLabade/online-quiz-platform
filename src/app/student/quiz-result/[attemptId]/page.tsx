"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizReviewPage() {
  const { attemptId } = useParams();
  const router = useRouter();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchResults() {
      try {
        // Updated path to match the standard plural 'results'
        const res = await axios.get(`/api/student/quiz-result/${attemptId}`);
        setData(res.data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    }
    if (attemptId) fetchResults();
  }, [attemptId]);

  if (loading) return <div className="p-10 text-center animate-pulse text-gray-400 font-mono">Loading analysis...</div>;
  if (!data) return <div className="p-10 text-center">Results not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-10">
      <div className="max-w-3xl mx-auto">
        
        {/* Summary Header */}
        <div className="bg-white border border-gray-200 rounded-lg p-6 mb-8 flex justify-between items-center shadow-sm">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{data.quizTitle}</h1>
            <p className="text-sm text-gray-500">
              Submitted on {new Date(data.submittedAt).toLocaleDateString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400 uppercase font-bold tracking-wider">Total Score</p>
            <p className={`text-3xl font-black ${data.totalScore > 0 ? 'text-blue-600' : 'text-gray-900'}`}>
              {data.totalScore}
            </p>
          </div>
        </div>

        {/* Questions List - Mapped to 'analysis' array from backend */}
        <div className="space-y-6">
          {data.analysis.map((res, index) => (
            <div key={res.questionId} className="bg-white border border-gray-200 rounded-lg p-5 transition-hover hover:border-gray-300">
              <div className="flex justify-between items-start gap-3">
                <div className="flex gap-3">
                  <span className="font-bold text-gray-300">Q{index + 1}.</span>
                  <p className="font-medium text-gray-800">{res.questionText}</p>
                </div>
                {/* Visual indicator of marks per question */}
                <span className={`text-[10px] font-bold px-2 py-1 rounded whitespace-nowrap ${res.isCorrect ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {res.marksAwarded} / {res.maxMarks}
                </span>
              </div>

              <div className="mt-4 ml-8 space-y-2">
                {/* Student's Selection */}
                <div className={`p-3 rounded border text-sm ${
                  res.isCorrect 
                    ? "bg-green-50 border-green-200 text-green-800" 
                    : "bg-red-50 border-red-200 text-red-800"
                }`}>
                  <span className="font-bold">Your Answer: </span>
                  {res.selectedOption || "No answer provided"}
                </div>

                {/* Show Correct Answer only if the student was wrong */}
                {!res.isCorrect && (
                  <div className="p-3 rounded border border-gray-200 bg-gray-50 text-gray-700 text-sm">
                    <span className="font-bold text-gray-900">Correct Answer: </span>
                    {res.correctOption}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>

        <button 
          onClick={() => router.push('/student/dashboard')}
          className="mt-8 w-full py-3 text-gray-500 hover:text-blue-600 font-medium text-sm transition-colors border border-dashed border-gray-300 rounded-lg hover:border-blue-300 hover:bg-blue-50"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}