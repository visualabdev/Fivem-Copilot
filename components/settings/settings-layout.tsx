"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Settings, Brain, Database, Shield, Zap } from "lucide-react"
import Link from "next/link"

export function SettingsLayout() {
  const [settings, setSettings] = useState({
    aiProvider: "openai",
    aiModel: "gpt-4",
    apiKey: "",
    temperature: "0.7",
    maxTokens: "2048",
    enableRAG: true,
    vectorDB: "sqlite",
    chunkSize: "1000",
    topK: "6",
    enableLinting: true,
    enableOptimization: true,
    autoSave: true,
    darkMode: true,
  })

  const handleSettingChange = (key: string, value: string | boolean) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <div>
                <h1 className="text-xl font-bold">Settings</h1>
                <p className="text-sm text-muted-foreground">Configure your FiveM Copilot</p>
              </div>
            </div>
            <Link href="/">
              <Button variant="ghost">Home</Button>
            </Link>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <Tabs defaultValue="ai" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="ai" className="flex items-center space-x-2">
              <Brain className="h-4 w-4" />
              <span>AI</span>
            </TabsTrigger>
            <TabsTrigger value="rag" className="flex items-center space-x-2">
              <Database className="h-4 w-4" />
              <span>RAG</span>
            </TabsTrigger>
            <TabsTrigger value="features" className="flex items-center space-x-2">
              <Zap className="h-4 w-4" />
              <span>Features</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>Security</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>AI Configuration</CardTitle>
                <CardDescription>Configure your AI provider and model settings</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="ai-provider">AI Provider</Label>
                    <Select
                      value={settings.aiProvider}
                      onValueChange={(value) => handleSettingChange("aiProvider", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="anthropic">Anthropic</SelectItem>
                        <SelectItem value="ollama">Ollama (Local)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">Model</Label>
                    <Select value={settings.aiModel} onValueChange={(value) => handleSettingChange("aiModel", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {settings.aiProvider === "openai" && (
                          <>
                            <SelectItem value="gpt-4">GPT-4</SelectItem>
                            <SelectItem value="gpt-4-turbo">GPT-4 Turbo</SelectItem>
                            <SelectItem value="gpt-3.5-turbo">GPT-3.5 Turbo</SelectItem>
                          </>
                        )}
                        {settings.aiProvider === "anthropic" && (
                          <>
                            <SelectItem value="claude-3-opus">Claude 3 Opus</SelectItem>
                            <SelectItem value="claude-3-sonnet">Claude 3 Sonnet</SelectItem>
                            <SelectItem value="claude-3-haiku">Claude 3 Haiku</SelectItem>
                          </>
                        )}
                        {settings.aiProvider === "ollama" && (
                          <>
                            <SelectItem value="qwen2.5-coder">Qwen2.5 Coder</SelectItem>
                            <SelectItem value="llama3.1-instruct">Llama 3.1 Instruct</SelectItem>
                            <SelectItem value="codellama">CodeLlama</SelectItem>
                          </>
                        )}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <Input
                    id="api-key"
                    type="password"
                    placeholder="Enter your API key"
                    value={settings.apiKey}
                    onChange={(e) => handleSettingChange("apiKey", e.target.value)}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="temperature">Temperature</Label>
                    <Select
                      value={settings.temperature}
                      onValueChange={(value) => handleSettingChange("temperature", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0.1">0.1 (Focused)</SelectItem>
                        <SelectItem value="0.3">0.3 (Balanced)</SelectItem>
                        <SelectItem value="0.7">0.7 (Creative)</SelectItem>
                        <SelectItem value="1.0">1.0 (Very Creative)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="max-tokens">Max Tokens</Label>
                    <Select
                      value={settings.maxTokens}
                      onValueChange={(value) => handleSettingChange("maxTokens", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1024">1024</SelectItem>
                        <SelectItem value="2048">2048</SelectItem>
                        <SelectItem value="4096">4096</SelectItem>
                        <SelectItem value="8192">8192</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rag" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>RAG Configuration</CardTitle>
                <CardDescription>Configure the Retrieval Augmented Generation system</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Enable RAG</Label>
                    <p className="text-sm text-muted-foreground">Use context from documentation</p>
                  </div>
                  <Switch
                    checked={settings.enableRAG}
                    onCheckedChange={(checked) => handleSettingChange("enableRAG", checked)}
                  />
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="vector-db">Vector Database</Label>
                    <Select value={settings.vectorDB} onValueChange={(value) => handleSettingChange("vectorDB", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="sqlite">SQLite (Local)</SelectItem>
                        <SelectItem value="chroma">Chroma</SelectItem>
                        <SelectItem value="pinecone">Pinecone</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="chunk-size">Chunk Size</Label>
                    <Select
                      value={settings.chunkSize}
                      onValueChange={(value) => handleSettingChange("chunkSize", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="500">500 tokens</SelectItem>
                        <SelectItem value="1000">1000 tokens</SelectItem>
                        <SelectItem value="1500">1500 tokens</SelectItem>
                        <SelectItem value="2000">2000 tokens</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="top-k">Top-K Results</Label>
                  <Select value={settings.topK} onValueChange={(value) => handleSettingChange("topK", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3">3 results</SelectItem>
                      <SelectItem value="6">6 results</SelectItem>
                      <SelectItem value="10">10 results</SelectItem>
                      <SelectItem value="15">15 results</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium">Knowledge Base Status</h4>
                    <Badge variant="outline">Ready</Badge>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-sm">
                    <div>
                      <p className="text-muted-foreground">FiveM Natives</p>
                      <p className="font-medium">1,247 docs</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">QBCore</p>
                      <p className="font-medium">342 docs</p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">ESX</p>
                      <p className="font-medium">198 docs</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="features" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Feature Settings</CardTitle>
                <CardDescription>Enable or disable specific features</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code Linting</Label>
                    <p className="text-sm text-muted-foreground">Real-time Lua syntax checking</p>
                  </div>
                  <Switch
                    checked={settings.enableLinting}
                    onCheckedChange={(checked) => handleSettingChange("enableLinting", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Code Optimization</Label>
                    <p className="text-sm text-muted-foreground">Performance optimization suggestions</p>
                  </div>
                  <Switch
                    checked={settings.enableOptimization}
                    onCheckedChange={(checked) => handleSettingChange("enableOptimization", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Auto Save</Label>
                    <p className="text-sm text-muted-foreground">Automatically save changes</p>
                  </div>
                  <Switch
                    checked={settings.autoSave}
                    onCheckedChange={(checked) => handleSettingChange("autoSave", checked)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Dark Mode</Label>
                    <p className="text-sm text-muted-foreground">Use dark theme</p>
                  </div>
                  <Switch
                    checked={settings.darkMode}
                    onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
                <CardDescription>Configure security and privacy options</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-muted rounded-lg">
                  <h4 className="font-medium mb-2">Data Privacy</h4>
                  <p className="text-sm text-muted-foreground mb-4">
                    Your code and conversations are processed locally when possible. API calls to external services are
                    made only when necessary for AI functionality.
                  </p>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Local processing enabled</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span className="text-sm">No data stored on external servers</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="h-2 w-2 bg-green-500 rounded-full" />
                      <span className="text-sm">Encrypted API communications</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end space-x-4 mt-8">
          <Button variant="outline">Reset to Defaults</Button>
          <Button>Save Settings</Button>
        </div>
      </div>
    </div>
  )
}
