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
    <div className="max-w-2xl mx-auto py-10 px-6 sm:px-10 md:px-28">
      <h2 className="text-lg font-semibold text-center mb-6">
        Find Out More About Becoming a Partner!
      </h2>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Name - Two Columns */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* First Name */}
          <div>
            <label className="block text-xs">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
              required
            />
            <label className="block text-gray-500 text-xs mt-1">First</label>
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs opacity-0">Hidden Placeholder</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
            />
            <label className="block text-gray-500 text-xs mt-1">Last</label>
          </div>
        </div>

        {/* Title */}
        <div>
          <label className="block text-xs">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
          />
        </div>

        {/* Business Name */}
        <div>
          <label className="block text-xs">
            Business Name <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
            required
          />
        </div>

        {/* Business Website */}
        <div>
          <label className="block text-xs">Business Website</label>
          <input
            type="url"
            name="businessWebsite"
            value={formData.businessWebsite}
            onChange={handleChange}
            placeholder="https://example.com"
            className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
          />
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
            required
          />
        </div>

        {/* Phone */}
        <div>
          <label className="block text-xs">
            Phone <span className="text-red-500">*</span>
          </label>
          <input
            type="tel"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="(201) 555-0123"
            className="w-full border text-xs px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
            required
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-xs font-semibold">
            Description of Business
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows={3}
            className="w-full border px-3 py-2 mt-1 focus:outline-none focus:ring focus:ring-[#C5A464]"
          ></textarea>
        </div>

        {/* Submit Message */}
        {submitMessage && (
          <div className={`p-4 rounded text-center ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
            {submitMessage}
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            type="submit"
            disabled={isSubmitting}
            className={`text-white text-xs px-14 py-2 rounded-sm shadow-md transition ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-[#C5A464] hover:bg-[#A8824B]'
            }`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default PartnershipForm;