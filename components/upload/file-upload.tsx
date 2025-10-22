"use client"

import { useState, useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Upload, type File, X, CheckCircle, AlertCircle, Folder } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface UploadedFile {
  id: string
  name: string
  size: number
  type: string
  status: "uploading" | "processing" | "completed" | "error"
  progress: number
  framework?: "qbcore" | "esx" | "standalone"
  error?: string
}

export function FileUpload() {
  const [files, setFiles] = useState<UploadedFile[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map((file) => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type,
      status: "uploading",
      progress: 0,
    }))

    setFiles((prev) => [...prev, ...newFiles])
    setIsUploading(true)

    // Process each file
    for (const file of acceptedFiles) {
      const fileId = newFiles.find((f) => f.name === file.name)?.id
      if (!fileId) continue

      try {
        await processFile(file, fileId)
      } catch (error) {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "error", error: "Upload failed" } : f)))
      }
    }

    setIsUploading(false)
  }, [])

  const processFile = async (file: File, fileId: string) => {
    const formData = new FormData()
    formData.append("file", file)

    // Simulate upload progress
    const progressInterval = setInterval(() => {
      setFiles((prev) =>
        prev.map((f) => (f.id === fileId && f.progress < 90 ? { ...f, progress: f.progress + 10 } : f)),
      )
    }, 200)

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      })

      clearInterval(progressInterval)

      if (!response.ok) {
        throw new Error("Upload failed")
      }

      const result = await response.json()

      setFiles((prev) =>
        prev.map((f) =>
          f.id === fileId
            ? {
                ...f,
                status: "processing",
                progress: 100,
                framework: result.framework,
              }
            : f,
        ),
      )

      // Simulate processing
      setTimeout(() => {
        setFiles((prev) => prev.map((f) => (f.id === fileId ? { ...f, status: "completed" } : f)))

        toast({
          title: "File processed successfully",
          description: `${file.name} has been added to your knowledge base.`,
        })
      }, 2000)
    } catch (error) {
      clearInterval(progressInterval)
      throw error
    }
  }

  const removeFile = (fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId))
  }

  const clearCompleted = () => {
    setFiles((prev) => prev.filter((f) => f.status !== "completed"))
  }

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/plain": [".lua"],
      "application/zip": [".zip"],
      "application/x-zip-compressed": [".zip"],
    },
    disabled: isUploading,
  })

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  const getStatusIcon = (status: UploadedFile["status"]) => {
    switch (status) {
      case "uploading":
      case "processing":
        return <Upload className="h-4 w-4 animate-spin" />
      case "completed":
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case "error":
        return <AlertCircle className="h-4 w-4 text-red-500" />
    }
  }

  const getFrameworkBadge = (framework?: string) => {
    if (!framework) return null

    const colors = {
      qbcore: "bg-blue-500/10 text-blue-500 border-blue-500/20",
      esx: "bg-green-500/10 text-green-500 border-green-500/20",
      standalone: "bg-purple-500/10 text-purple-500 border-purple-500/20",
    }

    return (
      <Badge variant="outline" className={colors[framework as keyof typeof colors]}>
        {framework.toUpperCase()}
      </Badge>
    )
  }

  const completedCount = files.filter((f) => f.status === "completed").length

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Folder className="h-5 w-5" />
            Upload FiveM Files
          </CardTitle>
          <CardDescription>
            Upload Lua files or ZIP archives containing your FiveM resources. Supported frameworks: QBCore, ESX, and
            Standalone.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
              ${isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary/50"}
              ${isUploading ? "opacity-50 cursor-not-allowed" : ""}
            `}
          >
            <input {...getInputProps()} />
            <Upload className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
            {isDragActive ? (
              <p className="text-lg font-medium">Drop files here...</p>
            ) : (
              <div>
                <p className="text-lg font-medium mb-2">Drag & drop files here, or click to select</p>
                <p className="text-sm text-muted-foreground">Supports .lua files and .zip archives</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {files.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upload Progress</CardTitle>
                <CardDescription>
                  {completedCount} of {files.length} files processed
                </CardDescription>
              </div>
              {completedCount > 0 && (
                <Button variant="outline" size="sm" onClick={clearCompleted}>
                  Clear Completed
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {files.map((file) => (
                <div key={file.id} className="flex items-center gap-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">{getStatusIcon(file.status)}</div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-sm font-medium truncate">{file.name}</p>
                      {getFrameworkBadge(file.framework)}
                    </div>
                    <p className="text-xs text-muted-foreground mb-2">{formatFileSize(file.size)}</p>

                    {(file.status === "uploading" || file.status === "processing") && (
                      <div className="space-y-1">
                        <Progress value={file.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground">
                          {file.status === "uploading" ? "Uploading..." : "Processing..."}
                        </p>
                      </div>
                    )}

                    {file.status === "error" && <p className="text-xs text-red-500">{file.error}</p>}

                    {file.status === "completed" && (
                      <p className="text-xs text-green-500">Successfully processed and indexed</p>
                    )}
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(file.id)}
                    disabled={file.status === "uploading" || file.status === "processing"}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
