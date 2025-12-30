
const contactImage = "/heroimage1.jpeg"

const SponsorshipContactForm = () => {
  return (
    <div className="w-full my-10 min-h-screen bg-white flex flex-col lg:flex-row">
      
      {/* Left Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center   justify-center px-6 sm:px-10 md:px-16 lg:px-20  mb-10 lg:mb-0  ">
        <div className="w-full max-w-lg">
          <h2 className="text-2xl font-semibold mb-6">SPONSORSHIP INQUIRY</h2>

          <form className="space-y-6">
            {/* Name Fields */}
            <div>
              <label className="block text-sm font-medium">
                Name <span className="text-red-500">*</span>
              </label>
              <div className="flex flex-col sm:flex-row sm:space-x-4 mt-1">
                <div className="flex-1">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">First</p>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                    className="w-full p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400"
                  />
                  <p className="text-xs text-gray-500 mt-1">Email</p>
                </div>
                <div className="flex-1 mt-4 sm:mt-0">
                  <input
                    type="email"
                    className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
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
                  className="w-full p-2 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
                  defaultValue="+966 5054 3413"
                />
              </div>
            </div>

            {/* Message Field */}
            <div>
              <label className="block text-sm font-medium">
                Message <span className="text-red-500">*</span>
              </label>
              <textarea
                className="w-full p-2 border border-gray-300  focus:outline-none focus:ring-2 focus:ring-gray-400 mt-1"
                rows={4}
              ></textarea>
            </div>

            {/* Submit Button */}
            <button className="bg-[#C6A76D] text-sm text-white py-3 px-6 rounded-md hover:bg-[#b5925d] transition w-full sm:w-auto">
              Submit
            </button>
          </form>
        </div>
      </div>

      {/* Right Side - Image */}
      <div className="w-full  lg:w-1/2 h-64 lg:h-auto">
        <img
          src={contactImage}
          alt="Soccer Team"
          className="w-full h-full object-cover"
        />
      </div>

    </div>
  );
};

export default SponsorshipContactForm;
