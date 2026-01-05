import { ReactNode } from 'react';
import { Sidebar } from './Sidebar';

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background ghost-grid">
      <Sidebar />
      <main className="md:ml-64 min-h-screen">
        {children}
      </main>
    </div>
  );
};
