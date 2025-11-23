'use server';
/**
 * @fileOverview A speech-to-text AI flow.
 *
 * - speechToText - A function that converts audio to text.
 * - SpeechToTextInput - The input type for the speechToText function.
 * - SpeechToTextOutput - The return type for the speechToText function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SpeechToTextInputSchema = z.object({
  audioDataUri: z
    .string()
    .describe(
      "A recording of a user's voice, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'"
    ),
});
export type SpeechToTextInput = z.infer<typeof SpeechToTextInputSchema>;

const SpeechToTextOutputSchema = z.object({
  text: z.string().describe('The transcribed text from the audio.'),
});
export type SpeechToTextOutput = z.infer<typeof SpeechToTextOutputSchema>;

export async function speechToText(
  input: SpeechToTextInput
): Promise<SpeechToTextOutput> {
  return sttFlow(input);
}

const sttPrompt = ai.definePrompt({
  name: 'sttPrompt',
  input: { schema: z.object({ audioDataUri: z.string() }) },
  output: { schema: SpeechToTextOutputSchema },
  prompt: `Transcribe the following audio recording.

Audio: {{media url=audioDataUri}}`,
});

const sttFlow = ai.defineFlow(
  {
    name: 'sttFlow',
    inputSchema: SpeechToTextInputSchema,
    outputSchema: SpeechToTextOutputSchema,
  },
  async (input) => {
    const { output } = await sttPrompt(input);
    return output!;
  }
);
