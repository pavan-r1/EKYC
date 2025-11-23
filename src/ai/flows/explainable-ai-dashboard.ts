'use server';

/**
 * @fileOverview Generates explanations for AI decisions to be displayed on a dashboard.
 *
 * - explainAIDecision - A function that generates an explanation for an AI decision.
 * - ExplainAIDecisionInput - The input type for the explainAIDecision function.
 * - ExplainAIDecisionOutput - The return type for the explainAIDecision function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ExplainAIDecisionInputSchema = z.object({
  decisionType: z
    .string()
    .describe('The type of AI decision that needs explanation (e.g., Risk Score, Fraud Detection).'),
  decisionDetails: z.record(z.any()).describe('Detailed information about the AI decision.'),
  relevantData: z.string().describe('Relevant data used to make the AI decision (e.g., document details, biometric data).'),
});
export type ExplainAIDecisionInput = z.infer<typeof ExplainAIDecisionInputSchema>;

const ExplainAIDecisionOutputSchema = z.object({
  explanation: z
    .string()
    .describe('A human-readable explanation of the AI decision, including the reasoning behind it.'),
  confidenceScore: z.number().describe('A score indicating the confidence level of the AI decision (0-1).'),
  supportingEvidence: z.array(z.string()).describe('List any supporting evidence for the AI decision.'),
});
export type ExplainAIDecisionOutput = z.infer<typeof ExplainAIDecisionOutputSchema>;

export async function explainAIDecision(input: ExplainAIDecisionInput): Promise<ExplainAIDecisionOutput> {
  return explainAIDecisionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'explainAIDecisionPrompt',
  input: {schema: ExplainAIDecisionInputSchema},
  output: {schema: ExplainAIDecisionOutputSchema},
  prompt: `You are an AI explanation specialist, tasked with providing clear and concise explanations for AI decisions for auditors.

  Decision Type: {{{decisionType}}}
  Decision Details: {{{decisionDetails}}}
  Relevant Data: {{{relevantData}}}

  Based on the decision type, details, and relevant data provided, generate a human-readable explanation of the AI decision.
  Include a confidence score (0-1) indicating the reliability of the decision and list any supporting evidence used to arrive at the decision.
  Ensure the explanation is easily understandable for an auditor and highlights the key factors that influenced the outcome.
  Follow the schema to produce a JSON response.`,
});

const explainAIDecisionFlow = ai.defineFlow(
  {
    name: 'explainAIDecisionFlow',
    inputSchema: ExplainAIDecisionInputSchema,
    outputSchema: ExplainAIDecisionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
