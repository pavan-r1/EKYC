// This is an AI-powered document understanding flow.
//
// @fileOverview This file defines a Genkit flow for AI-based document understanding.
// It includes functions and schemas for extracting user details from uploaded documents like Aadhaar or PAN cards.
//
// - `extractUserDetails` - A function to extract user details from a document.
// - `DocumentUnderstandingInput` - The input type for the `extractUserDetails` function.
// - `DocumentUnderstandingOutput` - The output type for the `extractUserDetails` function.

'use server';

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DocumentUnderstandingInputSchema = z.object({
  documentDataUri: z
    .string()
    .describe(
      "A document image as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  documentType: z.enum(['Aadhaar', 'PAN']).describe('The type of document uploaded.'),
});

export type DocumentUnderstandingInput = z.infer<typeof DocumentUnderstandingInputSchema>;

const DocumentUnderstandingOutputSchema = z.object({
  userDetails: z.record(z.string(), z.string()).describe('Extracted user details from the document.'),
  confidenceScore: z.number().describe('Confidence score of the extraction.'),
});

export type DocumentUnderstandingOutput = z.infer<typeof DocumentUnderstandingOutputSchema>;

export async function extractUserDetails(
  input: DocumentUnderstandingInput
): Promise<DocumentUnderstandingOutput> {
  return documentUnderstandingFlow(input);
}

const documentUnderstandingPrompt = ai.definePrompt({
  name: 'documentUnderstandingPrompt',
  input: {schema: DocumentUnderstandingInputSchema},
  output: {schema: DocumentUnderstandingOutputSchema},
  prompt: `You are an expert AI assistant specializing in extracting information from documents.

You will receive a document image and the document type. Extract all relevant user details from the document.
Set a confidence score based on how confident you are in the extracted information.

Document Type: {{{documentType}}}
Document Image: {{media url=documentDataUri}}

Output the extracted user details as a JSON object.`,
});

const documentUnderstandingFlow = ai.defineFlow(
  {
    name: 'documentUnderstandingFlow',
    inputSchema: DocumentUnderstandingInputSchema,
    outputSchema: DocumentUnderstandingOutputSchema,
  },
  async input => {
    const {output} = await documentUnderstandingPrompt(input);
    return output!;
  }
);
