'use client';

import { FaSearch, FaBars, FaTimes } from 'react-icons/fa';
import Link from 'next/link';
import { SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

export default function Header() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const urlParams = new URLSearchParams(searchParams);
    const searchTermFromUrl = urlParams.get('searchTerm');
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const urlParams = new URLSearchParams(searchParams);
    urlParams.set('searchTerm', searchTerm);
    const searchQuery = urlParams.toString();
    router.push(`/search?${searchQuery}`);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen((prev) => !prev);
  };

  return (
    <header className='bg-slate-200 shadow-md'>
      <div className='flex justify-between items-center max-w-6xl mx-auto p-3'>
        {/* Logo */}
        <Link href='/'>
          <h1 className='font-bold text-sm sm:text-xl flex flex-wrap'>
            <span className='text-slate-500'>Feven</span>
            <span className='text-slate-700'>RealEstate</span>
          </h1>
        </Link>

        {/* Search Bar */}
        <form className='bg-slate-100 p-3 rounded-lg flex items-center' onSubmit={handleSubmit}>
          <input
            type='text'
            placeholder='Search...'
            className='bg-transparent focus:outline-none w-24 sm:w-64'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type='submit'>
            <FaSearch className='text-slate-600' />
          </button>
        </form>

        {/* Desktop Menu */}
        <ul className='hidden md:flex gap-4 items-center'>
          <Link href='/'>
            <li className='text-slate-700 hover:underline'>Home</li>
          </Link>
          <Link href='/about'>
            <li className='text-slate-700 hover:underline'>About</li>
          </Link>
          <SignedIn>
            <UserButton />
          </SignedIn>
          <SignedOut>
            <Link href='/sign-in'>
              <li className='text-slate-700 hover:underline'>Sign In</li>
            </Link>
          </SignedOut>
        </ul>

        {/* Hamburger Icon for Mobile */}
        <div className='md:hidden'>
          <button onClick={toggleMobileMenu}>
            {isMobileMenuOpen ? (
              <FaTimes className='text-2xl text-slate-700' />
            ) : (
              <FaBars className='text-2xl text-slate-700' />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className='md:hidden bg-slate-100 px-4 py-3'>
          <ul className='flex flex-col gap-3'>
            <Link href='/' onClick={() => setIsMobileMenuOpen(false)}>
              <li className='text-slate-700 hover:underline'>Home</li>
            </Link>
            <Link href='/about' onClick={() => setIsMobileMenuOpen(false)}>
              <li className='text-slate-700 hover:underline'>About</li>
            </Link>
            <SignedIn>
              <div onClick={() => setIsMobileMenuOpen(false)}>
                <UserButton />
              </div>
            </SignedIn>
            <SignedOut>
              <Link href='/sign-in' onClick={() => setIsMobileMenuOpen(false)}>
                <li className='text-slate-700 hover:underline'>Sign In</li>
              </Link>
            </SignedOut>
          </ul>
        </div>
      )}
    </header>
  );
}