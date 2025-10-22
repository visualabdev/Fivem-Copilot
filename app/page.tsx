import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Code, MessageSquare, FileText, Zap, Shield, Upload, Brain } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Header */}
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="h-8 w-8 bg-primary rounded-lg flex items-center justify-center">
                <Code className="h-5 w-5 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-xl font-bold">LabSeve7</h1>
                <p className="text-xs text-muted-foreground">FiveM Lua Copilot</p>
              </div>
            </div>
            <nav className="flex items-center space-x-4">
              <Link href="/studio">
                <Button variant="ghost">Studio</Button>
              </Link>
              <Link href="/docs">
                <Button variant="ghost">Docs</Button>
              </Link>
              <Link href="/upload">
                <Button variant="ghost">Upload</Button>
              </Link>
              <Link href="/settings">
                <Button variant="ghost">Settings</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge variant="secondary" className="mb-4">
            AI-Powered FiveM Development
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-balance">FiveM Lua Copilot</h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto text-pretty">
            Advanced AI assistant for QBCore and ESX development. Get intelligent code suggestions, error analysis, and
            optimization recommendations for your FiveM Lua scripts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/studio">
              <Button size="lg" className="w-full sm:w-auto">
                <Code className="mr-2 h-5 w-5" />
                Open Studio
              </Button>
            </Link>
            <Link href="/docs">
              <Button variant="outline" size="lg" className="w-full sm:w-auto bg-transparent">
                <FileText className="mr-2 h-5 w-5" />
                View Documentation
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Powerful Features</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Everything you need for professional FiveM Lua development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <MessageSquare className="h-8 w-8 text-primary mb-2" />
                <CardTitle>AI Chat Assistant</CardTitle>
                <CardDescription>Context-aware AI that understands QBCore and ESX patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Explain complex code patterns</li>
                  <li>• Generate snippets and templates</li>
                  <li>• Framework-specific guidance</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Zap className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Code Optimization</CardTitle>
                <CardDescription>Reduce resmon usage and improve performance</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Performance analysis</li>
                  <li>• Memory optimization</li>
                  <li>• Best practice suggestions</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Shield className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Code Linting</CardTitle>
                <CardDescription>Advanced Lua linting with FiveM-specific rules</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Syntax error detection</li>
                  <li>• Security vulnerability checks</li>
                  <li>• Style consistency</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Code className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Monaco Editor</CardTitle>
                <CardDescription>Professional code editor with Lua syntax highlighting</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• FiveM natives autocomplete</li>
                  <li>• Multi-file project support</li>
                  <li>• Dark theme optimized</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Upload className="h-8 w-8 text-primary mb-2" />
                <CardTitle>Project Import</CardTitle>
                <CardDescription>Upload and analyze existing FiveM resources</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• ZIP file extraction</li>
                  <li>• Framework detection</li>
                  <li>• Automatic indexing</li>
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Brain className="h-8 w-8 text-primary mb-2" />
                <CardTitle>RAG Knowledge Base</CardTitle>
                <CardDescription>Contextual assistance powered by FiveM documentation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Native function reference</li>
                  <li>• QBCore/ESX documentation</li>
                  <li>• Community best practices</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardContent className="p-12 text-center">
              <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join developers who are already using LabSeve7 FiveM Copilot to build better, more efficient FiveM
                resources.
              </p>
              <Link href="/studio">
                <Button size="lg" variant="secondary">
                  Launch Studio Now
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8 px-4">
        <div className="container mx-auto text-center text-muted-foreground">
          <p>&copy; 2024 LabSeve7. Built with Next.js and AI.</p>
        </div>
      </footer>
    </div>
  )
}
