export interface OpenRouterResponse {
  text: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
  model: string
}

/**
 * Generate text using OpenRouter API
 * @param prompt The prompt to send to the AI
 * @param options Configuration options
 * @returns Promise with the generated text and usage info
 */
export async function generateWithOpenRouter(
  prompt: string,
  options: {
    model?: string
    temperature?: number
    maxTokens?: number
  } = {}
): Promise<OpenRouterResponse> {
  try {
    const {
      model = "deepseek/deepseek-r1", // Free model
      temperature = 0.7,
      maxTokens = 2048,
    } = options

    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "HTTP-Referer": process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
        "X-Title": "FiveM Copilot Platform",
      },
      body: JSON.stringify({
        model,
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature,
        max_tokens: maxTokens,
      }),
    })

    if (!response.ok) {
      throw new Error(`OpenRouter API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()

    return {
      text: data.choices[0]?.message?.content || "",
      usage: data.usage ? {
        promptTokens: data.usage.prompt_tokens || 0,
        completionTokens: data.usage.completion_tokens || 0,
        totalTokens: data.usage.total_tokens || 0,
      } : undefined,
      model: data.model || model,
    }
  } catch (error) {
    console.error("OpenRouter generation failed:", error)
    throw new Error(`OpenRouter request failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Get available free models from OpenRouter
 * @returns List of available free models
 */
export function getOpenRouterFreeModels(): string[] {
  return [
    "deepseek/deepseek-r1",           // DeepSeek R1 (free)
    "meta-llama/llama-3.2-3b-instruct", // Llama 3.2 3B (free)
    "mistralai/mistral-7b-instruct",   // Mistral 7B (free)
    "google/gemma-7b-it",             // Gemma 7B (free)
  ]
}

/**
 * Check if OpenRouter is properly configured
 * @returns Boolean indicating if API key is set
 */
export function isOpenRouterConfigured(): boolean {
  return !!process.env.OPENROUTER_API_KEY
}
