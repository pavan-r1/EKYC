'use server';
/**
 * @fileOverview AI-Based Risk Scoring Flow.
 *
 * This file defines a Genkit flow for scoring the risk associated with a user
 * based on their biometrics, documents, and behavioral patterns.
 *
 * @remarks
 * The flow takes biometric data, document verification results, and customer behavior as input,
 * and uses a machine learning model to score the risk into categories of low, medium, or high.
 *
 * @exports riskScoring - The main function to initiate the risk scoring flow.
 * @exports RiskScoringInput - The input type for the riskScoring function.
 * @exports RiskScoringOutput - The return type for the riskScoring function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const RiskScoringInputSchema = z.object({
  biometrics: z.string().describe('Biometric data of the user.'),
  documentVerification: z.string().describe('Results of document verification.'),
  customerBehavior: z.string().describe('Customer behavior data.'),
});
export type RiskScoringInput = z.infer<typeof RiskScoringInputSchema>;

const RiskScoringOutputSchema = z.object({
  riskScore: z
    .enum(['low', 'medium', 'high'])
    .describe('Risk score categorized as low, medium, or high.'),
  explanation: z.string().describe('Explanation of the risk score.'),
});
export type RiskScoringOutput = z.infer<typeof RiskScoringOutputSchema>;

export async function riskScoring(input: RiskScoringInput): Promise<RiskScoringOutput> {
  return riskScoringFlow(input);
}

const riskScoringPrompt = ai.definePrompt({
  name: 'riskScoringPrompt',
  input: {schema: RiskScoringInputSchema},
  output: {schema: RiskScoringOutputSchema},
  prompt: `You are an AI expert in risk assessment for financial institutions.
  Given the following information about a user, determine their risk score as low, medium, or high.
  Provide a brief explanation for your assessment.

  Biometrics: {{{biometrics}}}
  Document Verification: {{{documentVerification}}}
  Customer Behavior: {{{customerBehavior}}}

  Consider factors such as the consistency of biometric data, the authenticity of documents,
  and any unusual or suspicious behavior patterns.

  Return the risk score and explanation in the format specified in the output schema.
`,
});

const riskScoringFlow = ai.defineFlow(
  {
    name: 'riskScoringFlow',
    inputSchema: RiskScoringInputSchema,
    outputSchema: RiskScoringOutputSchema,
  },
  async input => {
    const {output} = await riskScoringPrompt(input);
    return output!;
  }
);
