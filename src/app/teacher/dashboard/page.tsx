"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

const initialQuizData = [
  { name: "Math Quiz 1", score: 75 },
  { name: "Math Quiz 2", score: 82 },
  { name: "Science Quiz", score: 68 },
  { name: "History Quiz", score: 85 },
];

const hardQuestions = [
  { text: "Solve quadratic equation", successRate: 45 },
  { text: "Photosynthesis process", successRate: 52 },
  { text: "World War II timeline", successRate: 61 },
  { text: "Grammar rules", successRate: 68 },
];

export default function TeacherDashboard() {
  const router = useRouter();
  const [grades, setGrades] = useState([]);
  const [quizzes, setQuizzes] = useState([]);
  const [selectedGrade, setSelectedGrade] = useState<string | null>(null);
  const [totalQuizzes, setTotalQuizzes] = useState<number>(0);
  const [quizData] = useState(initialQuizData);

  useEffect(() => {
    async function fetchData() {
      try {
        // Run both requests in parallel for better performance
        const [dashboardRes, allQuizzesRes] = await Promise.all([
          axios.get("/api/teacher/dashboard"),
          axios.get("/api/teacher/quiz/all")
        ]);

        // 1. Set Grades and Stats
        const dashData = dashboardRes.data;
        setGrades(dashData?.grades ?? []);
        setTotalQuizzes(dashData?.totalQuizzez ?? 0);

        // 2. Set Quizzes (Use the response that actually contains the full list)
        // We prioritize res2 but fallback to dashData if that's where they live
        const quizList = allQuizzesRes.data?.quizzes || dashData?.quizzes || [];
        setQuizzes(quizList);

        // 3. Auto-select first grade
        if (dashData?.grades?.length > 0) {
          setSelectedGrade(dashData.grades[0].grade);
        }
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      }
    }
    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Teacher Dashboard</h1>
          <button 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 cursor-pointer font-medium"
            onClick={() => router.push("/teacher/create/quiz")}
          >
            + Create New Quiz
          </button>
        </div>

        {/* Grade Tabs */}
        <div className="flex gap-3 mb-6 overflow-x-auto pb-2">
          {grades.map((g) => (
            <button
              key={g.grade}
              onClick={() => setSelectedGrade(g.grade)}
              className={`px-4 py-2 rounded whitespace-nowrap transition-colors ${
                selectedGrade === g.grade
                  ? "bg-blue-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              Grade {g.grade}
            </button>
          ))}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white p-5 rounded border border-gray-200">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Selected Grade</p>
            <p className="text-3xl font-bold mt-1">{selectedGrade ?? "-"}</p>
          </div>
          <div className="bg-white p-5 rounded border border-gray-200">
            <p className="text-gray-500 text-sm uppercase tracking-wider font-semibold">Total Quizzes</p>
            <p className="text-3xl font-bold mt-1">{totalQuizzes}</p>
          </div>
        </div>

        {/* Analytics Section */}
        {/* <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
          <div className="lg:col-span-2 bg-white p-6 rounded border border-gray-200">
            <h2 className="font-bold mb-4 text-gray-800">Average Performance</h2>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={quizData}>
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#f3f4f6'}} />
                <Bar dataKey="score" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div> */}

          {/* Hard Questions */}
          {/* <div className="bg-white p-6 rounded border border-gray-200">
            <h2 className="font-bold mb-4 text-gray-800">Struggling Topics</h2>
            <div className="space-y-5">
              {hardQuestions.map((q, i) => (
                <div key={i}>
                  <div className="flex justify-between mb-1.5">
                    <span className="text-sm text-gray-700">{q.text}</span>
                    <span className="text-sm font-bold">{q.successRate}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        q.successRate < 50 ? "bg-red-500" : q.successRate < 70 ? "bg-yellow-500" : "bg-green-500"
                      }`}
                      style={{ width: `${q.successRate}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div> */}

        {/* All Quizzes Component */}
        <div className="bg-white rounded border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center">
            <h2 className="font-bold text-gray-800">Your Quizzes</h2>
            <span className="text-xs text-gray-500 font-medium bg-gray-100 px-2 py-1 rounded">Showing {quizzes.length} Quizzes</span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 text-gray-600 text-xs uppercase font-bold">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Subject</th>
                  <th className="px-6 py-4">Difficulty</th>
                  <th className="px-6 py-4">Duration</th>
                  <th className="px-6 py-4">Tags</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {quizzes.length > 0 ? (
                  quizzes.map((quiz) => (
                    <tr key={quiz.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{quiz.title}</td>
                      <td className="px-6 py-4 text-sm text-gray-600 uppercase">{quiz.subject}</td>
                      <td className="px-6 py-4">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                          quiz.difficulty === 'hard' ? 'bg-red-100 text-red-700' : 
                          quiz.difficulty === 'medium' ? 'bg-yellow-100 text-yellow-700' : 
                          'bg-green-100 text-green-700'
                        }`}>
                          {quiz.difficulty}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-600">{quiz.durationMinutes}m</td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {quiz.tags.slice(0, 2).map((tag, i) => (
                            <span key={i} className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded border border-blue-100">
                              #{tag}
                            </span>
                          ))}
                          {quiz.tags.length > 2 && <span className="text-[10px] text-gray-400">+{quiz.tags.length - 2}</span>}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button 
                          onClick={() => router.push(`/teacher/quiz/${quiz.id}`)}
                          className="text-blue-600 hover:text-blue-800 text-sm font-bold"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="px-6 py-10 text-center text-gray-500 text-sm">
                      No quizzes found. Create your first one to get started.
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