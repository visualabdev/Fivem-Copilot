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
    aiProvider: "google", // Default to Google AI (free)
    aiModel: "gemini-1.5-flash",
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

  const getProviderInfo = (provider: string) => {
    const providers = {
      google: {
        name: "Google AI Studio",
        cost: "Free",
        limit: "1,500 requests/day",
        models: ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-2.0-flash-exp"],
        defaultModel: "gemini-1.5-flash",
        badge: "bg-green-100 text-green-800",
        badgeText: "FREE",
        setupUrl: "https://makersuite.google.com/app/apikey"
      },
      openrouter: {
        name: "OpenRouter",
        cost: "Free",
        limit: "200 requests/day",
        models: ["deepseek/deepseek-r1", "meta-llama/llama-3.2-3b-instruct", "mistralai/mistral-7b-instruct"],
        defaultModel: "deepseek/deepseek-r1",
        badge: "bg-green-100 text-green-800",
        badgeText: "FREE",
        setupUrl: "https://openrouter.ai/keys"
      },
      openai: {
        name: "OpenAI",
        cost: "Paid",
        limit: "Usage based",
        models: ["gpt-4", "gpt-4-turbo", "gpt-3.5-turbo"],
        defaultModel: "gpt-4",
        badge: "bg-blue-100 text-blue-800",
        badgeText: "PAID",
        setupUrl: "https://platform.openai.com/api-keys"
      },
      anthropic: {
        name: "Anthropic",
        cost: "Paid",
        limit: "Usage based",
        models: ["claude-3-opus", "claude-3-sonnet", "claude-3-haiku"],
        defaultModel: "claude-3-sonnet",
        badge: "bg-purple-100 text-purple-800",
        badgeText: "PAID",
        setupUrl: "https://console.anthropic.com/"
      },
      ollama: {
        name: "Ollama (Local)",
        cost: "Free",
        limit: "Local only",
        models: ["qwen2.5-coder", "llama3.1-instruct", "codellama"],
        defaultModel: "qwen2.5-coder",
        badge: "bg-gray-100 text-gray-800",
        badgeText: "LOCAL",
        setupUrl: "https://ollama.ai/"
      }
    }
    return providers[provider as keyof typeof providers] || providers.openai
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
                      onValueChange={(value) => {
                        const providerInfo = getProviderInfo(value)
                        handleSettingChange("aiProvider", value)
                        handleSettingChange("aiModel", providerInfo.defaultModel)
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="google">
                          <div className="flex items-center space-x-2">
                            <span>Google AI Studio</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">FREE</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="openrouter">
                          <div className="flex items-center space-x-2">
                            <span>OpenRouter</span>
                            <Badge className="bg-green-100 text-green-800 text-xs">FREE</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="openai">
                          <div className="flex items-center space-x-2">
                            <span>OpenAI</span>
                            <Badge className="bg-blue-100 text-blue-800 text-xs">PAID</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="anthropic">
                          <div className="flex items-center space-x-2">
                            <span>Anthropic</span>
                            <Badge className="bg-purple-100 text-purple-800 text-xs">PAID</Badge>
                          </div>
                        </SelectItem>
                        <SelectItem value="ollama">
                          <div className="flex items-center space-x-2">
                            <span>Ollama (Local)</span>
                            <Badge className="bg-gray-100 text-gray-800 text-xs">LOCAL</Badge>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      {getProviderInfo(settings.aiProvider).limit} • {getProviderInfo(settings.aiProvider).cost}
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="ai-model">Model</Label>
                    <Select value={settings.aiModel} onValueChange={(value) => handleSettingChange("aiModel", value)}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {getProviderInfo(settings.aiProvider).models.map((model) => (
                          <SelectItem key={model} value={model}>
                            {model}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="api-key">API Key</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="api-key"
                      type="password"
                      placeholder={`Enter your ${getProviderInfo(settings.aiProvider).name} API key`}
                      value={settings.apiKey}
                      onChange={(e) => handleSettingChange("apiKey", e.target.value)}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => window.open(getProviderInfo(settings.aiProvider).setupUrl, '_blank')}
                    >
                      Get Key
                    </Button>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Get your API key from {getProviderInfo(settings.aiProvider).setupUrl}
                  </p>
                </div>

                <Separator />

                <div className="space-y-3">
                  <h4 className="font-medium">AI Providers Comparison</h4>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b">
                          <th className="text-left py-2">Provider</th>
                          <th className="text-left py-2">Cost</th>
                          <th className="text-left py-2">Daily Limit</th>
                          <th className="text-left py-2">Setup Time</th>
                          <th className="text-left py-2">Best For</th>
                        </tr>
                      </thead>
                      <tbody className="text-muted-foreground">
                        <tr className="border-b">
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <span>Google AI Studio</span>
                              {settings.aiProvider === "google" && (
                                <Badge className="bg-green-100 text-green-800 text-xs">ACTIVE</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-2">Free</td>
                          <td className="py-2">1,500 requests</td>
                          <td className="py-2">2 minutes</td>
                          <td className="py-2">General use, fast responses</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <span>OpenRouter</span>
                              {settings.aiProvider === "openrouter" && (
                                <Badge className="bg-green-100 text-green-800 text-xs">ACTIVE</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-2">Free</td>
                          <td className="py-2">200 requests</td>
                          <td className="py-2">2 minutes</td>
                          <td className="py-2">Multiple model options</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <span>OpenAI</span>
                              {settings.aiProvider === "openai" && (
                                <Badge className="bg-blue-100 text-blue-800 text-xs">ACTIVE</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-2">Paid</td>
                          <td className="py-2">Usage based</td>
                          <td className="py-2">2 minutes</td>
                          <td className="py-2">High quality, unlimited</td>
                        </tr>
                        <tr className="border-b">
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <span>Anthropic</span>
                              {settings.aiProvider === "anthropic" && (
                                <Badge className="bg-purple-100 text-purple-800 text-xs">ACTIVE</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-2">Paid</td>
                          <td className="py-2">Usage based</td>
                          <td className="py-2">5 minutes</td>
                          <td className="py-2">Safe, ethical AI</td>
                        </tr>
                        <tr>
                          <td className="py-2">
                            <div className="flex items-center space-x-2">
                              <span>Ollama</span>
                              {settings.aiProvider === "ollama" && (
                                <Badge className="bg-gray-100 text-gray-800 text-xs">ACTIVE</Badge>
                              )}
                            </div>
                          </td>
                          <td className="py-2">Free</td>
                          <td className="py-2">Local only</td>
                          <td className="py-2">30 minutes</td>
                          <td className="py-2">Privacy, no internet needed</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
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
