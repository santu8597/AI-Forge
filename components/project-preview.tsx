"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useEffect, useState } from "react"

interface ProjectPreviewProps {
  sandboxId: string | null
}

export default function ProjectPreview({ sandboxId }: ProjectPreviewProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sandboxId) {
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    // For e2b sandbox, we need to construct the preview URL
    try {
      // This is the format for e2b sandbox preview URLs
      setPreviewUrl(`https://code.e2b.dev/sandbox/${sandboxId}`)
      setIsLoading(false)
    } catch (err) {
      console.error("Error setting up preview:", err)
      setError("Failed to set up project preview")
      setIsLoading(false)
    }
  }, [sandboxId])

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Skeleton className="h-[400px] w-full rounded-md" />
            <p className="text-center text-muted-foreground">Preparing project preview...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col items-center justify-center space-y-4">
            <p className="text-center text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!previewUrl) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No preview available.</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-0 h-[600px]">
        <iframe
          src={previewUrl}
          className="w-full h-full border-0"
          title="Project Preview"
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </CardContent>
    </Card>
  )
}
