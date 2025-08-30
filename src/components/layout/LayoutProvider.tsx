'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/lib/hooks/useSupabaseAuth';
import { CartProvider } from '@/lib/context/cart-context';
import Layout from './Layout';

interface LayoutProviderProps {
  children: ReactNode;
}

export default function LayoutProvider({ children }: LayoutProviderProps) {
  return (
    <AuthProvider>
      <CartProvider>
        <Layout>
          {children}
        </Layout>
      </CartProvider>
    </AuthProvider>
  );
}