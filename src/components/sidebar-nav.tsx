'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  FileText,
  UserCheck,
  ShieldAlert,
  BookCheck,
  MessageSquare,
} from 'lucide-react';
import { useLanguage } from '@/app/language-provider';

const links = [
  { href: '/dashboard', labelKey: 'dashboard', icon: LayoutDashboard },
  { href: '/document-verification', labelKey: 'documentVerification', icon: FileText },
  { href: '/face-verification', labelKey: 'faceVerification', icon: UserCheck },
  { href: '/risk-scoring', labelKey: 'riskScoring', icon: ShieldAlert },
  { href: '/audit-trail', labelKey: 'auditTrail', icon: BookCheck },
  { href: '/support-chat', labelKey: 'supportChat', icon: MessageSquare },
];

export default function SidebarNav() {
  const pathname = usePathname();
  const { t } = useLanguage();

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <SidebarMenu>
      {links.map(link => (
        <SidebarMenuItem key={link.href}>
          <SidebarMenuButton asChild isActive={isActive(link.href)} tooltip={{ children: t(`sidebar.${link.labelKey}`) }}>
            <Link href={link.href}>
              <link.icon className="h-5 w-5" />
              <span className="group-data-[collapsible=icon]:hidden">{t(`sidebar.${link.labelKey}`)}</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      ))}
    </SidebarMenu>
  );
}
