/**
 * PDF generation utilities for filling contract templates
 */

import { PDFDocument } from 'pdf-lib'
import fs from 'fs/promises'
import path from 'path'
import { getContractTemplatePath } from './contract-template'

export interface OfferData {
  propertyAddress: string
  city: string
  state: string
  zipCode: string
  offerPrice: number
  closingDate: string // YYYY-MM-DD format
  financingType?: string
  buyerName?: string
  buyerEmail?: string
  buyerPhone?: string
  mlsNumber?: string | null
  listingAgentName?: string | null
  listingAgentEmail?: string | null
  listingAgentPhone?: string | null
  sellerCredits?: number | null
  additionalNotes?: string | null
}

/**
 * Generate a filled PDF offer letter from a template
 * 
 * @param offerData - The offer data to fill into the PDF
 * @param propertyType - The property type to determine which template to use
 * @returns The filled PDF as a Uint8Array
 */
export async function generateOfferLetterPDF(
  offerData: OfferData,
  propertyType?: string | null
): Promise<Uint8Array> {
  // Get the template path based on state and property type
  const templatePath = getContractTemplatePath(offerData.state, propertyType)
  
  // Check if template exists
  try {
    await fs.access(templatePath)
  } catch (error) {
    throw new Error(`Template not found at ${templatePath}. Please ensure the template file exists.`)
  }

  // Load the PDF template
  const templateBytes = await fs.readFile(templatePath)
  const pdfDoc = await PDFDocument.load(templateBytes)

  // Get the form from the PDF
  const form = pdfDoc.getForm()

  // Get all form fields to see what's available
  const fields = form.getFields()

  console.log('Fields:', fields)
  // Helper function to safely set a field value
  const setFieldValue = (fieldName: string, value: string | number | null | undefined) => {
    try {
      const field = form.getTextField(fieldName)
      if (value !== null && value !== undefined && value !== '') {
        field.setText(String(value))
      }
    } catch (error) {
      // Field doesn't exist or is not a text field, skip it
      // This is expected for fields that don't exist in the template
    }
  }

  // Helper function to try multiple field name variations
  const setFieldValueVariations = (variations: string[], value: string | number | null | undefined) => {
    for (const fieldName of variations) {
      try {
        setFieldValue(fieldName, value)
        break // If successful, stop trying other variations
      } catch (error) {
        // Continue to next variation
      }
    }
  }

  // Fill in the minimum required fields: property address, offer price, closing date
  // Try common field name variations for address
  const fullAddress = `${offerData.propertyAddress}, ${offerData.city}, ${offerData.state} ${offerData.zipCode}`
  setFieldValueVariations(
    ['PropertyAddress', 'Address', 'Property_Address', 'property_address', 'Property Address'],
    fullAddress
  )
  setFieldValueVariations(
    ['StreetAddress', 'Street_Address', 'street_address', 'Street Address'],
    offerData.propertyAddress
  )
  setFieldValueVariations(
    ['City', 'city', 'PropertyCity', 'Property_City'],
    offerData.city
  )
  setFieldValueVariations(
    ['State', 'state', 'PropertyState', 'Property_State'],
    offerData.state
  )
  setFieldValueVariations(
    ['ZipCode', 'Zip_Code', 'zip_code', 'Zip Code', 'PostalCode', 'Postal_Code'],
    offerData.zipCode
  )

  // Fill in offer price
  const formattedPrice = offerData.offerPrice.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
  setFieldValueVariations(
    ['OfferPrice', 'Offer_Price', 'offer_price', 'Offer Price', 'PurchasePrice', 'Purchase_Price', 'Price'],
    formattedPrice
  )

  // Fill in closing date
  // Format date as MM/DD/YYYY for display
  const closingDateObj = new Date(offerData.closingDate)
  const formattedDate = closingDateObj.toLocaleDateString('en-US', {
    month: '2-digit',
    day: '2-digit',
    year: 'numeric',
  })
  setFieldValueVariations(
    ['ClosingDate', 'Closing_Date', 'closing_date', 'Closing Date', 'CloseDate', 'Close_Date'],
    formattedDate
  )

  // Fill in optional fields if available
  if (offerData.financingType) {
    setFieldValueVariations(
      ['FinancingType', 'Financing_Type', 'financing_type', 'Financing Type', 'LoanType', 'Loan_Type'],
      offerData.financingType
    )
  }

  if (offerData.buyerName) {
    setFieldValueVariations(
      ['BuyerName', 'Buyer_Name', 'buyer_name', 'Buyer Name', 'PurchaserName', 'Purchaser_Name'],
      offerData.buyerName
    )
  }

  if (offerData.buyerEmail) {
    setFieldValueVariations(
      ['BuyerEmail', 'Buyer_Email', 'buyer_email', 'Buyer Email', 'PurchaserEmail', 'Purchaser_Email'],
      offerData.buyerEmail
    )
  }

  if (offerData.buyerPhone) {
    setFieldValueVariations(
      ['BuyerPhone', 'Buyer_Phone', 'buyer_phone', 'Buyer Phone', 'PurchaserPhone', 'Purchaser_Phone'],
      offerData.buyerPhone
    )
  }

  if (offerData.mlsNumber) {
    setFieldValueVariations(
      ['MLSNumber', 'MLS_Number', 'mls_number', 'MLS Number', 'MLS', 'mls'],
      offerData.mlsNumber
    )
  }

  if (offerData.listingAgentName) {
    setFieldValueVariations(
      ['ListingAgentName', 'Listing_Agent_Name', 'listing_agent_name', 'Listing Agent Name', 'AgentName', 'Agent_Name'],
      offerData.listingAgentName
    )
  }

  if (offerData.listingAgentEmail) {
    setFieldValueVariations(
      ['ListingAgentEmail', 'Listing_Agent_Email', 'listing_agent_email', 'Listing Agent Email', 'AgentEmail', 'Agent_Email'],
      offerData.listingAgentEmail
    )
  }

  if (offerData.listingAgentPhone) {
    setFieldValueVariations(
      ['ListingAgentPhone', 'Listing_Agent_Phone', 'listing_agent_phone', 'Listing Agent Phone', 'AgentPhone', 'Agent_Phone'],
      offerData.listingAgentPhone
    )
  }

  if (offerData.sellerCredits) {
    setFieldValueVariations(
      ['SellerCredits', 'Seller_Credits', 'seller_credits', 'Seller Credits', 'Concessions', 'concessions'],
      offerData.sellerCredits.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    )
  }

  // Flatten the form to make it non-editable
  form.flatten()

  // Save the PDF
  const pdfBytes = await pdfDoc.save()
  return pdfBytes
}

/**
 * Save the generated PDF to a file
 * 
 * @param pdfBytes - The PDF bytes to save
 * @param outputPath - The path where to save the PDF
 */
export async function savePDFToFile(pdfBytes: Uint8Array, outputPath: string): Promise<void> {
  await fs.writeFile(outputPath, pdfBytes)
}

