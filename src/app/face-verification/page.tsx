import AppHeader from '@/components/app-header';
import FaceVerificationForm from './face-verification-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function FaceVerificationPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto grid max-w-4xl gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Face Verification</CardTitle>
              <CardDescription>
                Upload a selfie and a driver's license to verify a user's identity.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FaceVerificationForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
