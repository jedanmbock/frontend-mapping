'use client';

import React from 'react';
import { ThemeProvider } from '@/context/ThemeContext';
import { AuthProvider } from '@/context/AuthContext';
import { NextIntlClientProvider, AbstractIntlMessages } from 'next-intl';

interface ProvidersProps {
  children: React.ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
}

export default function Providers({ children, locale, messages }: ProvidersProps) {
  return (
    // Le Provider de traduction doit envelopper les autres
    <NextIntlClientProvider locale={locale} messages={messages} timeZone="Africa/Douala">
      <ThemeProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </ThemeProvider>
    </NextIntlClientProvider>
  );
}
