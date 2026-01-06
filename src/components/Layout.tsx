import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="min-h-screen bg-background ghost-grid flex">
      <Sidebar />

      <main className="flex-1 md:ml-72 min-h-screen">
        {children}
      </main>
    </div>
  );
};
