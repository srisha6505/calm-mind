import { Message } from "../types";

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  moodScore?: number;
}

const STORAGE_KEY = "calmmind_chat_sessions";
const CURRENT_SESSION_KEY = "calmmind_current_session";
const MAX_SESSIONS = 50;

// Get all chat sessions from localStorage
export const getAllSessions = (): ChatSession[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return [];
    const sessions = JSON.parse(stored);
    // Convert timestamp strings back to Date objects
    return sessions.map((session: ChatSession) => ({
      ...session,
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error("Error loading chat sessions:", error);
    return [];
  }
};

// Save a chat session
export const saveSession = (session: ChatSession): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    const sessions = stored ? JSON.parse(stored) : [];
    const existingIndex = sessions.findIndex(
      (s: ChatSession) => s.id === session.id,
    );

    // Serialize Date objects to ISO strings
    const serializedSession = {
      ...session,
      messages: session.messages.map((msg) => ({
        ...msg,
        timestamp:
          msg.timestamp instanceof Date
            ? msg.timestamp.toISOString()
            : msg.timestamp,
      })),
    };

    if (existingIndex >= 0) {
      sessions[existingIndex] = serializedSession;
    } else {
      sessions.unshift(serializedSession);
      // Keep only the most recent sessions
      if (sessions.length > MAX_SESSIONS) {
        sessions.pop();
      }
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
  } catch (error) {
    console.error("Error saving chat session:", error);
  }
};

// Get a specific session by ID
export const getSession = (id: string): ChatSession | null => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return null;
    const sessions = JSON.parse(stored);
    const session = sessions.find((s: ChatSession) => s.id === id);
    if (!session) return null;

    // Convert timestamp strings back to Date objects
    return {
      ...session,
      messages: session.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    };
  } catch (error) {
    console.error("Error loading session:", error);
    return null;
  }
};

// Delete a session
export const deleteSession = (id: string): void => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return;
    const sessions = JSON.parse(stored);
    const filtered = sessions.filter((s: ChatSession) => s.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error("Error deleting session:", error);
  }
};

// Get current session ID
export const getCurrentSessionId = (): string | null => {
  return localStorage.getItem(CURRENT_SESSION_KEY);
};

// Set current session ID
export const setCurrentSessionId = (id: string): void => {
  localStorage.setItem(CURRENT_SESSION_KEY, id);
};

// Generate a title from the first user message
export const generateSessionTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((m) => m.sender === "user");
  if (!firstUserMessage) return "New Conversation";

  const text = firstUserMessage.text;
  if (text.length <= 40) return text;
  return text.substring(0, 37) + "...";
};

// Update session with new messages
export const updateSessionMessages = (
  sessionId: string,
  messages: Message[],
  moodScore?: number,
): void => {
  const session = getSession(sessionId);
  if (session) {
    session.messages = messages;
    session.updatedAt = Date.now();
    session.title = generateSessionTitle(messages);
    if (moodScore !== undefined) {
      session.moodScore = moodScore;
    }
    saveSession(session);
  }
};

// Create a new session
export const createNewSession = (moodScore?: number): ChatSession => {
  const newSession: ChatSession = {
    id: `session_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    title: "New Conversation",
    messages: [],
    createdAt: Date.now(),
    updatedAt: Date.now(),
    moodScore,
  };
  return newSession;
};

// Get conversation context (last N messages)
export const getConversationContext = (
  messages: Message[],
  contextLength: number = 5,
): Message[] => {
  return messages.slice(-contextLength);
};
