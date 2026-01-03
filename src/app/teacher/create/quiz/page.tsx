"use client"
import axios from 'axios';
import { redirect, useRouter } from 'next/navigation';
import { useState, ChangeEvent, FormEvent } from 'react';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function CreateQuiz() {
  const [formData, setFormData] = useState({
    title: '',
    subject: '',
    grade: '',
    difficulty: '',
    duration: '',
    tags: ''
  });

  const router = useRouter()

  const handleChange = (e: any) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const payload = {
      title: formData.title,
      subject: formData.subject,
      grade: formData.grade,
      difficulty: formData.difficulty as Difficulty,
      duration: parseInt(formData.duration),
      tags: formData.tags.split(',').map(t => t.trim()).filter(Boolean)
    };

    try {
        console.log(payload)
        const result = await axios.post("/api/quiz/create", payload)
        console.log(result)
        //@ts-ignore
      if (result.data.success) { 
          alert('Quiz created successfully'); //@ts-ignore
          
          setFormData({
            title: '',
            subject: '',
            grade: '',
            difficulty: '',
          duration: '',
          tags: ''
        }); //@ts-ignore
        router.push(`/teacher/create/question?quizId=${encodeURIComponent(result.data.quizId)}`)
    } else {
        alert('Failed to create quiz');
      }
    } catch (err) {
      console.error("some error occured: " + err);
      alert('Error occurred');
    }
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">New Quiz</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="Math Quiz 1"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Subject</label>
            <input
              type="text"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="Mathematics"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Grade</label>
            <input
              type="text"
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="10"
              min="1"
              max="12"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5">Difficulty</label>
            <select
              name="difficulty"
              value={formData.difficulty}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded bg-white"
              required
            >
              <option value="">Choose difficulty</option>
              <option value="easy">Easy</option>
              <option value="medium">Medium</option>
              <option value="hard">Hard</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5">Duration (minutes)</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded"
              placeholder="60"
              min="5"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1.5">Tags</label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
            placeholder="algebra, calculus, trigonometry"
          />
          <p className="text-xs text-gray-500 mt-1">Separate multiple tags with commas</p>
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Create Quiz
          </button>
          <button
            type="button"
            onClick={() => window.history.back()}
            className="px-6 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}