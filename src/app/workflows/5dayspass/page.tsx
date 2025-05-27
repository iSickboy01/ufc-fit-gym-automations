'use client'

import { useState } from 'react';

interface FormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
}

export default function WelcomeWorkflowPage() {
  const [form, setForm] = useState<FormData>({ 
    firstName: '', 
    lastName: '', 
    email: '', 
    phone: '', 
    address: '', 
    city: '', 
    state: '', 
    postalCode: '' 
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  // Validation patterns
  const patterns = {
    email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    phone: /^\(\d{3}\) \d{3}-\d{4}$/,
    postalCode: /^\d{5}(-\d{4})?$/,
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
      case 'phone':
        return patterns.phone.test(value) ? '' : 'Please enter a valid phone number';
      case 'postalCode':
        return patterns.postalCode.test(value) ? '' : 'Please enter a valid ZIP code';
      case 'address':
        return value.trim().length >= 5 ? '' : 'Address must be at least 5 characters';
      case 'city':
        return value.trim().length >= 2 ? '' : 'City must be at least 2 characters';
      case 'state':
        return value.trim().length >= 2 ? '' : 'State must be at least 2 characters';
      default:
        return '';
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
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
      const res = await fetch('/api/5days-pass-submit', {
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
          phone: '', 
          address: '', 
          city: '', 
          state: '', 
          postalCode: '' 
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

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-xl shadow-lg bg-white">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Contact Information</h1>
      
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

        {/* Address Field */}
        <div>
          <label className="block text-black text-sm font-medium mb-2">
            Street Address *
          </label>
          <input
            name="address"
            type="text"
            placeholder="123 Main Street"
            value={form.address}
            onChange={handleChange}
            className={inputClass('address')}
            required
          />
          {errors.address && (
            <p className="text-red-500 text-sm mt-1">{errors.address}</p>
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
              placeholder="New York"
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
              placeholder="NY"
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
              placeholder="12345"
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
          {loading ? 'Submitting...' : 'Submit Information'}
        </button>
        
        {success && (
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg">
            ✅ Information submitted successfully!
          </div>
        )}
      </div>
    </div>
  );
}