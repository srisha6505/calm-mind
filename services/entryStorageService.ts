import { Message } from "../types";

export interface Entry {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  moodScore?: number;
}

const ENTRIES_KEY = "calmmind_entries_list";
const CURRENT_ENTRY_KEY = "calmmind_current_entry";

// Since we can't actually write to filesystem in browser,
// we'll use localStorage to store entry data as JSON
// In a real Node.js environment, this would use fs.writeFile

// Get all entries metadata
export const getAllEntries = (): Entry[] => {
  try {
    const stored = localStorage.getItem(ENTRIES_KEY);
    if (!stored) return [];
    const entries = JSON.parse(stored);
    return entries.map((entry: any) => ({
      ...entry,
      messages: entry.messages.map((msg: any) => ({
        ...msg,
        timestamp: new Date(msg.timestamp),
      })),
    }));
  } catch (error) {
    console.error("Error loading entries:", error);
    return [];
  }
};

// Save an entry
export const saveEntry = (entry: Entry): void => {
  try {
    const entries = getAllEntries();
    const existingIndex = entries.findIndex((e) => e.id === entry.id);

    // Serialize the entry
    const serializedEntry = {
      ...entry,
      messages: entry.messages.map((msg) => ({
        ...msg,
        timestamp:
          msg.timestamp instanceof Date
            ? msg.timestamp.toISOString()
            : msg.timestamp,
      })),
    };

    if (existingIndex >= 0) {
      entries[existingIndex] = entry;
    } else {
      entries.unshift(entry);
    }

    // Save to localStorage (simulating JSON file storage)
    const serializedEntries = entries.map((e) => ({
      ...e,
      messages: e.messages.map((msg) => ({
        ...msg,
        timestamp:
          msg.timestamp instanceof Date
            ? msg.timestamp.toISOString()
            : msg.timestamp,
      })),
    }));

    localStorage.setItem(ENTRIES_KEY, JSON.stringify(serializedEntries));

    // In a real implementation, you would write to:
    // chats/${sanitizeFilename(entry.title)}_${entry.id}.json
  } catch (error) {
    console.error("Error saving entry:", error);
  }
};

// Get a specific entry by ID
export const getEntry = (id: string): Entry | null => {
  try {
    const entries = getAllEntries();
    const entry = entries.find((e) => e.id === id);
    return entry || null;
  } catch (error) {
    console.error("Error loading entry:", error);
    return null;
  }
};

// Delete an entry
export const deleteEntry = (id: string): void => {
  try {
    const entries = getAllEntries();
    const filtered = entries.filter((e) => e.id !== id);

    const serializedEntries = filtered.map((e) => ({
      ...e,
      messages: e.messages.map((msg) => ({
        ...msg,
        timestamp:
          msg.timestamp instanceof Date
            ? msg.timestamp.toISOString()
            : msg.timestamp,
      })),
    }));

    localStorage.setItem(ENTRIES_KEY, JSON.stringify(serializedEntries));
  } catch (error) {
    console.error("Error deleting entry:", error);
  }
};

// Get current entry ID
export const getCurrentEntryId = (): string | null => {
  return localStorage.getItem(CURRENT_ENTRY_KEY);
};

// Set current entry ID
export const setCurrentEntryId = (id: string): void => {
  localStorage.setItem(CURRENT_ENTRY_KEY, id);
};

// Generate a title from the first user message
export const generateEntryTitle = (messages: Message[]): string => {
  const firstUserMessage = messages.find((m) => m.sender === "user");
  if (!firstUserMessage) return "New Entry";

  const text = firstUserMessage.text;
  if (text.length <= 40) return text;
  return text.substring(0, 37) + "...";
};

// Update entry with new messages
export const updateEntryMessages = (
  entryId: string,
  messages: Message[],
  moodScore?: number
): void => {
  const entry = getEntry(entryId);
  if (entry) {
    entry.messages = messages;
    entry.updatedAt = Date.now();
    entry.title = generateEntryTitle(messages);
    if (moodScore !== undefined) {
      entry.moodScore = moodScore;
    }
    saveEntry(entry);
  }
};

// Create a new entry
export const createNewEntry = (moodScore?: number): Entry => {
  const timestamp = Date.now();
  const newEntry: Entry = {
    id: `entry_${timestamp}_${Math.random().toString(36).substr(2, 9)}`,
    title: "New Entry",
    messages: [],
    createdAt: timestamp,
    updatedAt: timestamp,
    moodScore,
  };
  return newEntry;
};

// Get conversation context (last N messages for AI)
export const getConversationContext = (
  messages: Message[],
  contextLength: number = 5
): Message[] => {
  return messages.slice(-contextLength);
};

// Calculate average mood across all entries
export const getAverageMood = (): number | null => {
  const entries = getAllEntries();
  const entriesWithMood = entries.filter((e) => e.moodScore !== undefined);

  if (entriesWithMood.length === 0) return null;

  const sum = entriesWithMood.reduce((acc, entry) => acc + (entry.moodScore || 0), 0);
  return Math.round(sum / entriesWithMood.length);
};

// Get total entry count
export const getTotalEntryCount = (): number => {
  const entries = getAllEntries();
  return entries.length;
};

// Sanitize filename for safe file system storage
export const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .toLowerCase()
    .substring(0, 50);
};

// Export entry to JSON format (for download)
export const exportEntryToJSON = (entry: Entry): string => {
  return JSON.stringify(entry, null, 2);
};
