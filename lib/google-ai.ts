import { GoogleGenerativeAI } from "@google/generative-ai"

// Initialize Google AI with API key
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export interface GoogleAIResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Generate text using Google Gemini AI
 * @param prompt The prompt to send to the AI
 * @param options Configuration options
 * @returns Promise with the generated text and usage info
 */
export async function generateWithGoogleAI(
  prompt: string,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<GoogleAIResponse> {
  try {
    const {
      model = "gemini-1.5-flash", // Default to free tier model
      temperature = 0.7,
      maxTokens = 2048,
    } = options

    const geminiModel = genAI.getGenerativeModel({ model })

    // Configure generation parameters
    const generationConfig = {
      temperature,
      topK: 40,
      topP: 0.95,
      maxOutputTokens: maxTokens,
    }

    const result = await geminiModel.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig,
    })

    const response = await result.response
    const text = response.text()

    // Extract usage information if available
    const usage = response.usageMetadata ? {
      promptTokens: response.usageMetadata.promptTokenCount || 0,
      completionTokens: response.usageMetadata.candidatesTokenCount || 0,
      totalTokens: response.usageMetadata.totalTokenCount || 0,
    } : undefined

    return {
      text,
      usage,
    }
  } catch (error) {
    console.error("Google AI generation failed:", error)
    throw new Error(`Google AI request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get available models from Google AI Studio
 * @returns List of available models
 */
export function getAvailableModels(): string[] {
  return [
    "gemini-1.5-flash",     // Free tier, fast responses
    "gemini-1.5-pro",       // Paid tier, more capable
    "gemini-2.0-flash-exp", // Experimental, fastest
  ]
}

/**
 * Check if Google AI is properly configured
 * @returns Boolean indicating if API key is set
 */
export function isGoogleAIConfigured(): boolean {
  return !!process.env.GOOGLE_AI_API_KEY
}
