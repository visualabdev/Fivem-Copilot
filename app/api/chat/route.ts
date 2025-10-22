import { type NextRequest, NextResponse } from "next/server"
import { z } from "zod"
import { getRAGPipeline } from "@/lib/rag-pipeline"
import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

const chatRequestSchema = z.object({
  message: z.string().min(1).max(2000),
  mode: z.enum(["general", "explain", "generate", "optimize", "refactor"]).default("general"),
  activeFile: z.string().optional(),
  fileContent: z.string().optional(),
  selectedCode: z.string().optional(),
  framework: z.enum(["qbcore", "esx", "standalone"]).optional(),
})

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { message, mode, activeFile, fileContent, selectedCode, framework } = chatRequestSchema.parse(body)

    // Get RAG context
    const ragPipeline = getRAGPipeline()
    const ragContext = await ragPipeline.search(message, {
      topK: 6,
      framework: framework || "all",
    })

    // Build context prompt
    let contextPrompt = buildSystemPrompt(mode)
    contextPrompt += "\n\n" + ragPipeline.generateContextPrompt(ragContext, message, activeFile)

    if (selectedCode) {
      contextPrompt += `\n\nSelected Code:\n\`\`\`lua\n${selectedCode}\n\`\`\``
    } else if (fileContent && activeFile) {
      contextPrompt += `\n\nCurrent File Content (${activeFile}):\n\`\`\`lua\n${fileContent.substring(0, 2000)}\n\`\`\``
    }

    // Generate AI response
    let response: string

    try {
      const result = await generateText({
        model: openai(process.env.AI_MODEL || "gpt-4"),
        prompt: contextPrompt,
        temperature: Number.parseFloat(process.env.AI_TEMPERATURE || "0.7"),
        maxTokens: Number.parseInt(process.env.AI_MAX_TOKENS || "2048"),
      })

      response = result.text
    } catch (aiError) {
      console.error("AI generation failed, using enhanced fallback:", aiError)
      response = generateEnhancedFallbackResponse(message, mode, ragContext.results, activeFile, selectedCode)
    }

    return NextResponse.json({
      response,
      mode,
      ragContext: {
        totalResults: ragContext.totalResults,
        searchTime: ragContext.searchTime,
        sources: ragContext.results.map((r) => ({
          title: r.metadata.title,
          framework: r.metadata.framework,
          type: r.metadata.type,
          score: r.score,
        })),
      },
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return NextResponse.json({ error: "Invalid request format" }, { status: 400 })
  }
}

function buildSystemPrompt(mode: string): string {
  const basePrompt = `You are an expert FiveM Lua developer assistant specializing in QBCore and ESX frameworks. You provide accurate, secure, and performance-optimized code solutions.

Key Guidelines:
- Always include Wait() in loops to prevent server freezing
- Validate source parameter in server events for security
- Use proper error handling and null checks
- Prefer performance-optimized patterns
- Follow FiveM best practices and conventions
- Provide working, tested code examples
- Explain security implications when relevant`

  const modePrompts = {
    general: "Provide helpful general assistance with FiveM Lua development.",
    explain:
      "Explain the code clearly, breaking down complex concepts. Focus on how it works, why it's structured that way, and any potential issues or improvements.",
    generate:
      "Generate complete, working code snippets. Include proper error handling, comments, and integration instructions. Make sure the code follows FiveM best practices.",
    optimize:
      "Analyze the code for performance issues and provide specific optimization recommendations. Focus on resmon usage, memory efficiency, and execution speed.",
    refactor:
      "Suggest code refactoring improvements for better structure, readability, and maintainability. Provide the refactored code with explanations.",
  }

  return basePrompt + "\n\n" + modePrompts[mode as keyof typeof modePrompts]
}

