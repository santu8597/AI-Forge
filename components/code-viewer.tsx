"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Folder, File, ChevronRight, ChevronDown } from "lucide-react"
import { cn } from "@/lib/utils"

interface CodeViewerProps {
  files: { [key: string]: string }
}

interface FileTreeNode {
  name: string
  path: string
  type: "file" | "folder"
  children?: FileTreeNode[]
}

export default function CodeViewer({ files }: CodeViewerProps) {
  const [selectedFile, setSelectedFile] = useState<string | null>(
    Object.keys(files).length > 0 ? Object.keys(files)[0] : null,
  )
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set())

  // Build file tree
  const buildFileTree = (): FileTreeNode => {
    const root: FileTreeNode = {
      name: "root",
      path: "",
      type: "folder",
      children: [],
    }

    Object.keys(files).forEach((path) => {
      const parts = path.split("/")
      let currentNode = root

      parts.forEach((part, index) => {
        const isFile = index === parts.length - 1
        const currentPath = parts.slice(0, index + 1).join("/")

        let node = currentNode.children?.find((child) => child.name === part)

        if (!node) {
          node = {
            name: part,
            path: currentPath,
            type: isFile ? "file" : "folder",
            children: isFile ? undefined : [],
          }
          currentNode.children?.push(node)
        }

        if (!isFile) {
          currentNode = node
        }
      })
    })

    return root
  }

  const fileTree = buildFileTree()

  const toggleFolder = (path: string) => {
    setExpandedFolders((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(path)) {
        newSet.delete(path)
      } else {
        newSet.add(path)
      }
      return newSet
    })
  }

  const renderFileTree = (node: FileTreeNode, level = 0) => {
    if (node.type === "file") {
      return (
        <div
          key={node.path}
          className={cn(
            "flex items-center py-1 px-2 cursor-pointer hover:bg-muted rounded-md",
            selectedFile === node.path && "bg-muted",
          )}
          style={{ paddingLeft: `${(level + 1) * 12}px` }}
          onClick={() => setSelectedFile(node.path)}
        >
          <File className="h-4 w-4 mr-2 text-blue-500" />
          <span className="text-sm truncate">{node.name}</span>
        </div>
      )
    }

    if (node.name === "root") {
      return node.children?.map((child) => renderFileTree(child, level))
    }

    const isExpanded = expandedFolders.has(node.path)

    return (
      <div key={node.path}>
        <div
          className="flex items-center py-1 px-2 cursor-pointer hover:bg-muted rounded-md"
          style={{ paddingLeft: `${level * 12}px` }}
          onClick={() => toggleFolder(node.path)}
        >
          {isExpanded ? <ChevronDown className="h-4 w-4 mr-1" /> : <ChevronRight className="h-4 w-4 mr-1" />}
          <Folder className="h-4 w-4 mr-2 text-yellow-500" />
          <span className="text-sm font-medium">{node.name}</span>
        </div>
        {isExpanded && node.children?.map((child) => renderFileTree(child, level + 1))}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className="p-0">
        <div className="grid grid-cols-[300px_1fr] h-[600px] divide-x">
          <div className="p-4 overflow-auto">
            <h3 className="font-medium mb-2">Project Files</h3>
            <ScrollArea className="h-[550px]">{renderFileTree(fileTree)}</ScrollArea>
          </div>
          <div className="overflow-hidden">
            {selectedFile ? (
              <div className="h-full flex flex-col">
                <div className="px-4 py-2 border-b font-mono text-sm truncate">{selectedFile}</div>
                <ScrollArea className="flex-1">
                  <pre className="p-4 text-sm font-mono whitespace-pre-wrap">{files[selectedFile]}</pre>
                </ScrollArea>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center text-muted-foreground">
                Select a file to view its contents
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
