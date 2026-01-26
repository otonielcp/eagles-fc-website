"use client";
import React, { useState } from "react";
import { sendPartnershipInquiry } from '@/actions/contact';

const PartnershipForm = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    title: "",
    businessName: "",
    businessWebsite: "",
    email: "",
    phone: "",
    description: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    try {
      const result = await sendPartnershipInquiry(formData);
      
      if (result.success) {
        setSubmitMessage('Partnership inquiry submitted successfully!');
        // Reset form
        setFormData({
          firstName: "",
          lastName: "",
          title: "",
          businessName: "",
          businessWebsite: "",
          email: "",
          phone: "",
          description: "",
        });
      } else {
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      setSubmitMessage('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="partnership-form" className="max-w-5xl mx-auto py-20 px-6 sm:px-10 bg-white">
      {/* Form Header */}
      <div className="text-center mb-12">
        <div className="flex items-center justify-center gap-4 mb-6">
          <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#C5A464]"></div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-gray-900 uppercase tracking-tight">
            Let's Partner Up!
          </h2>
          <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#C5A464]"></div>
        </div>
        <p className="text-gray-600 text-lg md:text-xl font-medium">
          Fill out the form below and we'll get back to you within 24 hours
        </p>
      </div>

      <div className="bg-gray-50 rounded-2xl p-8 md:p-12 shadow-xl border border-gray-200">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Name - Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* First Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Last Name
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
              />
            </div>
          </div>

          {/* Title */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Title / Position
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleChange}
              placeholder="e.g., Marketing Director, CEO, Owner"
              className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
            />
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Business Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="businessName"
              value={formData.businessName}
              onChange={handleChange}
              className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
              required
            />
          </div>

          {/* Business Website */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Business Website
            </label>
            <input
              type="url"
              name="businessWebsite"
              value={formData.businessWebsite}
              onChange={handleChange}
              placeholder="https://www.yourbusiness.com"
              className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
            />
          </div>

          {/* Email & Phone */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="email@example.com"
                className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-bold text-gray-800 mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="(555) 123-4567"
                className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all shadow-sm hover:border-gray-400"
                required
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-bold text-gray-800 mb-2">
              Tell Us About Your Business & Partnership Goals
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows={5}
              placeholder="Share what your business does and what you're looking to achieve through this partnership..."
              className="w-full bg-white border-2 border-gray-300 text-sm px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A464] focus:border-transparent transition-all resize-none shadow-sm hover:border-gray-400"
            ></textarea>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`p-4 rounded-lg text-center font-semibold ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700 border-2 border-red-300' : 'bg-green-100 text-green-700 border-2 border-green-300'}`}>
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-center pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`inline-flex items-center gap-3 text-white font-bold text-base md:text-lg px-12 py-4 rounded-lg shadow-xl transition-all duration-300 ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-[#C5A464] to-[#B39355] hover:from-[#B39355] hover:to-[#A38444] transform hover:-translate-y-1 hover:shadow-2xl'
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                <>
                  Submit Partnership Inquiry
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PartnershipForm;