import AppHeader from '@/components/app-header';
import DocumentVerificationForm from './document-verification-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocumentVerificationPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto grid max-w-2xl gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Document Verification</CardTitle>
              <CardDescription>
                Upload an Aadhaar or PAN card to extract user details using AI.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DocumentVerificationForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
