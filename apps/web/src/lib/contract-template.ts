import path from 'path'
import { fileURLToPath } from 'url'

/**
 * Get the path to the contract template based on state and property type
 * This utility ensures we can reliably find the template file
 * regardless of where the code is executed from
 * 
 * @param state - The state to get the contract template for, in two character format and lowercase (e.g. "tx")
 * @param propertyType - The property type ("singlefamily", "condo", etc.). Defaults to "singlefamily"
 * @returns The path to the contract template
 */
export function getContractTemplatePath(state: string, propertyType?: string | null): string {
  // In Next.js API routes, process.cwd() returns the project root
  // which is apps/web/ in this monorepo structure
  const stateLower = state.toLowerCase()
  
  // Determine template filename based on property type
  // Default to singlefamily-resale if propertyType is not specified or not recognized
  let templateFilename = 'singlefamily-resale.pdf'
  if (propertyType) {
    const propTypeLower = propertyType.toLowerCase()
    if (propTypeLower.includes('condo') || propTypeLower.includes('condominium')) {
      templateFilename = 'condo-resale.pdf'
    } else {
      templateFilename = 'singlefamily-resale.pdf'
    }
  }
  
  const templatePath = path.join(process.cwd(), 'templates', stateLower, templateFilename)
  return templatePath
}

/**
 * Get the templates directory path
 */
export function getTemplatesDirectory(): string {
  return path.join(process.cwd(), 'templates')
}

