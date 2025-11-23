'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import AppHeader from '@/components/app-header';
import { Activity, ShieldCheck, Clock, Users } from 'lucide-react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useLanguage } from '../language-provider';

const chartData = [
  { name: 'Jan', verifications: 4000, fraud: 24 },
  { name: 'Feb', verifications: 3000, fraud: 13 },
  { name: 'Mar', verifications: 2000, fraud: 98 },
  { name: 'Apr', verifications: 2780, fraud: 39 },
  { name: 'May', verifications: 1890, fraud: 48 },
  { name: 'Jun', verifications: 2390, fraud: 38 },
  { name: 'Jul', verifications: 3490, fraud: 43 },
];

const recentActivities = [
    { id: '1', user: 'John Doe', status: 'Approved', risk: 'Low', date: '2024-07-23' },
    { id: '2', user: 'Jane Smith', status: 'Rejected', risk: 'High', date: '2024-07-23' },
    { id: '3', user: 'Sam Wilson', status: 'Pending', risk: 'Medium', date: '2024-07-22' },
    { id: '4', user: 'Peter Parker', status: 'Approved', risk: 'Low', date: '2024-07-22' },
    { id: '5', user: 'Bruce Wayne', status: 'Approved', risk: 'Low', date: '2024-07-21' },
];

const riskVariantMap: { [key: string]: 'default' | 'secondary' | 'destructive' } = {
    Low: 'default',
    Medium: 'secondary',
    High: 'destructive',
};

export default function DashboardPage() {
  const { t } = useLanguage();
  return (
    <>
      <AppHeader />
      <main className="flex-1 space-y-4 p-4 md:p-6 lg:p-8">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.totalVerifications')}
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,543</div>
              <p className="text-xs text-muted-foreground">
                +20.1% {t('dashboard.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.highRiskAlerts')}
              </CardTitle>
              <ShieldCheck className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">231</div>
              <p className="text-xs text-muted-foreground">
                +180.1% {t('dashboard.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.avgProcessingTime')}
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">~2 min</div>
              <p className="text-xs text-muted-foreground">
                -15% {t('dashboard.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {t('dashboard.automationRate')}
              </CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">92.5%</div>
              <p className="text-xs text-muted-foreground">
                +5% {t('dashboard.fromLastMonth')}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-7">
          <Card className="lg:col-span-4">
            <CardHeader>
              <CardTitle>{t('dashboard.verificationTrends')}</CardTitle>
              <CardDescription>{t('dashboard.last7Months')}</CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'hsl(var(--background))',
                      borderColor: 'hsl(var(--border))',
                    }}
                  />
                  <Legend iconSize={10} />
                  <Bar dataKey="verifications" fill="hsl(var(--primary))" name={t('dashboard.verifications')} radius={[4, 4, 0, 0]} />
                  <Bar dataKey="fraud" fill="hsl(var(--destructive))" name={t('dashboard.fraudAlerts')} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          <Card className="lg:col-span-3">
            <CardHeader>
              <CardTitle>{t('dashboard.recentActivities')}</CardTitle>
              <CardDescription>
                {t('dashboard.recentActivitiesDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t('dashboard.user')}</TableHead>
                    <TableHead>{t('dashboard.status')}</TableHead>
                    <TableHead>{t('dashboard.risk')}</TableHead>
                    <TableHead>{t('dashboard.date')}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {recentActivities.map(activity => (
                    <TableRow key={activity.id}>
                      <TableCell className="font-medium">{activity.user}</TableCell>
                      <TableCell>{activity.status}</TableCell>
                      <TableCell>
                        <Badge variant={riskVariantMap[activity.risk]}>{activity.risk}</Badge>
                      </TableCell>
                      <TableCell>{activity.date}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </main>
    </>
  );
}
