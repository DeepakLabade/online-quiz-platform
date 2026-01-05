"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function TeacherDashboard() {
  const router = useRouter();
  const [quizzes, setQuizzes] = useState([]);
  const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [dashboardRes, allQuizzesRes] = await Promise.all([
          axios.get("/api/teacher/dashboard"),
          axios.get("/api/teacher/quiz/all")
        ]);

        const dashData = dashboardRes.data;
        //@ts-ignore
        setTotalQuizzes(dashData?.totalQuizzez ?? 0);

        //@ts-ignore
        const quizList = allQuizzesRes.data?.quizzes || dashData?.quizzes || [];
        setQuizzes(quizList);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Teacher Dashboard</h1>
            <p className="text-sm text-gray-500">Manage your assessments and track student progress.</p>
          </div>
          <button 
            className="bg-blue-600 text-white px-5 py-2 rounded shadow-sm hover:bg-blue-700 transition-colors font-semibold text-sm"
            onClick={() => router.push("/teacher/create/quiz")}
          >
            + New Quiz
          </button>
        </div>

        {/* Stats Row */}
        <div className="mb-8">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm max-w-xs">
            <p className="text-gray-400 text-xs uppercase tracking-wider font-bold">Total Quizzes</p>
            <p className="text-4xl font-black mt-1 text-gray-900">{totalQuizzes}</p>
          </div>
        </div>

        {/* Quizzes Table */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
            <h2 className="font-bold text-gray-800">Your Quizzes</h2>
            <span className="text-[10px] text-gray-500 font-bold uppercase tracking-widest bg-white border border-gray-200 px-2 py-1 rounded">
              Count: {quizzes.length}
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-500 text-[10px] uppercase font-bold tracking-wider">
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Subject</th>
                  <th className="px-6 py-3">Difficulty</th>
                  <th className="px-6 py-3">Duration</th>
                  <th className="pr-6 py-3 text-right">LeaderBoard</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {loading ? (
                  [1, 2, 3].map((i) => (
                    <tr key={i} className="animate-pulse">
                      <td colSpan={5} className="px-6 py-4"><div className="h-4 bg-gray-100 rounded w-full"></div></td>
                    </tr>
                  ))
                ) : quizzes.length > 0 ? (
                  quizzes.map((quiz) => (/*@ts-ignore */
                    <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">{/*@ts-ignore */}
                      <td className="px-6 py-4 font-semibold text-gray-800">{quiz.title}</td>{/*@ts-ignore */}
                      <td className="px-6 py-4 text-sm text-gray-500">{quiz.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${/*@ts-ignore */
                          quiz.difficulty === 'hard' ? 'bg-red-50 text-red-600' : /*@ts-ignore */
                          quiz.difficulty === 'medium' ? 'bg-yellow-50 text-yellow-700' : 
                          'bg-green-50 text-green-600'
                        }`}>{/*@ts-ignore */}
                          {quiz.difficulty}
                        </span>
                      </td>{/*@ts-ignore */}
                      <td className="px-6 py-4 text-sm text-gray-500">{quiz.durationMinutes}m</td>
                      <td className="px-6 py-4 text-right">
                        <button /*@ts-ignore */
                          onClick={() => router.push(`/teacher/leaderboard/${quiz.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-xs font-bold underline decoration-2 underline-offset-4"
                        >
                          View Results
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-gray-400 text-sm italic">
                      No quizzes found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}