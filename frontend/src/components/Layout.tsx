import type { ReactNode } from "react";
import Navbar from "./Navbar";
import { Toaster } from "./ui/sonner";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div>
      <Navbar />
      {children}
      <Toaster />
    </div>
  );
}
