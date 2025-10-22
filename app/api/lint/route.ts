import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const lintRequestSchema = z.object({
  code: z.string().min(1),
  filename: z.string().optional(),
  framework: z.enum(["qbcore", "esx", "standalone"]).optional(),
})

interface LintIssue {
  line: number
  column: number
  severity: "error" | "warning" | "info"
  message: string
  rule: string
  suggestion?: string
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, filename, framework } = lintRequestSchema.parse(body)

    // Simulate linting process
    await new Promise((resolve) => setTimeout(resolve, 500))

    const issues: LintIssue[] = []
    const lines = code.split("\n")

    // Basic Lua syntax checks
    lines.forEach((line, index) => {
      const lineNum = index + 1

      // Check for common FiveM issues
      if (line.includes("while true do") && !line.includes("Wait(")) {
        issues.push({
          line: lineNum,
          column: line.indexOf("while true do") + 1,
          severity: "error",
          message: "Infinite loop without Wait() will freeze the server",
          rule: "fivem-wait-required",
          suggestion: "Add Wait(0) or appropriate delay inside the loop",
        })
      }

      if (line.includes("Wait(0)") && line.includes("while")) {
        issues.push({
          line: lineNum,
          column: line.indexOf("Wait(0)") + 1,
          severity: "warning",
          message: "Wait(0) in loops can cause performance issues",
          rule: "fivem-wait-optimization",
          suggestion: "Use Wait(100) or higher for better performance",
        })
      }

      // Check for uncached natives
      if (line.includes("PlayerPedId()") && !line.includes("local")) {
        issues.push({
          line: lineNum,
          column: line.indexOf("PlayerPedId()") + 1,
          severity: "info",
          message: "Consider caching PlayerPedId() for better performance",
          rule: "fivem-cache-natives",
          suggestion: "local playerPed = PlayerPedId()",
        })
      }

      // Framework-specific checks
      if (framework === "qbcore" && line.includes("ESX.")) {
        issues.push({
          line: lineNum,
          column: line.indexOf("ESX.") + 1,
          severity: "error",
          message: "ESX functions used in QBCore resource",
          rule: "framework-mismatch",
          suggestion: "Use QBCore.Functions instead",
        })
      }

      if (framework === "esx" && line.includes("QBCore.")) {
        issues.push({
          line: lineNum,
          column: line.indexOf("QBCore.") + 1,
          severity: "error",
          message: "QBCore functions used in ESX resource",
          rule: "framework-mismatch",
          suggestion: "Use ESX functions instead",
        })
      }
    })

    return NextResponse.json({
      issues,
      summary: {
        errors: issues.filter((i) => i.severity === "error").length,
        warnings: issues.filter((i) => i.severity === "warning").length,
        info: issues.filter((i) => i.severity === "info").length,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Lint API error:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}
