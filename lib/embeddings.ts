import OpenAI from "openai"

export interface EmbeddingProvider {
  generateEmbedding(text: string): Promise<number[]>
  generateEmbeddings(texts: string[]): Promise<number[][]>
  getDimensions(): number
}

export class OpenAIEmbeddingProvider implements EmbeddingProvider {
  private client: OpenAI
  private model: string
  private dimensions: number

  constructor(apiKey?: string, model = "text-embedding-3-small") {
    this.client = new OpenAI({
      apiKey: apiKey || process.env.OPENAI_API_KEY,
    })
    this.model = model
    this.dimensions = model === "text-embedding-3-small" ? 1536 : 3072
  }

  async generateEmbedding(text: string): Promise<number[]> {
    try {
      const response = await this.client.embeddings.create({
        model: this.model,
        input: text.replace(/\n/g, " ").trim(),
      })

      return response.data[0].embedding
    } catch (error) {
      console.error("OpenAI embedding error:", error)
      // Return a mock embedding for development
      return this.generateMockEmbedding(text)
    }
  }

  async generateEmbeddings(texts: string[]): Promise<number[][]> {
    try {
      const cleanTexts = texts.map((text) => text.replace(/\n/g, " ").trim())

      const response = await this.client.embeddings.create({
        model: this.model,
        input: cleanTexts,
      })

      return response.data.map((item) => item.embedding)
    } catch (error) {
      console.error("OpenAI embeddings error:", error)
      // Return mock embeddings for development
      return texts.map((text) => this.generateMockEmbedding(text))
    }
  }

  getDimensions(): number {
    return this.dimensions
  }

  private generateMockEmbedding(text: string): number[] {
    // Generate a deterministic mock embedding based on text content
    const hash = this.simpleHash(text)
    const embedding = new Array(this.dimensions)

    for (let i = 0; i < this.dimensions; i++) {
      // Use hash to generate pseudo-random but deterministic values
      const seed = (hash + i) * 2654435761
      embedding[i] = (Math.sin(seed) + 1) / 2 - 0.5 // Normalize to [-0.5, 0.5]
    }

    // Normalize the vector
    const norm = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0))
    return embedding.map((val) => val / norm)
  }

  private simpleHash(str: string): number {
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = (hash << 5) - hash + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return Math.abs(hash)
  }
}

// Singleton instance
let embeddingProvider: EmbeddingProvider | null = null

export function getEmbeddingProvider(): EmbeddingProvider {
  if (!embeddingProvider) {
    embeddingProvider = new OpenAIEmbeddingProvider()
  }
  return embeddingProvider
}
