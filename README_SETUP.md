# CalmMind - Setup & Documentation

A context-aware mental wellness companion powered by Google Gemini AI.

## 🌟 Features

### Core Functionality
- **Context-Aware AI**: The AI understands your mood and adjusts responses accordingly
- **Mood Tracking**: Visual mood slider (1-10 scale) that directly influences AI behavior
- **Entry Management**: All conversations stored as entries (like journal entries) locally
- **Conversation History**: Last 5 messages automatically included as context
- **Markdown Support**: AI responses beautifully rendered with markdown formatting
- **Dark/Light Mode**: Full theme support with system preference detection
- **Resizable Panels**: Customize your workspace with draggable sidebars

### Privacy & Security
- ✅ **100% Local Storage**: All entries saved on your device using localStorage
- ✅ **No External Database**: Your conversations never leave your browser
- ✅ **Secure API Key**: Stored in `.env` file (never committed to git)
- ✅ **No Tracking**: Zero analytics or data collection

### Smart AI Integration
The AI receives contextual information from your UI interactions:
- Current mood score and recent mood changes
- Last 5 messages from the current conversation
- Whether you just adjusted the mood slider (triggers acknowledgment)
- Safe mode status
- Conversation continuity across the session

## 📋 Prerequisites

- **Node.js** 18+ and npm
- **Google Gemini API Key** (free tier available)

## 🚀 Quick Start

### 1. Clone & Install

```bash
cd abhaya_proj
npm install
```

### 2. Configure API Key

Create a `.env` file in the project root:

```bash
cp .env.example .env
```

Then edit `.env` and add your Gemini API key:

```env
VITE_GEMINI_API_KEY=your_actual_api_key_here
```

**Get your free API key:**
1. Visit https://aistudio.google.com/app/apikey
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy and paste into `.env`

### 3. Run Development Server

```bash
npm run dev
```

Open http://localhost:3000 in your browser.

## 📁 Project Structure

```
abhaya_proj/
├── components/          # React components
│   ├── ChatInterface.tsx       # Main chat UI with markdown rendering
│   ├── ChatHistory.tsx         # Entry sidebar (left panel)
│   ├── MoodTracker.tsx         # Mood slider with stats
│   ├── SupportFlows.tsx        # CBT & grounding exercises
│   ├── ResizablePanel.tsx      # Draggable panel component
│   ├── MarkdownRenderer.tsx    # Markdown formatter for AI responses
│   └── Button.tsx              # Reusable button component
├── services/           # Business logic
│   ├── geminiService.ts        # AI integration with context injection
│   └── entryStorageService.ts  # localStorage management for entries
├── chats/              # Local entry storage (gitignored)
│   └── .gitkeep       # Keeps folder in git
├── constants.ts        # System prompts & configuration
├── types.ts            # TypeScript interfaces
├── App.tsx             # Main application component
├── .env                # API keys (gitignored - YOU MUST CREATE THIS)
├── .env.example        # Template for .env
└── .gitignore          # Protects sensitive files
```

## 🎯 How It Works

### Entry Flow
1. **New Entry**: Click "New Entry" in left sidebar
2. **Set Mood**: Adjust the mood slider (1-10) before or during conversation
3. **Chat**: Type your thoughts - AI receives your mood + last 5 messages as context
4. **Auto-Save**: Entries automatically saved with title extracted from first message
5. **Load History**: Click any past entry to resume that conversation

### Mood Integration
The mood slider is **directly injected** into the AI prompt:

- **Low (1-3)**: AI uses gentle, validating language. Avoids overwhelming advice.
- **Medium (4-7)**: AI offers practical coping strategies and encouragement.
- **High (8-10)**: AI celebrates progress and helps maintain momentum.

**Mood Change Detection**: If you adjust the mood slider by ±2 points, the AI will acknowledge this change in its next response.

### Context Injection
Every message sent to the AI includes:
```
[User's message]
---
Recent Conversation (Last 5 messages):
[Timestamped conversation history]
---
Current User State:
- Mood: 6/10 (medium)
- Context: managing, could use encouragement and coping strategies
```

### Prompt Engineering
All prompts in `constants.ts` and `geminiService.ts` are carefully engineered to:
- Adjust tone based on mood score
- Reference conversation history naturally
- Acknowledge UI interactions (mood changes)
- Provide structured CBT and grounding exercises
- Maintain ethical boundaries (crisis resources for self-harm mentions)

## 🔧 Configuration

### Environment Variables
- `VITE_GEMINI_API_KEY`: Your Google Gemini API key (required)

