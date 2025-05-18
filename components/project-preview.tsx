"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import { useEffect, useState } from "react"

interface ProjectPreviewProps {
  sandboxId: string | null
}

export default function ProjectPreview({ sandboxId }: ProjectPreviewProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!sandboxId) {
      setIsLoading(false)
      return
    }

    setIsLoading(false)
    setError(null)
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

  if (!sandboxId) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No preview available.</CardContent>
      </Card>
    )
  }

  // Instead of embedding an iframe, provide a link to open in a new tab
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center justify-center space-y-6">
          <p className="text-center">
            Due to security restrictions, the sandbox preview needs to be opened in a new tab.
          </p>
          <Button
            onClick={() => window.open(`https://code.e2b.dev/sandbox/${sandboxId}`, "_blank")}
            className="flex items-center gap-2"
          >
            <ExternalLink className="h-4 w-4" />
            Open Sandbox in New Tab
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
