'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

function EmployeeTagPage() {
  const [employeeTag, setEmployeeTag] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeTag.trim()) {
      setError('Please enter a valid employee tag');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/employee-submits/add-tag', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          vemployee: employeeTag.trim() 
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to process employee tag');
      }

      // Redirect to employee form page
      router.push('employeeForm');
      
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Employee Tag Submission
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Enter your employee tag to continue
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="employee-tag" className="sr-only">
              Employee Tag
            </label>
            <input
              id="employee-tag"
              name="employee-tag"
              type="text"
              required
              className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Enter employee tag (vemployee)"
              value={employeeTag}
              onChange={(e) => setEmployeeTag(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <div className="text-red-600 text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Processing...' : 'Continue to Employee Form'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EmployeeTagPage;