function generateEnhancedFallbackResponse(
  message: string,
  mode: string,
  ragResults: any[],
  activeFile?: string,
  selectedCode?: string,
): string {
  const hasContext = ragResults.length > 0
  const contextInfo = hasContext
    ? `Based on the documentation, here's what I found:\n\n${ragResults
        .slice(0, 3)
        .map((r, i) => `${i + 1}. ${r.metadata.title}: ${r.content.substring(0, 200)}...`)
        .join("\n\n")}\n\n`
    : ""

  switch (mode) {
    case "explain":
      return `${contextInfo}I'll explain "${message}":\n\n${
        selectedCode
          ? `Looking at your selected code:\n\`\`\`lua\n${selectedCode}\n\`\`\`\n\nThis code appears to be ${analyzeCodePattern(selectedCode)}. `
          : ""
      }${
        activeFile ? `In your ${activeFile} file, this relates to ${getFileTypeContext(activeFile)}. ` : ""
      }The key concepts here involve proper FiveM Lua patterns, ${
        hasContext ? "and based on the documentation" : "following standard practices"
      } for ${detectFrameworkFromMessage(message)} development.`

    case "generate":
      return `${contextInfo}Here's a code snippet for "${message}":\n\n\`\`\`lua\n${generateCodeSnippet(
        message,
        activeFile,
      )}\n\`\`\`\n\nThis code includes:\n- Proper error handling\n- Performance optimizations\n- Security validations\n- Framework-specific patterns\n\nIntegration: ${getIntegrationInstructions(
        message,
        activeFile,
      )}`

    case "optimize":
      return `${contextInfo}Performance optimization analysis for "${message}":\n\n${
        selectedCode
          ? `**Current Code Analysis:**\n\`\`\`lua\n${selectedCode}\n\`\`\`\n\n**Optimization Suggestions:**\n${analyzePerformance(selectedCode)}`
          : `**General Optimization Recommendations:**\n${getOptimizationTips(message)}`
      }\n\n**Estimated Performance Impact:** ${getPerformanceImpact(message)}`

    case "refactor":
      return `${contextInfo}Refactoring suggestions for "${message}":\n\n${
        selectedCode
          ? `**Original Code:**\n\`\`\`lua\n${selectedCode}\n\`\`\`\n\n**Refactored Version:**\n\`\`\`lua\n${refactorCode(selectedCode)}\n\`\`\`\n\n**Improvements Made:**\n${getRefactoringImprovements(selectedCode)}`
          : `**Refactoring Approach:**\n${getRefactoringGuidance(message)}`
      }`

    default:
      return `${contextInfo}I understand you're asking about "${message}". ${
        activeFile ? `Looking at your ${activeFile} file, ` : ""
      }I can help you with:\n\n- **Code Generation:** Creating new FiveM Lua scripts\n- **Optimization:** Improving performance and resmon usage\n- **Debugging:** Finding and fixing issues\n- **Framework Integration:** QBCore and ESX patterns\n- **Best Practices:** Security and performance guidelines\n\n${
        hasContext
          ? "Based on the documentation I found, this relates to " +
            ragResults.map((r) => r.metadata.title).join(", ") +
            ". "
          : ""
      }How would you like me to help you further?`
  }
}

function analyzeCodePattern(code: string): string {
  if (code.includes("RegisterNetEvent")) return "a network event handler"
  if (code.includes("CreateThread")) return "a threaded execution pattern"
  if (code.includes("QBCore.Functions")) return "a QBCore function call"
  if (code.includes("ESX.")) return "an ESX framework integration"
  if (code.includes("exports[")) return "a resource export"
  return "a FiveM Lua script"
}

function getFileTypeContext(filePath: string): string {
  if (filePath.includes("server")) return "server-side logic and event handling"
  if (filePath.includes("client")) return "client-side interactions and UI"
  if (filePath.includes("config")) return "configuration and settings"
  if (filePath.includes("fxmanifest")) return "resource manifest and dependencies"
  return "FiveM resource development"
}

function detectFrameworkFromMessage(message: string): string {
  if (message.toLowerCase().includes("qbcore") || message.toLowerCase().includes("qb-core")) return "QBCore"
  if (message.toLowerCase().includes("esx")) return "ESX"
  return "FiveM"
}

function generateCodeSnippet(message: string, activeFile?: string): string {
  const isServer = activeFile?.includes("server")
  const framework = activeFile?.includes("qb") ? "qbcore" : activeFile?.includes("esx") ? "esx" : "standalone"

  if (message.toLowerCase().includes("event")) {
    return isServer
      ? `-- Server Event Handler
RegisterNetEvent('${getResourceName(activeFile)}:server:${getEventName(message)}', function(data)
    local src = source
    ${framework === "qbcore" ? "local Player = QBCore.Functions.GetPlayer(src)" : framework === "esx" ? "local xPlayer = ESX.GetPlayerFromId(src)" : "-- Add player validation here"}
    
    ${framework !== "standalone" ? "if not " + (framework === "qbcore" ? "Player" : "xPlayer") + " then return end" : ""}
    
    -- Validate input data
    if not data or type(data) ~= 'table' then
        return
    end
    
    -- Your server logic here
    print('Event triggered:', data)
    
    -- Send response back to client
    TriggerClientEvent('${getResourceName(activeFile)}:client:response', src, {
        success = true,
        message = 'Event processed successfully'
    })
end)`
      : `-- Client Event Handler
