"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Search, Book, Code, Zap, FileText, ArrowLeft } from "lucide-react"
import Link from "next/link"

const docCategories = [
  {
    id: "fivem",
    title: "FiveM Natives",
    description: "Complete reference for FiveM native functions",
    icon: Code,
    count: 1247,
    color: "bg-blue-500",
  },
  {
    id: "qbcore",
    title: "QBCore Framework",
    description: "QBCore events, exports, and callbacks",
    icon: Zap,
    count: 342,
    color: "bg-green-500",
  },
  {
    id: "esx",
    title: "ESX Framework",
    description: "ESX Legacy documentation and examples",
    icon: FileText,
    count: 198,
    color: "bg-purple-500",
  },
  {
    id: "examples",
    title: "Code Examples",
    description: "Real-world FiveM resource examples",
    icon: Book,
    count: 89,
    color: "bg-orange-500",
  },
]

const sampleDocs = [
  {
    id: "1",
    title: "GetPlayerPed",
    category: "fivem",
    description: "Returns the ped handle for the specified player",
    content:
      "GetPlayerPed(playerId) -> Ped\n\nParameters:\n- playerId: The player ID\n\nReturns:\n- Ped: The ped handle",
  },
  {
    id: "2",
    title: "QBCore.Functions.GetPlayer",
    category: "qbcore",
    description: "Get player data from server ID",
    content:
      "QBCore.Functions.GetPlayer(source) -> Player\n\nParameters:\n- source: Player server ID\n\nReturns:\n- Player: Player object with data",
  },
  {
    id: "3",
    title: "ESX.GetPlayerFromId",
    category: "esx",
    description: "Get ESX player object from server ID",
    content:
      "ESX.GetPlayerFromId(playerId) -> xPlayer\n\nParameters:\n- playerId: Player server ID\n\nReturns:\n- xPlayer: ESX player object",
  },
]

export function DocsLayout() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedDoc, setSelectedDoc] = useState<string | null>(null)

  const filteredDocs = sampleDocs.filter(
    (doc) =>
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  if (selectedDoc) {
    const doc = sampleDocs.find((d) => d.id === selectedDoc)
    if (!doc) return null

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
          <div className="container mx-auto px-4 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Button variant="ghost" onClick={() => setSelectedDoc(null)}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Docs
                </Button>
                <Separator orientation="vertical" className="h-6" />
                <div>
                  <h1 className="text-xl font-bold">{doc.title}</h1>
                  <p className="text-sm text-muted-foreground">{doc.description}</p>
                </div>
              </div>
              <Link href="/">
                <Button variant="ghost">Home</Button>
              </Link>
            </div>
          </div>
        </header>

        <div className="container mx-auto px-4 py-8">
          <Card>
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="outline">{docCategories.find((c) => c.id === doc.category)?.title}</Badge>
                <CardTitle>{doc.title}</CardTitle>
              </div>
              <CardDescription>{doc.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm font-mono whitespace-pre-wrap">{doc.content}</pre>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold">Documentation</h1>
              <p className="text-sm text-muted-foreground">FiveM, QBCore, and ESX reference</p>
            </div>
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search documentation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {!selectedCategory ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {docCategories.map((category) => (
              <Card
                key={category.id}
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => setSelectedCategory(category.id)}
              >
                <CardHeader>
                  <div className="flex items-center space-x-3">
                    <div className={`h-10 w-10 ${category.color} rounded-lg flex items-center justify-center`}>
                      <category.icon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{category.title}</CardTitle>
                      <Badge variant="secondary" className="text-xs">
                        {category.count} items
                      </Badge>
                    </div>
                  </div>
                  <CardDescription>{category.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        ) : (
          <div className="mb-6">
            <Button variant="ghost" onClick={() => setSelectedCategory(null)}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Categories
            </Button>
          </div>
        )}

        <div className="grid gap-4">
          {filteredDocs.map((doc) => (
            <Card
              key={doc.id}
              className="cursor-pointer hover:shadow-md transition-shadow"
              onClick={() => setSelectedDoc(doc.id)}
            >
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{doc.title}</CardTitle>
                    <CardDescription>{doc.description}</CardDescription>
                  </div>
                  <Badge variant="outline">{docCategories.find((c) => c.id === doc.category)?.title}</Badge>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
