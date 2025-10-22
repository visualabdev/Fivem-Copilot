"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { FileCode, X, Save, Download, Upload, Play, Bug } from "lucide-react"
import { MonacoEditor } from "./monaco-editor"

interface CodeEditorProps {
  activeFile: string | null
}

interface FileData {
  path: string
  content: string
  language: string
  modified: boolean
  lastSaved?: Date
}

const sampleFiles: Record<string, string> = {
  "my-resource/fxmanifest.lua": `fx_version 'cerulean'
game 'gta5'

author 'LabSeve7'
description 'Sample FiveM Resource'
version '1.0.0'

shared_scripts {
    'config/config.lua'
}

client_scripts {
    'client.lua'
}

server_scripts {
    'server.lua'
}`,
  "my-resource/server.lua": `-- Server-side script
local QBCore = exports['qb-core']:GetCoreObject()

-- Event handlers
RegisterNetEvent('my-resource:server:doSomething', function()
    local src = source
    local Player = QBCore.Functions.GetPlayer(src)
    
    if not Player then return end
    
    -- Your server logic here
    print('Player ' .. Player.PlayerData.name .. ' triggered server event')
end)

-- Commands
QBCore.Commands.Add('mycommand', 'Test command', {}, false, function(source, args)
    local src = source
    TriggerClientEvent('my-resource:client:notify', src, 'Command executed!')
end)`,
  "my-resource/client.lua": `-- Client-side script
local QBCore = exports['qb-core']:GetCoreObject()

-- Event handlers
RegisterNetEvent('my-resource:client:notify', function(message)
    QBCore.Functions.Notify(message, 'success')
end)

-- Main thread
CreateThread(function()
    while true do
        Wait(1000) -- Always include Wait in loops
        
        -- Your client logic here
    end
end)

-- Key mapping
RegisterKeyMapping('myresource', 'My Resource Action', 'keyboard', 'F6')

RegisterCommand('myresource', function()
    TriggerServerEvent('my-resource:server:doSomething')
end)`,
  "my-resource/config/config.lua": `Config = {}

-- General settings
Config.Debug = false
Config.Locale = 'en'

-- Feature toggles
Config.EnableFeatureA = true
Config.EnableFeatureB = false

-- Timing settings
Config.CheckInterval = 5000 -- 5 seconds
Config.SaveInterval = 30000 -- 30 seconds`,
}

