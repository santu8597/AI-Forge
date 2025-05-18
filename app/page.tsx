"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Loader2, Code, Play, FileCode } from "lucide-react"
import ProjectPlan from "@/components/project-plan"
import CodeViewer from "@/components/code-viewer"
import ProjectPreview from "@/components/project-preview"
import DownloadButton from "@/components/download-button"
import { generateProject } from "@/app/actions"

export default function Home() {
  const [prompt, setPrompt] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [projectPlan, setProjectPlan] = useState<string | null>(null)
  const [projectFiles, setProjectFiles] = useState<{ [key: string]: string }>({})
  const [sandboxId, setSandboxId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("plan")
  const [projectName, setProjectName] = useState("My Project")

  const handleSubmit = async () => {
    if (!prompt.trim()) return

    setIsGenerating(true)
    setProjectPlan(null)
    setProjectFiles({})
    setSandboxId(null)

    try {
      // Extract a project name from the prompt
      const nameMatch = prompt.match(
        /(?:create|build|make|develop)\s+(?:a|an)\s+([a-z0-9\s]+?)(?:\s+with|\s+using|\s+that|\.|$)/i,
      )
      const extractedName = nameMatch ? nameMatch[1].trim() : "My Project"
      setProjectName(extractedName.charAt(0).toUpperCase() + extractedName.slice(1))

      const result = await generateProject(prompt)
      setProjectPlan(result.plan)
      setProjectFiles(result.files)
      setSandboxId(result.sandboxId)
      setActiveTab("plan")
    } catch (error) {
      console.error("Error generating project:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <main className="container mx-auto py-8 px-4">
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">AI Project Builder</CardTitle>
          <CardDescription>Describe your project idea, and AI will plan and generate code for you</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Textarea
              placeholder="Describe your project (e.g., 'Create a todo app with React and local storage')"
              className="min-h-[120px] w-full"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isGenerating}
            />
            <Button onClick={handleSubmit} disabled={isGenerating || !prompt.trim()} className="w-full">
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating Project...
                </>
              ) : (
                "Generate Project"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>

      {(projectPlan || isGenerating) && (
        <>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">{projectName}</h2>
            {sandboxId && <DownloadButton files={projectFiles} sandboxId={sandboxId} projectName={projectName} />}
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="plan" className="flex items-center">
                <FileCode className="mr-2 h-4 w-4" />
                Project Plan
              </TabsTrigger>
              <TabsTrigger
                value="code"
                className="flex items-center"
                disabled={!projectFiles || Object.keys(projectFiles).length === 0}
              >
                <Code className="mr-2 h-4 w-4" />
                Code
              </TabsTrigger>
              <TabsTrigger value="preview" className="flex items-center" disabled={!sandboxId}>
                <Play className="mr-2 h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>

            <TabsContent value="plan" className="mt-4">
              <ProjectPlan plan={projectPlan} isLoading={isGenerating} />
            </TabsContent>

            <TabsContent value="code" className="mt-4">
              <CodeViewer files={projectFiles} />
            </TabsContent>

            <TabsContent value="preview" className="mt-4">
              <ProjectPreview sandboxId={sandboxId} />
            </TabsContent>
          </Tabs>
        </>
      )}
    </main>
  )
}
