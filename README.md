# FiveM Copilot Platform

*AI-powered FiveM Lua development assistant with multiple free AI providers*

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/sylexzs-projects/v0-five-m-copilot-platform)
[![Built with v0](https://img.shields.io/badge/Built%20with-v0.app-black?style=for-the-badge)](https://v0.app/chat/projects/VkxHyhryQpx)

## ✨ Features

- 🤖 AI-powered code generation and explanation
- 📚 FiveM Native Reference integration (7,356+ natives)
- 🔧 Support for QBCore, ESX, and Standalone frameworks
- 🚀 Multiple AI providers (OpenAI, Google AI, OpenRouter)
- 📝 Code optimization and refactoring suggestions
- 🔍 RAG-powered context-aware responses

## 🚀 Quick Start

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd fivem-copilot
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure AI Provider** (Choose one):

   ### Option 1: Google AI Studio (FREE) ⭐
   - Get API key from: https://makersuite.google.com/app/apikey
   - Create `.env.local` file:
   ```env
   GOOGLE_AI_API_KEY=your_google_ai_api_key_here
   GOOGLE_AI_MODEL=gemini-1.5-flash
   ```
   - **Limits**: 1,500 requests/day, 1M tokens/minute

   ### Option 2: OpenRouter (FREE)
   - Get API key from: https://openrouter.ai/keys
   - Create `.env.local` file:
   ```env
   OPENROUTER_API_KEY=your_openrouter_api_key_here
   OPENROUTER_MODEL=deepseek/deepseek-r1
   ```
   - **Limits**: 200 requests/day with free models

   ### Option 3: OpenAI (Paid)
   ```env
   OPENAI_API_KEY=your_openai_api_key_here
   AI_MODEL=gpt-4
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:3000`

## 🤖 AI Providers

The platform supports multiple AI providers:

| Provider | Cost | Daily Limit | Models | Setup Time |
|----------|------|-------------|---------|------------|
| **Google AI Studio** | Free | 1,500 requests | Gemini 1.5 Flash/Pro | 2 minutes |
| **OpenRouter** | Free | 200 requests | DeepSeek, Llama, Mistral | 2 minutes |
| **OpenAI** | Paid | Based on usage | GPT-4, GPT-3.5 | 2 minutes |

## 📚 FiveM Native Reference

The AI has access to the complete FiveM Native Reference documentation:
- 7,356 documented native functions
- Client-side and server-side examples
- Lua syntax and best practices
- Framework-specific implementations

## 🛠 Development

### Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Project Structure

```
├── app/                 # Next.js app router
│   ├── api/chat/       # AI chat API endpoint
│   └── auth/           # Authentication pages
├── components/         # React components
├── lib/               # Utilities and AI providers
│   ├── google-ai.ts   # Google AI integration
│   ├── openrouter-ai.ts # OpenRouter integration
│   └── rag-pipeline.ts # RAG context system
└── middleware.ts      # Next.js middleware
```

## 🔧 AI Configuration

The system automatically detects which AI provider is configured and uses the appropriate one:

1. **Google AI** (if `GOOGLE_AI_API_KEY` is set)
2. **OpenRouter** (if `OPENROUTER_API_KEY` is set)
3. **OpenAI** (fallback)

## 📖 Usage

1. **Code Generation**: Ask the AI to create FiveM scripts, commands, or events
2. **Code Explanation**: Select code and ask for explanations
3. **Optimization**: Get performance improvements for your scripts
4. **Framework Support**: Works with QBCore, ESX, and Standalone

## 🔒 Authentication

Authentication has been removed for development simplicity. The platform now runs without login requirements.

## 🚀 Deployment

The project is configured for deployment on Vercel. Make sure to set your environment variables in the Vercel dashboard.

---

*Built with Next.js, TypeScript, and multiple AI providers for the best FiveM development experience.*
