import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import AppSidebar from '@/components/app-sidebar';
import { cn } from '@/lib/utils';
import { LanguageProvider } from './language-provider';

export const metadata: Metadata = {
  title: 'KYC Insights - AI-Powered Verification Platform',
  description: 'AI-Powered KYC Fraud Detection and Automation System',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Source+Code+Pro&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'font-body antialiased',
          'min-h-screen bg-background'
        )}
      >
        <LanguageProvider>
            <SidebarProvider>
            <div className="relative flex min-h-dvh">
                <AppSidebar />
                <div className="flex flex-1 flex-col group-data-[state=collapsed]/sidebar-wrapper:md:pl-[var(--sidebar-width-icon)] md:pl-[var(--sidebar-width)] transition-[padding] duration-300 ease-in-out">
                {children}
                </div>
            </div>
            </SidebarProvider>
        </LanguageProvider>
        <Toaster />
      </body>
    </html>
  );
}
