'use client';

import { useActionState, useTransition } from 'react';
import { handleDocumentVerification } from '@/app/actions';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Loader2, UploadCloud, CheckCircle2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const initialState = {
  success: false,
  message: '',
};

const readFileAsDataURI = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

export default function DocumentVerificationForm() {
  const [formState, formAction] = useActionState(handleDocumentVerification, initialState);
  const [isPending, startTransition] = useTransition();
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [documentType, setDocumentType] = useState('Aadhaar');
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (!formState.success && formState.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: formState.message,
      });
    }
  }, [formState, toast]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Please select a file to upload.',
      });
      return;
    }

    const dataUri = await readFileAsDataURI(file);
    const formData = new FormData(formRef.current!);
    formData.set('documentDataUri', dataUri);
    startTransition(() => {
        formAction(formData);
    });
  };
  
  const result = formState.success ? formState.data : null;

  return (
    <div className="space-y-6">
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="documentType">Document Type</Label>
          <Select name="documentType" value={documentType} onValueChange={setDocumentType} required>
            <SelectTrigger>
              <SelectValue placeholder="Select document type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Aadhaar">Aadhaar</SelectItem>
              <SelectItem value="PAN">PAN</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="document">Upload Document</Label>
          <div className="relative">
            <Input id="document" name="document" type="file" onChange={handleFileChange} className="pr-16" required/>
            <div className="absolute inset-y-0 right-0 flex py-1.5 pr-1.5">
                <div className="flex items-center rounded-md px-3 text-xs text-muted-foreground pointer-events-none">
                    {file ? <CheckCircle2 className="text-green-500" /> : <UploadCloud />}
                </div>
            </div>
          </div>
          {file && <p className="text-sm text-muted-foreground">Selected: {file.name}</p>}
        </div>

        <Button type="submit" disabled={isPending || !file} className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Verify Document'}
        </Button>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label>Confidence Score</Label>
              <div className="flex items-center gap-2">
                <Progress value={(result.confidenceScore ?? 0) * 100} className="w-full" />
                <span className="font-mono text-sm">{((result.confidenceScore ?? 0) * 100).toFixed(0)}%</span>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Extracted Details</Label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 rounded-md border p-4 text-sm">
                {Object.entries(result.userDetails ?? {}).map(([key, value]) => (
                  <div key={key} className="flex">
                    <span className="font-semibold capitalize w-24 shrink-0">{key.replace(/_/g, ' ')}:</span>
                    <span className="text-muted-foreground truncate">{String(value)}</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
