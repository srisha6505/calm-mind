import React, { useState, useEffect } from "react";
import { Message, Sender } from "../types";
import { MessageSquare, Plus, Trash2, Clock, Folder } from "lucide-react";
import {
  getAllEntries,
  deleteEntry,
  Entry,
} from "../services/entryStorageService";

interface EntryHistoryProps {
  currentMessages: Message[];
  currentEntryId: string | null;
  onNewEntry?: () => void;
  onLoadEntry?: (entryId: string) => void;
}

export const EntryHistory: React.FC<EntryHistoryProps> = ({
  currentMessages,
  currentEntryId,
  onNewEntry,
  onLoadEntry,
}) => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [activeEntry, setActiveEntry] = useState<string | null>(currentEntryId);

  useEffect(() => {
    loadEntries();
  }, []);

  useEffect(() => {
    setActiveEntry(currentEntryId);
  }, [currentEntryId]);

  const loadEntries = () => {
    const allEntries = getAllEntries();
    setEntries(allEntries);
  };

  const formatTimestamp = (timestamp: number) => {
    const now = Date.now();
    const diff = now - timestamp;
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days}d ago`;
    return new Date(timestamp).toLocaleDateString();
  };

  const handleNewEntry = () => {
    setActiveEntry("current");
    onNewEntry?.();
  };

  const handleDeleteEntry = (entryId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm("Are you sure you want to delete this entry?")) {
      deleteEntry(entryId);
      loadEntries();
      if (activeEntry === entryId) {
        handleNewEntry();
      }
    }
  };

  const handleLoadEntry = (entryId: string) => {
    setActiveEntry(entryId);
    onLoadEntry?.(entryId);
    loadEntries(); // Refresh to update timestamps
  };

  const getPreview = (messages: Message[]) => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage) return "No messages yet";
    const text = lastMessage.text;
    return text.length > 50 ? text.substring(0, 47) + "..." : text;
  };

  return (
    <div className="h-full bg-white dark:bg-dark-800 border-r border-stone-200 dark:border-dark-700 flex flex-col transition-colors duration-300">
      {/* Header */}
      <div className="p-4 border-b border-stone-200 dark:border-dark-700">
        <div className="flex items-center gap-2 mb-3">
          <Folder className="w-4 h-4 text-primary-600 dark:text-primary-400" />
          <span className="text-xs font-bold text-stone-600 dark:text-slate-400 uppercase tracking-wider">
            My Entries
          </span>
        </div>
        <button
          onClick={handleNewEntry}
          className="w-full py-2.5 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-xl flex items-center justify-center gap-2 text-sm font-semibold transition-all shadow-sm hover:shadow-md active:scale-[0.98]"
        >
          <Plus className="w-4 h-4" />
          New Entry
        </button>
      </div>

      {/* Current Session */}
      <div className="px-3 pt-4 pb-2">
        <span className="px-3 text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider">
          Active Entry
        </span>
      </div>

      <div className="px-3 pb-3">
        <button
          onClick={() => handleLoadEntry("current")}
          className={`w-full p-3 rounded-xl text-left transition-all ${
            activeEntry === "current" || activeEntry === null
              ? "bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800"
              : "hover:bg-stone-50 dark:hover:bg-dark-700 border border-transparent"
          }`}
        >
          <div className="flex items-start gap-3">
            <div
              className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                activeEntry === "current" || activeEntry === null
                  ? "bg-primary-100 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400"
                  : "bg-stone-100 dark:bg-dark-900 text-stone-500 dark:text-slate-400"
              }`}
            >
              <MessageSquare className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-sm text-stone-800 dark:text-slate-200 mb-0.5 truncate">
                Current Session
              </div>
              <div className="text-xs text-stone-500 dark:text-slate-400 truncate">
                {currentMessages.length > 1
                  ? getPreview(currentMessages)
                  : "Start a new entry"}
              </div>
              <div className="flex items-center gap-1.5 mt-1.5 text-[10px] text-stone-400 dark:text-slate-500">
                <Clock className="w-3 h-3" />
                <span>{currentMessages.length} messages</span>
              </div>
            </div>
          </div>
        </button>
      </div>

      {/* History Section */}
      <div className="px-3 py-2 border-t border-stone-100 dark:border-dark-700">
        <span className="px-3 text-[10px] font-bold text-stone-400 dark:text-slate-500 uppercase tracking-wider">
          Past Entries ({entries.length})
        </span>
      </div>

      {/* Scrollable History List */}
      <div className="flex-1 overflow-y-auto px-3 pb-4 space-y-1.5 scrollbar-thin">
        {entries.length === 0 ? (
          <div className="px-3 py-8 text-center">
            <div className="text-stone-400 dark:text-slate-600 text-xs italic">
              No saved entries yet
            </div>
          </div>
        ) : (
          entries.map((entry) => (
            <button
              key={entry.id}
              onClick={() => handleLoadEntry(entry.id)}
              className={`group w-full p-3 rounded-xl text-left transition-all ${
                activeEntry === entry.id
                  ? "bg-stone-100 dark:bg-dark-700 border border-stone-200 dark:border-dark-600"
                  : "hover:bg-stone-50 dark:hover:bg-dark-900/50 border border-transparent"
              }`}
            >
              <div className="flex items-start justify-between gap-2 mb-1.5">
                <span className="font-semibold text-sm text-stone-800 dark:text-slate-200 truncate flex-1">
                  {entry.title}
                </span>
                <button
                  onClick={(e) => handleDeleteEntry(entry.id, e)}
                  className="opacity-0 group-hover:opacity-100 text-stone-400 hover:text-red-500 dark:text-slate-500 dark:hover:text-red-400 transition-opacity"
                  aria-label="Delete entry"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-xs text-stone-500 dark:text-slate-400 truncate mb-1.5">
                {getPreview(entry.messages)}
              </p>
              <div className="flex items-center justify-between text-[10px] text-stone-400 dark:text-slate-500">
                <span>{formatTimestamp(entry.updatedAt)}</span>
                <div className="flex items-center gap-2">
                  {entry.moodScore && (
                    <span className="flex items-center gap-1">
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${
                          entry.moodScore <= 3
                            ? "bg-red-400"
                            : entry.moodScore <= 7
                              ? "bg-yellow-400"
                              : "bg-green-400"
                        }`}
                      />
                      {entry.moodScore}/10
                    </span>
                  )}
                  <span>{entry.messages.length} msgs</span>
                </div>
              </div>
            </button>
          ))
        )}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-stone-200 dark:border-dark-700">
        <div className="text-[10px] text-stone-400 dark:text-slate-500 text-center leading-relaxed">
          <span className="block mb-1">🔒 All entries stored locally</span>
          <span className="block font-semibold text-primary-600 dark:text-primary-400">
            Your privacy is protected
          </span>
        </div>
      </div>
    </div>
  );
};
