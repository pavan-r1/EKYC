import AppHeader from '@/components/app-header';
import ChatClient from './chat-client';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function SupportChatPage() {
  return (
    <>
      <AppHeader />
      <main className="flex-1 p-4 md:p-6 lg:p-8 flex flex-col">
        <div className="mx-auto w-full max-w-3xl flex-1 flex">
          <Card className="w-full flex flex-col">
            <CardHeader>
              <CardTitle>Multilingual Support</CardTitle>
              <CardDescription>
                Get help with the KYC process in your regional language.
              </CardDescription>
            </CardHeader>
            <ChatClient />
          </Card>
        </div>
      </main>
    </>
  );
}
