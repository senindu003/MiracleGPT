// src/subcomponents/Episodes.jsx
import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { enhanceStory, saveStory } from "../api";

export default function Episodes({ storyData, currentUser, onStorySaved }) {
  const navigate = useNavigate();

  const handleSave = async () => {
    const res = await saveStory({ author: currentUser, story, title });
    // res expected: { message, user_details, story_id, title }
    onStorySaved?.({
      id: res.story_id, // or whatever field your backend returns
      title: res.title,
      user_details: res.user_details,
    });
  };

  const [path, setPath] = useState(["episode_1"]);
  const [expandedEpisodes, setExpandedEpisodes] = useState(
    new Set(["episode_1"])
  );
  const [showFullStory, setShowFullStory] = useState(false);
  const [fullStoryText, setFullStoryText] = useState("");
  const [storyTitle, setStoryTitle] = useState("Untitled Wireframe");
  const [isEnhancing, setIsEnhancing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [count, setCount] = useState(0);
  const [changeTitle, setChangeTitle] = useState(false);
  const episodeRefs = useRef({});

  useEffect(() => {
    console.log("Story data received in Episodes:", storyData);
    if (storyData && Object.keys(storyData).length > 0) {
      console.log("First episode structure:", storyData.episode_1);
      console.log("Choices structure:", storyData.episode_1?.choices);
    }
  }, [storyData]);

  const getEpisodeByPathIndex = (index) => {
    let node = null;
    for (let i = 0; i <= index; i++) {
      const key = path[i];
      if (i % 2 === 0) {
        node = storyData[key];
        if (!node) {
          console.log(`No episode found at index ${i}, key: ${key}`);
          return null;
        }
      } else {
        if (node && node.choices) {
          let foundChoice = null;
          Object.values(node.choices).forEach((choiceObj) => {
            if (choiceObj.text === key) {
              foundChoice = choiceObj;
            }
          });
          node = foundChoice;
          if (!node) {
            console.log(`No choice found at index ${i}, text: ${key}`);
            return null;
          }
        } else {
          console.log(`No choices found at index ${i} for node`);
          return null;
        }
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

    if (!currentEpisode || !currentEpisode.choices) {
      console.error("No choices found in current episode");
      return;
    }

    console.log("Current episode choices:", currentEpisode.choices);

    let nextEpisodeKey = null;

    Object.entries(currentEpisode.choices).forEach(([choiceKey, choiceObj]) => {
      console.log(`Choice key: ${choiceKey}`, choiceObj);
      if (choiceObj.text === choiceText) {
        nextEpisodeKey = choiceObj.leads_to || choiceObj.next_episode;
        console.log("Found next episode:", nextEpisodeKey);
      }
    });

    if (!nextEpisodeKey) {
      console.error("Could not find next episode for choice:", choiceText);
      return;
    }

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
      if (episode) {
        const storyText = episode.content || episode.story;
        if (storyText) {
          stories.push(storyText.trim());
        }
      }
    }
    setFullStoryText(stories.join("\n"));
  };

  const handleGetStory = () => {
    updateFullStory();
    setShowFullStory(true);
    setStoryTitle("Untitled Wireframe");
  };

  const handleEnhanceStory = async () => {
    const agreed = confirm(
      "Are you sure you want to build up the story according to chosen wireframe?"
    );
    if (!agreed) return;
    setIsEnhancing(true);
    const preferredTitle = storyTitle;
    setStoryTitle("Building your story...");
    try {
      const data = await enhanceStory(fullStoryText);

      setFullStoryText(data.enhancedStory);
      preferredTitle === "Untitled Wireframe"
        ? setStoryTitle(data.title)
        : setStoryTitle(preferredTitle);

      if (data.error) {
        throw new Error(data.error);
      }
      setCount((prev) => prev + 1);
    } catch (error) {
      console.error(error);
      alert(error);
    } finally {
      setIsEnhancing(false);
    }
  };

  const handleSaveStory = async () => {
    const shouldSave = confirm("Are you sure you want to save this story?");
    if (!shouldSave) return;
    setIsSaving(true);
    try {
      const data = await saveStory({
        author: currentUser,
        story: fullStoryText,
        title: storyTitle,
      });

      localStorage.setItem("user", JSON.stringify(data.user_details));
      alert(data.message);
      navigate("/home", {
        replace: false,
      });
    } catch (error) {
      console.error(error);
      alert(error);
      setIsSaving(false);
    }
  };

  const renderEpisodes = () => {
    const elements = [];
    for (let i = 0; i < path.length; i += 2) {
      const episode = getEpisodeByPathIndex(i);
      if (!episode) {
        console.error(`No episode found at index ${i}, path: ${path}`);
        break;
      }

      const isEnding =
        !episode.choices || Object.keys(episode.choices).length === 0;
      const selectedChoice = path[i + 1] || null;
      const episodeId = path[i];

      const isExpanded = expandedEpisodes.has(episodeId);

      const storyText = episode.content || episode.story || "No story content";

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
            {episode.title || `Episode ${episodeId}`}
          </button>

          <div
            className={`transition-max-height duration-500 ease-in-out overflow-hidden px-6 ${
              isExpanded ? "max-h-[2000px] py-4" : "max-h-0 py-0"
            } text-gray-700 text-lg whitespace-pre-line`}
            aria-hidden={!isExpanded}
          >
            <div>{storyText}</div>

            {isEnding ? (
              <div className="pt-4 text-center text-purple-900 font-semibold">
                The End.
              </div>
            ) : (
              <div className="pt-6 space-x-4 flex flex-row justify-between items-center">
                {episode.choices &&
                  Object.values(episode.choices).map((choiceObj, idx) => {
                    const choiceText = choiceObj.text || `Choice ${idx + 1}`;
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
    lastEpisode &&
    (!lastEpisode.choices || Object.keys(lastEpisode.choices).length === 0);
  const isLastEpisodeExpanded = expandedEpisodes.has(lastEpisodeId);

  if (!storyData || Object.keys(storyData).length === 0) {
    return (
      <div className="max-w-7xl mx-auto p-6 bg-purple-50 min-h-screen flex flex-col items-center justify-center">
        <h1 className="text-4xl font-extrabold mb-6 text-purple-800 text-center">
          No Story Generated
        </h1>
        <p className="text-gray-600 text-lg">Please generate a story first.</p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6 bg-purple-50 min-h-screen flex flex-col relative">
      <h1 className="text-4xl font-extrabold mb-6 text-purple-800 text-center">
        Story Wireframe
      </h1>

      <div
        className={`grow bg-transparent transition-opacity duration-500 ease-in-out ${
          showFullStory
            ? "opacity-50 pointer-events-none select-none"
            : "opacity-100"
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
              Restart 🔄
            </button>
            <button
              onClick={handleGetStory}
              className="rounded-md bg-green-600 text-white py-2 px-4 hover:bg-green-500 transition"
            >
              Get Wireframe
            </button>
          </div>
        )}
      </div>

      {showFullStory && (
        <div
          className="fixed inset-0 flex items-center justify-center z-50 p-4 pointer-events-none"
          disabled={isEnhancing}
        >
          <div
            className="relative bg-white rounded shadow-lg max-w-3xl w-full max-h-[80vh] flex flex-col p-6 pointer-events-auto"
            style={{ minWidth: "320px" }}
          >
            <button
              onClick={() => {
                setShowFullStory(false);
                setCount(0);
                setIsSaving(false);
              }}
              className="absolute top-2 right-2 rounded-md  text-white py-2 px-4 hover:cursor-pointer transition disabled:opacity-20 disabled:cursor-not-allowed"
              disabled={isEnhancing}
            >
              ✖️
            </button>
            <div>
              <label
                onClick={() => setChangeTitle(true)}
                htmlFor="fullStoryTextarea"
                className="font-semibold text-purple-800 mb-2 inline-block"
              >
                {!changeTitle && storyTitle}
                {changeTitle && (
                  <div>
                    <input
                      type="text"
                      value={storyTitle}
                      onChange={(e) => setStoryTitle(e.target.value)}
                      className="w-full p-2 border border-purple-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 "
                    />
                  </div>
                )}
              </label>
              {changeTitle ? (
                <button
                  className="rounded-md bg-green-600 text-[12px] text-white py-1 px-3 ml-2 hover:bg-green-500 transition disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={isEnhancing}
                  onClick={() => setChangeTitle(false)}
                >
                  OK
                </button>
              ) : (
                <button
                  className="rounded-md bg-blue-600 text-[12px] text-white py-1 px-3 ml-2 hover:bg-blue-500 transition disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={isEnhancing}
                  onClick={() => setChangeTitle(true)}
                >
                  Edit Title
                </button>
              )}
            </div>
            <textarea
              id="fullStoryTextarea"
              value={fullStoryText}
              onChange={(e) => setFullStoryText(e.target.value)}
              className="resize-none grow p-2 border border-purple-300 rounded text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 "
              style={{ minHeight: "300px" }}
              disabled={isEnhancing}
            />
            <div className="mt-4 flex justify-start gap-5 items-center">
              <button
                onClick={() => {
                  count >= 1
                    ? alert("New feature is coming soon ...")
                    : handleEnhanceStory();
                }}
                className="relative rounded-md bg-blue-600 text-white py-2 px-4 hover:bg-blue-500 transition disabled:opacity-20 disabled:cursor-not-allowed"
                disabled={isEnhancing}
              >
                {count >= 1 ? "Enhance more 🧙🏻‍♂️" : "Let's Build Up Story 🚀"}
                {!count >= 1 && (
                  <span
                    className="absolute top-1 right-1 size-3 animate-ping rounded-full bg-red-700"
                    disabled={isEnhancing}
                  ></span>
                )}
              </button>
              {count >= 1 && (
                <button
                  onClick={handleSaveStory}
                  className="rounded-md bg-green-600 text-white py-2 px-4 hover:bg-green-500 transition disabled:opacity-20 disabled:cursor-not-allowed"
                  disabled={isSaving}
                >
                  Save to Library 📥
                </button>
              )}
              {count >= 1 && (
                <button
                  onClick={() => {
                    localStorage.setItem("pdfTitle", storyTitle);
                    localStorage.setItem("pdfContent", fullStoryText);
                    window.open("/pdf_preview", "_blank", "titlebar=0");
                  }}
                  className="rounded-md bg-pink-600 text-white py-2 px-4 hover:bg-pink-500 transition disabled:opacity-20 disabled:cursor-not-allowed"
                >
                  Download Story ⬇️
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
