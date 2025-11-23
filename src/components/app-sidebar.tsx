import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import SidebarNav from './sidebar-nav';
import Image from 'next/image';
import { Separator } from './ui/separator';

export default function AppSidebar() {
  return (
    <Sidebar className="border-r" collapsible="icon">
      <SidebarHeader className="p-3">
        <div className="flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center">
            <Image
              src="/kyc-logo.svg"
              alt="KYC Logo"
              width={40}
              height={40}
              priority
            />
          </div>
          <div className="group-data-[collapsible=icon]:hidden">
            <h2 className="text-lg font-semibold tracking-tight font-headline">
              KYC Insights
            </h2>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent className="p-2">
        <SidebarNav />
      </SidebarContent>
      <SidebarFooter className="p-2">
        {/* Placeholder for footer content */}
      </SidebarFooter>
    </Sidebar>
  );
}
