'use client'

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phone: string;
  companyName: string;
  jobTitle: string;
  gymLocation: string;
  employeeListSize: string;
  city: string;
  state: string;
  postalCode: string;
  companyAddress: string;
}

export default function DecisionMakersPage() {
  const [form, setForm] = useState<FormData>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    password: '',
    phone: '', 
    companyName: '',
    jobTitle: '',
    gymLocation: '',
    employeeListSize: '',
    city: '', 
    state: '', 
    postalCode: '',
    companyAddress: '' 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\(\d{3}\) \d{3}-\d{4}$/,
    postalCode: /^\d{5}(-\d{4})?$/,
    name: /^[a-zA-Z\s'-]{2,}$/,
    password: /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/
  };

  // Employee size options with free months
  const employeeSizeOptions = [
    { value: '6-49', label: '6 – 49 Employees = 1 Month Free' },
    { value: '50-99', label: '50 – 99 Employees = 2 Months Free' },
    { value: '100-249', label: '100 – 249 Employees = 3 Months Free' },
    { value: '250-499', label: '250 – 499 Employees = 4 Months Free' },
    { value: '500-999', label: '500 – 999 Employees = 5 Months Free' },
    { value: '1000-1999', label: '1000 – 1999 Employees = 6 Months Free' },
    { value: '2000-2999', label: '2000 – 2999 Employees = 7 Months Free' },
    { value: '3000-3999', label: '3000 – 3999 Employees = 8 Months Free' },
    { value: '4000-4999', label: '4000 – 4999 Employees = 9 Months Free' },
    { value: '5000+', label: '5000+ = 12 Months Free' }
  ];

  // Gym location options
  const gymLocationOptions = [
    { value: 'san-jose', label: 'San Jose' },
    { value: 'sunnyvale', label: 'Sunnyvale' }
  ];

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

  // Format postal code as user types
  const formatPostalCode = (value: string) => {
    const numbers = value.replace(/[^\d]/g, '');
    if (numbers.length <= 5) return numbers;
    return `${numbers.slice(0, 5)}-${numbers.slice(5, 9)}`;
  };

  const validateField = (name: keyof FormData, value: string): string => {
    switch (name) {
      case 'firstName':
      case 'lastName':
        return patterns.name.test(value) ? '' : 'Must be at least 2 characters, letters only';
      case 'email':
        return patterns.email.test(value) ? '' : 'Please enter a valid email address';
      case 'password':
        return patterns.password.test(value) ? '' : 'Password must be at least 8 characters with letters and numbers';
      case 'phone':
        return patterns.phone.test(value) ? '' : 'Please enter a valid phone number';
      case 'postalCode':
        return patterns.postalCode.test(value) ? '' : 'Please enter a valid ZIP code';
      case 'companyName':
        return value.trim().length >= 2 ? '' : 'Company name must be at least 2 characters';
      case 'jobTitle':
        return value.trim().length >= 2 ? '' : 'Job title must be at least 2 characters';
      case 'gymLocation':
        return value ? '' : 'Please select a gym location';
      case 'employeeListSize':
        return value ? '' : 'Please select employee list size';
      case 'companyAddress':
        return value.trim().length >= 5 ? '' : 'Address must be at least 5 characters';
      case 'city':
        return value.trim().length >= 2 ? '' : 'City must be at least 2 characters';
      case 'state':
        return value.trim().length >= 2 ? '' : 'State must be at least 2 characters';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    let { name, value } = e.target;
    
    // Apply formatting for specific fields
    if (name === 'phone') {
      value = formatPhoneNumber(value);
    } else if (name === 'postalCode') {
      value = formatPostalCode(value);
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
      const res = await fetch('/api/decision-maker-submits', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        setSuccess(true);
        // Reset form after successful submission
        setForm({ 
          firstName: '', 
          lastName: '', 
          email: '', 
          password: '',
          phone: '', 
          companyName: '',
          jobTitle: '',
          gymLocation: '',
          employeeListSize: '',
          city: '', 
          state: '', 
          postalCode: '',
          companyAddress: '' 
        });
        setErrors({});
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const inputClass = (fieldName: keyof FormData) => 
    `w-full p-3 border rounded-lg transition-colors appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
      errors[fieldName] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-black-300 focus:border-blue-500'
    } focus:outline-none focus:ring-2 focus:ring-blue-200`;

  const selectClass = (fieldName: keyof FormData) => 
    `w-full p-3 border rounded-lg transition-colors appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm ${
      errors[fieldName] 
        ? 'border-red-500 focus:border-red-500' 
        : 'border-black-300 focus:border-blue-500'
    } focus:outline-none focus:ring-2 focus:ring-blue-200 bg-white`;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Decision Maker Registration</h1>
      
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

        {/* Company Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
          
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Job Title *
            </label>
            <input
              name="jobTitle"
              type="text"
              placeholder="HR Manager"
              value={form.jobTitle}
              onChange={handleChange}
              className={inputClass('jobTitle')}
              required
            />
            {errors.jobTitle && (
              <p className="text-red-500 text-sm mt-1">{errors.jobTitle}</p>
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
              placeholder="john.doe@company.com"
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
              Choose Password *
            </label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              value={form.password}
              onChange={handleChange}
              className={inputClass('password')}
              required
            />
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>
        </div>

        {/* Phone Number */}
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

        {/* Gym Location and Employee Size */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Gym Location *
            </label>
            <select
              name="gymLocation"
              value={form.gymLocation}
              onChange={handleChange}
              className={selectClass('gymLocation')}
              required
            >
              <option value="">Select a location</option>
              {gymLocationOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.gymLocation && (
              <p className="text-red-500 text-sm mt-1">{errors.gymLocation}</p>
            )}
          </div>
          
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              Employee List Size *
            </label>
            <select
              name="employeeListSize"
              value={form.employeeListSize}
              onChange={handleChange}
              className={selectClass('employeeListSize')}
              required
            >
              <option value="">Select employee count</option>
              {employeeSizeOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            {errors.employeeListSize && (
              <p className="text-red-500 text-sm mt-1">{errors.employeeListSize}</p>
            )}
          </div>
        </div>

        {/* Address Field */}
        <div>
          <label className="block text-black text-sm font-medium mb-2">
            Company Address *
          </label>
          <input
            name="address"
            type="text"
            placeholder="123 Business Blvd"
            value={form.companyAddress}
            onChange={handleChange}
            className={inputClass('companyAddress')}
            required
          />
          {errors.companyAddress && (
            <p className="text-red-500 text-sm mt-1">{errors.companyAddress}</p>
          )}
        </div>

        {/* City, State, Postal Code */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              City *
            </label>
            <input
              name="city"
              type="text"
              placeholder="San Jose"
              value={form.city}
              onChange={handleChange}
              className={inputClass('city')}
              required
            />
            {errors.city && (
              <p className="text-red-500 text-sm mt-1">{errors.city}</p>
            )}
          </div>
          
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              State *
            </label>
            <input
              name="state"
              type="text"
              placeholder="CA"
              value={form.state}
              onChange={handleChange}
              className={inputClass('state')}
              maxLength={2}
              required
            />
            {errors.state && (
              <p className="text-red-500 text-sm mt-1">{errors.state}</p>
            )}
          </div>
          
          <div>
            <label className="block text-black text-sm font-medium mb-2">
              ZIP Code *
            </label>
            <input
              name="postalCode"
              type="text"
              placeholder="95101"
              value={form.postalCode}
              onChange={handleChange}
              className={inputClass('postalCode')}
              maxLength={10}
              required
            />
            {errors.postalCode && (
              <p className="text-red-500 text-sm mt-1">{errors.postalCode}</p>
            )}
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Register Company'}
        </button>
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Company Registered Successfully!
          </div>
        )}
      </div>
    </div>
  );
}