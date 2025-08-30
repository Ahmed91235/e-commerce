'use client';

import { ReactNode } from 'react';
import { useCart } from '@/lib/context/cart-context';
import Header from './Header';
import Footer from './Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { state, toggleCart } = useCart();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Header cartItemCount={state.itemCount} onCartClick={toggleCart} />
      <main className="flex-1">
        {children}
      </main>
      <Footer />
      <CartDrawer />
    </div>
  );
}