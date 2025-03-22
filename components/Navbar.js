
"use client";

import { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { Menu, X, BookOpen, User, LogOut } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  const handleSignOut = async () => {
    await signOut({ redirect: true, callbackUrl: '/' });
  };

  const isActive = (path) => {
    return pathname === path;
  };

  return (
    <header className="bg-white border-b border-neutral-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center" onClick={closeMenu}>
            <span className="text-2xl font-bold text-primary-600">
              <BookOpen className="h-6 w-6 inline-block mr-2" />
              TaleWeaver
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className={`text-sm font-medium ${isActive('/') ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Home
            </Link>
            <Link 
              href="/create" 
              className={`text-sm font-medium ${isActive('/create') ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Create
            </Link>
            <Link 
              href="/explore" 
              className={`text-sm font-medium ${isActive('/explore') ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
            >
              Explore
            </Link>
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`text-sm font-medium ${isActive('/dashboard') ? 'text-primary-600' : 'text-neutral-600 hover:text-neutral-900'}`}
                >
                  Dashboard
                </Link>
                <button 
                  onClick={handleSignOut}
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="text-sm font-medium text-neutral-600 hover:text-neutral-900"
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="btn btn-primary py-2"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 rounded-md text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
            >
              <span className="sr-only">{isMenuOpen ? 'Close menu' : 'Open menu'}</span>
              {isMenuOpen ? (
                <X className="h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-neutral-200">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link 
              href="/" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/') ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={closeMenu}
            >
              Home
            </Link>
            <Link 
              href="/create" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/create') ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={closeMenu}
            >
              Create
            </Link>
            <Link 
              href="/explore" 
              className={`block px-3 py-2 rounded-md text-base font-medium ${
                isActive('/explore') ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
              }`}
              onClick={closeMenu}
            >
              Explore
            </Link>
            {session ? (
              <>
                <Link 
                  href="/dashboard" 
                  className={`block px-3 py-2 rounded-md text-base font-medium ${
                    isActive('/dashboard') ? 'bg-primary-50 text-primary-600' : 'text-neutral-600 hover:bg-neutral-50'
                  }`}
                  onClick={closeMenu}
                >
                  <User className="h-5 w-5 inline-block mr-2" />
                  Dashboard
                </Link>
                <button 
                  onClick={() => {
                    handleSignOut();
                    closeMenu();
                  }}
                  className="block w-full text-left px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-50"
                >
                  <LogOut className="h-5 w-5 inline-block mr-2" />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <Link 
                  href="/signin" 
                  className="block px-3 py-2 rounded-md text-base font-medium text-neutral-600 hover:bg-neutral-50"
                  onClick={closeMenu}
                >
                  Sign In
                </Link>
                <Link 
                  href="/signup" 
                  className="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
                  onClick={closeMenu}
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
