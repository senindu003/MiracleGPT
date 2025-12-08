import React, { useState, Fragment } from "react";
import {
  Listbox,
  ListboxButton,
  ListboxOption,
  ListboxOptions,
  Transition,
} from "@headlessui/react";
import { Check, ChevronsUpDown } from "lucide-react";

const options = {
  theme: [
    "Fantasy 🧙‍♂️",
    "Science Fiction 🚀",
    "Mystery 🕵️‍♀️",
    "Romance 💕",
    "Adventure 🏞️",
    "Horror 👻",
    "Historical 🏰",
    "Comedy 😂",
    "Drama 🎭",
    "Thriller 🔪",
  ],
  mainCharacters: ["1", "2", "3", "4"],
  episodes: ["2", "3", "4"],
  wordsPerEpisode: ["50-100", "100-150", "150-200", "200-250"],
  choicesPerEpisode: ["2"],
  tone: [
    "Lucid 😊",
    "Dramatic 🎭",
    "Mysterious 🕵️‍♂️",
    "Dark / Gothic 🌑",
    "Humorous 😂",
    "Inspirational 🌟",
    "Emotional 💔",
    "Suspenseful 😰",
  ],
  setting: [
    "Medieval Kingdom 🏰",
    "Futuristic City 🌆",
    "Haunted House 👻",
    "Space Station 🛰️",
    "Enchanted Forest 🌲",
    "Post-Apocalyptic Wasteland ☢️",
    "Tropical Island 🏝️",
    "Small Town 🏡",
  ],
  audience: [
    "Children (ages 5-12)",
    "Teens (ages 13-18)",
    "Adults (18+)",
    "All Ages",
  ],
  emojis: ["Yes, use liberally 🎉✨", "Use sparingly 🙂", "No emojis ❌"],
  outputFormat: ["JSON", "Python Dictionary"], // NOTE: This field is not sent to backend (UserRequest doesn't have it)
  specialRequests: [
    "None",
    "No violence 🚫🔫",
    "Focus on friendship 🤝",
    "Include mystery elements 🔍",
    "Avoid horror elements 👻❌",
    "Include romance 💕",
    "Emphasize humor 😂",
    "Custom (enter in prompt below)",
  ],
};

