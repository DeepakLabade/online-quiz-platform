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
        // Accessing the quizzes array from your backend response
        setQuizzes(res.data.allQuizzes || []);
      } catch (err) {
        console.error("Error fetching quizzes:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchQuizzes();
  }, []);

  // Simple search filter
  const filteredQuizzes = quizzes.filter(q => 
    q.title.toLowerCase().includes(filter.toLowerCase()) ||
    q.subject.toLowerCase().includes(filter.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Available Quizzes</h1>
            <p className="text-gray-500 mt-1">Select a quiz to test your knowledge</p>
          </div>
          
          <div className="w-full md:w-64">
            <input 
              type="text"
              placeholder="Search subject or title..."
              className="w-full px-4 py-2 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500 font-medium">Loading quizzes...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredQuizzes.length > 0 ? (
              filteredQuizzes.map((quiz) => (
                <div 
                  key={quiz.id} 
                  className="bg-white border border-gray-200 rounded-lg overflow-hidden flex flex-col hover:shadow-md transition-shadow"
                >
                  {/* Card Header (Subject Accent) */}
                  <div className="bg-blue-600 h-2 w-full"></div>
                  
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-xs font-bold text-blue-600 uppercase tracking-wide">
                        {quiz.subject}
                      </span>
                      <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase border ${
                        quiz.difficulty === 'hard' ? 'border-red-200 text-red-600 bg-red-50' : 
                        quiz.difficulty === 'medium' ? 'border-yellow-200 text-yellow-700 bg-yellow-50' : 
                        'border-green-200 text-green-600 bg-green-50'
                      }`}>
                        {quiz.difficulty}
                      </span>
                    </div>

                    <h2 className="text-xl font-bold text-gray-800 mb-2 truncate">
                      {quiz.title}
                    </h2>

                    <div className="flex items-center gap-4 text-sm text-gray-500 mb-4">
                      <div className="flex items-center gap-1">
                        <span>Grade:</span>
                        <span className="font-semibold text-gray-700">{quiz.grade}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <span>Time:</span>
                        <span className="font-semibold text-gray-700">{quiz.durationMinutes}m</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-6">
                      {quiz.tags?.map((tag, i) => (
                        <span key={i} className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                          #{tag}
                        </span>
                      ))}
                    </div>

                    <button 
                      onClick={() => router.push(`/student/quiz/attempt/${quiz.id}`)}
                      className="mt-auto w-full bg-gray-900 text-white py-2.5 rounded font-bold hover:bg-black transition-colors"
                    >
                      Start Quiz
                    </button>
                  </div>
                </div>
              ))
            ) : (
              <div className="col-span-full bg-white p-12 text-center rounded border border-dashed border-gray-300">
                <p className="text-gray-500 font-medium">No quizzes match your search.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}