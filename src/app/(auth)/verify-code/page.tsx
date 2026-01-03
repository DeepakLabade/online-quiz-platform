'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';//@ts-ignore
import axios, { AxiosError } from 'axios';

interface VerifyResponse {
  success: boolean;
  message?: string;
}

export default function VerifyCodePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get('email');

  const [code, setCode] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (!email) {
      setError('Invalid verification link. Please sign up again.');
    }
  }, [email]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!email) {
      setError('Email not found. Please sign up again.');
      return;
    }

    if (code.length !== 6) {
      setError('Please enter a 6-digit code.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      console.log('Sending verification request:', { verifyCode: code, email });

      const { data } = await axios.post<VerifyResponse>(
        '/api/auth/verify',
        {
          verifyCode: code,
          email,
        }
      );

      console.log('Verification response:', data);

      if (data.success) {
        router.push('/dashboard');
      } else {
        throw new Error(data.message || 'Verification failed');
      }
    } catch (err) {
      const axiosError = err as AxiosError<VerifyResponse>;
      
      console.error('Verification error:', {
        status: axiosError.response?.status,
        data: axiosError.response?.data,
        message: axiosError.message
      });

      setError(
        axiosError.response?.data?.message ||
        axiosError.message ||
        'Invalid verification code. Please try again.'
      );

      setCode('');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError('Email not found.');
      return;
    }

    try {
      setIsLoading(true);
      setError('');

      await axios.post('/api/auth/resend-code', { email });
      
      alert('Verification code sent successfully!');
    } catch (err) {
      const axiosError = err as AxiosError<VerifyResponse>;
      
      setError(
        axiosError.response?.data?.message ||
        'Failed to resend code.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-50 to-slate-100 px-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>

            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Verify Your Email
            </h1>

            <p className="text-slate-600">
              We've sent a 6-digit verification code to
            </p>

            <p className="text-sm text-blue-600 font-medium mt-1">
              {email ? email.replace(/(.{2}).+(@.+)/, '$1****$2') : 'your email'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-slate-700 mb-2 text-center">
                Verification Code
              </label>
              <input
                type="text"
                id="code"
                value={code}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '').slice(0, 6);
                  setCode(value);
                  setError('');
                }}
                placeholder="000000"
                maxLength={6}
                disabled={isLoading}
                className={`w-full px-4 py-3 text-center text-2xl font-semibold tracking-widest border-2 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition ${
                  error ? 'border-red-500' : 'border-slate-300'
                } ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
              {error && (
                <p className="text-red-500 text-sm mt-2 text-center">{error}</p>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading || code.length !== 6}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 rounded-lg transition duration-200 shadow-lg shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying…' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm mb-2">
              Didn't receive the code?
            </p>
            <button
              onClick={handleResendCode}
              disabled={isLoading}
              className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
            >
              Resend Code
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link href="/signup" className="text-slate-600 hover:text-slate-900 text-sm">
              ← Back to Sign Up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}