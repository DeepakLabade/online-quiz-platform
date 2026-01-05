'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import axios from "axios"
import { toast } from 'sonner';

export default function SignupPage() {

  const router = useRouter();
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'student'
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  const roles = [
    { value: 'student', label: 'Student' },
    { value: 'teacher', label: 'Teacher' },
    { value: 'admin', label: 'Admin' }
  ];

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    })); //@ts-ignore
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.username.trim()) { //@ts-ignore
      newErrors.username = 'Username is required';
    } else if (formData.username.length < 3) {//@ts-ignore
      newErrors.username = 'Username must be at least 3 characters';
    }

    if (!formData.email.trim()) {//@ts-ignore
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {//@ts-ignore
      newErrors.email = 'Email is invalid';
    }

    if (!formData.password) {//@ts-ignore
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {//@ts-ignore
      newErrors.password = 'Password must be at least 6 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
        if (validateForm()) {
            const response: any = await axios.post("/api/auth/sign-up", {
                username: formData.username,
                email: formData.email,
                password: formData.password,
                role: formData.role
            })
            toast(response.data.msg)
            router.push(`/verify-code?email=${encodeURIComponent(formData.email)}`);
        }

    } catch (error: any) {
        console.error("Signup error:", error);
        toast.error(
          error instanceof Error ? error.message : "Signup error"
        );
    if (error.response?.data?.msg) {
      toast.error(
        error instanceof Error ? error.message : "Something went wrong"
      );
    } else {
      toast("signup failed. please try again")
    }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-slate-900 mb-2">Create Account</h1>
            <p className="text-slate-600">Join us today and get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-slate-700 mb-1.5">
                Username
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${//@ts-ignore
                  errors.username ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter your username"
              />
              {//@ts-ignore
              errors.username && (//@ts-ignore
                <p className="text-red-500 text-sm mt-1">{errors.username}</p>
              )}
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${//@ts-ignore
                  errors.email ? 'border-red-500' : 'border-slate-300'
                }`}
                placeholder="Enter your email"
              />
              {//@ts-ignore
              errors.email && (//@ts-ignore
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition pr-12 ${//@ts-ignore
                    errors.password ? 'border-red-500' : 'border-slate-300'
                  }`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
              {//@ts-ignore
              errors.password && ( //@ts-ignore
                <p className="text-red-500 text-sm mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Role
              </label>
              <div className="grid grid-cols-3 gap-2">
                {roles.map((role) => (
                  <label
                    key={role.value}
                    className={`relative flex items-center justify-center px-4 py-2.5 border-2 rounded-lg cursor-pointer transition ${
                      formData.role === role.value
                        ? 'border-blue-500 bg-blue-50 text-blue-700'
                        : 'border-slate-300 hover:border-slate-400'
                    }`}
                  >
                    <input
                      type="radio"
                      name="role"
                      value={role.value}
                      checked={formData.role === role.value}
                      onChange={handleChange}
                      className="sr-only"
                    />
                    <span className="text-sm font-medium">{role.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30"
            >
              Sign Up
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600">
              Already have an account?{' '}
              <Link href="/login" className="text-blue-600 hover:text-blue-700 font-medium">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}