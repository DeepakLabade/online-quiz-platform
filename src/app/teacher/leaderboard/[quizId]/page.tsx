"use client";

import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function QuizLeaderboardPage() {
  const { quizId } = useParams();
  const router = useRouter();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchLeaderboard() {
      try {
        const res = await axios.get(`/api/teacher/leaderboard/${quizId}`);
        console.log("res: " + JSON.stringify(res.data.leaderboard[0].student.username))
        setLeaderboard(res.data.leaderboard || []);
      } catch (err) {
        console.error("Error fetching leaderboard:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchLeaderboard();
  }, [quizId]);

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        
        {/* Compact Header */}
        <div className="flex items-center justify-between mb-6 pb-4 border-b border-gray-200">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Quiz Leaderboard</h1>
            <p className="text-sm text-gray-500">Top performing students</p>
          </div>
          <button 
            onClick={() => router.back()}
            className="text-sm font-medium text-gray-600 hover:text-blue-600"
          >
            Back
          </button>
        </div>

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3, 4, 5].map((n) => (
              <div key={n} className="h-12 bg-gray-200 animate-pulse rounded"></div>
            ))}
          </div>
        ) : (
          <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase w-16">Rank</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase">Student</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Date</th>
                  <th className="px-4 py-3 text-xs font-bold text-gray-500 uppercase text-right">Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {leaderboard.length > 0 ? (
                  leaderboard.map((entry, index) => (
                    <tr key={entry.id} className="hover:bg-blue-50/30 transition-colors">
                      <td className="px-4 py-3">
                        <div className={`flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                          index === 0 ? "bg-yellow-100 text-yellow-700" :
                          index === 1 ? "bg-gray-100 text-gray-600" :
                          index === 2 ? "bg-orange-100 text-orange-700" :
                          "text-gray-400"
                        }`}>
                          {index + 1}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-sm font-medium text-gray-900">{entry.student.username}</div>
                        <div className="text-[10px] text-gray-400">{entry.student.email}</div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-500 text-right font-mono">
                        {new Date(entry.submittedAt).toLocaleDateString()}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className="text-sm font-bold text-blue-600">
                          {entry.score}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-sm text-gray-500">
                      No attempts recorded for this quiz yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}