import React, { useState, useRef, useEffect } from "react";
import Episodes from "../subcomponents/Episodes";
import PromptSpace from "../subcomponents/PromptSpace";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [storyData, setStoryData] = useState({});
  const [isGenerating, setIsGenerating] = useState(false); // New loading state
  const episodesRef = useRef(null);

  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);

  const scrollToEpisodes = () => {
    if (episodesRef.current) {
      episodesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Function passed to PromptSpace to update the story data
  // In Home.jsx, update the handleStoryGenerated function:
const handleStoryGenerated = (newStoryData) => {
  console.log("Received story data in Home:", newStoryData); // Add this
  setStoryData(newStoryData);
  setIsGenerating(false); // Stop loading when data arrives
  scrollToEpisodes();
};
  // Function to start generation
  const handleStartGeneration = () => {
    setIsGenerating(true); // Start loading when button is clicked
  };

  // Scroll to top on page load
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      {/* Fixed hamburger button always visible */}
      <button
        onClick={openNav}
        className="fixed top-5 left-5 z-1100 text-white bg-gray-900 px-3 py-1.5 text-lg rounded hover:bg-gray-700 focus:outline-none"
        aria-label="Open sidebar"
      >
        &#9776;
      </button>

      {/* Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full bg-gray-900 overflow-x-hidden transition-all duration-500 pt-16 z-1000 ${
          isOpen ? "w-64" : "w-0"
        }`}
        style={{ paddingTop: "60px" }}
      >
        <button
          onClick={closeNav}
          className="absolute top-0 right-6 text-white text-4xl font-bold focus:outline-none"
          aria-label="Close sidebar"
        >
          &times;
        </button>
        <nav
          className={`flex flex-col space-y-4 pl-8 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          <a
            href="#"
            className="text-gray-400 text-[20px] hover:text-gray-100 transition-colors"
          >
            About
          </a>
          <a
            href="#"
            className="text-gray-400 text-2xl hover:text-gray-100 transition-colors"
          >
            Services
          </a>
          <a
            href="#"
            className="text-gray-400 text-2xl hover:text-gray-100 transition-colors"
          >
            Clients
          </a>
          <a
            href="#"
            className="text-gray-400 text-2xl hover:text-gray-100 transition-colors"
          >
            Contact
          </a>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`relative transition-margin duration-500 p-4 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        {/* Pass the handler functions down to PromptSpace */}
        <PromptSpace 
          onGenerate={() => {
            handleStartGeneration(); // Set loading state
            scrollToEpisodes(); // Scroll to episodes
          }} 
          onStoryGenerated={handleStoryGenerated} 
        /> 
        
        <div ref={episodesRef} className={`transition-opacity duration-300 ${isGenerating ? 'opacity-50' : 'opacity-100'}`}>
          {/* Show loading spinner while generating */}
          {isGenerating && (
            <div className="text-center mt-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-purple-700 text-xl">Generating your story...</p>
            </div>
          )}
          
          {/* Show episodes when story data is available */}
          {!isGenerating && storyData && Object.keys(storyData).length > 0 ? (
            <Episodes storyData={storyData} />
          ) : (
            /* Only show the placeholder when not generating and no story data */
            !isGenerating && (
              <div className="text-center text-gray-500 mt-10 text-xl">
                Enter your parameters above to generate a new interactive story!
              </div>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default Home;