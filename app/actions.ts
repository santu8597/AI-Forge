"use server"

import { generateObject } from "ai"
import { google } from "@ai-sdk/google"
import { Sandbox } from "@e2b/code-interpreter"
import { projectPlanSchema, codeFilesSchema } from "@/lib/schemas"

export async function generateProject(prompt: string) {
  try {
    // Step 1: Generate a project plan using Gemini with generateObject
    const { object: projectPlan } = await generateObject({
      model: google("gemini-2.5-flash-preview-04-17"),
      schema: projectPlanSchema,
      system: `You are an expert Next.js developer who specializes in building modern web applications.
      You have deep knowledge of React, TypeScript, and the Next.js App Router.
      You create clean, maintainable code following best practices.
      You excel at using shadcn/ui components and Tailwind CSS for styling.
      You understand how to structure Next.js projects properly with appropriate folder organization.`,
      prompt: `Create a detailed project plan for the following project idea: "${prompt}".
      
      Provide a structured response with:
      - A comprehensive overview of the project
      - A list of key features to implement
      - A detailed technology stack (focusing on Next.js, React, TypeScript, and shadcn/ui)
      - A clear folder structure following Next.js App Router conventions
      - Step-by-step implementation instructions
      
      Be specific and detailed in your planning.`,
    })

    // Step 2: Generate code based on the plan using generateObject with schema
    const { object: files } = await generateObject({
      model: google("gemini-2.5-flash-preview-04-17"),
      schema: codeFilesSchema,
      system: `You are an expert Next.js developer who specializes in building modern web applications.
      You have deep knowledge of React, TypeScript, and the Next.js App Router.
      You create clean, maintainable code following best practices.
      You excel at using shadcn/ui components and Tailwind CSS for styling.
      You understand how to structure Next.js projects properly with appropriate folder organization.`,
      prompt: `Based on this project plan:
      
      Overview: ${projectPlan.overview}
      
      Features:
      ${projectPlan.features.map((feature) => `- ${feature}`).join("\n")}
      
      Technology Stack:
      ${projectPlan.techStack.map((tech) => `- ${tech}`).join("\n")}
      
      Folder Structure:
      ${projectPlan.folderStructure}
      
      Implementation Steps:
      ${projectPlan.implementationSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}
      
      Generate all the necessary code files for this project. Your response should be a JSON object where:
      - Each key is a file path (e.g., "app/page.tsx")
      - Each value is the complete code for that file as a string
      
      Follow these guidelines:
      - Use the Next.js App Router structure
      - Implement shadcn/ui components for the UI
      - Use Tailwind CSS for styling
      - Write clean TypeScript code
      - Include all necessary files to make the project functional
      - Ensure the code is complete and follows best practices`,
    })

    // Convert project plan to string format for display
    const planString = `
# Project Plan: ${prompt}

## Overview
${projectPlan.overview}

## Features
${projectPlan.features.map((feature) => `- ${feature}`).join("\n")}

## Technology Stack
${projectPlan.techStack.map((tech) => `- ${tech}`).join("\n")}

## Folder Structure
\`\`\`
${projectPlan.folderStructure}
\`\`\`

## Implementation Steps
${projectPlan.implementationSteps.map((step, index) => `${index + 1}. ${step}`).join("\n")}
`

    // Step 3: Create a sandbox with e2b
    const sandbox = await Sandbox.create()

    // Write files to the sandbox
    for (const [path, content] of Object.entries(files)) {
      try {
        await sandbox.files.write(path, content)
      } catch (error) {
        console.error(`Error writing file ${path}:`, error)
      }
    }
    // console.log("Files written to sandbox:", files)
    console.log("Sandbox created with ID:", sandbox.sandboxId)
    return {
      plan: planString,
      files,
      sandboxId: sandbox.sandboxId,
    } 
  } catch (error) {
    console.error("Error in generateProject:", error)
    throw new Error(`Failed to generate project: ${error.message}`)
  }
}
