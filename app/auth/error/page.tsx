import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-gray-950 flex items-center justify-center p-6">
      <div className="w-full max-w-sm">
        <div className="flex flex-col gap-6">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-white mb-2">LabSeve7</h1>
            <p className="text-gray-400">FiveM Copilot Platform</p>
          </div>
          <Card className="bg-gray-900 border-gray-800">
            <CardHeader>
              <CardTitle className="text-2xl text-white">Sorry, something went wrong.</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {params?.error ? (
                <p className="text-sm text-red-400">Error: {params.error}</p>
              ) : (
                <p className="text-sm text-gray-300">An unspecified error occurred during authentication.</p>
              )}
              <Button asChild className="w-full bg-blue-600 hover:bg-blue-700">
                <Link href="/auth/login">Try Again</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