function Dropdown({ label, options, selected, setSelected, id }) {
  return (
    <div className="w-full">
      <label
        htmlFor={id}
        className="block mb-1 font-medium text-purple-900 select-none"
      >
        {label}
      </label>
      <Listbox value={selected} onChange={setSelected}>
        <div className="relative mt-1">
          <ListboxButton
            className="relative w-full cursor-pointer rounded-md border-2 border-purple-400 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-1 sm:text-sm"
            id={id}
          >
            <span className="block truncate">{selected}</span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-5 w-5 text-purple-600" />
            </span>
          </ListboxButton>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ListboxOptions
              className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm"
              style={{ scrollbarWidth: "thin" }}
            >
              {options.map((option, idx) => (
                <ListboxOption
                  key={idx}
                  className={({ active }) =>
                    `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                      active ? "bg-purple-100 text-purple-900" : "text-gray-900"
                    }`
                  }
                  value={option}
                >
                  {({ selected, active }) => (
                    <>
                      <span
                        className={`block truncate ${
                          selected ? "font-semibold" : "font-normal"
                        }`}
                      >
                        {option}
                      </span>
                      {selected ? (
                        <span
                          className={`absolute inset-y-0 left-0 flex items-center pl-3 ${
                            active ? "text-purple-900" : "text-purple-600"
                          }`}
                        >
                          <Check className="h-5 w-5" />
                        </span>
                      ) : null}
                    </>
                  )}
                </ListboxOption>
              ))}
            </ListboxOptions>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

// Ensure the component accepts the new onStoryGenerated prop
const PromptSpace = ({ onGenerate, onStoryGenerated }) => { 
  // State hooks for all dropdowns
  const [theme, setTheme] = useState(options.theme[4]);
  const [mainCharacters, setMainCharacters] = useState(options.mainCharacters[2]);
  const [episodes, setEpisodes] = useState(options.episodes[2]);
  const [wordsPerEpisode, setWordsPerEpisode] = useState(options.wordsPerEpisode[3]);
  const [choicesPerEpisode, setChoicesPerEpisode] = useState(
    options.choicesPerEpisode[0]
  );
  const [tone, setTone] = useState(options.tone[0]);
  const [setting, setSetting] = useState(options.setting[6]);
  const [audience, setAudience] = useState(options.audience[1]);
  const [emojis, setEmojis] = useState(options.emojis[0]);
  const [specialRequests, setSpecialRequests] = useState(
    options.specialRequests[0]
  );
  const [additionalInstructions, setAdditionalInstructions] = useState("");
  const [isLoading, setIsLoading] = useState(false); // New state for loading

  const handleGenerate = async () => {
    // 1. Construct the prompt object matching the UserRequest Pydantic model
    const userRequestPayload = {
      theme,
      mainCharacters: parseInt(mainCharacters), // Ensure numbers are sent as integers
      episodes: parseInt(episodes),             // Ensure numbers are sent as integers
      wordsPerEpisode,
      choicesPerEpisode: parseInt(choicesPerEpisode), // Ensure numbers are sent as integers
      tone,
      setting,
      audience,
      emojis,
      specialRequests,
      additionalInstructions
    };
    
    setIsLoading(true); // Start loading

    try{
      // 2. Call the FastAPI endpoint that triggers the AI generation
      const response = await fetch("http://127.0.0.1:8000/userpromptreceived", { // Corrected endpoint
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userRequestPayload), // Send the structured user data
      });

      if(response.ok){
        // SUCCESS PATH (HTTP 200)
        const data = await response.json();
        
        // Data should be {"response": "<RAW_AI_JSON_STRING>"}
        const rawAiResponse = data.response; 

        try {
            const storyDataObject = JSON.parse(rawAiResponse);
            onStoryGenerated(storyDataObject); 
            onGenerate();
        } catch (jsonError) {
            console.error("Error parsing AI response JSON:", rawAiResponse, jsonError);
            alert(`Error: Invalid JSON received from AI. Raw response: ${rawAiResponse}`);
        }

      } else {
        // ERROR PATH (HTTP 500)
        const errorData = await response.json();
        
        // Check for the 'detail' field returned by FastAPI's HTTPException
        const errorMessage = errorData.detail || `HTTP Error ${response.status}: ${response.statusText}`;

        // Display the correct error message from the backend
        throw new Error(errorMessage); 
      }    }
    catch(error){
      console.error(error);
      alert(`Failed to generate story: ${error.message}`);
    }
    finally {
        setIsLoading(false); // Stop loading regardless of success/failure
    }
  };

  return (
    <div className="flex flex-row justify-center items-start p-6 bg-purple-50 min-h-screen">
      <div className="border-purple-500 border-4 p-6 rounded-lg max-w-3xl w-full bg-white shadow-lg">
        <h1 className="text-center text-3xl font-semibold text-purple-800 mb-8">
          Interactive Story Generator
        </h1>
        {/* Pass the form handler to the onSubmit */}
        <form className="space-y-6" onSubmit={(e) => {e.preventDefault(); handleGenerate();}}> 
          <Dropdown
            label="Theme / Genre:"
            options={options.theme}
            selected={theme}
            setSelected={setTheme}
            id="theme"
          />
          <Dropdown
            label="Number of Main Characters:"
            options={options.mainCharacters}
            selected={mainCharacters}
            setSelected={setMainCharacters}
            id="characters"
          />
          <Dropdown
            label="Number of Episodes (Story Depth):"
            options={options.episodes}
            selected={episodes}
            setSelected={setEpisodes}
            id="episodes"
          />

          <Dropdown
            label="Words per Episode:"
            options={options.wordsPerEpisode}
            selected={wordsPerEpisode}
            setSelected={setWordsPerEpisode}
            id="wordsPerEpisode"
          />

          <Dropdown
            label="Choices per Episode:"
            options={options.choicesPerEpisode}
            selected={choicesPerEpisode}
            setSelected={setChoicesPerEpisode}
            id="choicesPerEpisode"
          />
          <Dropdown
            label="Tone / Mood:"
            options={options.tone}
            selected={tone}
            setSelected={setTone}
            id="tone"
          />
          <Dropdown
            label="Setting:"
            options={options.setting}
            selected={setting}
            setSelected={setSetting}
            id="setting"
          />
          <Dropdown
            label="Target Audience:"
            options={options.audience}
            selected={audience}
            setSelected={setAudience}
            id="audience"
          />
          <Dropdown
            label="Use of Emojis:"
            options={options.emojis}
            selected={emojis}
            setSelected={setEmojis}
            id="emojis"
          />
          <Dropdown
            label="Special Requests / Constraints (optional):"
            options={options.specialRequests}
            selected={specialRequests}
            setSelected={setSpecialRequests}
            id="specialRequests"
          />
          <div>
            <label
              htmlFor="prompt-area"
              className="block mb-1 font-medium text-purple-900"
            >
              Additional Instructions / Story Prompt:
            </label>
            <textarea
              id="prompt-area"
              name="prompt-area"
              rows={5}
              value={additionalInstructions}
              onChange={(e)=>{setAdditionalInstructions(e.target.value)}}
              placeholder="Enter your story prompt or any extra instructions here..."
              className="w-full rounded-md border-2 border-gray-300 p-3 resize-y focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>
          <button
            type="submit"
            className="w-full rounded-md bg-purple-800 py-3 text-white font-semibold hover:bg-purple-600 transition disabled:bg-purple-400"
            disabled={isLoading} // Disable button while loading
          >
            {isLoading ? "Generating..." : "Generate Magic"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default PromptSpace;