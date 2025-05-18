import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Loader2 } from "lucide-react"
import ReactMarkdown from "react-markdown"

interface ProjectPlanProps {
  plan: string | null
  isLoading: boolean
}

export default function ProjectPlan({ plan, isLoading }: ProjectPlanProps) {
  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <Loader2 className="h-6 w-6 animate-spin" />
            <p>Generating project plan...</p>
          </div>
          <div className="mt-4 space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[90%]" />
            <Skeleton className="h-4 w-[80%]" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-[85%]" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (!plan) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">No project plan generated yet.</CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardContent className="p-6 prose dark:prose-invert max-w-none">
        <ReactMarkdown>{plan}</ReactMarkdown>
      </CardContent>
    </Card>
  )
}
