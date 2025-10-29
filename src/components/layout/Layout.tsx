'use client';

import { ReactNode } from 'react';
import { useCart } from '@/lib/context/cart-context';
import AmazonHeader from '@/components/amazon/AmazonHeader';
import AmazonNavBar from '@/components/amazon/AmazonNavBar';
import AmazonFooter from '@/components/amazon/AmazonFooter';
import { CartDrawer } from '@/components/cart/CartDrawer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { state, toggleCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <AmazonHeader />
      <AmazonNavBar />
      <main className="flex-1">
        {children}
      </main>
      <AmazonFooter />
      <CartDrawer />
    </div>
  );
}