export function CodeEditor({ activeFile }: CodeEditorProps) {
  const [openTabs, setOpenTabs] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [files, setFiles] = useState<Record<string, FileData>>({})

  useEffect(() => {
    if (activeFile && !openTabs.includes(activeFile)) {
      // Load file content
      const content = sampleFiles[activeFile] || "-- File content will be loaded here"
      const language = getLanguageFromPath(activeFile)

      setFiles((prev) => ({
        ...prev,
        [activeFile]: {
          path: activeFile,
          content,
          language,
          modified: false,
        },
      }))

      setOpenTabs((prev) => [...prev, activeFile])
      setActiveTab(activeFile)
    } else if (activeFile) {
      setActiveTab(activeFile)
    }
  }, [activeFile, openTabs])

  const getLanguageFromPath = (path: string): string => {
    const extension = path.split(".").pop()?.toLowerCase()
    switch (extension) {
      case "lua":
        return "lua"
      case "js":
        return "javascript"
      case "json":
        return "json"
      case "md":
        return "markdown"
      default:
        return "plaintext"
    }
  }

  const closeTab = (filePath: string) => {
    const newTabs = openTabs.filter((tab) => tab !== filePath)
    setOpenTabs(newTabs)

    // Remove file data if not modified
    if (!files[filePath]?.modified) {
      setFiles((prev) => {
        const newFiles = { ...prev }
        delete newFiles[filePath]
        return newFiles
      })
    }

    if (activeTab === filePath) {
      setActiveTab(newTabs.length > 0 ? newTabs[newTabs.length - 1] : null)
    }
  }

  const handleFileChange = (filePath: string, content: string) => {
    setFiles((prev) => ({
      ...prev,
      [filePath]: {
        ...prev[filePath],
        content,
        modified: content !== sampleFiles[filePath],
      },
    }))
  }

  const saveFile = async (filePath: string) => {
    const fileData = files[filePath]
    if (!fileData) return

    // Simulate save operation
    await new Promise((resolve) => setTimeout(resolve, 500))

    setFiles((prev) => ({
      ...prev,
      [filePath]: {
        ...prev[filePath],
        modified: false,
        lastSaved: new Date(),
      },
    }))
  }

  const lintFile = async (filePath: string) => {
    const fileData = files[filePath]
    if (!fileData) return

    try {
      const response = await fetch("/api/lint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: fileData.content,
          filename: filePath,
          framework: detectFramework(fileData.content),
        }),
      })

      const result = await response.json()
      console.log("Lint results:", result)
      // TODO: Display lint results in UI
    } catch (error) {
      console.error("Linting failed:", error)
    }
  }

  const optimizeFile = async (filePath: string) => {
    const fileData = files[filePath]
    if (!fileData) return

    try {
      const response = await fetch("/api/optimize", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: fileData.content,
          filename: filePath,
          framework: detectFramework(fileData.content),
        }),
      })

      const result = await response.json()
      console.log("Optimization results:", result)
      // TODO: Display optimization suggestions in UI
    } catch (error) {
      console.error("Optimization failed:", error)
    }
  }

  const detectFramework = (content: string): string => {
    if (content.includes("QBCore") || content.includes("qb-core")) {
      return "qbcore"
    } else if (content.includes("ESX") || content.includes("es_extended")) {
      return "esx"
    }
    return "standalone"
  }

  const downloadFile = (filePath: string) => {
    const fileData = files[filePath]
    if (!fileData) return

    const blob = new Blob([fileData.content], { type: "text/plain" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filePath.split("/").pop() || "file.lua"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const getFileName = (path: string) => {
    return path.split("/").pop() || path
  }

  if (openTabs.length === 0) {
    return (
      <div className="h-full flex items-center justify-center bg-background">
        <div className="text-center text-muted-foreground">
          <FileCode className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p className="text-lg font-medium mb-2">No file selected</p>
          <p className="text-sm">Select a file from the explorer to start editing</p>
          <div className="mt-6 space-y-2">
            <Button variant="outline" className="w-full bg-transparent">
              <Upload className="h-4 w-4 mr-2" />
              Upload Files
            </Button>
            <Button variant="outline" className="w-full bg-transparent">
              <FileCode className="h-4 w-4 mr-2" />
              Create New File
            </Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background">
      <Tabs value={activeTab || undefined} onValueChange={setActiveTab} className="h-full flex flex-col">
        <div className="border-b bg-muted/30">
          <TabsList className="h-auto p-0 bg-transparent">
            {openTabs.map((filePath) => {
              const fileData = files[filePath]
              return (
                <TabsTrigger
                  key={filePath}
                  value={filePath}
                  className="relative px-3 py-2 data-[state=active]:bg-background border-r last:border-r-0"
                >
                  <FileCode className="h-3 w-3 mr-2" />
                  <span className="text-xs">
                    {getFileName(filePath)}
                    {fileData?.modified && <span className="text-orange-500 ml-1">•</span>}
                  </span>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-4 w-4 p-0 ml-2 hover:bg-destructive hover:text-destructive-foreground"
                    onClick={(e) => {
                      e.stopPropagation()
                      closeTab(filePath)
                    }}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                </TabsTrigger>
              )
            })}
          </TabsList>
        </div>

        {openTabs.map((filePath) => {
          const fileData = files[filePath]
          if (!fileData) return null

          return (
            <TabsContent key={filePath} value={filePath} className="flex-1 m-0">
              <div className="h-full flex flex-col">
                <div className="flex items-center justify-between p-2 border-b bg-muted/20">
                  <div className="flex items-center space-x-2">
                    <Badge variant="outline" className="text-xs">
                      {fileData.language}
                    </Badge>
                    <span className="text-sm text-muted-foreground">{filePath}</span>
                    {fileData.modified && (
                      <Badge variant="secondary" className="text-xs">
                        Modified
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center space-x-1">
                    <Button variant="ghost" size="sm" onClick={() => lintFile(filePath)}>
                      <Bug className="h-4 w-4 mr-2" />
                      Lint
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => optimizeFile(filePath)}>
                      <Play className="h-4 w-4 mr-2" />
                      Optimize
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => downloadFile(filePath)}>
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => saveFile(filePath)}>
                      <Save className="h-4 w-4 mr-2" />
                      Save
                    </Button>
                  </div>
                </div>

                <div className="flex-1">
                  <MonacoEditor
                    value={fileData.content}
                    onChange={(content) => handleFileChange(filePath, content)}
                    language={fileData.language}
                    theme="fivem-dark"
                  />
                </div>
              </div>
            </TabsContent>
          )
        })}
      </Tabs>
    </div>
  )
}
