// frontend/components/Layout.tsx
import { ReactNode } from 'react';
import NavBar from './NavBar';

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <NavBar />
      <main className="flex-grow container mx-auto px-4 py-8">
        {children}
      </main>
      <footer className="bg-white border-t py-4">
        <div className="text-center text-sm text-gray-500">
          © 2025 CESI-Zen
        </div>
      </footer>
    </div>
  );
}
