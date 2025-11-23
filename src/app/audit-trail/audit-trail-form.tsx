'use client';

import { useActionState, useTransition } from 'react';
import { handleExplainDecision } from '@/app/actions';
import { useEffect, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';

const initialState = {
  success: false,
  message: '',
};

const defaultDecisionDetails = {
  RiskScore: JSON.stringify({ userId: 'USR-12345', finalScore: 'High' }, null, 2),
  FraudDetection: JSON.stringify({ transactionId: 'TXN-98765', flags: ['UnusualLocation', 'HighAmount'] }, null, 2),
};

export default function AuditTrailForm() {
  const [formState, formAction] = useActionState(handleExplainDecision, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [decisionType, setDecisionType] = useState('RiskScore');

  useEffect(() => {
    if (!formState.success && formState.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: formState.message,
      });
    }
  }, [formState, toast]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
        formAction(formData);
    });
  };
  
  const result = formState.success ? formState.data : null;

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="decisionType">Decision Type</Label>
          <Select name="decisionType" value={decisionType} onValueChange={setDecisionType} required>
            <SelectTrigger>
              <SelectValue placeholder="Select decision type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="RiskScore">Risk Score</SelectItem>
              <SelectItem value="FraudDetection">Fraud Detection</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="decisionDetails">Decision Details (JSON)</Label>
          <Textarea id="decisionDetails" name="decisionDetails" rows={5} className="font-code" defaultValue={defaultDecisionDetails[decisionType as keyof typeof defaultDecisionDetails]} required/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="relevantData">Relevant Data</Label>
          <Textarea id="relevantData" name="relevantData" rows={5} placeholder="Provide relevant data..." defaultValue="Biometrics: Low confidence. Document: Mismatch in address. Behavior: Multiple failed login attempts." required/>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Generate Explanation'}
        </Button>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>AI Decision Explanation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
                <Label>Confidence Score</Label>
                <div className="flex items-center gap-2">
                    <Progress value={(result.confidenceScore ?? 0) * 100} className="w-full" />
                    <span className="font-mono text-sm">{((result.confidenceScore ?? 0) * 100).toFixed(0)}%</span>
                </div>
            </div>
            <div>
              <Label>Explanation</Label>
              <CardDescription className="mt-1">{result.explanation}</CardDescription>
            </div>
            <div>
              <Label>Supporting Evidence</Label>
              <ul className="mt-1 list-disc list-inside text-sm text-muted-foreground space-y-1">
                {result.supportingEvidence?.map((evidence, index) => (
                  <li key={index}>{evidence}</li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
