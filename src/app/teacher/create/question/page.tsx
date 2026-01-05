"use client"
import axios from 'axios';
import { useSearchParams, useRouter } from 'next/navigation';
import { useState, Suspense } from 'react'; // Added Suspense
import { toast } from 'sonner';

function CreateQuestionContent() {
  const [formData, setFormData] = useState({
    question: '',
    options: ['', ''],
    correctAnswer: ''
  });

  const searchParams = useSearchParams();
  const router = useRouter();
  const quizId = searchParams.get('quizId');

  const handleQuestionChange = (e: any) => {
    setFormData({ ...formData, question: e.target.value });
  };

  const handleOptionChange = (index: any, value: any) => {
    const newOptions = [...formData.options];
    const oldOptionValue = newOptions[index];
    newOptions[index] = value;

    const wasCorrect = formData.correctAnswer === oldOptionValue;
    
    setFormData({ 
      ...formData, 
      options: newOptions,
      correctAnswer: wasCorrect ? value : formData.correctAnswer
    });
  };

  const addOption = () => {
    setFormData({ ...formData, options: [...formData.options, ''] });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!formData.correctAnswer) {
      toast('Please select a correct answer');
      return;
    }

    try {
      const res = await axios.post("/api/quiz/create/question", {
        question: formData.question,
        correctAnswer: formData.correctAnswer,
        options: formData.options,
        quizId: quizId
      });
      //@ts-ignore
      if (res.data.success || res.status === 200) {
        toast('Question added');
        setFormData({
          question: '',
          options: ['', ''],
          correctAnswer: ''
        });
      }
    } catch (err) {
      console.error(err);
      toast.error('Error occurred');
    }
  };

  return (
    <div className="p-8 max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Add Question</h1>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm font-medium mb-1.5">Question</label>
          <textarea
            value={formData.question}
            onChange={handleQuestionChange}
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
            placeholder="Enter your question here"
            required
          />
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <label className="block text-sm font-medium">Options</label>
            <button
              type="button"
              onClick={addOption}
              className="text-sm text-blue-600 hover:text-blue-700"
            >
              + Add option
            </button>
          </div>
          
          <div className="space-y-2">
            {formData.options.map((option, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="radio"
                  name="correct"
                  checked={formData.correctAnswer === option && option !== ''}
                  onChange={() => setFormData({ ...formData, correctAnswer: option })}
                  className="w-4 h-4"
                  required
                />
                <input
                  type="text"
                  value={option}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
                  placeholder={`Option ${index + 1}`}
                  required
                />
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-2">Select the correct answer choice</p>
        </div>

        <div className="pt-4 space-y-3">
          <button
            type="submit"
            className="w-full px-6 py-2.5 bg-blue-600 text-white rounded font-medium hover:bg-blue-700 transition-colors"
          >
            Add Question
          </button>
          
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => router.push('/teacher/dashboard')}
              className="flex-1 px-6 py-2 bg-green-600 text-white rounded font-medium hover:bg-green-700 transition-colors text-center"
            >
              Finish Quiz
            </button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="flex-1 px-6 py-2 bg-gray-100 text-gray-700 rounded font-medium hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

// 2. The default export wraps the content in Suspense
export default function CreateQuestion() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-pulse text-gray-500 font-mono">Loading form...</div>
      </div>
    }>
      <CreateQuestionContent />
    </Suspense>
  );
}