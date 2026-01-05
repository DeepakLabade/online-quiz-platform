"use client"
import axios from 'axios';
import { useRouter } from 'next/navigation'; // Import useRouter
import React, { useEffect, useState } from 'react';

export default function StudentDashboard() {
  const router = useRouter(); // Initialize router
  const [totalQuizzes, setTotalQuizzes] = useState(0)
  const [allQuizzes, setAllQuizzes] = useState<any>([])
  const [username, setUsername] = useState()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    async function fetchData() {
      try {
        const res = await axios.get("/api/student/dashboard")//@ts-ignore
        setTotalQuizzes(res.data.totalQuizzes)//@ts-ignore
        setAllQuizzes(res.data.attemptedQuizzes)//@ts-ignore
        if (res.data.attemptedQuizzes?.length > 0) {//@ts-ignore
          setUsername(res.data.attemptedQuizzes[0].student.username)
        }
      } catch (err) {
        console.error("Error fetching dashboard:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if(loading) return <div className='font-mono flex items-center h-screen justify-center'>Loading...</div>

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        
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

        <div className="bg-white rounded-lg shadow">
          <div className="p-6 border-b">
            <h2 className="text-xl font-bold text-gray-800">Quiz History</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Quiz Title</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Subject</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Score</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Date</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="px-6  py-3 text-right text-sm font-medium text-gray-600">Analysis</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {allQuizzes.map((quiz: any, idx: any) => (
                  <tr key={idx}>
                    <td className="px-6 py-4 text-sm text-gray-800">{quiz.quiz.title}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{quiz.quiz.subject}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-800">
                      {quiz.score !== null ? quiz.score : "-"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {quiz.submittedAt ? new Date(quiz.submittedAt).toLocaleDateString() : "N/A"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700`}>
                        {quiz.status}
                      </span>
                    </td>
                    {/* Added Action Button */}
                    <td className="px-6 py-4 text-sm text-right">
                      <button 
                        onClick={() => router.push(`/student/quiz-result/${quiz.id}`)}
                        className="text-blue-600 hover:text-blue-800 font-bold"
                      >
                        View Results
                      </button>
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