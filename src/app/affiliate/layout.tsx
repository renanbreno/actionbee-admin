'use client';

import { Toaster } from '@/components/ui/sonner';
import { AffiliateAuthProvider } from '@/contexts/affiliate-auth/presentation/providers/affiliate-auth-provider';

export default function AffiliateLayout({ children }: { children: React.ReactNode }) {
  return (
    <AffiliateAuthProvider>
      {children}
      <Toaster richColors position="top-right" />
    </AffiliateAuthProvider>
  );
}
