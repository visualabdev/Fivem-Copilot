import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRAGPipeline } from "@/lib/rag-pipeline"

const ingestRequestSchema = z.object({
  documents: z.array(
    z.object({
      content: z.string().min(1),
      metadata: z.object({
        source: z.string(),
        framework: z.string(),
        type: z.string(),
        title: z.string().optional(),
        category: z.string().optional(),
      }),
    }),
  ),
  chunkSize: z.number().min(100).max(2000).default(1000),
  chunkOverlap: z.number().min(0).max(500).default(200),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { documents, chunkSize, chunkOverlap } = ingestRequestSchema.parse(body)

    const ragPipeline = getRAGPipeline()

    const result = await ragPipeline.ingestDocuments(documents, {
      chunkSize,
      chunkOverlap,
      batchSize: 5,
    })

    return NextResponse.json({
      success: true,
      processedDocuments: result.processedDocuments,
      totalChunks: result.totalChunks,
      failedDocuments: result.failedDocuments,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("RAG ingest API error:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}
