'use server';
/**
 * @fileOverview Implements a multilingual AI chat assistant flow for KYC process support.
 *
 * - multilingualChatAssistant - A function to handle user queries in their regional language.
 * - MultilingualChatAssistantInput - The input type for the multilingualChatAssistant function.
 * - MultilingualChatAssistantOutput - The return type for the multilingualChatAssistant function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const MultilingualChatAssistantInputSchema = z.object({
  userQuery: z.string().describe('The user query in their regional language.'),
  language: z.string().describe('The regional language of the user query.'),
});
export type MultilingualChatAssistantInput = z.infer<typeof MultilingualChatAssistantInputSchema>;

const MultilingualChatAssistantOutputSchema = z.object({
  response: z.string().describe('The response from the AI chat assistant in the user specified language.'),
});
export type MultilingualChatAssistantOutput = z.infer<typeof MultilingualChatAssistantOutputSchema>;

export async function multilingualChatAssistant(input: MultilingualChatAssistantInput): Promise<MultilingualChatAssistantOutput> {
  return multilingualChatAssistantFlow(input);
}

const prompt = ai.definePrompt({
  name: 'multilingualChatAssistantPrompt',
  input: {schema: MultilingualChatAssistantInputSchema},
  output: {schema: MultilingualChatAssistantOutputSchema},
  prompt: `You are a multilingual AI chat assistant that assists users with the KYC process in their regional language.

  User Query: {{{userQuery}}}
  Language: {{{language}}}

  Respond to the user query in the same language as the query.
  Your goal is to help them navigate the KYC process and answer their questions.
  Keep responses concise and helpful.
  `,
});

const multilingualChatAssistantFlow = ai.defineFlow(
  {
    name: 'multilingualChatAssistantFlow',
    inputSchema: MultilingualChatAssistantInputSchema,
    outputSchema: MultilingualChatAssistantOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
