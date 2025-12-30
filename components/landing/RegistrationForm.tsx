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
        setSubmitMessage('Registration submitted successfully!');
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
    <form onSubmit={handleSubmit} className="max-w-6xl mx-auto px-6 sm:px-8 py-12">
      {/* Player Name Section */}
      <h2 className="text-lg font-bold text-[#C5A464]">PLAYER NAME</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <input 
          type="text" 
          name="playerFirstName"
          value={formData.playerFirstName}
          onChange={handleInputChange}
          placeholder="FIRST" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="playerLastName"
          value={formData.playerLastName}
          onChange={handleInputChange}
          placeholder="LASTNAME" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="playerSuffix"
          value={formData.playerSuffix}
          onChange={handleInputChange}
          placeholder="Suffix" 
          className="shadow-inner text-sm p-3 w-full" 
        />
      </div>

      {/* Player Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-6">
        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">PLAYER GENDER</h2>
          <select 
            name="playerGender"
            value={formData.playerGender}
            onChange={handleInputChange}
            className="shadow-inner text-sm p-3 w-full mt-2 text-gray-500"
            required
          >
            <option value="MALE">MALE</option>
            <option value="FEMALE">FEMALE</option>
          </select>
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">PLAYER BIRTHDAY</h2>
          <input 
            type="date"
            name="playerBirthday"
            value={formData.playerBirthday}
            onChange={handleInputChange}
            className="shadow-inner text-sm p-3 w-full mt-2 text-gray-500"
            required
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">POSITION</h2>
          <select 
            name="position"
            value={formData.position}
            onChange={handleInputChange}
            className="shadow-inner p-3 text-sm w-full mt-2 text-gray-500"
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
          <h2 className="text-md font-bold text-[#C5A464]">CURRENT CLUB</h2>
          <input 
            type="text" 
            name="currentClub"
            value={formData.currentClub}
            onChange={handleInputChange}
            className="shadow-inner text-sm p-3 w-full mt-2" 
          />
        </div>
      </div>

      {/* Team Info Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-6">
        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">TEAM NAME</h2>
          <input 
            type="text" 
            name="teamName"
            value={formData.teamName}
            onChange={handleInputChange}
            className="shadow-inner text-sm p-3 w-full mt-2" 
          />
        </div>
        
        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">NUMBER OF YEARS PLAYING</h2>
          <input 
            type="text" 
            name="yearsPlaying"
            value={formData.yearsPlaying}
            onChange={handleInputChange}
            className="shadow-inner text-xs p-3 w-full mt-2" 
          />
        </div>

        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">OTHER PERTINENT SOCCER EXPERIENCE</h2>
          <input 
            type="text" 
            name="soccerExperience"
            value={formData.soccerExperience}
            onChange={handleInputChange}
            className="shadow-inner text-sm p-3 w-full mt-2" 
          />
        </div>
      </div>

      {/* Parent/Guardian Information */}
      <h2 className="text-lg font-bold text-gray-500 mt-8">PARENT OR GUARDIAN INFORMATION</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
        <input 
          type="text" 
          name="parentFirstName"
          value={formData.parentFirstName}
          onChange={handleInputChange}
          placeholder="FIRST" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="parentLastName"
          value={formData.parentLastName}
          onChange={handleInputChange}
          placeholder="LASTNAME" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="parentSuffix"
          value={formData.parentSuffix}
          onChange={handleInputChange}
          placeholder="Suffix" 
          className="shadow-inner text-sm p-3 w-full" 
        />
      </div>

      {/* Contact Info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">PARENT OR GUARDIAN EMAIL ADDRESS</h2>
          <input 
            type="email" 
            name="parentEmail"
            value={formData.parentEmail}
            onChange={handleInputChange}
            placeholder="Enter Email" 
            className="shadow-inner text-sm p-3 w-full mt-2" 
            required 
          />
        </div>
        <div>
          <h2 className="text-lg font-bold text-[#C5A464]">PARENT OR GUARDIAN PHONE*</h2>
          <input 
            type="tel" 
            name="parentPhone"
            value={formData.parentPhone}
            onChange={handleInputChange}
            placeholder="Enter Phone Number" 
            className="shadow-inner text-sm p-3 w-full mt-2" 
            required 
          />
        </div>
      </div>

      {/* Address Section */}
      <h2 className="text-lg font-bold text-[#C5A464] mt-6">ADDRESS</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-2">
        <input 
          type="text" 
          name="street"
          value={formData.street}
          onChange={handleInputChange}
          placeholder="Street" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="city"
          value={formData.city}
          onChange={handleInputChange}
          placeholder="City" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="state"
          value={formData.state}
          onChange={handleInputChange}
          placeholder="State" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
        <input 
          type="text" 
          name="zipcode"
          value={formData.zipcode}
          onChange={handleInputChange}
          placeholder="Zipcode" 
          className="shadow-inner text-sm p-3 w-full" 
          required 
        />
      </div>

      {/* Submit Message */}
      {submitMessage && (
        <div className={`mt-4 p-4 rounded ${submitMessage.includes('Error') ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
          {submitMessage}
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center mt-8">
        <button 
          type="submit"
          disabled={isSubmitting}
          className={`w-full sm:w-96 py-4 font-bold text-lg text-white ${
            isSubmitting 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-[#C5A464] hover:bg-[#B8986A]'
          }`}
        >
          {isSubmitting ? 'SENDING...' : 'SEND !'}
        </button>
      </div>
    </form>
  );
};

export default RegistrationForm;