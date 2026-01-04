import React, { useState } from 'react';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');

  const stats = {
    totalUsers: 1247,
    activeUsers: 892,
    totalQuizzes: 156,
    completedAttempts: 8934
  };

  const recentUsers = [
    { id: 1, name: "John Smith", email: "john@example.com", joined: "2025-01-02", quizzes: 12, avgScore: 85 },
    { id: 2, name: "Sarah Johnson", email: "sarah@example.com", joined: "2025-01-01", quizzes: 8, avgScore: 92 },
    { id: 3, name: "Mike Chen", email: "mike@example.com", joined: "2024-12-30", quizzes: 15, avgScore: 78 },
    { id: 4, name: "Emma Wilson", email: "emma@example.com", joined: "2024-12-29", quizzes: 6, avgScore: 88 },
    { id: 5, name: "David Brown", email: "david@example.com", joined: "2024-12-28", quizzes: 20, avgScore: 76 }
  ];

  const quizList = [
    { id: 1, title: "JavaScript Basics", category: "Programming", attempts: 234, avgScore: 82, created: "2024-12-15" },
    { id: 2, title: "React Fundamentals", category: "Programming", attempts: 189, avgScore: 79, created: "2024-12-10" },
    { id: 3, title: "CSS Advanced", category: "Web Design", attempts: 156, avgScore: 85, created: "2024-12-08" },
    { id: 4, title: "Python Basics", category: "Programming", attempts: 298, avgScore: 77, created: "2024-12-01" },
    { id: 5, title: "Database Design", category: "Database", attempts: 145, avgScore: 73, created: "2024-11-25" }
  ];

  const systemActivity = [
    { date: "2025-01-04", newUsers: 12, quizAttempts: 156, avgScore: 81 },
    { date: "2025-01-03", newUsers: 15, quizAttempts: 189, avgScore: 79 },
    { date: "2025-01-02", newUsers: 18, quizAttempts: 203, avgScore: 83 },
    { date: "2025-01-01", newUsers: 9, quizAttempts: 134, avgScore: 78 },
    { date: "2024-12-31", newUsers: 7, quizAttempts: 98, avgScore: 82 }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Bar */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex justify-between items-center">
            <h1 className="text-xl font-semibold">Admin Panel</h1>
            <div className="flex gap-3">
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Create Quiz
              </button>
              <button className="px-4 py-2 text-sm border rounded hover:bg-gray-50">
                Settings
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">
        {/* Tabs */}
        <div className="mb-6 border-b">
          <div className="flex gap-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-3 px-1 border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`pb-3 px-1 border-b-2 transition ${
                activeTab === 'users'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Users
            </button>
            <button
              onClick={() => setActiveTab('quizzes')}
              className={`pb-3 px-1 border-b-2 transition ${
                activeTab === 'quizzes'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Quizzes
            </button>
            <button
              onClick={() => setActiveTab('activity')}
              className={`pb-3 px-1 border-b-2 transition ${
                activeTab === 'activity'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-600 hover:text-gray-800'
              }`}
            >
              Activity
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              <div className="bg-white border rounded-lg p-5">
                <p className="text-sm text-gray-600 mb-1">Total Users</p>
                <p className="text-2xl font-semibold">{stats.totalUsers}</p>
              </div>
              <div className="bg-white border rounded-lg p-5">
                <p className="text-sm text-gray-600 mb-1">Active Users</p>
                <p className="text-2xl font-semibold">{stats.activeUsers}</p>
              </div>
              <div className="bg-white border rounded-lg p-5">
                <p className="text-sm text-gray-600 mb-1">Total Quizzes</p>
                <p className="text-2xl font-semibold">{stats.totalQuizzes}</p>
              </div>
              <div className="bg-white border rounded-lg p-5">
                <p className="text-sm text-gray-600 mb-1">Quiz Attempts</p>
                <p className="text-2xl font-semibold">{stats.completedAttempts}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white border rounded-lg p-5">
                <h3 className="font-medium mb-4">Recent Users</h3>
                <div className="space-y-3">
                  {recentUsers.slice(0, 5).map(user => (
                    <div key={user.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <span className="text-xs text-gray-600">{user.joined}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white border rounded-lg p-5">
                <h3 className="font-medium mb-4">Top Performing Quizzes</h3>
                <div className="space-y-3">
                  {quizList.slice(0, 5).map(quiz => (
                    <div key={quiz.id} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-medium">{quiz.title}</p>
                        <p className="text-xs text-gray-500">{quiz.attempts} attempts</p>
                      </div>
                      <span className="text-sm font-medium">{quiz.avgScore}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white border rounded-lg">
            <div className="p-5 border-b">
              <input
                type="text"
                placeholder="Search users..."
                className="w-full px-3 py-2 border rounded"
              />
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Name</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Email</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Joined</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Quizzes</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Avg Score</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentUsers.map(user => (
                  <tr key={user.id}>
                    <td className="px-5 py-4 text-sm">{user.name}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.email}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{user.joined}</td>
                    <td className="px-5 py-4 text-sm">{user.quizzes}</td>
                    <td className="px-5 py-4 text-sm">{user.avgScore}%</td>
                    <td className="px-5 py-4 text-sm">
                      <button className="text-blue-600 hover:underline mr-3">View</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Quizzes Tab */}
        {activeTab === 'quizzes' && (
          <div className="bg-white border rounded-lg">
            <div className="p-5 border-b flex justify-between">
              <input
                type="text"
                placeholder="Search quizzes..."
                className="w-96 px-3 py-2 border rounded"
              />
              <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">
                Add Quiz
              </button>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Title</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Category</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Attempts</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Avg Score</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Created</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {quizList.map(quiz => (
                  <tr key={quiz.id}>
                    <td className="px-5 py-4 text-sm font-medium">{quiz.title}</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{quiz.category}</td>
                    <td className="px-5 py-4 text-sm">{quiz.attempts}</td>
                    <td className="px-5 py-4 text-sm">{quiz.avgScore}%</td>
                    <td className="px-5 py-4 text-sm text-gray-600">{quiz.created}</td>
                    <td className="px-5 py-4 text-sm">
                      <button className="text-blue-600 hover:underline mr-3">Edit</button>
                      <button className="text-red-600 hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Activity Tab */}
        {activeTab === 'activity' && (
          <div className="bg-white border rounded-lg">
            <div className="p-5 border-b">
              <h3 className="font-medium">System Activity</h3>
            </div>
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Date</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">New Users</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Quiz Attempts</th>
                  <th className="px-5 py-3 text-left text-xs font-medium text-gray-600">Avg Score</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {systemActivity.map((day, index) => (
                  <tr key={index}>
                    <td className="px-5 py-4 text-sm">{day.date}</td>
                    <td className="px-5 py-4 text-sm">{day.newUsers}</td>
                    <td className="px-5 py-4 text-sm">{day.quizAttempts}</td>
                    <td className="px-5 py-4 text-sm">{day.avgScore}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}