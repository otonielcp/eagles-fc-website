"use client";

import { useState, useEffect } from "react";
import { getActiveCoaches } from "@/actions/staff";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { X, Plus } from "lucide-react";
import { motion } from "framer-motion";
const defaultCoachImage = "/coachimg.png";

const CoachCard = ({
  name,
  position,
  image,
  teamName,
  biography,
  nationality,
  socialMedia,
  onClick,
  index
}: {
  name: string,
  position: string,
  image?: string,
  teamName?: string,
  biography?: string,
  nationality?: string,
  socialMedia?: {
    instagram?: string,
    twitter?: string,
    facebook?: string
  },
  onClick: () => void,
  index: number
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative group rounded-2xl shadow-2xl overflow-hidden cursor-pointer max-w-[400px] mx-auto transform hover:scale-[1.02] transition-all duration-500"
    >
      {/* Outer glow effect on hover */}
      <div className="absolute -inset-1 bg-gradient-to-r from-[#C5A464] via-[#BD9B58] to-[#C5A464] rounded-2xl opacity-0 group-hover:opacity-20 blur-xl transition-opacity duration-500 -z-10"></div>
      
      {/* Image Container with enhanced styling */}
      <div
        className="h-[480px] relative overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-black"
      >
        {/* Background pattern overlay */}
        <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition-opacity duration-500"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, #C5A464 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        ></div>
        
        <div className="relative h-full w-full">
          <img
            src={image ? image : '/default.jpg'}
            alt={name}
            className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
          />
          
          {/* Multi-layer gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-br from-[#C5A464]/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          
          {/* Shine effect on hover */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
        </div>
        
        {/* Enhanced decorative corner accents */}
        <div className="absolute top-6 right-6 w-16 h-16">
          <div className="absolute top-0 right-0 w-12 h-12 border-t-2 border-r-2 border-[#C5A464] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
          <div className="absolute top-2 right-2 w-8 h-8 border-t border-r border-[#C5A464]/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        </div>
        
        <div className="absolute bottom-6 left-6 w-16 h-16">
          <div className="absolute bottom-0 left-0 w-12 h-12 border-b-2 border-l-2 border-[#C5A464] opacity-0 group-hover:opacity-100 transition-all duration-500 transform group-hover:scale-110"></div>
          <div className="absolute bottom-2 left-2 w-8 h-8 border-b border-l border-[#C5A464]/50 opacity-0 group-hover:opacity-100 transition-all duration-700"></div>
        </div>
      </div>

      {/* Enhanced Text Content with better styling */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-[#C5A464] via-[#C5A464] to-[#BD9B58] py-7 px-6 transform group-hover:shadow-2xl transition-all duration-300">
        {/* Decorative top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
        
        <div className="relative">
          <h3 className="text-white font-bold text-2xl mb-2 group-hover:text-gray-50 transition-colors duration-300 leading-tight">
            {name}
          </h3>
          
          <div className="flex items-center gap-2 mb-3">
            <div className="h-0.5 w-8 bg-white/60 group-hover:w-12 group-hover:bg-white transition-all duration-300"></div>
            <p className="text-white/95 text-sm uppercase tracking-wider font-semibold">
              {position}
            </p>
          </div>
          
          {/* Show team name if available */}
          {teamName && (
            <div className="mb-4 flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white/80"></div>
              <p className="text-white/90 text-xs italic font-light">
                {teamName}
              </p>
            </div>
          )}
          
          {/* Enhanced Plus Icon with better styling */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex-1"></div>
            <motion.div
              whileHover={{ scale: 1.15, rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              className="w-10 h-10 rounded-full flex items-center justify-center cursor-pointer bg-[#181819] hover:bg-[#0a0a0a] transition-all duration-300 shadow-xl group-hover:shadow-2xl border-2 border-white/20 group-hover:border-white/40"
              onClick={(e) => {
                e.stopPropagation();
                onClick();
              }}
            >
              <Plus className="w-5 h-5 text-white" strokeWidth={3} />
            </motion.div>
          </div>
        </div>
      </div>
      
      {/* Bottom accent line */}
      <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#C5A464] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
    </motion.div>
  );
};

const CoachesList = () => {
  // State to store coaches data
  const [coaches, setCoaches] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCoach, setSelectedCoach] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch coaches data on component mount
  useEffect(() => {
    const fetchCoaches = async () => {
      try {
        const coachesData = await getActiveCoaches();
        setCoaches(coachesData);
      } catch (error) {
        console.error("Failed to fetch coaches:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCoaches();
  }, []);

  // Handler for opening the coach details modal
  const handleCoachClick = (coach: any) => {
    setSelectedCoach(coach);
    setIsModalOpen(true);
  };

  // Show loading state
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-playfair italic text-gray-800 mb-6">Coaching Staff</h2>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#C5A464]"></div>
          </div>
          <p className="text-gray-600 mt-4">Loading coaching staff information...</p>
        </motion.div>
      </div>
    );
  }

  // If no coaches found, display a message
  if (coaches.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-4xl sm:text-5xl font-playfair italic text-gray-800 mb-6">Coaching Staff</h2>
          <p className="text-gray-600 text-lg">No coaching staff information available at this time.</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 bg-gradient-to-b from-white to-gray-50">
      {/* Enhanced Title Section */}
      <motion.div
        initial={{ opacity: 0, y: -30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16"
      >
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-playfair italic text-gray-800 mb-4">
          Coaching Staff
        </h2>
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: "120px" }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-1 bg-gradient-to-r from-transparent via-[#C5A464] to-transparent mx-auto"
        ></motion.div>
        <p className="text-gray-600 mt-6 text-lg font-light max-w-2xl mx-auto">
          Meet our dedicated coaching team committed to developing excellence on and off the pitch
        </p>
      </motion.div>

      {/* Enhanced Grid Layout with better spacing */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 lg:gap-12 xl:gap-14">
        {coaches.map((coach, index) => (
          <CoachCard
            key={coach._id}
            name={coach.displayName}
            position={coach.role}
            image={coach.image}
            teamName={coach.teamId?.name} // Display team name if available
            biography={coach.biography}
            nationality={coach.nationality}
            socialMedia={coach.socialMedia}
            onClick={() => handleCoachClick(coach)}
            index={index}
          />
        ))}
      </div>

      {/* Enhanced Coach Details Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto p-0">
          {selectedCoach && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              <DialogHeader className="px-6 pt-6 pb-4 border-b border-gray-200">
                <DialogTitle className="text-3xl font-playfair italic text-gray-800 flex items-center justify-between">
                  {selectedCoach.displayName}
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="rounded-full p-2 hover:bg-gray-100 transition-colors duration-200"
                  >
                    <X className="h-5 w-5 text-gray-600" />
                  </button>
                </DialogTitle>
              </DialogHeader>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
                {/* Image Section */}
                <div className="md:col-span-1">
                  <div className="relative overflow-hidden rounded-lg shadow-xl">
                    <img
                      src={selectedCoach.image || defaultCoachImage}
                      alt={selectedCoach.displayName}
                      className="w-full rounded-lg object-cover h-auto max-h-[450px]"
                    />
                    {/* Decorative corner accents */}
                    <div className="absolute top-4 right-4 w-16 h-16 border-t-2 border-r-2 border-[#C5A464]"></div>
                    <div className="absolute bottom-4 left-4 w-16 h-16 border-b-2 border-l-2 border-[#C5A464]"></div>
                  </div>
                </div>

                {/* Information Section */}
                <div className="md:col-span-1 space-y-6">
                  <div className="border-l-4 border-[#C5A464] pl-4">
                    <h3 className="font-semibold text-sm uppercase tracking-wide text-[#C5A464] mb-1">Position</h3>
                    <p className="text-gray-800 text-lg font-medium">{selectedCoach.role}</p>
                  </div>

                  {selectedCoach.teamId?.name && (
                    <div className="border-l-4 border-[#C5A464] pl-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-[#C5A464] mb-1">Team</h3>
                      <p className="text-gray-800 text-lg font-medium">{selectedCoach.teamId.name}</p>
                    </div>
                  )}

                  {selectedCoach.nationality && (
                    <div className="border-l-4 border-[#C5A464] pl-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-[#C5A464] mb-1">Nationality</h3>
                      <p className="text-gray-800 text-lg font-medium">{selectedCoach.nationality}</p>
                    </div>
                  )}

                  {/* Enhanced Social Media Links */}
                  {selectedCoach.socialMedia && (
                    <div className="pt-4">
                      <h3 className="font-semibold text-sm uppercase tracking-wide text-[#C5A464] mb-3">Connect</h3>
                      <div className="flex gap-4">
                        {selectedCoach.socialMedia.instagram && (
                          <a
                            href={`https://instagram.com/${selectedCoach.socialMedia.instagram}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#C5A464] hover:text-white transition-all duration-300 transform hover:scale-110"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"></line></svg>
                          </a>
                        )}
                        {selectedCoach.socialMedia.twitter && (
                          <a
                            href={`https://twitter.com/${selectedCoach.socialMedia.twitter}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#C5A464] hover:text-white transition-all duration-300 transform hover:scale-110"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path></svg>
                          </a>
                        )}
                        {selectedCoach.socialMedia.facebook && (
                          <a
                            href={`https://facebook.com/${selectedCoach.socialMedia.facebook}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 hover:bg-[#C5A464] hover:text-white transition-all duration-300 transform hover:scale-110"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path></svg>
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Enhanced Biography Section */}
              {selectedCoach.biography && (
                <div className="px-6 pb-6 pt-4 bg-gray-50 border-t border-gray-200">
                  <h3 className="font-semibold text-lg text-[#C5A464] mb-4 uppercase tracking-wide">Biography</h3>
                  <p className="text-gray-700 leading-relaxed text-base font-light">{selectedCoach.biography}</p>
                </div>
              )}
            </motion.div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CoachesList;