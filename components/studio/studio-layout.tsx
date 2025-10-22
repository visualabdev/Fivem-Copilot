"use client"

import { useState } from "react"
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable"
import { StudioHeader } from "./studio-header"
import { FileExplorer } from "./file-explorer"
import { CodeEditor } from "./code-editor"
import { ChatPanel } from "./chat-panel"

export function StudioLayout() {
  const [activeFile, setActiveFile] = useState<string | null>(null)
  const [fileContent, setFileContent] = useState<string>("")
  const [selectedCode, setSelectedCode] = useState<string>("")

  const handleFileSelect = (filePath: string) => {
    setActiveFile(filePath)
    // In a real implementation, this would load the actual file content
    // For now, we'll use the sample content from the code editor
  }

  return (
    <div className="h-screen flex flex-col bg-background">
      <StudioHeader />
      <div className="flex-1 overflow-hidden">
        <ResizablePanelGroup direction="horizontal">
          <ResizablePanel defaultSize={20} minSize={15} maxSize={30}>
            <FileExplorer onFileSelect={handleFileSelect} activeFile={activeFile} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={55} minSize={30}>
            <CodeEditor activeFile={activeFile} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={25} minSize={20} maxSize={40}>
            <ChatPanel activeFile={activeFile} fileContent={fileContent} selectedCode={selectedCode} />
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </div>
  )
}
