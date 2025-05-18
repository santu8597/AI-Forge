import { z } from "zod"

// Define schema for project plan
export const projectPlanSchema = z.object({
  overview: z.string().min(1),
  features: z.array(z.string().min(1)),
  techStack: z.array(z.string().min(1)),
  folderStructure: z.string().min(1),
  implementationSteps: z.array(z.string().min(1)),
})

// Define schema for code files
export const codeFilesSchema = z.record(z.string().min(1), z.string().min(1))

// Define types based on schemas
export type ProjectPlan = z.infer<typeof projectPlanSchema>
export type CodeFiles = z.infer<typeof codeFilesSchema>
