"use client";

import { QuoteProvider } from './QuoteContext';
import { AuthProvider } from './AuthContext';
import ToastContainer from './ToastContainer';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AuthProvider>
      <QuoteProvider>
        {children}
        <ToastContainer />
      </QuoteProvider>
    </AuthProvider>
  );
}
