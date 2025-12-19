// src/components/Home.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Episodes from "../subcomponents/Episodes";
import PromptSpace from "../subcomponents/PromptSpace";
import { getStory, deleteStory } from "../api";

const STORY_WIREFRAME_KEY = "miracle_story_wireframe_v1"; // storage key (versioned)

const Home = () => {
  const navigate = useNavigate();
  const episodesRef = useRef(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  // --- current user from localStorage ---
  let storedUser = null;
  try {
    const raw = localStorage.getItem("user");
    storedUser = raw ? JSON.parse(raw) : null;
  } catch {
    storedUser = null;
  }

  const current_user = storedUser || {
    username: "Guest",
    stories: { id: [], title: [] },
  };

  // --- UI state ---
  const [isOpen, setIsOpen] = useState(false);
  const [isStoriesOpen, setIsStoriesOpen] = useState(false);
  const [isMyStoriesOpen, setIsMyStoriesOpen] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  // --- Persisted storyData (restored on refresh) ---
  const [storyData, setStoryData] = useState(() => {
    try {
      const raw = sessionStorage.getItem(STORY_WIREFRAME_KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });

  // Whenever storyData changes, persist it
  useEffect(() => {
    try {
      if (storyData && Object.keys(storyData).length > 0) {
        sessionStorage.setItem(STORY_WIREFRAME_KEY, JSON.stringify(storyData));
      } else {
        sessionStorage.removeItem(STORY_WIREFRAME_KEY);
      }
    } catch {
      // ignore quota / storage errors
    }
  }, [storyData]);

  const [userStories, setUserStories] = useState(() => {
    const ids = current_user.stories?.id || [];
    const titles = current_user.stories?.title || [];
    return ids.map((id, idx) => ({ id, title: titles[idx] || "Untitled" }));
  });

  const openNav = () => setIsOpen(true);
  const closeNav = () => setIsOpen(false);

  const scrollToEpisodes = () => {
    if (episodesRef.current) {
      episodesRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleStoryGenerated = (newStoryData) => {
    console.log("Received story data in Home:", newStoryData);
    setStoryData(newStoryData);
    setIsGenerating(false);
    scrollToEpisodes();
  };

  const handleStorySaved = (savedData) => {
    if (savedData.user_details) {
      localStorage.setItem("user", JSON.stringify(savedData.user_details));
    }
    setUserStories((prev) => [
      ...prev,
      { id: savedData.id, title: savedData.title || "Untitled" },
    ]);
  };

  const handleStartGeneration = () => setIsGenerating(true);

  const handleGetStory = async (story_id) => {
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    try {
      const data = await getStory(story_id);
      localStorage.setItem("pdfTitle", data.title);
      localStorage.setItem("pdfContent", data.story);

      if (isMobile) navigate("/pdf_preview");
      else window.open("/pdf_preview", "_blank", "noopener,noreferrer");
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  const handleDeleteStory = async (story_id) => {
    const story = userStories.find((s) => s.id === story_id);
    const agreed = window.confirm(
      `Are you sure to delete "${story?.title}" story?`
    );
    if (!agreed) return;

    try {
      const data = await deleteStory(story_id);
      setUserStories((prev) => prev.filter((s) => s.id !== story_id));
      alert(data.message);
    } catch (error) {
      console.error(error.message);
      alert(error.message);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const clearCurrentWireframe = () => {
    setStoryData({});
    try {
      sessionStorage.removeItem(STORY_WIREFRAME_KEY);
    } catch {}
  };

  return (
    <>
      {/* Fixed hamburger button */}
      <button
        onClick={openNav}
        className="fixed top-5 left-5 z-200 text-white bg-gray-900 px-3 py-1.5 text-lg rounded hover:bg-gray-700 focus:outline-none"
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
          className={`flex flex-col space-y-6 pl-8 transition-opacity duration-300 ${
            isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
          }`}
        >
          {/* User Profile */}
          <div className="flex items-center space-x-4">
            <img
              src={current_user.profilePicUrl || "/no_photo.png"}
              alt={`${current_user.username || current_user}'s profile`}
              className="w-12 h-12 rounded-full object-cover border-2 border-purple-600"
            />
            <div>
              <p className="text-white font-semibold text-lg">
                {current_user.username || current_user || "Guest"}
              </p>
              <p className="text-gray-400 text-sm">Welcome back!</p>
            </div>
          </div>

          <a className="text-gray-400 text-lg hover:text-white transition-colors cursor-pointer">
            Profile
          </a>

          {/* Accordion: Stories */}
          <div>
            <button
              onClick={() => setIsStoriesOpen(!isStoriesOpen)}
              className="flex items-center justify-between w-full text-gray-400 text-lg hover:text-white transition-colors focus:outline-none"
              aria-expanded={isStoriesOpen}
              aria-controls="stories-accordion"
            >
              <span className="cursor-pointer">Library</span>
            </button>

            {isStoriesOpen && (
              <div
                id="stories-accordion"
                className="mt-2 ml-4 flex flex-col space-y-2"
              >
                <a
                  onClick={() => {
                    clearCurrentWireframe();
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  className="text-gray-400 text-base hover:text-white transition-colors cursor-pointer"
                >
                  Create New
                </a>

                <div>
                  <button
                    onClick={() => setIsMyStoriesOpen(!isMyStoriesOpen)}
                    className="flex items-center justify-between w-full text-gray-400 text-base hover:text-white transition-colors focus:outline-none cursor-pointer"
                    aria-expanded={isMyStoriesOpen}
                    aria-controls="my-stories-accordion"
                  >
                    <span>View Story</span>
                    <svg
                      className={`w-4 h-4 transform transition-transform duration-300 ${
                        isMyStoriesOpen ? "rotate-90" : ""
                      }`}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>

                  {isMyStoriesOpen && (
                    <div
                      id="my-stories-accordion"
                      className="mt-2 ml-4 flex flex-col space-y-1"
                    >
                      {userStories.length > 0 ? (
                        userStories.map((story) => (
                          <div className="mb-3" key={story.id}>
                            <a
                              onClick={() => handleGetStory(story.id)}
                              className="text-gray-400 text-sm hover:text-white transition-colors cursor-pointer leading-0.5"
                            >
                              <span className="text-[25px] mr-2">&#8226;</span>
                              {story.title}
                            </a>
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              width="16"
                              height="16"
                              fill="Red"
                              viewBox="0 0 16 16"
                              className="bi bi-trash cursor-pointer rounded-full inline-block ml-5"
                              onClick={() => handleDeleteStory(story.id)}
                            >
                              <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z" />
                              <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z" />
                            </svg>
                          </div>
                        ))
                      ) : (
                        <p className="text-gray-500 text-sm">
                          No stories found.
                        </p>
                      )}
                    </div>
                  )}
                </div>

                <a className="text-gray-400 text-base hover:text-white transition-colors cursor-pointer">
                  Favorites
                </a>
              </div>
            )}
          </div>

          <button
            onClick={() => {
              // Important: your old code called localStorage.clear() which deletes EVERYTHING
              // including other app data. Keep it targeted.
              localStorage.removeItem("token");
              localStorage.removeItem("user");
              try {
                sessionStorage.removeItem(STORY_WIREFRAME_KEY);
              } catch {}

              navigate("/login", { replace: true });
              closeNav();
            }}
            className="text-gray-400 text-lg hover:text-white transition-colors text-left cursor-pointer"
          >
            Log Out
          </button>
        </nav>
      </div>

      {/* Main content */}
      <div
        className={`relative transition-margin duration-500 p-4 ${
          isOpen ? "ml-64" : "ml-0"
        }`}
      >
        <PromptSpace
          onGenerate={() => {
            handleStartGeneration();
            scrollToEpisodes();
          }}
          onStoryGenerated={handleStoryGenerated}
        />

        <div
          ref={episodesRef}
          className={`transition-opacity duration-300 ${
            isGenerating ? "opacity-50" : "opacity-100"
          }`}
        >
          {isGenerating && (
            <div className="text-center mt-10">
              <div className="inline-block animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-600 mb-4"></div>
              <p className="text-purple-700 text-xl">
                Generating your story...
              </p>
            </div>
          )}

          {!isGenerating && storyData && Object.keys(storyData).length > 0 ? (
            <Episodes
              storyData={storyData}
              currentUser={current_user.username}
              onStorySaved={handleStorySaved}
            />
          ) : (
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
