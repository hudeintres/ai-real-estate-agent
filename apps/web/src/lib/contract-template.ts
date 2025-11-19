import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Get the path to the TREC contract template
 * This utility ensures we can reliably find the template file
 * regardless of where the code is executed from
 * 
 * @param state - The state to get the contract template for, in two character format and lowercase (e.g. "tx")
 * @returns The path to the contract template
 */
export function getContractTemplatePath(state: string): string {
  // In Next.js API routes, process.cwd() returns the project root
  // which is apps/web/ in this monorepo structure
  const templatePath = path.join(process.cwd(), 'templates', state.toLowerCase(), 'trec-one-to-four-family-residential-resale-contract.pdf')
  return templatePath
}

/**
 * Get the templates directory path
 */
export function getTemplatesDirectory(): string {
  return path.join(process.cwd(), 'templates')
}

