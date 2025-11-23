import { config } from 'dotenv';
config();

import '@/ai/flows/risk-scoring.ts';
import '@/ai/flows/explainable-ai-dashboard.ts';
import '@/ai/flows/document-understanding.ts';
import '@/ai/flows/face-verification.ts';
import '@/ai/flows/multilingual-chat-assistant.ts';
import '@/ai/flows/tts-flow.ts';
import '@/ai/flows/stt-flow.ts';