### Customization
Edit `constants.ts` to modify:
- `SYSTEM_INSTRUCTION`: Core AI personality and guidelines
- `INITIAL_MESSAGE`: First message shown in new entries
- `CBT_STEPS`: Cognitive Behavioral Therapy exercise steps
- `GROUNDING_EXERCISES`: Anxiety/panic management techniques
- `PRIVACY_MESSAGE`: Privacy notice shown in UI

### Storage Location
Entries are stored in browser localStorage under:
- `calmmind_entries_list`: All entry metadata and messages
- `calmmind_current_entry`: Currently active entry ID

## 📊 Stats & Analytics

**Total Entries**: Count of all saved entries
**Average Mood**: Calculated from mood scores across all entries
Both displayed in the Mood Tracker panel (right sidebar)

## 🎨 UI Components Explained

### Left Sidebar (Entry History)
- **Purpose**: Quick access to past conversations
- **Resizable**: Drag the right edge to adjust width
- **Shows**: Entry titles, previews, timestamps, mood indicators
- **Actions**: Load entry, delete entry, create new entry

### Center Panel (Chat Interface)
- **Purpose**: Main conversation area
- **Features**: Markdown rendering, auto-scroll, typing indicators
- **Quick Actions**: Grounding exercises, CBT session, mood tracking, crisis help
- **Input**: Multi-line text with send button

### Right Sidebar (Tools)
- **Mood Tracker**: Slider + current mood + all-time stats
- **Support Flows**: Guided CBT and grounding exercises
- **Privacy Notice**: Reminder that data is stored locally
- **Resizable**: Drag the left edge to adjust width

## 🛡️ Safety Features

- **Crisis Detection**: AI prompts for emergency services if self-harm mentioned
- **Safe Mode Toggle**: Visual indicator of safe space status
- **No Judgment**: System prompts emphasize validation and non-judgment
- **Licensed Professional Disclaimer**: Shown in chat header

## 🚢 Deployment

### Build for Production

```bash
npm run build
```

Output in `dist/` folder.

### Deploy to Vercel/Netlify

1. Set environment variable: `VITE_GEMINI_API_KEY`
2. Deploy the `dist` folder
3. Note: Entries will be per-device (localStorage limitation)

### Git Safety Checklist

Before pushing to GitHub:

```bash
# Verify .env is gitignored
git status  # Should NOT show .env

# Verify .gitignore includes:
cat .gitignore | grep -E "\.env|chats/"

# Safe to push if .env is not in staged files
git add .
git commit -m "Initial commit"
git push origin main
```

## 🐛 Troubleshooting

### "API key not configured" error
- Ensure `.env` file exists in project root
- Verify `VITE_GEMINI_API_KEY=your_key_here` is set
- Restart dev server after adding `.env`

### AI not responding
- Check browser console for errors
- Verify API key is valid at https://aistudio.google.com/
- Check internet connection
- Try refreshing the page

### Entries not saving
- Open browser DevTools → Application → Local Storage
- Verify `calmmind_entries_list` exists
- Check for localStorage quota errors in console
- Clear some old entries if storage is full

### Mood changes not reflected
- Mood injection happens on next message send
- Try sending a message after adjusting the slider
- Check console for "mood changed" logs

## 🔒 Security Best Practices

1. **Never commit `.env`**: Already in `.gitignore` ✅
2. **Rotate API keys**: If exposed, create new key in Google AI Studio
3. **Limit API key**: Set usage quotas in Google Cloud Console
4. **Use HTTPS**: In production, always use secure connections
5. **Regular updates**: Keep dependencies updated for security patches

## 📚 Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite 6
- **AI**: Google Gemini 2.0 Flash (via `@google/genai`)
- **Styling**: TailwindCSS (CDN)
- **Icons**: Lucide React
- **Charts**: Recharts
- **Markdown**: react-markdown + remark-gfm
- **Storage**: Browser localStorage

## 🤝 Contributing

This is a personal mental wellness tool. Feel free to fork and customize for your own use.

### Key Files to Customize
- `constants.ts`: AI personality and prompts
- `geminiService.ts`: Context injection logic
- `App.tsx`: Main app state and flow
- `MoodTracker.tsx`: Mood slider behavior

## 📄 License

Private project - for personal use.

## 🆘 Crisis Resources

**If you or someone you know is in crisis:**

- **988 Suicide & Crisis Lifeline** (US): Call/Text 988
- **Crisis Text Line** (US): Text HOME to 741741
- **International Association for Suicide Prevention**: https://www.iasp.info/resources/Crisis_Centres/

**This app is not a replacement for professional mental health care.**

---

Built with ❤️ for mental wellness and privacy.