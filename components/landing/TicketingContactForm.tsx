"use client";

import { useState } from 'react';
import { toast, Toaster } from 'sonner';
import { sendContactEmail } from '@/actions/contact';

const contactImage = "/heroimage1.jpeg"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    confirmEmail: '',
    phone: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (formData.email !== formData.confirmEmail) {
      toast.error('Email addresses do not match');
      return;
    }

    setIsSubmitting(true);

    try {
      // Transform form data to match ContactFormData interface
      const contactData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        phone: formData.phone,
        subject: 'Ticketing Inquiry',
        message: formData.message
      };

      const result = await sendContactEmail(contactData);

      if (result.success) {
        toast.success('Message sent successfully!');
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
        toast.error(result.message || 'Failed to send message');
      }
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error('Failed to send message. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full my-10 min-h-screen bg-white flex flex-col lg:flex-row">
      <Toaster position="top-right" />
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-10 md:px-16 lg:px-20 mb-10 lg:mb-0">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-6">TICKETING INQUIRY</h2>

          <form className="space-y-6" onSubmit={handleSubmit}>
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                    onChange={handleChange}
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
                  onChange={handleChange}
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
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1"
                rows={4}
                required
              ></textarea>
            </div>

            {/* Submit Button */}
            <button 
              type="submit"
              disabled={isSubmitting}
              className="bg-[#C6A76D] text-sm text-white py-3 px-6 rounded-md hover:bg-[#b5925d] transition w-full sm:w-auto disabled:opacity-50"
            >
              {isSubmitting ? (
                <div className="flex items-center">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Sending...
                </div>
              ) : (
                'Submit'
              )}
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
}
