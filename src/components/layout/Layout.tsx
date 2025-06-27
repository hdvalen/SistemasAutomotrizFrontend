import React from 'react';
import { Sidebar } from './Sidebar';
import { Header } from './Header';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="flex h-screen bg-zinc-900 text-zinc-100">
  <Sidebar />
  <div className="flex-1 flex flex-col overflow-hidden bg-zinc-900">
    <Header />
    <main className="flex-1 overflow-y-auto p-6 bg-zinc-900">
      {children}
    </main>
  </div>
</div>

  );
}