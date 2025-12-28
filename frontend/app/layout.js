'use client';

import '../styles/globals.css';
import { useState, useEffect } from 'react';

export default function RootLayout({ children }) {
  const [theme, setTheme] = useState('light');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  // Prevent hydration mismatch by not rendering theme-dependent content until mounted
  if (!mounted) {
    return (
      <html lang="en">
        <head>
          <title>Inventory Management System</title>
          <meta name="description" content="AEC Materials Inventory Visibility System" />
        </head>
        <body>
          <div className="theme-wrapper">{children}</div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en" className={theme}>
      <head>
        <title>Inventory Management System</title>
        <meta name="description" content="AEC Materials Inventory Visibility System" />
      </head>
      <body>
        <div className="theme-wrapper">{children}</div>
      </body>
    </html>
  );
}
