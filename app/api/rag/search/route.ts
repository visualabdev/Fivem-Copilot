import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRAGPipeline } from "@/lib/rag-pipeline"

const searchRequestSchema = z.object({
  query: z.string().min(1).max(500),
  topK: z.number().min(1).max(20).default(6),
  framework: z.enum(["qbcore", "esx", "fivem", "all"]).default("all"),
})

interface DocumentChunk {
  id: string
  content: string
  metadata: {
    source: string
    framework: string
    type: string
    title?: string
    category?: string
  }
  score: number
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { query, topK, framework } = searchRequestSchema.parse(body)

    const ragPipeline = getRAGPipeline()
    const searchOptions: any = { topK }

    if (framework !== "all") {
      searchOptions.framework = framework
    }

    const ragContext = await ragPipeline.search(query, searchOptions)

    return NextResponse.json({
      results: ragContext.results,
      query: ragContext.query,
      totalResults: ragContext.totalResults,
      searchTime: `${ragContext.searchTime}ms`,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("RAG search API error:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}
