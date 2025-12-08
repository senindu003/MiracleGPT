import React, { useState, useRef, useEffect } from "react";

export default function Episodes({ storyData }) {
  const [path, setPath] = useState(["episode_1"]);
  const [expandedEpisodes, setExpandedEpisodes] = useState(new Set(["episode_1"]));
  const [showFullStory, setShowFullStory] = useState(false);
  const [fullStoryText, setFullStoryText] = useState("");
  const episodeRefs = useRef({});

  const getEpisodeByPathIndex = (index) => {
    let node = storyData;
    for (let i = 0; i <= index; i++) {
      const key = path[i];
      if (!node) return null;
      if (i === 0) {
        node = node[key];
      } else if (i % 2 === 1) {
        node = node.choices ? node.choices[key] : null;
      } else {
        node = node[key];
      }
    }
    return node;
  };

  const scrollToEpisode = (episodeId) => {
    const el = episodeRefs.current[episodeId];
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleChoice = (choiceText, episodeIndex) => {
    const newPath = path.slice(0, episodeIndex + 1);
    const currentEpisode = getEpisodeByPathIndex(episodeIndex);
    const choiceObj = currentEpisode.choices[choiceText];
    const nextEpisodeKey = Object.keys(choiceObj)[0];
    const updatedPath = [...newPath, choiceText, nextEpisodeKey];
    setPath(updatedPath);

    setExpandedEpisodes((prev) => new Set(prev).add(nextEpisodeKey));

    if (showFullStory) {
      updateFullStory(updatedPath);
    }

    setTimeout(() => {
      scrollToEpisode(nextEpisodeKey);
    }, 100);
  };

  const handleBack = () => {
    setPath((prev) => (prev.length > 1 ? prev.slice(0, -2) : prev));
  };

  const handleRestart = () => {
    setPath(["episode_1"]);
    setExpandedEpisodes(new Set(["episode_1"]));
    setShowFullStory(false);
    setFullStoryText("");
  };

  const toggleExpanded = (episodeId) => {
    setExpandedEpisodes((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(episodeId)) {
        newSet.delete(episodeId);
      } else {
        newSet.add(episodeId);
      }
      return newSet;
    });
  };

  useEffect(() => {
    expandedEpisodes.forEach((episodeId) => {
      const el = episodeRefs.current[episodeId];
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
  }, [expandedEpisodes]);

  const updateFullStory = (currentPath = path) => {
    const stories = [];
    for (let i = 0; i < currentPath.length; i += 2) {
      const episode = getEpisodeByPathIndex(i);
      if (episode && episode.story) {
        stories.push(episode.story.trim());
      }
    }
    setFullStoryText(stories.join("\n"));
  };

  const handleGetStory = () => {
    updateFullStory();
    setShowFullStory(true);
  };

  const renderEpisodes = () => {
    const elements = [];
    for (let i = 0; i < path.length; i += 2) {
      const episode = getEpisodeByPathIndex(i);
      if (!episode) break;

      const isEnding = !episode.choices || Object.keys(episode.choices).length === 0;
      const selectedChoice = path[i + 1] || null;
      const episodeId = path[i];

      const isExpanded = expandedEpisodes.has(episodeId);

      elements.push(
        <div
          key={episodeId}
          className="border border-purple-300 rounded mb-4 bg-white shadow"
          ref={(el) => (episodeRefs.current[episodeId] = el)}
        >
          <button
            type="button"
            className="w-full text-left px-6 py-3 bg-purple-200 hover:bg-purple-300 font-semibold text-purple-800 rounded-t"
            onClick={() => toggleExpanded(episodeId)}
            aria-expanded={isExpanded}
            disabled={showFullStory}
          >
            {episode.title}
          </button>

          <div
            className={`transition-max-height duration-500 ease-in-out overflow-hidden px-6 ${
              isExpanded ? "max-h-[2000px] py-4" : "max-h-0 py-0"
            } text-gray-700 text-lg whitespace-pre-line`}
            aria-hidden={!isExpanded}
          >
            <div>{episode.story}</div>

            {isEnding ? (
              <div className="pt-4 text-center text-purple-900 font-semibold">The End.</div>
            ) : (
              <div className="pt-6 space-x-4 flex flex-row justify-between items-center">
                {Object.entries(episode.choices).map(([choiceText]) => {
                  const isSelected = choiceText === selectedChoice;
                  return (
                    <button
                      key={choiceText}
                      onClick={() => handleChoice(choiceText, i)}
                      className={`px-4 py-2 text-[16px] rounded-md transition ${
                        isSelected
                          ? "bg-purple-900 text-white cursor-default"
                          : "bg-purple-700 text-white hover:bg-purple-600"
                      }`}
                      disabled={isSelected || showFullStory}
                      aria-current={isSelected ? "true" : undefined}
                    >
                      {choiceText}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      );
    }
    return elements;
  };

  const lastEpisodeIndex = path.length - 1;
  const lastEpisodeId = path[lastEpisodeIndex];
  const lastEpisode = getEpisodeByPathIndex(lastEpisodeIndex);
  const isLastEpisodeEnding =
    lastEpisode && (!lastEpisode.choices || Object.keys(lastEpisode.choices).length === 0);
  const isLastEpisodeExpanded = expandedEpisodes.has(lastEpisodeId);

  return (
    <div className="max-w-7xl mx-auto p-6 bg-purple-50 min-h-screen flex flex-col relative">
      <h1 className="text-4xl font-extrabold mb-6 text-purple-800 text-center">Enjoy the Story</h1>

      <div
        className={`grow bg-transparent transition-opacity duration-500 ease-in-out ${
          showFullStory ? "opacity-50 pointer-events-none select-none" : "opacity-100"
        }`}
      >
        {renderEpisodes()}

        {isLastEpisodeEnding && isLastEpisodeExpanded && (
          <div className="mt-6 flex space-x-4">
            <button
              onClick={handleRestart}
              className="rounded-md bg-purple-700 text-white py-2 px-4 hover:bg-purple-600 transition"
              disabled={showFullStory}
            >
              Restart Story 🔄
            </button>
            <button
              onClick={handleGetStory}
              className="rounded-md bg-green-600 text-white py-2 px-4 hover:bg-green-500 transition"
            >
              Get Story 📥
            </button>
          </div>
        )}
      </div>

      {showFullStory && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none">
          <div
            className="bg-white rounded shadow-lg max-w-3xl w-full max-h-[80vh] flex flex-col p-6 pointer-events-auto"
            style={{ minWidth: "320px" }}
          >
            <label htmlFor="fullStoryTextarea" className="font-semibold text-purple-800 mb-2">
              Full Story
            </label>
            <textarea
              id="fullStoryTextarea"
              value={fullStoryText}
              onChange={(e) => setFullStoryText(e.target.value)}
              className="resize-none grow p-2 border border-purple-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500"
              style={{ minHeight: "300px" }}
            />
            <div className="mt-4 flex justify-between items-center">
              <button
                onClick={() => {
                  alert("Enhance the story with a Title - feature coming soon!");
                }}
                className="rounded-md bg-blue-600 text-white py-2 px-4 hover:bg-blue-500 transition"
              >
                Enhance the story with a Title
              </button>
              <button
                onClick={() => setShowFullStory(false)}
                className="rounded-md bg-red-600 text-white py-2 px-4 hover:bg-red-500 transition"
              >
                Close ✖️
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
