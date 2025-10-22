"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  MessageSquare,
  Send,
  Bot,
  User,
  Zap,
  Code,
  FileText,
  RefreshCw,
  Copy,
  ThumbsUp,
  ThumbsDown,
  Trash2,
  Settings,
  Loader2,
} from "lucide-react"

interface ChatPanelProps {
  activeFile: string | null
  fileContent?: string
  selectedCode?: string
}

interface Message {
  id: string
  type: "user" | "assistant"
  content: string
  timestamp: Date
  mode?: string
  ragContext?: {
    totalResults: number
    searchTime: number
    sources: Array<{
      title: string
      framework: string
      type: string
      score: number
    }>
  }
  feedback?: "positive" | "negative"
}

interface ChatSettings {
  framework: "qbcore" | "esx" | "standalone" | "auto"
  includeFileContent: boolean
  maxContextLength: number
}

export function ChatPanel({ activeFile, fileContent, selectedCode }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      type: "assistant",
      content:
        "Hello! I'm your FiveM Lua Copilot. I can help you with QBCore and ESX development, code optimization, error analysis, and generating snippets. I have access to comprehensive FiveM documentation and can provide contextual assistance based on your active files.\n\nHow can I assist you today?",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [selectedMode, setSelectedMode] = useState<string>("general")
  const [isLoading, setIsLoading] = useState(false)
  const [settings, setSettings] = useState<ChatSettings>({
    framework: "auto",
    includeFileContent: true,
    maxContextLength: 2000,
  })
  const [showSettings, setShowSettings] = useState(false)

  const scrollAreaRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const modes = [
    { id: "general", label: "General", icon: MessageSquare, description: "General assistance and questions" },
    { id: "explain", label: "Explain", icon: FileText, description: "Explain code patterns and concepts" },
    { id: "generate", label: "Generate", icon: Code, description: "Generate code snippets and templates" },
    { id: "optimize", label: "Optimize", icon: Zap, description: "Optimize performance and resmon usage" },
    { id: "refactor", label: "Refactor", icon: RefreshCw, description: "Refactor and improve code structure" },
  ]

  useEffect(() => {
    // Auto-scroll to bottom when new messages are added
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector("[data-radix-scroll-area-viewport]")
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight
      }
    }
  }, [messages])

  const detectFramework = (content: string): "qbcore" | "esx" | "standalone" => {
    if (content.includes("QBCore") || content.includes("qb-core")) return "qbcore"
    if (content.includes("ESX") || content.includes("es_extended")) return "esx"
    return "standalone"
  }

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage: Message = {
      id: Date.now().toString(),
      type: "user",
      content: input,
      timestamp: new Date(),
      mode: selectedMode,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsLoading(true)

    try {
      const requestBody = {
        message: input,
        mode: selectedMode,
        activeFile,
        fileContent: settings.includeFileContent ? fileContent?.substring(0, settings.maxContextLength) : undefined,
        selectedCode,
        framework:
          settings.framework === "auto" ? (fileContent ? detectFramework(fileContent) : undefined) : settings.framework,
      }

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content: result.response,
        timestamp: new Date(),
        ragContext: result.ragContext,
      }

      setMessages((prev) => [...prev, assistantMessage])
    } catch (error) {
      console.error("Chat error:", error)
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          "I apologize, but I encountered an error processing your request. Please try again or check your connection.",
        timestamp: new Date(),
      }
      setMessages((prev) => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const copyMessage = (content: string) => {
    navigator.clipboard.writeText(content)
  }

  const provideFeedback = (messageId: string, feedback: "positive" | "negative") => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === messageId ? { ...msg, feedback } : { ...msg, feedback: undefined })),
    )
  }

  const clearChat = () => {
    setMessages([
      {
        id: "welcome",
        type: "assistant",
        content: "Chat cleared! I'm ready to help you with FiveM Lua development. What would you like to work on?",
        timestamp: new Date(),
      },
    ])
  }

  const formatCode = (content: string) => {
    // Simple code block detection and formatting
    const codeBlockRegex = /```(\w+)?\n([\s\S]*?)```/g
    const inlineCodeRegex = /`([^`]+)`/g

    return content
      .replace(codeBlockRegex, (match, lang, code) => {
        return `<pre class="bg-muted p-3 rounded-lg text-sm font-mono overflow-x-auto my-2"><code class="language-${lang || "lua"}">${code.trim()}</code></pre>`
      })
      .replace(inlineCodeRegex, '<code class="bg-muted px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\n/g, "<br>")
  }

  return (
    <div className="h-full flex flex-col bg-background border-l">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center space-x-2">
            <Bot className="h-5 w-5 text-primary" />
            <h3 className="font-semibold text-sm">FiveM Copilot</h3>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={() => setShowSettings(!showSettings)}>
              <Settings className="h-3 w-3" />
            </Button>
            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={clearChat}>
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>

        {showSettings && (
          <Card className="p-3 mb-3 space-y-3">
            <div>
              <label className="text-xs font-medium">Framework Detection</label>
              <Select
                value={settings.framework}
                onValueChange={(value: "qbcore" | "esx" | "standalone" | "auto") =>
                  setSettings((prev) => ({ ...prev, framework: value }))
                }
              >
                <SelectTrigger className="h-7 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="auto">Auto-detect</SelectItem>
                  <SelectItem value="qbcore">QBCore</SelectItem>
                  <SelectItem value="esx">ESX</SelectItem>
                  <SelectItem value="standalone">Standalone</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between">
              <label className="text-xs font-medium">Include File Content</label>
              <input
                type="checkbox"
                checked={settings.includeFileContent}
                onChange={(e) => setSettings((prev) => ({ ...prev, includeFileContent: e.target.checked }))}
                className="h-3 w-3"
              />
            </div>
          </Card>
        )}

        <div className="space-y-2">
          <p className="text-xs text-muted-foreground">Mode:</p>
          <div className="grid grid-cols-2 gap-1">
            {modes.map((mode) => (
              <Button
                key={mode.id}
                variant={selectedMode === mode.id ? "default" : "ghost"}
                size="sm"
                className="h-8 text-xs justify-start"
                onClick={() => setSelectedMode(mode.id)}
                title={mode.description}
              >
                <mode.icon className="h-3 w-3 mr-1" />
                {mode.label}
              </Button>
            ))}
          </div>
        </div>

        {activeFile && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-1">Active File:</p>
            <Badge variant="outline" className="text-xs">
              {activeFile.split("/").pop()}
            </Badge>
            {settings.framework !== "auto" && (
              <Badge variant="secondary" className="text-xs ml-2">
                {settings.framework.toUpperCase()}
              </Badge>
            )}
          </div>
        )}

        {selectedCode && (
          <div className="mt-3 pt-3 border-t">
            <p className="text-xs text-muted-foreground mb-1">Selected Code:</p>
            <pre className="text-xs bg-muted p-2 rounded max-h-20 overflow-y-auto">
              {selectedCode.substring(0, 200)}
              {selectedCode.length > 200 && "..."}
            </pre>
          </div>
        )}
      </div>

      <ScrollArea className="flex-1 p-3" ref={scrollAreaRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div key={message.id} className="flex space-x-2">
              <div className="flex-shrink-0">
                {message.type === "user" ? (
                  <div className="h-6 w-6 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-3 w-3 text-primary-foreground" />
                  </div>
                ) : (
                  <div className="h-6 w-6 bg-secondary rounded-full flex items-center justify-center">
                    <Bot className="h-3 w-3 text-secondary-foreground" />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-xs font-medium">{message.type === "user" ? "You" : "Copilot"}</span>
                  {message.mode && (
                    <Badge variant="outline" className="text-xs">
                      {modes.find((m) => m.id === message.mode)?.label}
                    </Badge>
                  )}
                  <span className="text-xs text-muted-foreground">{message.timestamp.toLocaleTimeString()}</span>
                </div>
                <Card className="p-3">
                  <div
                    className="text-sm prose prose-sm max-w-none dark:prose-invert"
                    dangerouslySetInnerHTML={{ __html: formatCode(message.content) }}
                  />

                  {message.ragContext && message.ragContext.totalResults > 0 && (
                    <div className="mt-3 pt-3 border-t">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-muted-foreground">Knowledge Sources</span>
                        <Badge variant="outline" className="text-xs">
                          {message.ragContext.totalResults} results ({message.ragContext.searchTime}ms)
                        </Badge>
                      </div>
                      <div className="space-y-1">
                        {message.ragContext.sources.slice(0, 3).map((source, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
                            <span className="truncate">{source.title}</span>
                            <div className="flex items-center space-x-1">
                              <Badge variant="secondary" className="text-xs">
                                {source.framework}
                              </Badge>
                              <span className="text-muted-foreground">{(source.score * 100).toFixed(0)}%</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex items-center justify-between mt-3 pt-2 border-t">
                    <div className="flex items-center space-x-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 px-2 text-xs"
                        onClick={() => copyMessage(message.content)}
                      >
                        <Copy className="h-3 w-3 mr-1" />
                        Copy
                      </Button>
                    </div>
                    {message.type === "assistant" && (
                      <div className="flex items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 ${message.feedback === "positive" ? "text-green-500" : ""}`}
                          onClick={() => provideFeedback(message.id, "positive")}
                        >
                          <ThumbsUp className="h-3 w-3" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className={`h-6 w-6 p-0 ${message.feedback === "negative" ? "text-red-500" : ""}`}
                          onClick={() => provideFeedback(message.id, "negative")}
                        >
                          <ThumbsDown className="h-3 w-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex space-x-2">
              <div className="h-6 w-6 bg-secondary rounded-full flex items-center justify-center">
                <Bot className="h-3 w-3 text-secondary-foreground" />
              </div>
              <Card className="p-3">
                <div className="flex items-center space-x-2">
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="text-sm text-muted-foreground">Thinking...</span>
                </div>
              </Card>
            </div>
          )}
        </div>
      </ScrollArea>

      <div className="p-3 border-t">
        <div className="flex space-x-2">
          <Textarea
            ref={textareaRef}
            placeholder="Ask about FiveM, QBCore, ESX, or paste code for analysis..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={isLoading}
            className="min-h-[40px] max-h-[120px] resize-none"
            rows={1}
          />
          <Button onClick={handleSend} disabled={isLoading || !input.trim()} className="px-3">
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
          </Button>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>Press Enter to send, Shift+Enter for new line</span>
          <span>{input.length}/2000</span>
        </div>
      </div>
    </div>
  )
}
