import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"

const optimizeRequestSchema = z.object({
  code: z.string().min(1),
  filename: z.string().optional(),
  framework: z.enum(["qbcore", "esx", "standalone"]).optional(),
})

interface OptimizationSuggestion {
  line: number
  type: "performance" | "memory" | "pattern" | "security"
  issue: string
  suggestion: string
  originalCode: string
  optimizedCode: string
  impact: "high" | "medium" | "low"
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { code, filename, framework } = optimizeRequestSchema.parse(body)

    // Simulate optimization analysis
    await new Promise((resolve) => setTimeout(resolve, 800))

    const suggestions: OptimizationSuggestion[] = []
    const lines = code.split("\n")

    lines.forEach((line, index) => {
      const lineNum = index + 1

      // Performance optimizations
      if (line.includes("Wait(0)")) {
        suggestions.push({
          line: lineNum,
          type: "performance",
          issue: "Using Wait(0) can cause unnecessary CPU usage",
          suggestion: "Use dynamic wait times based on activity",
          originalCode: line.trim(),
          optimizedCode: line.replace("Wait(0)", "Wait(100)"),
          impact: "medium",
        })
      }

      if (line.includes("PlayerPedId()") && !line.includes("local")) {
        suggestions.push({
          line: lineNum,
          type: "performance",
          issue: "Repeatedly calling PlayerPedId() is inefficient",
          suggestion: "Cache the player ped at the start of functions",
          originalCode: line.trim(),
          optimizedCode: `local playerPed = PlayerPedId()\n${line.replace(/PlayerPedId$$$$/g, "playerPed")}`,
          impact: "high",
        })
      }

      // Memory optimizations
      if (line.includes("CreateThread") && line.includes("while true")) {
        suggestions.push({
          line: lineNum,
          type: "memory",
          issue: "Infinite threads can accumulate over time",
          suggestion: "Consider using event-driven patterns instead",
          originalCode: line.trim(),
          optimizedCode: "-- Consider using RegisterNetEvent instead of continuous loops",
          impact: "medium",
        })
      }

      // Pattern improvements
      if (
        line.includes("TriggerEvent") &&
        !line.includes("TriggerServerEvent") &&
        !line.includes("TriggerClientEvent")
      ) {
        suggestions.push({
          line: lineNum,
          type: "pattern",
          issue: "Using TriggerEvent for local events",
          suggestion: "Use TriggerServerEvent or TriggerClientEvent for network events",
          originalCode: line.trim(),
          optimizedCode: line.replace("TriggerEvent", "TriggerServerEvent"),
          impact: "low",
        })
      }

      // Security improvements
      if (line.includes("source") && !line.includes("local src = source")) {
        suggestions.push({
          line: lineNum,
          type: "security",
          issue: "Direct use of 'source' parameter",
          suggestion: "Always validate and cache the source parameter",
          originalCode: line.trim(),
          optimizedCode: `local src = source\nif not src then return end\n${line}`,
          impact: "high",
        })
      }
    })

    // Calculate potential performance improvement
    const highImpactCount = suggestions.filter((s) => s.impact === "high").length
    const mediumImpactCount = suggestions.filter((s) => s.impact === "medium").length
    const lowImpactCount = suggestions.filter((s) => s.impact === "low").length

    const estimatedImprovement = highImpactCount * 15 + mediumImpactCount * 8 + lowImpactCount * 3

    return NextResponse.json({
      suggestions,
      summary: {
        totalSuggestions: suggestions.length,
        byType: {
          performance: suggestions.filter((s) => s.type === "performance").length,
          memory: suggestions.filter((s) => s.type === "memory").length,
          pattern: suggestions.filter((s) => s.type === "pattern").length,
          security: suggestions.filter((s) => s.type === "security").length,
        },
        byImpact: {
          high: highImpactCount,
          medium: mediumImpactCount,
          low: lowImpactCount,
        },
        estimatedImprovement: `${estimatedImprovement}%`,
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Optimize API error:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}
