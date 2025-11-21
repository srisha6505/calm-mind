export enum Sender {
  USER = 'user',
  BOT = 'bot',
}

export interface Message {
  id: string;
  text: string;
  sender: Sender;
  timestamp: Date;
}

export interface MoodEntry {
  timestamp: number; // Unix timestamp
  score: number; // 1-10
}

export interface CBTStep {
  id: number;
  title: string;
  question: string;
  description: string;
}

export type SupportMode = 'CBT' | 'GROUNDING';