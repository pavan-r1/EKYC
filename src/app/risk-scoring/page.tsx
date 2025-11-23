import AppHeader from '@/components/app-header';
import RiskScoringForm from './risk-scoring-form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function RiskScoringPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8">
        <div className="mx-auto grid max-w-2xl gap-4">
          <Card>
            <CardHeader>
              <CardTitle>Risk Scoring Model</CardTitle>
              <CardDescription>
                Input user data to generate a risk score (Low, Medium, High) using the AI model.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RiskScoringForm />
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
