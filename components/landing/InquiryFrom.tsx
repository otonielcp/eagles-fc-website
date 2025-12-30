"use client";

import { useState } from 'react';

interface InquiryFormProps {
  inquiryType: string;
  title: string;
  onSubmit: (formData: any) => Promise<any>;
}

const InquiryForm = ({ inquiryType, title, onSubmit }: InquiryFormProps) => {
  const contactImage = "/heroimage1.jpeg";

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '+966 5054 3413',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setSubmitMessage('Email addresses do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const result = await onSubmit(formData);
      
      if (result.success) {
        setSubmitMessage('Your inquiry has been sent successfully!');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          confirmEmail: '',
          phone: '+966 5054 3413',
          message: ''
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
    <div className="w-full my-10 min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 mb-10 lg:mb-0">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-6">{title}</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Fields */}
            <div>
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-1">
                <div className="flex-1">
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">First</p>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Last</p>
                </div>
              </div>
            </div>

            {/* Email Fields */}
            <div>
              <label className="block text-sm font-medium">
                Email <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-1">
                <div className="flex-1">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Email</p>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <input
                    type="email"
                    name="confirmEmail"
                    value={formData.confirmEmail}
                    onChange={handleInputChange}
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Confirm Email</p>
                </div>
              </div>
            </div>

            {/* Phone Field */}
            <div>
              <label className="block text-sm font-medium">
                Phone <span className="text-red-500">*</span>
              </label>
              <div className="mt-1">
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  required
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1"
                rows={4}
                required
              ></textarea>
            </div>

            {/* Submit Message */}
            {submitMessage && (
              <div className={`p-4 rounded ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                {submitMessage}
              </div>
            )}

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className={`text-sm text-white py-3 px-6 rounded-md transition w-full sm:w-auto ${
                isSubmitting 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-[#C6A76D] hover:bg-[#b5925d]'
              }`}
            >
              {isSubmitting ? 'Submitting...' : 'Submit'}
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-full lg:w-1/2 h-64 lg:h-auto">
        <img
          src={contactImage}
          alt="Soccer Team"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
};

export default InquiryForm;