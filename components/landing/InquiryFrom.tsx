"use client";

import { useState } from 'react';
import { useTurnstile } from '@/components/forms/Turnstile';

interface InquiryFormProps {
  inquiryType: string;
  title: string;
  onSubmit: (formData: any) => Promise<any>;
}

const InquiryForm = ({ inquiryType, title, onSubmit }: InquiryFormProps) => {
  const human = useTurnstile();
  // Club crest (the old /heroimage1.jpeg no longer exists in /public)
  const contactImage = "/EAGLES-CREST.png";

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');
  const [isError, setIsError] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!human.ready) {
      setIsError(true);
      setSubmitMessage(human.missingMessage);
      return;
    }
    setIsSubmitting(true);
    setSubmitMessage('');
    setIsError(false);

    // Validation
    if (formData.email !== formData.confirmEmail) {
      setIsError(true);
      setSubmitMessage('Email addresses do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      // Transform form data to match ContactFormData interface
      const contactData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        subject: title, // Use the title as the subject
        message: formData.message,
        turnstileToken: human.token,
      };

      const result = await onSubmit(contactData);
      human.reset(); // each token works once
      
      if (result.success) {
        setSubmitMessage('Your inquiry has been sent successfully!');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          confirmEmail: '',
          phone: '',
          message: ''
        });
      } else {
        setIsError(true);
        setSubmitMessage(`Error: ${result.message}`);
      }
    } catch (error) {
      human.reset();
      setIsError(true);
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

            {/* Human check (Cloudflare Turnstile) */}
            {human.widget}

            {/* Submit Message */}
            {submitMessage && (
              <div role={isError ? 'alert' : 'status'} className={`p-4 rounded ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
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
      <div className="w-full lg:w-1/2 h-64 lg:h-auto flex items-center justify-center" style={{ backgroundColor: '#181819' }}>
        <img
          src={contactImage}
          alt="Eagles FC crest"
          className="w-1/2 max-w-xs h-auto object-contain"
        />
      </div>

    </div>
  );
};

export default InquiryForm;