'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  companyName: string;
  gymLocation: string;
}

export default function EmployeeKeyForm() {
  const router = useRouter();
  const [form, setForm] = useState<FormData>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    companyName: '',
    gymLocation: ''
  });
  const [loading, setLoading] = useState(false);
  const [employeeKey, setEmployeeKey] = useState<string>('');
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\(\d{3}\) \d{3}-\d{4}$/,
    name: /^[a-zA-Z\s'-]{2,}$/
  };

  // Format phone number as user types
  const formatPhoneNumber = (value: string) => {
    const phoneNumber = value.replace(/[^\d]/g, '');
    const phoneNumberLength = phoneNumber.length;
    
    if (phoneNumberLength < 4) return phoneNumber;
    if (phoneNumberLength < 7) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    }
    return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
  };

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return patterns.name.test(value) ? '' : 'Must be at least 2 characters, letters only';
      case 'email':
        return patterns.email.test(value) ? '' : 'Please enter a valid email address';
      case 'phone':
        return patterns.phone.test(value) ? '' : 'Please enter a valid phone number';
      case 'companyName':
        return value.trim().length >= 2 ? '' : 'Company name must be at least 2 characters';
      case 'gymLocation':
        return value ? '' : 'Please select a gym location';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // Apply formatting for phone field
    if (name === 'phone') {
      value = formatPhoneNumber(value);
    }
    
    setForm({ ...form, [name]: value });
    
    // Real-time validation
    const error = validateField(name as keyof FormData, value);
    setErrors(prev => ({ ...prev, [name]: error }));
  };


  const handleSubmit = async () => {
    // Validate all fields
    const newErrors: Partial<Record<keyof FormData, string>> = {};
    (Object.keys(form) as Array<keyof FormData>).forEach(key => {
      const error = validateField(key, form[key]);
      if (error) newErrors[key] = error;
    });
    
    setErrors(newErrors);
    
    // Don't submit if there are errors
    if (Object.keys(newErrors).length > 0) return;
    
    setLoading(true);
    try {
      
      const response = await fetch('/api/employee-submits/employee-form', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form),

      });

        
      
      if (!response.ok) {
        throw new Error('Failed to submit form');
      }
      
      const data = await response.json();
      
      // Set the employee key from the API response
      setEmployeeKey(data.employee_key || data.employeeKey);
      
      
      setForm({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        phone: '', 
        companyName: '',
        gymLocation: ''
      });
      setErrors({});

      setTimeout(() => {
        router.push('keyForgot');
      }, 5000);
      
    } catch (err) {
      console.error('Submission error:', err);
      
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName: keyof FormData) => 
    `w-full p-3 border rounded-lg transition-colors appearance-none relative block px-3 py-2 border placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-200 focus:z-10 sm:text-sm ${
      errors[fieldName] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-gray-300 focus:border-blue-500'
    }`;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Employee Key Information</h1>
      
      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              First Name *
            </label>
            <input
              name="firstName"
              type="text"
              placeholder="John"
              value={form.firstName}
              onChange={handleChange}
              className={inputClass('firstName')}
              required
            />
            {errors.firstName && (
              <p className="text-red-500 text-sm mt-1">{errors.firstName}</p>
            )}
          </div>
          
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Last Name *
            </label>
            <input
              name="lastName"
              type="text"
              placeholder="Doe"
              value={form.lastName}
              onChange={handleChange}
              className={inputClass('lastName')}
              required
            />
            {errors.lastName && (
              <p className="text-red-500 text-sm mt-1">{errors.lastName}</p>
            )}
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Email Address *
            </label>
            <input
              name="email"
              type="email"
              placeholder="john.doe@example.com"
              value={form.email}
              onChange={handleChange}
              className={inputClass('email')}
              required
            />
            {errors.email && (
              <p className="text-red-500 text-sm mt-1">{errors.email}</p>
            )}
          </div>
          
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Phone Number *
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="(555) 123-4567"
              value={form.phone}
              onChange={handleChange}
              className={inputClass('phone')}
              maxLength={14}
              required
            />
            {errors.phone && (
              <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
            )}
          </div>
        </div>

        {/* Company Name Field */}
        <div>
          <label className="block text-black text-sm font-medium mb-2">
            Company Name *
          </label>
          <input
            name="companyName"
            type="text"
            placeholder="Acme Corporation"
            value={form.companyName}
            onChange={handleChange}
            className={inputClass('companyName')}
            required
          />
          {errors.companyName && (
            <p className="text-red-500 text-sm mt-1">{errors.companyName}</p>
          )}
        </div>

        {/* Gym Location Dropdown */}
        <div>
          <label className="block text-black text-sm font-medium mb-2">
            Gym Location *
          </label>
          <select
            name="gymLocation"
            value={form.gymLocation}
            onChange={handleChange}
            className={inputClass('gymLocation')}
            required
          >
            <option value="">Select a gym location</option>
            <option value="San Jose">San Jose</option>
            <option value="Sunnyvale">Sunnyvale</option>
          </select>
          {errors.gymLocation && (
            <p className="text-red-500 text-sm mt-1">{errors.gymLocation}</p>
          )}
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit Information'}
        </button>
        
        {employeeKey && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            <p className="font-medium">✅ Information submitted successfully!</p>
            <p className="mt-2">Your employee key is: <span className="font-mono font-bold text-green-900">{employeeKey}</span></p>
          </div>
        )}
      </div>
    </div>
  );
}