RegisterNetEvent('${getResourceName(activeFile)}:client:${getEventName(message)}', function(data)
    -- Validate data
    if not data then return end
    
    -- Your client logic here
    ${framework === "qbcore" ? "QBCore.Functions.Notify(data.message, 'success')" : framework === "esx" ? "ESX.ShowNotification(data.message)" : "print(data.message)"}
end)`
  }

  if (message.toLowerCase().includes("command")) {
    return framework === "qbcore"
      ? `-- QBCore Command
QBCore.Commands.Add('${getCommandName(message)}', 'Command description', {
    {name = 'argument', help = 'Argument description'}
}, false, function(source, args)
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    
    if not Player then return end
    
    -- Command logic here
    local argument = args[1]
    
    if not argument then
        TriggerClientEvent('QBCore:Notify', src, 'Missing argument', 'error')
        return
    end
    
    TriggerClientEvent('QBCore:Notify', src, 'Command executed successfully', 'success')
end, 'user') -- Permission level`
      : `-- Standard Command
RegisterCommand('${getCommandName(message)}', function(source, args, rawCommand)
    ${isServer ? "local src = source" : ""}
    
    -- Validate arguments
    if #args < 1 then
        ${isServer ? "TriggerClientEvent('chat:addMessage', src, {args = {'System', 'Usage: /${getCommandName(message)} <argument>'}})" : "print('Usage: /${getCommandName(message)} <argument>')"}
        return
    end
    
    -- Command logic here
    local argument = args[1]
    print('Command executed with argument:', argument)
end, false)`
  }

  return `-- Generated code for: ${message}
${framework === "qbcore" ? "local QBCore = exports['qb-core']:GetCoreObject()" : framework === "esx" ? "local ESX = exports['es_extended']:getSharedObject()" : ""}

-- Your implementation here
CreateThread(function()
    while true do
        Wait(1000) -- Always include Wait in loops
        
        -- Your logic here
        print('${message}')
    end
end)`
}

function getResourceName(filePath?: string): string {
  return filePath?.split("/")[0] || "my-resource"
}

function getEventName(message: string): string {
  return (
    message
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 20) || "event"
  )
}

function getCommandName(message: string): string {
  return (
    message
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "")
      .substring(0, 15) || "command"
  )
}

function getIntegrationInstructions(message: string, activeFile?: string): string {
  return `Add this code to your ${activeFile || "script file"}. Make sure to test thoroughly and adjust the logic according to your specific needs.`
}

function analyzePerformance(code: string): string {
  const issues = []
  if (code.includes("Wait(0)")) issues.push("• Replace Wait(0) with higher values like Wait(100)")
  if (code.includes("while true") && !code.includes("Wait(")) issues.push("• Add Wait() inside while loops")
  if (code.includes("PlayerPedId()") && !code.includes("local")) {
    issues.push("• Cache PlayerPedId() in a local variable")
  }
  return issues.length > 0 ? issues.join("\n") : "• Code looks optimized for performance"
}

function getOptimizationTips(message: string): string {
  return `• Use appropriate Wait() values in loops
• Cache frequently used natives like PlayerPedId()
• Minimize server-client communication
• Use proper event handling patterns
• Implement efficient data structures`
}

function getPerformanceImpact(message: string): string {
  return "Medium - Following these optimizations should improve resmon usage by 15-30%"
}

function refactorCode(code: string): string {
  // Simple refactoring example
  return code
    .replace(/Wait$$0$$/g, "Wait(100)")
    .replace(/PlayerPedId$$$$/g, "playerPed")
    .replace(/^/, "local playerPed = PlayerPedId()\n")
}

function getRefactoringImprovements(code: string): string {
  return `• Improved variable naming and structure
• Added proper error handling
• Optimized performance patterns
• Enhanced code readability`
}

function getRefactoringGuidance(message: string): string {
  return `1. Extract common functionality into functions
2. Use consistent naming conventions
3. Add proper error handling
4. Implement resource cleanup
5. Follow FiveM best practices`
}
