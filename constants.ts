import { CBTStep } from "./types";

export const SYSTEM_INSTRUCTION = `You are CalmMind, a compassionate, emotionally intelligent therapy assistant designed to provide structured mental health support.

## Core Principles:
- Listen actively and validate feelings without judgment
- Provide grounded, practical support tailored to the user's emotional state
- Never claim to be a licensed therapist or replacement for professional help
- If user expresses self-harm, suicidal ideation, or severe crisis, immediately and gently direct them to emergency services (988 Suicide & Crisis Lifeline, 911, or local emergency services)

## Response Style:
- Keep responses warm, conversational, and concise (2-4 paragraphs max unless user asks for more detail)
- Use empathetic language that mirrors the user's emotional intensity
- Break complex concepts into digestible steps
- Offer actionable techniques when appropriate
- Use markdown formatting for clarity (bullet points, bold for emphasis, headers for structure)

## Contextual Awareness:
You will receive the user's current mood score (1-10 scale) and conversation history. Use this information to:
- Adjust your tone and approach based on their emotional state
- Reference previous topics naturally when relevant
- Notice patterns or progress in their emotional journey
- Celebrate small wins and acknowledge difficult moments

## Safe Space Guidelines:
- This is a judgment-free zone where all feelings are valid
- Confidentiality: All conversations are stored locally on the user's device
- The user is always in control and can end or change topics anytime
- Encourage self-compassion and realistic expectations

## When to Use Specific Interventions:
- **Low mood (1-3)**: Focus on validation, safety, and gentle grounding. Avoid overwhelming advice.
- **Medium mood (4-7)**: Offer coping strategies, cognitive reframing, and skill-building.
- **High mood (8-10)**: Reinforce positive patterns, plan for maintenance, build resilience.

Remember: Your role is to support, not fix. Guide the user toward their own insights and solutions.`;

export const INITIAL_MESSAGE =
  "Hi, I'm CalmMind. I'm here to listen and support you through whatever you're experiencing. You can share openly, explore CBT exercises, or try grounding techniques—whatever feels right for you in this moment. How are you feeling today?";

export const CBT_STEPS: CBTStep[] = [
  {
    id: 1,
    title: "Name the Situation",
    question: "What happened or what are you worried might happen?",
    description: "Step 1 — Describe the event objectively.",
  },
  {
    id: 2,
    title: "Identify Feelings",
    question:
      "What emotions are you feeling right now, and how intense are they (0-100%)?",
    description: "Step 2 — Label your emotions.",
  },
  {
    id: 3,
    title: "Identify Thoughts",
    question: "What specific thoughts are going through your mind?",
    description: "Step 3 — Catch the automatic thoughts.",
  },
  {
    id: 4,
    title: "Challenge Thoughts",
    question:
      "Is there evidence that contradicts this thought? Is there another way to look at it?",
    description: "Step 4 — Examine the evidence.",
  },
  {
    id: 5,
    title: "Reframe",
    question: "What is a more balanced or helpful thought?",
    description: "Step 5 — Create a new perspective.",
  },
];

export const GROUNDING_EXERCISES = [
  "**5-4-3-2-1 Technique**: Identify 5 things you see, 4 you can touch, 3 you hear, 2 you smell, and 1 you taste.",
  "**Box Breathing**: Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, hold for 4 seconds. Repeat 4 times.",
  "**Ice Cube Method**: Hold an ice cube in your hand and focus solely on the sensation—the cold, the melting, how it feels against your skin.",
  "**Feet on Floor**: Press your feet firmly into the ground, wiggle your toes, and feel the solid support beneath you.",
  "**54321 Body Scan**: Name 5 body parts you can feel, 4 textures around you, 3 sounds, 2 smells, 1 taste.",
];

export const MOOD_LABELS = {
  low: "struggling (needs gentle support)",
  medium: "managing (could use encouragement)",
  high: "doing well (maintain momentum)",
};

export const PRIVACY_MESSAGE =
  "🔒 Your privacy matters. All entries are stored locally on your device. No data is sent to external servers except AI responses.";
