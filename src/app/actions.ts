'use server';

import { z } from 'zod';
import {
  extractUserDetails,
  DocumentUnderstandingInput,
  DocumentUnderstandingOutput,
} from '@/ai/flows/document-understanding';
import {
  verifyFace,
  FaceVerificationInput,
  FaceVerificationOutput,
} from '@/ai/flows/face-verification';
import {
  riskScoring,
  RiskScoringInput,
  RiskScoringOutput,
} from '@/ai/flows/risk-scoring';
import {
  explainAIDecision,
  ExplainAIDecisionInput,
  ExplainAIDecisionOutput,
} from '@/ai/flows/explainable-ai-dashboard';
import {
  multilingualChatAssistant,
  MultilingualChatAssistantInput,
  MultilingualChatAssistantOutput,
} from '@/ai/flows/multilingual-chat-assistant';
import {
  textToSpeech,
  TextToSpeechInput,
  TextToSpeechOutput,
} from '@/ai/flows/tts-flow';
import {
  speechToText,
  SpeechToTextInput,
  SpeechToTextOutput,
} from '@/ai/flows/stt-flow';

type FormState<T> = {
  success: boolean;
  message: string;
  data?: T;
};

// Document Verification Action
const docSchema = z.object({
  documentDataUri: z.string().min(1, 'Document image is required.'),
  documentType: z.enum(['Aadhaar', 'PAN']),
});
export async function handleDocumentVerification(
  prevState: FormState<DocumentUnderstandingOutput>,
  formData: FormData
): Promise<FormState<DocumentUnderstandingOutput>> {
  try {
    const validatedFields = docSchema.safeParse({
      documentDataUri: formData.get('documentDataUri'),
      documentType: formData.get('documentType'),
    });

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid input.' };
    }

    const result = await extractUserDetails(
      validatedFields.data as DocumentUnderstandingInput
    );
    return { success: true, message: 'Verification successful.', data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

// Face Verification Action
const faceSchema = z.object({
  selfieDataUri: z.string().min(1, 'Selfie image is required.'),
  licensePhotoDataUri: z.string().min(1, 'License photo is required.'),
});
export async function handleFaceVerification(
  prevState: FormState<FaceVerificationOutput>,
  formData: FormData
): Promise<FormState<FaceVerificationOutput>> {
  try {
    const validatedFields = faceSchema.safeParse({
      selfieDataUri: formData.get('selfieDataUri'),
      licensePhotoDataUri: formData.get('licensePhotoDataUri'),
    });

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid input.' };
    }

    const result = await verifyFace(validatedFields.data as FaceVerificationInput);
    return { success: true, message: 'Verification successful.', data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

// Risk Scoring Action
const riskSchema = z.object({
  biometrics: z.string().min(1, 'Biometrics data is required.'),
  documentVerification: z.string().min(1, 'Document verification data is required.'),
  customerBehavior: z.string().min(1, 'Customer behavior data is required.'),
});
export async function handleRiskScoring(
  prevState: FormState<RiskScoringOutput>,
  formData: FormData
): Promise<FormState<RiskScoringOutput>> {
  try {
    const validatedFields = riskSchema.safeParse({
      biometrics: formData.get('biometrics'),
      documentVerification: formData.get('documentVerification'),
      customerBehavior: formData.get('customerBehavior'),
    });

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid input.' };
    }

    const result = await riskScoring(validatedFields.data as RiskScoringInput);
    return { success: true, message: 'Scoring successful.', data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

// Explainable AI Action
const explainSchema = z.object({
  decisionType: z.string().min(1, 'Decision type is required.'),
  decisionDetails: z.string().min(1, 'Decision details are required.'),
  relevantData: z.string().min(1, 'Relevant data is required.'),
});
export async function handleExplainDecision(
  prevState: FormState<ExplainAIDecisionOutput>,
  formData: FormData
): Promise<FormState<ExplainAIDecisionOutput>> {
  try {
    const validatedFields = explainSchema.safeParse({
      decisionType: formData.get('decisionType'),
      decisionDetails: formData.get('decisionDetails'),
      relevantData: formData.get('relevantData'),
    });

    if (!validatedFields.success) {
      return { success: false, message: 'Invalid input.' };
    }

    const parsedDetails = JSON.parse(validatedFields.data.decisionDetails);

    const result = await explainAIDecision({
      ...validatedFields.data,
      decisionDetails: parsedDetails,
    } as ExplainAIDecisionInput);
    return { success: true, message: 'Explanation generated.', data: result };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unknown error occurred.',
    };
  }
}

// Chat Assistant Action
const chatSchema = z.object({
  userQuery: z.string().min(1, 'Query is required.'),
  language: z.string().min(1, 'Language is required.'),
});
export async function handleChat(
  input: MultilingualChatAssistantInput
): Promise<MultilingualChatAssistantOutput> {
  const validatedFields = chatSchema.safeParse(input);
  if (!validatedFields.success) {
    return { response: 'Invalid input. Please try again.' };
  }
  const result = await multilingualChatAssistant(validatedFields.data);
  return result;
}

// Text to Speech Action
export async function handleTextToSpeech(
  input: TextToSpeechInput
): Promise<TextToSpeechOutput> {
  const result = await textToSpeech(input);
  return result;
}

// Speech to Text Action
export async function handleSpeechToText(
  input: SpeechToTextInput
): Promise<SpeechToTextOutput> {
  const result = await speechToText(input);
  return result;
}
