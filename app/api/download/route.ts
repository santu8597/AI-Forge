import { type NextRequest, NextResponse } from "next/server"
import JSZip from "jszip"

export async function POST(req: NextRequest) {
  try {
    const { sandboxId, files } = await req.json()

    if (!sandboxId || !files || Object.keys(files).length === 0) {
      return NextResponse.json({ error: "Missing required parameters" }, { status: 400 })
    }

    // Create a new ZIP file
    const zip = new JSZip()

    // Add all files to the ZIP
    for (const [path, content] of Object.entries(files)) {
      zip.file(path, content)
    }

    // Generate the ZIP file
    const zipBlob = await zip.generateAsync({ type: "blob" })

    // Convert Blob to ArrayBuffer
    const arrayBuffer = await zipBlob.arrayBuffer()

    // Return the ZIP file
    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "application/zip",
        "Content-Disposition": `attachment; filename="project.zip"`,
      },
    })
  } catch (error) {
    console.error("Error creating ZIP file:", error)
    return NextResponse.json({ error: "Failed to create ZIP file" }, { status: 500 })
  }
}
