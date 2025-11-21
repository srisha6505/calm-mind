import { GoogleGenerativeAI } from "@google/generative-ai";
import { SYSTEM_INSTRUCTION } from "../constants";
import { Message } from "../types";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";

let genAI: GoogleGenerativeAI | null = null;
let currentMoodScore: number = 5;
let lastMoodScore: number = 5;

export const setMoodScore = (score: number) => {
  lastMoodScore = currentMoodScore;
  currentMoodScore = score;
};

export const getMoodContext = (score: number): string => {
  if (score <= 3)
    return "low - struggling, needs gentle support and validation";
  if (score <= 7)
    return "medium - managing, could use encouragement and coping strategies";
  return "high - doing well, maintain positive momentum and build resilience";
};

export const getMoodLabel = (score: number): string => {
  if (score <= 3) return "low";
  if (score <= 7) return "medium";
  return "high";
};

export const buildEnhancedSystemInstruction = (): string => {
  const moodContext = getMoodContext(currentMoodScore);
  const moodLabel = getMoodLabel(currentMoodScore);
  const moodChanged = Math.abs(currentMoodScore - lastMoodScore) >= 2;

  let instruction = `${SYSTEM_INSTRUCTION}

## Current Session Context:
- **User's Current Mood**: ${moodLabel} (${currentMoodScore}/10)
- **Mood Description**: ${moodContext}`;

  if (moodChanged) {
    const direction =
      currentMoodScore > lastMoodScore ? "improved" : "declined";
    const change = Math.abs(currentMoodScore - lastMoodScore);
    instruction += `
- **Mood Change Detected**: The user's mood has ${direction} by ${change} points (from ${lastMoodScore}/10 to ${currentMoodScore}/10). Acknowledge this change naturally in your response if relevant.`;
  }

  instruction += `

## How to Respond Based on Current Mood (${currentMoodScore}/10):
`;

  if (currentMoodScore <= 3) {
    instruction += `
The user is in a **low mood state** - they're struggling and need gentle, compassionate support:
- Use extra gentle, validating language
- Keep suggestions simple and non-overwhelming
- Focus on immediate comfort and safety
- Avoid complex problem-solving or multiple action items
- Emphasize that their feelings are valid and they're not alone
- Consider suggesting grounding techniques or simple self-soothing activities
- Check in about their safety if needed`;
  } else if (currentMoodScore <= 7) {
    instruction += `
The user is in a **medium mood state** - they're managing but could use support:
- Balance validation with gentle encouragement
- Offer practical, actionable coping strategies
- Help them identify patterns and practice skills
- Introduce cognitive reframing when appropriate
- Build on their existing resilience
- Provide structured support like CBT exercises if relevant`;
  } else {
    instruction += `
The user is in a **high mood state** - they're doing well:
- Celebrate their progress and positive state
- Help them identify what's working
- Discuss maintenance strategies for sustaining wellbeing
- Build long-term resilience and preventive skills
- Explore growth opportunities
- Validate that good days are important to honor`;
  }

  instruction += `

## Important Guidelines:
- **Notice and acknowledge** when the user adjusts their mood slider - this is valuable information about how they're feeling
- Reference conversation history naturally to show continuity
- If the user's words contradict their mood score, gently explore this discrepancy
- Always maintain the safe, non-judgmental space
- Format responses with markdown for better readability`;

  return instruction;
};

export const initializeGenAI = () => {
  if (!API_KEY) {
    console.error("API_KEY is missing - please check your .env file");
    return null;
  }

  if (!genAI) {
    genAI = new GoogleGenerativeAI(API_KEY);
  }
  return genAI;
};

export const resetChatSession = () => {
  genAI = null;
};

export const sendMessageToGemini = async (
  message: string,
  conversationHistory: Message[] = [],
  moodJustChanged: boolean = false,
): Promise<string> => {
  const ai = initializeGenAI();

  if (!ai) {
    return "I'm sorry, I'm having trouble connecting right now. Please make sure your API key is configured in the .env file.";
  }

  try {
    const systemInstruction = buildEnhancedSystemInstruction();

    // Use gemini-2.0-flash which is available and stable
    const preferredModel =
      localStorage.getItem("calmmind_preferred_model") || "gemini-2.0-flash";

    const model = ai.getGenerativeModel({
      model: preferredModel,
    });

    // Build full prompt with system instruction and context
    let fullPrompt = systemInstruction + "\n\n";

    if (moodJustChanged && Math.abs(currentMoodScore - lastMoodScore) >= 2) {
      const direction =
        currentMoodScore > lastMoodScore ? "increased" : "decreased";
      const indicator = currentMoodScore > lastMoodScore ? "📈" : "📉";
      fullPrompt += `${indicator} [User just adjusted their mood slider from ${lastMoodScore}/10 to ${currentMoodScore}/10 - mood ${direction}]\n\n`;
    }

    if (conversationHistory.length > 0) {
      const recentMessages = conversationHistory.slice(-5);
      const contextParts = recentMessages.map((msg) => {
        const role = msg.sender === "user" ? "User" : "Assistant";
        return `${role}: ${msg.text.substring(0, 150)}${msg.text.length > 150 ? "..." : ""}`;
      });

      if (contextParts.length > 0) {
        fullPrompt += `Recent conversation:\n${contextParts.join("\n")}\n\n`;
      }
    }

    fullPrompt += `User's message: ${message}`;

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: fullPrompt }] }],
      generationConfig: {
        temperature: 0.7,
        topP: 0.9,
        topK: 40,
        maxOutputTokens: 2048,
      },
    });
    const response = await result.response;
    const text = response.text();

    return text || "I hear you. Could you tell me more about that?";
  } catch (error: any) {
    console.error("Gemini Error:", error);

    // Check for quota/rate limit errors
    if (
      error.message?.includes("quota") ||
      error.message?.includes("429") ||
      error.message?.includes("RESOURCE_EXHAUSTED") ||
      error.status === 429
    ) {
      return `⚠️ **API Quota Exceeded**

Your Google Gemini API key has run out of free quota. Here's how to fix this:

1. **Get a new API key** at https://aistudio.google.com/app/apikey
2. Update your \`.env\` file with the new key
3. Restart the dev server (\`npm run dev\`)

**Why this happens:** Free tier has limited requests per minute/day.

**Alternative:** Consider upgrading to a paid plan for unlimited access.`;
    }

    if (
      error.message?.includes("API key") ||
      error.message?.includes("API_KEY_INVALID")
    ) {
      return "⚠️ **Invalid API Key**\n\nYour API key is invalid or not configured. Please:\n1. Check your `.env` file\n2. Get a valid key from https://aistudio.google.com/app/apikey\n3. Restart the server";
    }

    if (
      error.message?.includes("network") ||
      error.message?.includes("fetch") ||
      error.message?.includes("Failed to fetch")
    ) {
      return "⚠️ **Network Connection Issue**\n\nPlease check:\n1. Your internet connection\n2. Firewall settings\n3. Try refreshing the page";
    }

    if (error.message?.includes("timeout")) {
      return "⏱️ The request timed out. Please try again with a shorter message.";
    }

    // Generic error with helpful context
    return `⚠️ **Error Connecting to AI**

${error.message || "Unknown error occurred"}

**Troubleshooting:**
- Check your internet connection
- Verify API key in \`.env\` file
- Try refreshing the page
- Check console for more details`;
  }
};

export const checkApiKeyConfigured = (): boolean => {
  return !!API_KEY && API_KEY !== "";
};
