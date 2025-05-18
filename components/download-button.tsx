"use client"

import { Button } from "@/components/ui/button"
import { Download, Loader2 } from "lucide-react"
import { useState } from "react"

interface DownloadButtonProps {
  files: { [key: string]: string }
  sandboxId: string | null
  projectName?: string
}

export default function DownloadButton({ files, sandboxId, projectName = "project" }: DownloadButtonProps) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownload = async () => {
    if (!sandboxId || Object.keys(files).length === 0) return

    setIsDownloading(true)

    try {
      const response = await fetch("/api/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ sandboxId, files }),
      })

      if (!response.ok) {
        throw new Error("Failed to download project")
      }

      // Get the blob from the response
      const blob = await response.blob()

      // Create a URL for the blob
      const url = window.URL.createObjectURL(blob)

      // Create a temporary link element
      const link = document.createElement("a")
      link.href = url
      link.download = `${projectName.toLowerCase().replace(/\s+/g, "-")}.zip`

      // Append the link to the body
      document.body.appendChild(link)

      // Click the link to trigger the download
      link.click()

      // Clean up
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.error("Error downloading project:", error)
      alert("Failed to download project. Please try again.")
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Button onClick={handleDownload} disabled={isDownloading || !sandboxId || Object.keys(files).length === 0}>
      {isDownloading ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Preparing Download...
        </>
      ) : (
        <>
          <Download className="mr-2 h-4 w-4" />
          Download Project
        </>
      )}
    </Button>
  )
}
