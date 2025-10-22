import { FileUpload } from "@/components/upload/file-upload"

export default function UploadPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Upload Files</h1>
          <p className="text-muted-foreground">
            Upload your FiveM resources to enhance the AI assistant's knowledge base.
          </p>
        </div>

        <FileUpload />
      </div>
    </div>
  )
}
