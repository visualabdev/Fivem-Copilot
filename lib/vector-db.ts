import Database from "better-sqlite3"
import { createHash } from "crypto"

export interface DocumentChunk {
  id: string
  content: string
  embedding: number[]
  metadata: {
    source: string
    framework: string
    type: string
    title?: string
    category?: string
    filePath?: string
    lineNumber?: number
  }
  createdAt: Date
}

export interface SearchResult extends DocumentChunk {
  score: number
}

export class VectorDatabase {
  private db: Database.Database
  private embeddingDim: number

  constructor(dbPath = "./data/vector.db", embeddingDim = 1536) {
    this.db = new Database(dbPath)
    this.embeddingDim = embeddingDim
    this.initializeDatabase()
  }

  private initializeDatabase() {
    // Create tables
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id TEXT PRIMARY KEY,
        content TEXT NOT NULL,
        embedding BLOB NOT NULL,
        source TEXT NOT NULL,
        framework TEXT NOT NULL,
        type TEXT NOT NULL,
        title TEXT,
        category TEXT,
        file_path TEXT,
        line_number INTEGER,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );
      
      CREATE INDEX IF NOT EXISTS idx_framework ON documents(framework);
      CREATE INDEX IF NOT EXISTS idx_type ON documents(type);
      CREATE INDEX IF NOT EXISTS idx_category ON documents(category);
      CREATE INDEX IF NOT EXISTS idx_source ON documents(source);
    `)
  }

  async addDocument(chunk: Omit<DocumentChunk, "id" | "createdAt">): Promise<string> {
    const id = this.generateId(chunk.content)
    const embeddingBlob = Buffer.from(new Float32Array(chunk.embedding).buffer)

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO documents 
      (id, content, embedding, source, framework, type, title, category, file_path, line_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      id,
      chunk.content,
      embeddingBlob,
      chunk.metadata.source,
      chunk.metadata.framework,
      chunk.metadata.type,
      chunk.metadata.title || null,
      chunk.metadata.category || null,
      chunk.metadata.filePath || null,
      chunk.metadata.lineNumber || null,
    )

    return id
  }

  async addDocuments(chunks: Omit<DocumentChunk, "id" | "createdAt">[]): Promise<string[]> {
    const transaction = this.db.transaction((chunks: Omit<DocumentChunk, "id" | "createdAt">[]) => {
      const ids: string[] = []
      for (const chunk of chunks) {
        const id = this.addDocumentSync(chunk)
        ids.push(id)
      }
      return ids
    })

    return transaction(chunks)
  }

  private addDocumentSync(chunk: Omit<DocumentChunk, "id" | "createdAt">): string {
    const id = this.generateId(chunk.content)
    const embeddingBlob = Buffer.from(new Float32Array(chunk.embedding).buffer)

    const stmt = this.db.prepare(`
      INSERT OR REPLACE INTO documents 
      (id, content, embedding, source, framework, type, title, category, file_path, line_number)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `)

    stmt.run(
      id,
      chunk.content,
      embeddingBlob,
      chunk.metadata.source,
      chunk.metadata.framework,
      chunk.metadata.type,
      chunk.metadata.title || null,
      chunk.metadata.category || null,
      chunk.metadata.filePath || null,
      chunk.metadata.lineNumber || null,
    )

    return id
  }

  async search(
    queryEmbedding: number[],
    options: {
      topK?: number
      framework?: string
      type?: string
      category?: string
      minScore?: number
    } = {},
  ): Promise<SearchResult[]> {
    const { topK = 6, framework, type, category, minScore = 0.0 } = options

    let whereClause = "WHERE 1=1"
    const params: any[] = []

    if (framework) {
      whereClause += " AND framework = ?"
      params.push(framework)
    }

    if (type) {
      whereClause += " AND type = ?"
      params.push(type)
    }

    if (category) {
      whereClause += " AND category = ?"
      params.push(category)
    }

    const stmt = this.db.prepare(`
      SELECT id, content, embedding, source, framework, type, title, category, file_path, line_number, created_at
      FROM documents 
      ${whereClause}
    `)

    const rows = stmt.all(...params)
    const results: SearchResult[] = []

    for (const row of rows) {
      const embedding = new Float32Array(row.embedding.buffer)
      const score = this.cosineSimilarity(queryEmbedding, Array.from(embedding))

      if (score >= minScore) {
        results.push({
          id: row.id,
          content: row.content,
          embedding: Array.from(embedding),
          metadata: {
            source: row.source,
            framework: row.framework,
            type: row.type,
            title: row.title,
            category: row.category,
            filePath: row.file_path,
            lineNumber: row.line_number,
          },
          createdAt: new Date(row.created_at),
          score,
        })
      }
    }

    return results.sort((a, b) => b.score - a.score).slice(0, topK)
  }

  async getStats(): Promise<{
    totalDocuments: number
    frameworks: Record<string, number>
    types: Record<string, number>
    categories: Record<string, number>
    sources: Record<string, number>
  }> {
    const totalStmt = this.db.prepare("SELECT COUNT(*) as count FROM documents")
    const total = totalStmt.get() as { count: number }

    const frameworkStmt = this.db.prepare("SELECT framework, COUNT(*) as count FROM documents GROUP BY framework")
    const frameworks = Object.fromEntries(frameworkStmt.all().map((row: any) => [row.framework, row.count]))

    const typeStmt = this.db.prepare("SELECT type, COUNT(*) as count FROM documents GROUP BY type")
    const types = Object.fromEntries(typeStmt.all().map((row: any) => [row.type, row.count]))

    const categoryStmt = this.db.prepare(
      "SELECT category, COUNT(*) as count FROM documents GROUP BY category WHERE category IS NOT NULL",
    )
    const categories = Object.fromEntries(categoryStmt.all().map((row: any) => [row.category, row.count]))

    const sourceStmt = this.db.prepare("SELECT source, COUNT(*) as count FROM documents GROUP BY source")
    const sources = Object.fromEntries(sourceStmt.all().map((row: any) => [row.source, row.count]))

    return {
      totalDocuments: total.count,
      frameworks,
      types,
      categories,
      sources,
    }
  }

  async deleteBySource(source: string): Promise<number> {
    const stmt = this.db.prepare("DELETE FROM documents WHERE source = ?")
    const result = stmt.run(source)
    return result.changes
  }

  async clear(): Promise<void> {
    this.db.exec("DELETE FROM documents")
  }

  close(): void {
    this.db.close()
  }

  private generateId(content: string): string {
    return createHash("sha256").update(content).digest("hex").substring(0, 16)
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length !== b.length) {
      throw new Error("Vectors must have the same length")
    }

    let dotProduct = 0
    let normA = 0
    let normB = 0

    for (let i = 0; i < a.length; i++) {
      dotProduct += a[i] * b[i]
      normA += a[i] * a[i]
      normB += b[i] * b[i]
    }

    if (normA === 0 || normB === 0) {
      return 0
    }

    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB))
  }
}

// Singleton instance
let vectorDb: VectorDatabase | null = null

export function getVectorDatabase(): VectorDatabase {
  if (!vectorDb) {
    vectorDb = new VectorDatabase()
  }
  return vectorDb
}
