"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function AdminDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchStats() {
      try {
        const res = await axios.get("/api/admin/stats");
        setStats(res.data);
      } catch (err) {
        console.error("Dashboard error", err);
      } finally {
        setLoading(false);
      }
    }
    fetchStats();
  }, []);

  if (loading) return <div className="p-12 text-gray-400 flex h-screen items-center justify-center font-mono">Loading system metrics...</div>;

  return (
    <div className="min-h-screen bg-[#f9fafb] p-4 sm:p-8 text-slate-900">
      <div className="max-w-7xl mx-auto">
        
        <header className="mb-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Platform Overview</h1>
            <p className="text-slate-500 text-sm">System performance and user activity.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
          <StatCard label="Total Students" value={stats.studentCount} />
          <StatCard label="Active Quizzes" value={stats.quizCount}  />
          <StatCard label="Total Attempts" value={stats.attemptCount} />
        </div>

        {/* Tables Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Recent Attempts */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h2 className="font-bold text-slate-800">Recent Quiz Attempts</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-500 uppercase text-[11px] font-bold tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Student</th>
                    <th className="px-6 py-3">Quiz</th>
                    <th className="px-6 py-3">Score</th>
                    <th className="px-6 py-3">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {stats.recentAttempts.map((attempt: any) => (
                    <tr key={attempt.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 font-medium">{attempt.student.username}</td>
                      <td className="px-6 py-4 text-slate-600">{attempt.quiz.title}</td>
                      <td className="px-6 py-4">
                        <span className="text-neutral-600">
                          {attempt.score}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                          attempt.status === 'submitted' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
                        }`}>
                          {attempt.status}
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
    </div>
  );
}

function StatCard({ label, value }: { label: string, value: any }) {
  return (
    <div className="bg-white border border-slate-200 p-6 rounded-xl shadow-sm">
      <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h3 className="text-3xl font-bold text-slate-900">{value}</h3>
    </div>
  );
}