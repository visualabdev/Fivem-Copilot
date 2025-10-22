# FiveM Copilot - Environment Variables Configuration
# Copy this file to .env.local and configure your preferred AI provider

# =============================================================================
# AI PROVIDER OPTIONS (Choose ONE or more)
# =============================================================================

# 🆓 Google AI Studio (RECOMMENDED - Most generous free tier)
# Get your API key from: https://makersuite.google.com/app/apikey
# Limits: 1,500 requests per day, 1M tokens per minute
GOOGLE_AI_API_KEY=AIzaSyBMTLIVeZ-2snCMCA5o2aLHCm37ydY-E_M
GOOGLE_AI_MODEL=gemini-1.5-flash

# 🆓 OpenRouter (Alternative free option)
# Get your API key from: https://openrouter.ai/keys
# Limits: 200 requests per day with free models
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=deepseek/deepseek-r1

# 💰 OpenAI (Paid option - fallback)
# Get your API key from: https://platform.openai.com/api-keys
OPENAI_API_KEY=your_openai_api_key_here
AI_MODEL=gpt-4

# 💰 Anthropic (Paid option)
# Get your API key from: https://console.anthropic.com/
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# 🔒 Ollama (Local AI - requires local installation)
# Install from: https://ollama.ai/
OLLAMA_BASE_URL=http://localhost:11434

# =============================================================================
# AI SETTINGS
# =============================================================================

# Temperature controls creativity (0.1 = focused, 1.0 = creative)
AI_TEMPERATURE=0.7

# Maximum tokens in AI response
AI_MAX_TOKENS=2048

# =============================================================================
# APP SETTINGS
# =============================================================================

# Your app URL (used for OpenRouter referrer)
NEXT_PUBLIC_APP_URL=http://localhost:3000

# Development settings
NODE_ENV=development

# =============================================================================
# SETUP INSTRUCTIONS
# =============================================================================

# 1. Copy this file to .env.local
# 2. Get an API key from one of the providers above
# 3. Set the corresponding API key variable
# 4. Start the development server: npm run dev

# The system will automatically detect which provider is configured
# and use it in order of preference: Google AI > OpenRouter > OpenAI
