'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';

export default function Navigation() {
  const [theme, setTheme] = useState('light');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  const isActive = (path) => pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-gray-900 dark:bg-gray-950 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="font-bold text-lg sm:text-xl hover:text-blue-400 transition-colors flex-shrink-0">
            📦 <span className="hidden sm:inline">Inventory System</span><span className="sm:hidden">Inventory</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            <Link 
              href="/" 
              className={`hover:text-blue-400 transition-colors ${
                isActive('/') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/inventory" 
              className={`hover:text-blue-400 transition-colors ${
                isActive('/inventory') || pathname?.startsWith('/inventory') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Inventory
            </Link>
            <Link 
              href="/stock-movement" 
              className={`hover:text-blue-400 transition-colors ${
                isActive('/stock-movement') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Stock Movement
            </Link>
            <Link 
              href="/insights" 
              className={`hover:text-blue-400 transition-colors ${
                isActive('/insights') ? 'text-blue-400 font-semibold' : ''
              }`}
            >
              Insights
            </Link>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? '🌙' : '☀️'}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg bg-gray-800 dark:bg-gray-900 hover:bg-gray-700 dark:hover:bg-gray-800 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 space-y-2">
            <Link 
              href="/" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive('/') ? 'bg-gray-800 text-blue-400 font-semibold' : ''
              }`}
            >
              Dashboard
            </Link>
            <Link 
              href="/inventory" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive('/inventory') || pathname?.startsWith('/inventory') ? 'bg-gray-800 text-blue-400 font-semibold' : ''
              }`}
            >
              Inventory
            </Link>
            <Link 
              href="/stock-movement" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive('/stock-movement') ? 'bg-gray-800 text-blue-400 font-semibold' : ''
              }`}
            >
              Stock Movement
            </Link>
            <Link 
              href="/insights" 
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg hover:bg-gray-800 transition-colors ${
                isActive('/insights') ? 'bg-gray-800 text-blue-400 font-semibold' : ''
              }`}
            >
              Insights
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
}
