import React, { useRef, useEffect, useState } from "react";
import { Message, Sender } from "../types";
import { Send, Sparkles, User } from "lucide-react";
import { Button } from "./Button";
import { MarkdownRenderer } from "./MarkdownRenderer";

interface ChatInterfaceProps {
  messages: Message[];
  isLoading: boolean;
  onSendMessage: (text: string) => void;
}

export const ChatInterface: React.FC<ChatInterfaceProps> = ({
  messages,
  isLoading,
  onSendMessage,
}) => {
  const [input, setInput] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (input.trim() && !isLoading) {
      onSendMessage(input);
      setInput("");
    }
  };

  const quickActions = [
    "Grounding exercise",
    "Track mood",
    "Start CBT session",
    "I'm feeling anxious",
  ];

  return (
    <div className="h-full flex flex-col bg-white dark:bg-dark-800 rounded-3xl border border-stone-200 dark:border-dark-700 shadow-soft dark:shadow-2xl overflow-hidden transition-colors duration-300">
      {/* Header Strip - Fixed */}
      <div className="flex-shrink-0 px-6 py-3 bg-white/90 dark:bg-dark-800/90 backdrop-blur-md border-b border-stone-100 dark:border-dark-700 flex justify-between items-center transition-colors duration-300">
        <span className="text-xs font-semibold text-stone-400 dark:text-slate-400 tracking-wider">
          CHAT INTERFACE
        </span>
        <span className="text-[10px] text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20 px-2 py-1 rounded border border-primary-100 dark:border-primary-900/30 font-medium">
          AI is not a replacement for a licensed professional
        </span>
      </div>

      {/* Messages Area - Scrollable */}
      <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-stone-50/50 dark:bg-transparent scrollbar-thin scrollbar-thumb-stone-300 dark:scrollbar-thumb-slate-700 scrollbar-track-transparent hover:scrollbar-thumb-stone-400 dark:hover:scrollbar-thumb-slate-600">
        {/* Welcome Bubble */}
        <div className="flex justify-center mb-8">
          <div className="bg-stone-100 dark:bg-transparent border border-dashed border-stone-300 dark:border-slate-700 rounded-full px-4 py-2 text-xs text-stone-500 dark:text-slate-500 flex items-center gap-2 transition-colors duration-300">
            <span>👋</span>
            Welcome. You're in control — start typing or use a quick action.
          </div>
        </div>

        {messages.map((msg) => {
          const isBot = msg.sender === Sender.BOT;
          return (
            <div
              key={msg.id}
              className={`flex w-full ${isBot ? "justify-start" : "justify-end"}`}
            >
              <div
                className={`flex max-w-[85%] md:max-w-[75%] gap-3 ${isBot ? "flex-row" : "flex-row-reverse"}`}
              >
                {/* Avatar */}
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 shadow-sm transition-colors duration-300 ${
                    isBot
                      ? "bg-gradient-to-tr from-indigo-500 to-purple-500 text-white"
                      : "bg-stone-200 dark:bg-dark-700 text-stone-600 dark:text-slate-300"
                  }`}
                >
                  {isBot ? (
                    <Sparkles className="w-4 h-4" />
                  ) : (
                    <User className="w-4 h-4" />
                  )}
                </div>

                {/* Bubble */}
                <div
                  className={`flex flex-col ${isBot ? "items-start" : "items-end"}`}
                >
                  <div
                    className={`px-5 py-3.5 rounded-2xl text-sm leading-relaxed shadow-sm transition-colors duration-300 ${
                      isBot
                        ? "bg-white dark:bg-dark-900 border border-stone-200 dark:border-dark-700 text-stone-700 dark:text-slate-200 rounded-tl-none"
                        : "bg-primary-600 text-white rounded-tr-none"
                    }`}
                  >
                    {isBot ? (
                      <MarkdownRenderer content={msg.text} />
                    ) : (
                      <span className="whitespace-pre-wrap">{msg.text}</span>
                    )}
                  </div>
                  <span className="text-[10px] text-stone-400 dark:text-slate-600 mt-1.5 px-1 font-medium">
                    {isBot ? "CalmMind" : "You"} •{" "}
                    {msg.timestamp.toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </span>
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex w-full justify-start animate-pulse">
            <div className="flex gap-3">
              <div className="w-8 h-8 rounded-full bg-stone-200 dark:bg-dark-700 shrink-0 mt-1" />
              <div className="bg-white dark:bg-dark-900 border border-stone-200 dark:border-dark-700 rounded-2xl px-5 py-4 rounded-tl-none flex gap-1.5">
                <div
                  className="w-2 h-2 bg-stone-300 dark:bg-slate-600 rounded-full animate-bounce"
                  style={{ animationDelay: "0ms" }}
                />
                <div
                  className="w-2 h-2 bg-stone-300 dark:bg-slate-600 rounded-full animate-bounce"
                  style={{ animationDelay: "150ms" }}
                />
                <div
                  className="w-2 h-2 bg-stone-300 dark:bg-slate-600 rounded-full animate-bounce"
                  style={{ animationDelay: "300ms" }}
                />
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {/* Input Area - Fixed at Bottom */}
      <div className="flex-shrink-0 p-4 bg-white/80 dark:bg-dark-900/50 backdrop-blur border-t border-stone-100 dark:border-dark-700 space-y-4 transition-colors duration-300">
        {/* Quick Chips */}
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {quickActions.map((action, i) => (
            <button
              key={i}
              onClick={() => onSendMessage(action)}
              className="whitespace-nowrap px-3 py-1.5 rounded-full border border-stone-200 dark:border-slate-700 bg-stone-50 dark:bg-dark-800 text-xs text-stone-600 dark:text-slate-300 hover:border-primary-400 hover:text-primary-600 dark:hover:border-primary-500 dark:hover:text-primary-400 transition-colors"
            >
              {action === "Start CBT session"
                ? "✨ " + action
                : action === "Grounding exercise"
                  ? "🧘 " + action
                  : action === "Track mood"
                    ? "😊 " + action
                    : action}
            </button>
          ))}
          <button className="whitespace-nowrap px-3 py-1.5 rounded-full border border-red-200 dark:border-red-900/30 bg-red-50 dark:bg-red-900/10 text-xs text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900/20 transition-colors flex items-center gap-1 font-medium">
            🚨 Crisis help
          </button>
        </div>

        <form onSubmit={handleSubmit} className="relative flex items-end gap-2">
          <div className="relative flex-1 group">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type how you're feeling..."
              className="w-full bg-stone-100 dark:bg-dark-800 text-stone-800 dark:text-slate-200 border border-transparent dark:border-dark-600 rounded-2xl py-3.5 pl-5 pr-12 focus:outline-none focus:ring-2 focus:ring-primary-500/50 focus:bg-white dark:focus:bg-dark-900 focus:border-primary-200 dark:focus:border-primary-600 placeholder:text-stone-400 dark:placeholder:text-slate-600 transition-all shadow-inner dark:shadow-none"
              disabled={isLoading}
            />
          </div>
          <Button
            type="submit"
            variant="primary"
            className="h-[52px] w-[52px] !rounded-2xl !px-0 shadow-md hover:shadow-lg hover:scale-105 transition-all duration-200"
            disabled={!input.trim() || isLoading}
          >
            <Send className="w-5 h-5" />
          </Button>
        </form>
      </div>
    </div>
  );
};
