"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Code, Home, FileText, Settings, Play, Save, Upload } from "lucide-react"
import Link from "next/link"

export function StudioHeader() {
  return (
    <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="flex items-center justify-between px-4 py-2">
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2">
            <div className="h-6 w-6 bg-primary rounded flex items-center justify-center">
              <Code className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold">LabSeve7</span>
          </Link>
          <Badge variant="secondary" className="text-xs">
            Studio
          </Badge>
        </div>

        <nav className="flex items-center space-x-2">
          <Button variant="ghost" size="sm">
            <Save className="h-4 w-4 mr-2" />
            Save
          </Button>
          <Button variant="ghost" size="sm">
            <Upload className="h-4 w-4 mr-2" />
            Upload
          </Button>
          <Button variant="ghost" size="sm">
            <Play className="h-4 w-4 mr-2" />
            Test
          </Button>
          <div className="h-4 w-px bg-border mx-2" />
          <Link href="/">
            <Button variant="ghost" size="sm">
              <Home className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/docs">
            <Button variant="ghost" size="sm">
              <FileText className="h-4 w-4" />
            </Button>
          </Link>
          <Link href="/settings">
            <Button variant="ghost" size="sm">
              <Settings className="h-4 w-4" />
            </Button>
          </Link>
        </nav>
      </div>
    </header>
  )
}
