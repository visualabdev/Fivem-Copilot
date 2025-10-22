import { getVectorDatabase, type DocumentChunk, type SearchResult } from "./vector-db"
import { getEmbeddingProvider } from "./embeddings"

export interface RAGContext {
  query: string
  results: SearchResult[]
  totalResults: number
  searchTime: number
}

export interface DocumentInput {
  content: string
  metadata: {
    source: string
    framework: string
    type: string
    title?: string
    category?: string
    filePath?: string
    lineNumber?: number
  }
}

export class RAGPipeline {
  private vectorDb = getVectorDatabase()
  private embeddingProvider = getEmbeddingProvider()

  async search(
    query: string,
    options: {
      topK?: number
      framework?: string
      type?: string
      category?: string
      minScore?: number
    } = {},
  ): Promise<RAGContext> {
    const startTime = Date.now()

    // Generate query embedding
    const queryEmbedding = await this.embeddingProvider.generateEmbedding(query)

    // Search vector database
    const results = await this.vectorDb.search(queryEmbedding, options)

    const searchTime = Date.now() - startTime

    return {
      query,
      results,
      totalResults: results.length,
      searchTime,
    }
  }

  async ingestDocuments(
    documents: DocumentInput[],
    options: {
      chunkSize?: number
      chunkOverlap?: number
      batchSize?: number
    } = {},
  ): Promise<{
    processedDocuments: number
    totalChunks: number
    failedDocuments: number
  }> {
    const { chunkSize = 1000, chunkOverlap = 200, batchSize = 10 } = options

    let processedDocuments = 0
    let totalChunks = 0
    let failedDocuments = 0

    // Process documents in batches
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize)

      try {
        const chunks = await this.processDocumentBatch(batch, chunkSize, chunkOverlap)
        await this.vectorDb.addDocuments(chunks)

        processedDocuments += batch.length
        totalChunks += chunks.length
      } catch (error) {
        console.error("Failed to process document batch:", error)
        failedDocuments += batch.length
      }
    }

    return {
      processedDocuments,
      totalChunks,
      failedDocuments,
    }
  }

  private async processDocumentBatch(
    documents: DocumentInput[],
    chunkSize: number,
    chunkOverlap: number,
  ): Promise<Omit<DocumentChunk, "id" | "createdAt">[]> {
    const allChunks: Omit<DocumentChunk, "id" | "createdAt">[] = []

    for (const doc of documents) {
      const chunks = this.chunkDocument(doc.content, chunkSize, chunkOverlap)

      for (let i = 0; i < chunks.length; i++) {
        const chunk = chunks[i]
        if (chunk.trim().length < 50) continue // Skip very small chunks

        try {
          const embedding = await this.embeddingProvider.generateEmbedding(chunk)

          allChunks.push({
            content: chunk,
            embedding,
            metadata: {
              ...doc.metadata,
              lineNumber: doc.metadata.lineNumber ? doc.metadata.lineNumber + i * 10 : undefined,
            },
          })
        } catch (error) {
          console.error("Failed to generate embedding for chunk:", error)
        }
      }
    }

    return allChunks
  }

  private chunkDocument(content: string, chunkSize: number, chunkOverlap: number): string[] {
    const chunks: string[] = []
    const words = content.split(/\s+/)

    for (let i = 0; i < words.length; i += chunkSize - chunkOverlap) {
      const chunk = words.slice(i, i + chunkSize).join(" ")
      if (chunk.trim().length > 0) {
        chunks.push(chunk.trim())
      }
    }

    return chunks
  }

  async getStats() {
    return await this.vectorDb.getStats()
  }

  async deleteBySource(source: string): Promise<number> {
    return await this.vectorDb.deleteBySource(source)
  }

  async clear(): Promise<void> {
    await this.vectorDb.clear()
  }

  generateContextPrompt(ragContext: RAGContext, userQuery: string, activeFile?: string): string {
    if (ragContext.results.length === 0) {
      return `User Query: ${userQuery}${activeFile ? `\nActive File: ${activeFile}` : ""}\n\nNo relevant documentation found. Please provide general FiveM Lua development assistance.`
    }

    const contextChunks = ragContext.results
      .map(
        (result, index) =>
          `[${index + 1}] ${result.metadata.title || result.metadata.type} (${result.metadata.framework}):\n${result.content}`,
      )
      .join("\n\n")

    return `User Query: ${userQuery}${activeFile ? `\nActive File: ${activeFile}` : ""}

Relevant Documentation:
${contextChunks}

Please provide a helpful response based on the above context and your knowledge of FiveM Lua development.`
  }
}

// Singleton instance
let ragPipelineInstance: RAGPipeline | null = null

export function getRAGPipeline(): RAGPipeline {
  if (!ragPipelineInstance) {
    ragPipelineInstance = new RAGPipeline()
  }
  return ragPipelineInstance
}

export const ragPipeline = getRAGPipeline()
