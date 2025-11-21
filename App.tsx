import React, { useState, useEffect } from "react";
import { ChatInterface } from "./components/ChatInterface";
import { EntryHistory } from "./components/ChatHistory";
import { MoodTracker } from "./components/MoodTracker";
import { SupportFlows } from "./components/SupportFlows";
import { ResizablePanel } from "./components/ResizablePanel";
import { Message, Sender, MoodEntry } from "./types";
import { INITIAL_MESSAGE, PRIVACY_MESSAGE } from "./constants";
import {
  sendMessageToGemini,
  setMoodScore,
  resetChatSession,
  checkApiKeyConfigured,
} from "./services/geminiService";
import {
  createNewEntry,
  saveEntry,
  getEntry,
  getCurrentEntryId,
  setCurrentEntryId,
  updateEntryMessages,
  Entry,
} from "./services/entryStorageService";
import { Moon, Sun, ShieldAlert } from "lucide-react";

export default function App() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      text: INITIAL_MESSAGE,
      sender: Sender.BOT,
      timestamp: new Date(),
    },
  ]);
  const [moodHistory, setMoodHistory] = useState<MoodEntry[]>([]);
  const [currentMoodScore, setCurrentMoodScore] = useState(5);
  const [previousMoodScore, setPreviousMoodScore] = useState(5);
  const [moodJustChanged, setMoodJustChanged] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [safeMode, setSafeMode] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [currentEntryId, setCurrentEntryIdState] = useState<string | null>(
    null,
  );
  const [apiKeyConfigured, setApiKeyConfigured] = useState(true);

  useEffect(() => {
    // Check API key configuration
    const hasApiKey = checkApiKeyConfigured();
    setApiKeyConfigured(hasApiKey);

    // Check system preference or local storage on mount
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia(
      "(prefers-color-scheme: dark)",
    ).matches;

    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove("dark");
    }

    // Load current entry if exists
    const savedEntryId = getCurrentEntryId();
    if (savedEntryId) {
      const entry = getEntry(savedEntryId);
      if (entry) {
        loadEntry(entry);
      }
    } else {
      // Create a new entry on first load
      handleNewEntry();
    }
  }, []);

  const toggleTheme = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    if (newMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const loadEntry = (entry: Entry) => {
    setCurrentEntryIdState(entry.id);
    setCurrentEntryId(entry.id);
    setMessages(
      entry.messages.length > 0
        ? entry.messages
        : [
            {
              id: "1",
              text: INITIAL_MESSAGE,
              sender: Sender.BOT,
              timestamp: new Date(),
            },
          ],
    );
    if (entry.moodScore !== undefined) {
      setCurrentMoodScore(entry.moodScore);
      setPreviousMoodScore(entry.moodScore);
      setMoodScore(entry.moodScore);
    }
    // Reset mood change flag when loading entry
    setMoodJustChanged(false);
  };

  const handleSendMessage = async (text: string) => {
    if (!apiKeyConfigured) {
      alert(
        "API key not configured. Please add VITE_GEMINI_API_KEY to your .env file.",
      );
      return;
    }

    // Add user message
    const userMsg: Message = {
      id: Date.now().toString(),
      text,
      sender: Sender.USER,
      timestamp: new Date(),
    };
    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setIsLoading(true);

    try {
      // Update mood score in Gemini service
      setMoodScore(currentMoodScore);

      // Get response from Gemini with conversation history and mood context
      const conversationHistory = updatedMessages.slice(0, -1); // Exclude the current message
      const responseText = await sendMessageToGemini(
        text,
        conversationHistory,
        moodJustChanged,
      );

      // Reset mood change flag after sending
      setMoodJustChanged(false);

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: responseText,
        sender: Sender.BOT,
        timestamp: new Date(),
      };
      const finalMessages = [...updatedMessages, botMsg];
      setMessages(finalMessages);

      // Save to current entry
      if (currentEntryId) {
        updateEntryMessages(currentEntryId, finalMessages, currentMoodScore);
      } else {
        // Create new entry if none exists
        const newEntry = createNewEntry(currentMoodScore);
        newEntry.messages = finalMessages;
        saveEntry(newEntry);
        setCurrentEntryIdState(newEntry.id);
        setCurrentEntryId(newEntry.id);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      const errorMsg: Message = {
        id: (Date.now() + 1).toString(),
        text: "I apologize, but I'm having trouble connecting right now. Please check your internet connection and try again.",
        sender: Sender.BOT,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveMood = (score: number) => {
    const newEntry: MoodEntry = {
      score,
      timestamp: Date.now(),
    };
    setMoodHistory((prev) => [...prev, newEntry]);

    // Track if mood changed significantly
    const moodChanged = Math.abs(score - previousMoodScore) >= 2;
    setPreviousMoodScore(currentMoodScore);
    setCurrentMoodScore(score);
    setMoodScore(score);
    setMoodJustChanged(moodChanged);

    // Update current entry with mood
    if (currentEntryId) {
      const entry = getEntry(currentEntryId);
      if (entry) {
        entry.moodScore = score;
        saveEntry(entry);
      }
    }

    // If mood changed significantly, reset chat session to get fresh context
    if (moodChanged) {
      resetChatSession();
    }
  };

  const handleNewEntry = () => {
    // Save current entry before creating new one
    if (currentEntryId && messages.length > 1) {
      updateEntryMessages(currentEntryId, messages, currentMoodScore);
    }

    // Create new entry
    const newEntry = createNewEntry(currentMoodScore);
    newEntry.messages = [
      {
        id: "1",
        text: INITIAL_MESSAGE,
        sender: Sender.BOT,
        timestamp: new Date(),
      },
    ];
    saveEntry(newEntry);
    setCurrentEntryIdState(newEntry.id);
    setCurrentEntryId(newEntry.id);
    setMessages(newEntry.messages);

    // Reset chat session in Gemini service
    resetChatSession();
    setMoodJustChanged(false);
  };

  const handleLoadEntry = (entryId: string) => {
    if (entryId === "current") {
      // Stay on current entry
      return;
    }

    // Save current entry before switching
    if (currentEntryId && messages.length > 1) {
      updateEntryMessages(currentEntryId, messages, currentMoodScore);
    }

    const entry = getEntry(entryId);
    if (entry) {
      loadEntry(entry);
      // Reset chat session for new conversation context
      resetChatSession();
    }
  };

  return (
    <div className="h-screen bg-stone-50 dark:bg-[#050914] text-stone-800 dark:text-slate-200 transition-colors duration-300 flex flex-col overflow-hidden">
      {/* Fixed Header */}
      <header className="flex-shrink-0 flex justify-between items-center gap-4 px-6 py-4 bg-white dark:bg-dark-800 border-b border-stone-200 dark:border-dark-700 z-20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-500 to-accent-purple flex items-center justify-center shadow-lg shadow-primary-500/20">
            <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-stone-900 dark:text-white tracking-tight">
              CalmMind
            </h1>
            <div className="flex items-center gap-2">
              <span className="text-[10px] border border-stone-300 dark:border-slate-700 rounded px-1.5 py-0.5 text-stone-500 dark:text-slate-400 uppercase tracking-widest font-medium">
                Mental Wellness
              </span>
              <span className="hidden md:inline text-xs text-stone-500 dark:text-slate-500 font-medium">
                — Context-aware support
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {!apiKeyConfigured && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-full bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 text-xs">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span className="font-medium">API Key Missing</span>
            </div>
          )}

          <button
            onClick={() => setSafeMode(!safeMode)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-300 ${
              safeMode
                ? "bg-green-100 border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-900 dark:text-green-400"
                : "bg-stone-200 border-stone-300 text-stone-500 dark:bg-dark-800 dark:border-slate-700 dark:text-slate-400"
            }`}
          >
            <div
              className={`w-2 h-2 rounded-full ${safeMode ? "bg-green-500 dark:bg-green-400" : "bg-stone-400 dark:bg-slate-500"}`}
            />
            Safe Mode {safeMode ? "On" : "Off"}
          </button>

          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-9 h-9 rounded-full border border-stone-200 dark:border-slate-700 bg-white dark:bg-dark-800 text-stone-600 dark:text-slate-300 hover:bg-stone-100 dark:hover:bg-dark-700 transition-colors shadow-sm"
            aria-label="Toggle theme"
          >
            {isDarkMode ? (
              <Moon className="w-4 h-4" />
            ) : (
              <Sun className="w-4 h-4" />
            )}
          </button>
        </div>
      </header>

      {/* Main Layout - 3 Column Grid */}
      <main className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Entry History - Resizable */}
        <ResizablePanel
          defaultWidth={288}
          minWidth={240}
          maxWidth={400}
          position="left"
          className="hidden lg:block overflow-hidden"
        >
          <EntryHistory
            currentMessages={messages}
            currentEntryId={currentEntryId}
            onNewEntry={handleNewEntry}
            onLoadEntry={handleLoadEntry}
          />
        </ResizablePanel>

        {/* Center: Chat Interface - Flexible, Scrollable */}
        <section className="flex-1 min-w-0 p-6 overflow-hidden">
          <div className="h-full">
            <ChatInterface
              messages={messages}
              isLoading={isLoading}
              onSendMessage={handleSendMessage}
            />
          </div>
        </section>

        {/* Right Sidebar: Tools - Resizable */}
        <ResizablePanel
          defaultWidth={320}
          minWidth={280}
          maxWidth={480}
          position="right"
          className="hidden xl:block border-l border-stone-200 dark:border-dark-700 bg-stone-50 dark:bg-[#050914] overflow-y-auto"
        >
          <div className="p-6 space-y-6">
            <MoodTracker
              history={moodHistory}
              onSave={handleSaveMood}
              currentScore={currentMoodScore}
            />
            <SupportFlows onSendToChat={handleSendMessage} />

            {/* Privacy Notice */}
            <div className="bg-primary-50 dark:bg-primary-900/10 border border-primary-200 dark:border-primary-900/30 rounded-2xl p-4">
              <p className="text-xs text-primary-700 dark:text-primary-300 leading-relaxed">
                {PRIVACY_MESSAGE}
              </p>
            </div>
          </div>
        </ResizablePanel>
      </main>
    </div>
  );
}
