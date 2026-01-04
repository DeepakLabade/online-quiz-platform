"use client"
import axios, { all } from 'axios';
import React, { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const [totalQuizzes, setTotalQuizzes] = useState(0)
  const [allQuizzes, setAllQuizzes] = useState<any>([])
  const [username, setUsername] = useState()

  useEffect(() => {
    async function fetchData() {
      const res = await axios.get("/api/student/dashboard")

      console.log(res.data)

      setTotalQuizzes(res.data.totalQuizzes)
      setAllQuizzes(res.data.attemptedQuizzes)
      setUsername(res.data.attemptedQuizzes[0].student.username)
    }

    fetchData()
  }, [])

  console.log(totalQuizzes, allQuizzes)

  const quizHistory = [
    { id: 1, title: "JavaScript Basics", score: 85, maxScore: 100, date: "2025-01-02", category: "Programming" },
    { id: 2, title: "React Fundamentals", score: 92, maxScore: 100, date: "2024-12-30", category: "Programming" },
    { id: 3, title: "CSS Grid & Flexbox", score: 78, maxScore: 100, date: "2024-12-28", category: "Web Design" },
    { id: 4, title: "Data Structures", score: 88, maxScore: 100, date: "2024-12-25", category: "Computer Science" },
    { id: 5, title: "HTML5 Advanced", score: 95, maxScore: 100, date: "2024-12-22", category: "Web Design" },
    { id: 6, title: "Algorithms", score: 72, maxScore: 100, date: "2024-12-20", category: "Computer Science" },
    { id: 7, title: "Node.js Basics", score: 80, maxScore: 100, date: "2024-12-18", category: "Programming" },
    { id: 8, title: "Database Design", score: 65, maxScore: 100, date: "2024-12-15", category: "Database" }
  ];

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}

        <div className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6'>
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold text-gray-800">Student Dashboard</h1>
          <p className="text-gray-600">Welcome, {username}</p>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
            <p className="text-gray-600 text-sm">Total Quizzes</p>
            <p className="text-3xl font-bold text-gray-800">{totalQuizzes}</p>
          </div>
        </div>

        {/* Quiz History */}
        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Quiz History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Quiz Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allQuizzes.map((quiz: any, idx: any) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm text-gray-800">{quiz.quiz.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quiz.quiz.subject}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {quiz.score}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">                        {new Date(quiz.submittedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700`}>
                        {quiz.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}