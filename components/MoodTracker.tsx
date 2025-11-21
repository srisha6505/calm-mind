import React, { useState, useEffect } from "react";
import { MoodEntry } from "../types";
import { Save, Meh, Frown, Smile, TrendingUp } from "lucide-react";
import {
  getTotalEntryCount,
  getAverageMood,
} from "../services/entryStorageService";

interface MoodTrackerProps {
  history: MoodEntry[];
  onSave: (score: number) => void;
  currentScore?: number;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({
  history,
  onSave,
  currentScore = 5,
}) => {
  const [currentMood, setCurrentMood] = useState(currentScore);
  const [totalEntries, setTotalEntries] = useState(0);
  const [avgMood, setAvgMood] = useState<number | null>(null);

  // Update local state when prop changes
  useEffect(() => {
    setCurrentMood(currentScore);
  }, [currentScore]);

  // Load stats from all entries
  useEffect(() => {
    loadStats();
  }, [history]);

  const loadStats = () => {
    const total = getTotalEntryCount();
    const average = getAverageMood();
    setTotalEntries(total);
    setAvgMood(average);
  };

  const getMoodIcon = (score: number) => {
    if (score <= 3)
      return <Frown className="w-6 h-6 text-red-500 dark:text-red-400" />;
    if (score <= 7)
      return <Meh className="w-6 h-6 text-yellow-500 dark:text-yellow-400" />;
    return <Smile className="w-6 h-6 text-green-500 dark:text-green-400" />;
  };

  const getMoodEmoji = (score: number) => {
    if (score <= 3) return "😔";
    if (score <= 7) return "😐";
    return "😊";
  };

  const handleSaveMood = () => {
    onSave(currentMood);
    loadStats(); // Refresh stats after saving
  };

  return (
    <div className="bg-white dark:bg-dark-800 border border-stone-200 dark:border-dark-700 rounded-3xl p-6 flex flex-col gap-5 shadow-soft dark:shadow-xl transition-colors duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-stone-800 dark:text-slate-200 font-bold text-sm tracking-wide uppercase">
          Mood Tracker
        </h3>
        <span className="text-xs bg-stone-100 dark:bg-dark-700 text-primary-600 dark:text-primary-400 px-2.5 py-1 rounded-lg border border-stone-200 dark:border-dark-600 font-medium">
          {getMoodEmoji(currentMood)} {currentMood}/10
        </span>
      </div>

      <div className="space-y-6">
        <div className="space-y-3">
          <p className="text-stone-500 dark:text-slate-400 text-sm font-medium">
            How are you feeling right now?
          </p>
          <div className="relative pt-8 pb-2 px-1">
            <div className="flex justify-between text-xs text-stone-400 dark:text-slate-500 mb-3 font-medium">
              <span>Low</span>
              <span>Okay</span>
              <span>High</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={currentMood}
              onChange={(e) => setCurrentMood(Number(e.target.value))}
              className="w-full h-2 bg-stone-200 dark:bg-dark-900 rounded-lg appearance-none cursor-pointer"
              style={{
                backgroundImage:
                  "linear-gradient(to right, #ef4444, #eab308, #22c55e)",
              }}
            />
            <div
              className="absolute top-0 transform -translate-x-1/2 transition-all duration-200 bg-white dark:bg-dark-800 p-1 rounded-full shadow-md border border-stone-200 dark:border-dark-700"
              style={{ left: `${((currentMood - 1) / 9) * 100}%` }}
            >
              {getMoodIcon(currentMood)}
            </div>
          </div>
          <div className="text-center">
            <p className="text-xs text-stone-500 dark:text-slate-400">
              {currentMood <= 3 &&
                "Take it easy. Be gentle with yourself today."}
              {currentMood > 3 &&
                currentMood <= 7 &&
                "You're managing. Keep going, one step at a time."}
              {currentMood > 7 && "Great to see you doing well! Keep it up."}
            </p>
          </div>
        </div>

        <button
          onClick={handleSaveMood}
          className="w-full py-2.5 bg-primary-600 hover:bg-primary-700 text-white border-0 rounded-xl flex items-center justify-center text-sm font-semibold transition-all gap-2 active:scale-[0.98] shadow-sm hover:shadow-md"
        >
          <Save className="w-4 h-4" />
          Save Current Mood
        </button>
      </div>

      <div className="pt-5 border-t border-stone-100 dark:border-dark-700">
        <div className="flex items-center gap-2 mb-3">
          <TrendingUp className="w-3.5 h-3.5 text-primary-600 dark:text-primary-400" />
          <p className="text-xs text-stone-400 dark:text-slate-500 font-medium uppercase tracking-wider">
            All-Time Stats
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-stone-50 dark:bg-dark-900 rounded-xl p-3 border border-stone-100 dark:border-dark-700">
            <div className="text-2xl font-bold text-stone-800 dark:text-slate-200">
              {totalEntries}
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400">
              Total Entries
            </div>
          </div>
          <div className="bg-stone-50 dark:bg-dark-900 rounded-xl p-3 border border-stone-100 dark:border-dark-700">
            <div className="text-2xl font-bold text-stone-800 dark:text-slate-200 flex items-center gap-1">
              {avgMood !== null ? (
                <>
                  {avgMood}
                  <span className="text-sm">{getMoodEmoji(avgMood)}</span>
                </>
              ) : (
                "-"
              )}
            </div>
            <div className="text-xs text-stone-500 dark:text-slate-400">
              Avg. Mood
            </div>
          </div>
        </div>
        <div className="mt-3 text-[10px] text-stone-400 dark:text-slate-500 italic text-center">
          📊 Stats calculated from all your entries
        </div>
      </div>
    </div>
  );
};
