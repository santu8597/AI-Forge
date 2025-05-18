import type { z } from "zod"
import type { projectPlanSchema, codeFilesSchema } from "./schemas"

// Define types based on schemas
export type ProjectPlan = z.infer<typeof projectPlanSchema>
export type CodeFiles = z.infer<typeof codeFilesSchema>

export interface GeneratedProject {
  plan: string
  files: CodeFiles
  sandboxId: string
}
