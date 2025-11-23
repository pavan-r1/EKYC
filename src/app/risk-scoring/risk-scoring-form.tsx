'use client';

import { useActionState, useTransition } from 'react';
import { handleRiskScoring } from '@/app/actions';
import { useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

const initialState = {
  success: false,
  message: '',
};

const riskVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    low: 'default',
    medium: 'secondary',
    high: 'destructive',
};

const riskColorMap: { [key: string]: string } = {
    low: 'bg-green-500',
    medium: 'bg-yellow-500',
    high: 'bg-red-500',
};


export default function RiskScoringForm() {
  const [formState, formAction] = useActionState(handleRiskScoring, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();

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
          <Label htmlFor="biometrics">Biometrics Data</Label>
          <Textarea id="biometrics" name="biometrics" rows={3} placeholder="e.g., Face match confidence: 98%, Liveness check: Passed" defaultValue="Face match confidence: 98%, Liveness check: Passed" required/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="documentVerification">Document Verification</Label>
          <Textarea id="documentVerification" name="documentVerification" rows={3} placeholder="e.g., Aadhaar verified, Name: John Doe, DOB: 1990-01-01" defaultValue="Aadhaar verified, Name: John Doe, DOB: 1990-01-01" required/>
        </div>
        <div className="space-y-2">
          <Label htmlFor="customerBehavior">Customer Behavior</Label>
          <Textarea id="customerBehavior" name="customerBehavior" rows={3} placeholder="e.g., Multiple login attempts from different IPs, large initial deposit" defaultValue="New account, single IP, standard login pattern, initial deposit of $500" required/>
        </div>
        <Button type="submit" disabled={isPending} className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Calculate Risk Score'}
        </Button>
      </form>

      {result && result.riskScore && (
        <Card>
          <CardHeader>
            <CardTitle>Risk Score Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Risk Score:</span>
                <Badge variant={riskVariantMap[result.riskScore]} className={cn('text-lg', riskColorMap[result.riskScore])}>
                    {result.riskScore.toUpperCase()}
                </Badge>
            </div>
            <div>
              <Label>Explanation</Label>
              <CardDescription className="mt-1">{result.explanation}</CardDescription>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
