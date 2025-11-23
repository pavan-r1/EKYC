'use client';

import { useActionState, useEffect, useRef, useState, useTransition } from 'react';
import { handleFaceVerification } from '@/app/actions';
import Image from 'next/image';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2, Camera, CheckCircle2, XCircle, RefreshCcw } from 'lucide-react';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';

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

const licensePlaceholder = PlaceHolderImages.find(img => img.id === 'license-example');

export default function FaceVerificationForm() {
  const [formState, formAction] = useActionState(handleFaceVerification, initialState);
  const { toast } = useToast();
  const [isPending, startTransition] = useTransition();

  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [selfieDataUri, setSelfieDataUri] = useState<string | null>(null);
  const [licenseDataUri, setLicenseDataUri] = useState<string | null>(null);
  const [licensePreview, setLicensePreview] = useState<string | null>(licensePlaceholder?.imageUrl || null);
  const formRef = useRef<HTMLFormElement>(null);

  const [hasCameraPermission, setHasCameraPermission] = useState<boolean | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const getCameraPermission = async () => {
      if(hasCameraPermission === null){
          try {
            const stream = await navigator.mediaDevices.getUserMedia({ video: true });
            if (videoRef.current) {
              videoRef.current.srcObject = stream;
            }
            setHasCameraPermission(true);
          } catch (error) {
            console.error('Error accessing camera:', error);
            setHasCameraPermission(false);
            toast({
              variant: 'destructive',
              title: 'Camera Access Denied',
              description: 'Please enable camera permissions in your browser settings.',
            });
          }
      }
    };
    getCameraPermission();
  }, [hasCameraPermission, toast]);

  useEffect(() => {
    if (formState.success === false && formState.message) {
      toast({
        variant: 'destructive',
        title: 'Error',
        description: formState.message,
      });
    }
  }, [formState, toast]);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLicenseFile(file);
      setLicensePreview(URL.createObjectURL(file));
      const dataUri = await readFileAsDataURI(file);
      setLicenseDataUri(dataUri);
    }
  };

  const handleCaptureSelfie = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const context = canvas.getContext('2d');
      context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);
      const dataUri = canvas.toDataURL('image/jpeg');
      setSelfieDataUri(dataUri);
    }
  };

  const handleRetakeSelfie = () => {
    setSelfieDataUri(null);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => {
        formAction(formData);
    });
  }

  const result = formState.success ? formState.data : null;

  return (
    <div className="space-y-6">
      <form ref={formRef} action={formAction} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="selfie">Live Selfie</Label>
            <div className="relative aspect-square w-full rounded-lg border bg-muted overflow-hidden">
              {selfieDataUri ? (
                <Image src={selfieDataUri} alt="Captured selfie" layout="fill" className="object-cover" />
              ) : (
                <video ref={videoRef} className="w-full h-full object-cover" autoPlay muted playsInline />
              )}
            </div>
            {!selfieDataUri ? (
              <Button type="button" onClick={handleCaptureSelfie} disabled={!hasCameraPermission} className="w-full">
                <Camera className="mr-2 h-4 w-4" />
                Capture Selfie
              </Button>
            ) : (
              <Button type="button" onClick={handleRetakeSelfie} variant="outline" className="w-full">
                <RefreshCcw className="mr-2 h-4 w-4" />
                Retake Selfie
              </Button>
            )}
            {hasCameraPermission === false && (
                <Alert variant="destructive">
                    <AlertTitle>Camera Access Required</AlertTitle>
                    <AlertDescription>
                        Please allow camera access to use this feature.
                    </AlertDescription>
                </Alert>
            )}
            <canvas ref={canvasRef} className="hidden" />
          </div>
          <div className="space-y-2">
            <Label htmlFor="license">Driver's License Photo</Label>
            <Image
              src={licensePreview || '/placeholder.svg'}
              alt="License preview"
              width={400}
              height={400}
              className="aspect-square w-full rounded-lg border object-cover"
              data-ai-hint={licensePlaceholder?.imageHint}
            />
            <Input id="license" name="license" type="file" accept="image/*" onChange={handleFileChange} required/>
          </div>
        </div>

        {selfieDataUri && <input type="hidden" name="selfieDataUri" value={selfieDataUri} />}
        {licenseDataUri && <input type="hidden" name="licensePhotoDataUri" value={licenseDataUri} />}

        <Button type="submit" disabled={isPending || !selfieDataUri || !licenseFile} className="w-full">
          {isPending ? <Loader2 className="animate-spin" /> : 'Verify Identity'}
        </Button>
      </form>

      {result && (
        <Card>
          <CardHeader>
            <CardTitle>Verification Result</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center space-y-4 text-center">
            {result.isMatch ? (
              <CheckCircle2 className="h-16 w-16 text-green-500" />
            ) : (
              <XCircle className="h-16 w-16 text-destructive" />
            )}
            <Badge variant={result.isMatch ? 'default' : 'destructive'} className={cn('text-lg', result.isMatch && 'bg-green-500')}>
              {result.isMatch ? 'Match Found' : 'No Match'}
            </Badge>
            <p className="text-muted-foreground">Confidence: {((result.confidence ?? 0) * 100).toFixed(2)}%</p>
            {result.reason && <p className="text-sm">Reason: {result.reason}</p>}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
