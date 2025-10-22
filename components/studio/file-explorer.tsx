"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  File,
  Folder,
  FolderOpen,
  Plus,
  Upload,
  ChevronRight,
  ChevronDown,
  FileCode,
  Download,
  Trash2,
  Edit,
} from "lucide-react"
import { cn } from "@/lib/utils"

interface FileNode {
  name: string
  type: "file" | "folder"
  path: string
  children?: FileNode[]
  expanded?: boolean
  size?: number
  lastModified?: Date
}

interface FileExplorerProps {
  onFileSelect: (path: string) => void
  activeFile: string | null
}

export function FileExplorer({ onFileSelect, activeFile }: FileExplorerProps) {
  const [files, setFiles] = useState<FileNode[]>([
    {
      name: "my-resource",
      type: "folder",
      path: "my-resource",
      expanded: true,
      children: [
        {
          name: "fxmanifest.lua",
          type: "file",
          path: "my-resource/fxmanifest.lua",
          size: 245,
          lastModified: new Date(),
        },
        {
          name: "server.lua",
          type: "file",
          path: "my-resource/server.lua",
          size: 1024,
          lastModified: new Date(),
        },
        {
          name: "client.lua",
          type: "file",
          path: "my-resource/client.lua",
          size: 856,
          lastModified: new Date(),
        },
        {
          name: "config",
          type: "folder",
          path: "my-resource/config",
          children: [
            {
              name: "config.lua",
              type: "file",
              path: "my-resource/config/config.lua",
              size: 512,
              lastModified: new Date(),
            },
          ],
        },
      ],
    },
  ])

  const [newFileName, setNewFileName] = useState("")
  const [newFileType, setNewFileType] = useState<"file" | "folder">("file")
  const [selectedFolder, setSelectedFolder] = useState<string>("")

  const toggleFolder = (path: string) => {
    const updateNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === path && node.type === "folder") {
          return { ...node, expanded: !node.expanded }
        }
        if (node.children) {
          return { ...node, children: updateNode(node.children) }
        }
        return node
      })
    }
    setFiles(updateNode(files))
  }

  const createNewFile = () => {
    if (!newFileName.trim()) return

    const parentPath = selectedFolder || "my-resource"
    const newPath = `${parentPath}/${newFileName}`

    const newNode: FileNode = {
      name: newFileName,
      type: newFileType,
      path: newPath,
      size: 0,
      lastModified: new Date(),
      ...(newFileType === "folder" && { children: [], expanded: false }),
    }

    const addToParent = (nodes: FileNode[]): FileNode[] => {
      return nodes.map((node) => {
        if (node.path === parentPath && node.type === "folder") {
          return {
            ...node,
            children: [...(node.children || []), newNode],
          }
        }
        if (node.children) {
          return { ...node, children: addToParent(node.children) }
        }
        return node
      })
    }

    setFiles(addToParent(files))
    setNewFileName("")
    setSelectedFolder("")
  }

  const deleteFile = (path: string) => {
    const removeNode = (nodes: FileNode[]): FileNode[] => {
      return nodes.filter((node) => {
        if (node.path === path) {
          return false
        }
        if (node.children) {
          node.children = removeNode(node.children)
        }
        return true
      })
    }
    setFiles(removeNode(files))
  }

  const exportProject = () => {
    // Create a simple project export
    const projectData = {
      name: "my-resource",
      files: files,
      exportedAt: new Date().toISOString(),
    }

    const blob = new Blob([JSON.stringify(projectData, null, 2)], {
      type: "application/json",
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "project-export.json"
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return "0 B"
    const k = 1024
    const sizes = ["B", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
  }

  const renderFileNode = (node: FileNode, depth = 0) => {
    const isActive = activeFile === node.path

    return (
      <div key={node.path}>
        <div
          className={cn(
            "flex items-center py-1 px-2 hover:bg-accent cursor-pointer text-sm group",
            isActive && "bg-accent text-accent-foreground",
            "transition-colors",
          )}
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => {
            if (node.type === "folder") {
              toggleFolder(node.path)
            } else {
              onFileSelect(node.path)
            }
          }}
        >
          {node.type === "folder" ? (
            <>
              {node.expanded ? <ChevronDown className="h-3 w-3 mr-1" /> : <ChevronRight className="h-3 w-3 mr-1" />}
              {node.expanded ? (
                <FolderOpen className="h-4 w-4 mr-2 text-blue-500" />
              ) : (
                <Folder className="h-4 w-4 mr-2 text-blue-500" />
              )}
            </>
          ) : (
            <>
              <div className="w-4 mr-1" />
              {node.name.endsWith(".lua") ? (
                <FileCode className="h-4 w-4 mr-2 text-orange-500" />
              ) : (
                <File className="h-4 w-4 mr-2 text-gray-500" />
              )}
            </>
          )}
          <span className="truncate flex-1">{node.name}</span>

          {node.type === "file" && node.size && (
            <span className="text-xs text-muted-foreground ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
              {formatFileSize(node.size)}
            </span>
          )}

          <div className="opacity-0 group-hover:opacity-100 transition-opacity ml-2 flex space-x-1">
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0"
              onClick={(e) => {
                e.stopPropagation()
                // TODO: Implement rename
              }}
            >
              <Edit className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="h-5 w-5 p-0 hover:bg-destructive hover:text-destructive-foreground"
              onClick={(e) => {
                e.stopPropagation()
                deleteFile(node.path)
              }}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {node.type === "folder" && node.expanded && node.children && (
          <div>{node.children.map((child) => renderFileNode(child, depth + 1))}</div>
        )}
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-background border-r">
      <div className="p-3 border-b">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-semibold text-sm">Explorer</h3>
          <div className="flex space-x-1">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                  <Plus className="h-3 w-3" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create New {newFileType === "file" ? "File" : "Folder"}</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="file-type">Type</Label>
                    <Select value={newFileType} onValueChange={(value: "file" | "folder") => setNewFileType(value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="file">File</SelectItem>
                        <SelectItem value="folder">Folder</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="file-name">Name</Label>
                    <Input
                      id="file-name"
                      value={newFileName}
                      onChange={(e) => setNewFileName(e.target.value)}
                      placeholder={newFileType === "file" ? "script.lua" : "folder-name"}
                    />
                  </div>
                  <Button onClick={createNewFile} className="w-full">
                    Create {newFileType === "file" ? "File" : "Folder"}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
              <Upload className="h-3 w-3" />
            </Button>

            <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={exportProject}>
              <Download className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      <ScrollArea className="flex-1">
        <div className="p-1">{files.map((node) => renderFileNode(node))}</div>
      </ScrollArea>

      <div className="p-3 border-t bg-muted/20">
        <div className="text-xs text-muted-foreground space-y-1">
          <div className="flex justify-between">
            <span>Files:</span>
            <span>{files.reduce((count, node) => count + (node.children?.length || 0), files.length)}</span>
          </div>
          <div className="flex justify-between">
            <span>Framework:</span>
            <span className="text-green-500">QBCore</span>
          </div>
        </div>
      </div>
    </div>
  )
}
