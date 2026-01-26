"use client";

import { useState } from 'react';
import { sendPlayerRegistrationEmail } from '@/actions/contact';

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    // Player Information
    playerFirstName: '',
    playerLastName: '',
    playerSuffix: '',
    playerGender: 'MALE',
    playerBirthday: '',
    position: 'Goalkeeper',
    currentClub: '',
    teamName: '',
    yearsPlaying: '',
    soccerExperience: '',
    
    // Parent/Guardian Information
    parentFirstName: '',
    parentLastName: '',
    parentSuffix: '',
    parentEmail: '',
    parentPhone: '',
    
    // Address Information
    street: '',
    city: '',
    state: '',
    zipcode: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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
      const result = await sendPlayerRegistrationEmail(formData);
      
      if (result.success) {
        setSubmitMessage('Inquiry submitted successfully!');
        // Reset form
        setFormData({
          playerFirstName: '',
          playerLastName: '',
          playerSuffix: '',
          playerGender: 'MALE',
          playerBirthday: '',
          position: 'Goalkeeper',
          currentClub: '',
          teamName: '',
          yearsPlaying: '',
          soccerExperience: '',
          parentFirstName: '',
          parentLastName: '',
          parentSuffix: '',
          parentEmail: '',
          parentPhone: '',
          street: '',
          city: '',
          state: '',
          zipcode: ''
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
    <div id="registration-form" className="w-full bg-white py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="w-16 h-[2px] bg-gradient-to-r from-transparent to-[#BD9B58]"></div>
            <span className="text-[#BD9B58] text-sm font-bold uppercase tracking-[0.3em]">Join Our Club</span>
            <div className="w-16 h-[2px] bg-gradient-to-l from-transparent to-[#BD9B58]"></div>
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bebas font-black text-black uppercase tracking-wider mb-4">
            PLAYER <span className="text-[#BD9B58]">INQUIRING</span>
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Fill out the form below to inquire about joining Eagles FC
          </p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white border-2 border-gray-200 p-8 md:p-12 shadow-lg">
          {/* Top gold accent line */}
          <div className="h-1 bg-gradient-to-r from-[#BD9B58] to-[#D4AF37] mb-8"></div>

          {/* Player Name Section */}
          <h3 className="text-xl font-bebas font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#BD9B58] text-white flex items-center justify-center font-bold">1</span>
            PLAYER INFORMATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="playerFirstName"
                value={formData.playerFirstName}
                onChange={handleInputChange}
                placeholder="First Name" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="playerLastName"
                value={formData.playerLastName}
                onChange={handleInputChange}
                placeholder="Last Name" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Suffix
              </label>
              <input 
                type="text" 
                name="playerSuffix"
                value={formData.playerSuffix}
                onChange={handleInputChange}
                placeholder="Jr., Sr., etc." 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
              />
            </div>
          </div>

          {/* Player Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Gender <span className="text-red-500">*</span>
              </label>
              <select 
                name="playerGender"
                value={formData.playerGender}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
                required
              >
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Date of Birth <span className="text-red-500">*</span>
              </label>
              <input 
                type="date"
                name="playerBirthday"
                value={formData.playerBirthday}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Position <span className="text-red-500">*</span>
              </label>
              <select 
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300"
                required
              >
                <option value="Goalkeeper">Goalkeeper</option>
                <option value="Defender">Defender</option>
                <option value="Midfield">Midfield</option>
                <option value="Forward">Forward</option>
                <option value="Anywhere">Anywhere</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Current Club
              </label>
              <input 
                type="text" 
                name="currentClub"
                value={formData.currentClub}
                onChange={handleInputChange}
                placeholder="Current club name"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
              />
            </div>
          </div>

          {/* Team Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Team Name
              </label>
              <input 
                type="text" 
                name="teamName"
                value={formData.teamName}
                onChange={handleInputChange}
                placeholder="Current team name"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
              />
            </div>
            
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Years Playing
              </label>
              <input 
                type="text" 
                name="yearsPlaying"
                value={formData.yearsPlaying}
                onChange={handleInputChange}
                placeholder="Number of years"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Soccer Experience
              </label>
              <input 
                type="text" 
                name="soccerExperience"
                value={formData.soccerExperience}
                onChange={handleInputChange}
                placeholder="Other experience"
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200 my-8"></div>

          {/* Parent/Guardian Information */}
          <h3 className="text-xl font-bebas font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#BD9B58] text-white flex items-center justify-center font-bold">2</span>
            PARENT OR GUARDIAN INFORMATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="parentFirstName"
                value={formData.parentFirstName}
                onChange={handleInputChange}
                placeholder="First Name" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="parentLastName"
                value={formData.parentLastName}
                onChange={handleInputChange}
                placeholder="Last Name" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Suffix
              </label>
              <input 
                type="text" 
                name="parentSuffix"
                value={formData.parentSuffix}
                onChange={handleInputChange}
                placeholder="Jr., Sr., etc." 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
              />
            </div>
          </div>

          {/* Contact Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input 
                type="email" 
                name="parentEmail"
                value={formData.parentEmail}
                onChange={handleInputChange}
                placeholder="parent@example.com" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input 
                type="tel" 
                name="parentPhone"
                value={formData.parentPhone}
                onChange={handleInputChange}
                placeholder="(402) 555-0123" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
          </div>

          {/* Divider */}
          <div className="border-t-2 border-gray-200 my-8"></div>

          {/* Address Section */}
          <h3 className="text-xl font-bebas font-bold text-black uppercase tracking-wider mb-4 flex items-center gap-3">
            <span className="w-8 h-8 bg-[#BD9B58] text-white flex items-center justify-center font-bold">3</span>
            ADDRESS INFORMATION
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-8">
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Street <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Street Address" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                City <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                placeholder="City" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                State <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="state"
                value={formData.state}
                onChange={handleInputChange}
                placeholder="State" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
            <div>
              <label className="block text-sm font-bold text-gray-700 uppercase tracking-wider mb-2">
                Zipcode <span className="text-red-500">*</span>
              </label>
              <input 
                type="text" 
                name="zipcode"
                value={formData.zipcode}
                onChange={handleInputChange}
                placeholder="Zipcode" 
                className="w-full px-4 py-3 border-2 border-gray-200 focus:border-[#BD9B58] focus:outline-none transition-colors duration-300" 
                required 
              />
            </div>
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
                Submitting Inquiry...
              </span>
            ) : (
              'Submit Inquiry'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;