'use server';
/**
 * @fileOverview An AI agent to verify user identity by comparing a live selfie with a driver's license photo.
 *
 * - verifyFace - A function that handles the face verification process.
 * - FaceVerificationInput - The input type for the verifyFace function.
 * - FaceVerificationOutput - The return type for the verifyFace function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const FaceVerificationInputSchema = z.object({
  selfieDataUri: z
    .string()
    .describe(
      "A photo of the user's face (selfie), as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
  licensePhotoDataUri: z
    .string()
    .describe(
      "A photo of the user's driver's license, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type FaceVerificationInput = z.infer<typeof FaceVerificationInputSchema>;

const FaceVerificationOutputSchema = z.object({
  isMatch: z.boolean().describe('Whether the selfie and license photo match.'),
  confidence: z.number().describe('The confidence score of the match.'),
  reason: z.string().optional().describe('Reason for the match result, if any.'),
});
export type FaceVerificationOutput = z.infer<typeof FaceVerificationOutputSchema>;

export async function verifyFace(input: FaceVerificationInput): Promise<FaceVerificationOutput> {
  return faceVerificationFlow(input);
}

const prompt = ai.definePrompt({
  name: 'faceVerificationPrompt',
  input: {schema: FaceVerificationInputSchema},
  output: {schema: FaceVerificationOutputSchema},
  prompt: `You are an AI expert in face verification. You will compare the user's selfie with their driver's license photo to verify their identity.  Determine if the two photos are of the same person.

Selfie: {{media url=selfieDataUri}}
Driver's License: {{media url=licensePhotoDataUri}}

Output a JSON object with the following fields:
- isMatch: true if the faces match, false otherwise.
- confidence: A number between 0 and 1 indicating the confidence level of the match.
- reason: Optional. A brief explanation for the match result, if needed.

Be strict to prevent identity fraud.  Ensure that the faces, lighting, and image quality are similar enough to confirm a match.
`,
});

const faceVerificationFlow = ai.defineFlow(
  {
    name: 'faceVerificationFlow',
    inputSchema: FaceVerificationInputSchema,
    outputSchema: FaceVerificationOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
