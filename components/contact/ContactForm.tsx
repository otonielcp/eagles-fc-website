'use client';

import { useState } from 'react';
import { sendContactEmail } from '@/actions/contact';

export default function ContactForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
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

    try {
      const result = await sendContactEmail(formData);
      
      if (result.success) {
        setSubmitMessage('Message sent successfully! We\'ll get back to you soon.');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          subject: '',
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
    <div className="w-full py-20 bg-gray-50">
      <div className="max-w-4xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
            <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Send Us A Message</span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas font-black text-black uppercase tracking-wider">
            GET IN <span className="text-[#BD9B58]">TOUCH</span>
          </h2>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 p-8 md:p-12 shadow-lg">
          {/* Top gold accent line */}
          <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] mb-8"></div>

          {/* Name and Email Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="name" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
                placeholder="John Doe"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
                placeholder="john@example.com"
              />
            </div>
          </div>

          {/* Phone and Subject Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <label htmlFor="phone" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
                placeholder="(402) 555-0123"
              />
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Subject <span className="text-red-500">*</span>
              </label>
              <select
                id="subject"
                name="subject"
                value={formData.subject}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
              >
                <option value="">Select a subject</option>
                <option value="general">General Inquiry</option>
                <option value="partnership">Partnership Opportunity</option>
                <option value="player">Player Registration</option>
                <option value="media">Media Inquiry</option>
                <option value="support">Support</option>
                <option value="other">Other</option>
              </select>
            </div>
          </div>

          {/* Message */}
          <div className="mb-6">
            <label htmlFor="message" className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300 resize-none"
              placeholder="Tell us how we can help you..."
            ></textarea>
          </div>

          {/* Submit Message */}
          {submitMessage && (
            <div className={`mb-6 p-4 border-l-4 ${
              submitMessage.includes('Error') 
                ? 'bg-red-50 border-red-500 text-red-700' 
                : 'bg-green-50 border-green-500 text-green-700'
            }`}>
              {submitMessage}
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-4 font-bold text-lg uppercase tracking-wider transition-all duration-500 ${
              isSubmitting
                ? 'bg-gray-400 text-gray-200 cursor-not-allowed'
                : 'bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] hover:from-[#D4AF37] hover:to-[#BD9B58] text-black shadow-[0_0_30px_rgba(189,155,88,0.3)] hover:shadow-[0_0_50px_rgba(189,155,88,0.6)]'
            }`}
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center gap-3">
                <div className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
