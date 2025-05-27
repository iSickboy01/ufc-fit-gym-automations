'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function KeyForgotPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const router = useRouter();

  // Email validation
  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleSubmit = async (e: React.FormEvent | React.KeyboardEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      setError('Please enter your email address');
      return;
    }

    if (!isValidEmail(email.trim())) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('/api/employee-submits/key-forgot', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          email: email.trim() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to recover employee key');
      }

      // Show success message
      setSuccess(true);
      setEmail(''); // Clear the form
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred while recovering your key');
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToForm = () => {
    router.push('employeeForm');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Recover Employee Key
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your email address to recover your employee key
          </p>
        </div>
        
        {!success ? (
          <div className="mt-8 space-y-6">
            <div>
              <label htmlFor="email" className="sr-only">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !isLoading) {
                    handleSubmit(e);
                  }
                }}
              />
            </div>

            {error && (
              <div className="text-red-600 text-sm text-center bg-red-50 border border-red-200 rounded-md p-3">
                {error}
              </div>
            )}

            <div>
              <button
                type="button"
                onClick={handleSubmit}
                disabled={isLoading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Recovering Key...' : 'Recover Employee Key'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={handleBackToForm}
                className="text-indigo-600 hover:text-indigo-500 text-sm font-medium"
              >
                ← Back to Employee Form
              </button>
            </div>
          </div>
        ) : (
          <div className="mt-8 space-y-6">
            <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-4 rounded-lg text-center">
              <div className="flex items-center justify-center mb-3">
                <svg className="w-8 h-8 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <p className="font-semibold text-lg">Request Received</p>
              </div>
              <p className="text-blue-700 leading-relaxed">
                Your request has been received and you'll receive an email with your employee key if your email is in our system.
              </p>
              <p className="mt-3 text-sm text-blue-600">
                Please check your email inbox (and spam folder) within the next few minutes.
              </p>
            </div>

            <div>
              <button
                onClick={handleBackToForm}
                className="w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Back to Employee Form
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default KeyForgotPage;