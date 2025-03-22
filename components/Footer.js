
import Link from 'next/link';
import { BookOpen, Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-white border-t border-neutral-200">
      <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 md:flex md:items-center md:justify-between">
        <div className="flex justify-center md:justify-start">
          <Link href="/" className="flex items-center">
            <BookOpen className="h-6 w-6 text-primary-600 mr-2" />
            <span className="text-xl font-bold text-neutral-900">TaleWeaver</span>
          </Link>
        </div>
        
        <div className="mt-8 md:mt-0">
          <ul className="flex justify-center md:justify-end space-x-6">
            <li>
              <Link href="/about" className="text-neutral-600 hover:text-neutral-900">
                About
              </Link>
            </li>
            <li>
              <Link href="/privacy" className="text-neutral-600 hover:text-neutral-900">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="/terms" className="text-neutral-600 hover:text-neutral-900">
                Terms
              </Link>
            </li>
            <li>
              <Link href="/contact" className="text-neutral-600 hover:text-neutral-900">
                Contact
              </Link>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto pb-8 px-4 sm:px-6 md:flex md:items-center md:justify-between">
        <div className="mt-8 md:mt-0 text-center md:text-left text-sm text-neutral-500">
          &copy; {currentYear} TaleWeaver. All rights reserved.
        </div>
        
        <div className="mt-8 md:mt-0 flex justify-center md:justify-end space-x-6">
          <a href="#" className="text-neutral-400 hover:text-neutral-600">
            <span className="sr-only">GitHub</span>
            <Github className="h-6 w-6" />
          </a>
          <a href="#" className="text-neutral-400 hover:text-neutral-600">
            <span className="sr-only">Twitter</span>
            <Twitter className="h-6 w-6" />
          </a>
          <a href="#" className="text-neutral-400 hover:text-neutral-600">
            <span className="sr-only">Instagram</span>
            <Instagram className="h-6 w-6" />
          </a>
        </div>
      </div>
    </footer>
  );
}
