import AppHeader from '@/components/app-header';
import AuditTrailForm from './audit-trail-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditTrailPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto grid max-w-2xl gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Explainable AI Dashboard</CardTitle>
              <CardDescription>
                Generate a human-readable explanation for a specific AI decision for auditing purposes.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AuditTrailForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
