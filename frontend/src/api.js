// src/api.js

// Base URL from Vite env
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
console.log(API_BASE_URL);

// Helper to add auth header when token exists
function authHeaders(extra = {}) {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

/* ---------- AUTH ---------- */

export async function signupUser(payload) {
  const res = await fetch(`${API_BASE_URL}/signup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Signup failed");
  }
  return res.json();
}

export async function loginUser(payload) {
  const res = await fetch(`${API_BASE_URL}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Login failed");
  }
  return res.json();
}

/* ---------- STORIES (HOME) ---------- */

export async function getStory(storyId) {
  const res = await fetch(`${API_BASE_URL}/get_story/${storyId}`, {
    method: "GET",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to get story");
  }
  return res.json(); // expected: { title, story, ... }
}

export async function deleteStory(storyId) {
  const res = await fetch(`${API_BASE_URL}/delete_story/${storyId}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Failed to delete story");
  }
  return res.json(); // expected: { message, ... }
}

/* ---------- STORY GENERATION (PromptSpace) ---------- */

export async function setMagic(requestBody) {
  const res = await fetch(`${API_BASE_URL}/set_magic`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(requestBody),
  });

  if (!res.ok) {
    const text = await res.text();
    let msg = res.statusText;
    try {
      const err = JSON.parse(text);
      msg = err.error || err.detail || msg;
    } catch {
      // ignore JSON parse error
    }
    throw new Error(msg);
  }

  return res.json(); // expected: { story: ... }
}

/* ---------- EPISODES (enhance/save) ---------- */

export async function enhanceStory(fullStoryText) {
  const res = await fetch(`${API_BASE_URL}/enhance`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ story: fullStoryText }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error enhancing story");
  }
  return res.json(); // expected: { enhancedStory, title, error? }
}

export async function saveStory({ author, story, title }) {
  const res = await fetch(`${API_BASE_URL}/save`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ author, story, title }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.detail || "Error saving story");
  }
  return res.json(); // expected: { message, user_details }
}
