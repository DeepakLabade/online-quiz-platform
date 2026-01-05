"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function StudentQuizzesPage() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("");

  useEffect(() => {
    async function fetchQuizzes() {
      try {
        const res = await axios.get("/api/quiz/all");
        setQuizzes(res.data.allQuizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  const filteredQuizzes = quizzes.filter(q => 
    //@ts-ignore
    q.title.toLowerCase().includes(filter.toLowerCase()) ||
    //@ts-ignore
    q.subject.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-800">Quizzes</h1>
          
          <div className="flex items-center gap-3">
            <input 
              type="text"
              placeholder="Search..."
              className="px-3 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:border-blue-500 w-40 md:w-64"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
            <button 
              onClick={() => router.push("/student/dashboard")}
              className="text-sm font-medium text-blue-600 hover:underline"
            >
              Dashboard
            </button>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="h-32 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="bg-white border border-gray-200 rounded p-4 flex flex-col hover:shadow-sm"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className="text-[10px] font-bold text-blue-600 uppercase">
                      {quiz.subject}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium capitalize">
                      {quiz.difficulty}
                    </span>
                  </div>

                  <h2 className="text-md font-semibold text-gray-900 mb-1">{quiz.title}</h2>
                  
                  <div className="text-xs text-gray-500 mb-3">
                    Grade {quiz.grade} • {quiz.durationMinutes}m
                  </div>

                  <button 
                    onClick={() => router.push(`/student/quiz/attempt/${quiz.id}`)}
                    className="mt-auto w-full bg-blue-600 text-white py-1.5 rounded text-sm font-medium hover:bg-blue-700"
                  >
                    Start Quiz
                  </button>
                </div>
              ))
            ) : (
              <div className="col-span-full py-8 text-center text-sm text-gray-500">
                No quizzes found.
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}