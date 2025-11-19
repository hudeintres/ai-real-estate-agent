# Contract Templates

This directory contains fillable contract templates used by the backend to generate completed contracts.

## TREC Resale Contract

Place the official TREC (Texas Real Estate Commission) fillable PDF contract here as:

- `trec-resale-contract.pdf` - The fillable PDF template that will be used by the AI to automatically fill out contract fields

## Usage

The template is accessed via the utility function in `src/lib/contract-template.ts`:

```typescript
import { getContractTemplatePath } from "@/lib/contract-template";

const templatePath = getContractTemplatePath();
// Returns: /path/to/apps/web/templates/trec-resale-contract.pdf
```

## Notes

- This directory is **not** publicly accessible - templates are only used server-side
- The template should be a fillable PDF form that can be programmatically filled
- Keep templates up to date with the latest TREC contract versions
