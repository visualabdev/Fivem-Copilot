import { type NextRequest, NextResponse } from "next/server"
import { ragPipeline } from "@/lib/rag-pipeline"

const MAX_FILE_SIZE = 50 * 1024 * 1024 // 50MB
const ALLOWED_EXTENSIONS = [".lua", ".js", ".json", ".txt", ".md", ".zip"]

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: `File ${file.name} exceeds maximum size of 50MB` }, { status: 400 })
    }

    // Validate file extension
    const extension = "." + file.name.split(".").pop()?.toLowerCase()
    if (!ALLOWED_EXTENSIONS.includes(extension)) {
      return NextResponse.json({ error: `File type ${extension} not allowed` }, { status: 400 })
    }

    // Process file content
    const content = await file.text()

    // Detect framework
    let framework = "standalone"
    if (content.includes("QBCore") || content.includes("qb-core")) {
      framework = "qbcore"
    } else if (content.includes("ESX") || content.includes("es_extended")) {
      framework = "esx"
    }

    // Detect file type
    let fileType = "unknown"
    if (file.name === "fxmanifest.lua") {
      fileType = "manifest"
    } else if (file.name.includes("server")) {
      fileType = "server"
    } else if (file.name.includes("client")) {
      fileType = "client"
    } else if (file.name.includes("config")) {
      fileType = "config"
    }

    try {
      await ragPipeline.ingestDocument({
        id: `upload_${Date.now()}_${file.name}`,
        content,
        metadata: {
          filename: file.name,
          framework,
          fileType,
          uploadedAt: new Date().toISOString(),
          size: file.size,
        },
      })
    } catch (ragError) {
      console.error("RAG ingestion error:", ragError)
      // Continue processing even if RAG fails
    }

    const processedFile = {
      name: file.name,
      size: file.size,
      type: fileType,
      framework,
      lines: content.split("\n").length,
      lastModified: new Date(file.lastModified).toISOString(),
    }

    // Simulate processing time
    await new Promise((resolve) => setTimeout(resolve, 1000))

    return NextResponse.json({
      success: true,
      file: processedFile,
      framework,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Upload API error:", error)
    return NextResponse.json({ error: "Failed to process file" }, { status: 500 })
  }
}
