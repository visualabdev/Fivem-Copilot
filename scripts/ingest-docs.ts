#!/usr/bin/env tsx

import { initializeKnowledgeBase } from "../lib/knowledge-base"
import { getRAGPipeline } from "../lib/rag-pipeline"

async function main() {
  console.log("🚀 Starting FiveM Copilot knowledge base ingestion...")

  try {
    // Initialize the knowledge base with sample data
    await initializeKnowledgeBase()

    // Get statistics
    const ragPipeline = getRAGPipeline()
    const stats = await ragPipeline.getStats()

    console.log("\n📊 Knowledge Base Statistics:")
    console.log(`Total Documents: ${stats.totalDocuments}`)
    console.log(
      `Frameworks: ${Object.entries(stats.frameworks)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}`,
    )
    console.log(
      `Types: ${Object.entries(stats.types)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}`,
    )
    console.log(
      `Categories: ${Object.entries(stats.categories)
        .map(([k, v]) => `${k}: ${v}`)
        .join(", ")}`,
    )

    console.log("\n✅ Knowledge base ingestion completed successfully!")

    // Test search functionality
    console.log("\n🔍 Testing search functionality...")
    const searchResult = await ragPipeline.search("How to get player data in QBCore?", {
      topK: 3,
      framework: "qbcore",
    })

    console.log(`Found ${searchResult.totalResults} results in ${searchResult.searchTime}ms`)
    searchResult.results.forEach((result, index) => {
      console.log(`${index + 1}. ${result.metadata.title} (score: ${result.score.toFixed(3)})`)
    })

    process.exit(0)
  } catch (error) {
    console.error("❌ Failed to ingest knowledge base:", error)
    process.exit(1)
  }
}

if (require.main === module) {
  main()
}
