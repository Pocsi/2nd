import { Link, useLocation } from "wouter";
import { useState } from "react";
import { useCart } from "@/contexts/cart-context";

export default function Header() {
  const [location] = useLocation();
  const { cartItems } = useCart();
  const itemCount = cartItems.length;

  return (
    <header className="sticky top-0 z-40 bg-white shadow-sm py-4">
      <div className="container mx-auto px-4 md:px-6 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/">
            <a className="text-2xl font-bold">2ND</a>
          </Link>
          <span className="hidden md:block text-sm italic">"A place to land & revalue cornered stuff"</span>
        </div>
        
        <nav className="hidden md:flex items-center space-x-6">
          <Link href="/">
            <a className={`nav-link font-medium hover:text-accent transition-colors ${location === '/' ? 'text-accent' : ''}`}>
              Browse
            </a>
          </Link>
          <Link href="/sell">
            <a className={`nav-link font-medium hover:text-accent transition-colors ${location === '/sell' ? 'text-accent' : ''}`}>
              Sell
            </a>
          </Link>
          <Link href="/#how-it-works">
            <a className="nav-link font-medium hover:text-accent transition-colors">
              How It Works
            </a>
          </Link>
          <a href="#" className="nav-link font-medium hover:text-accent transition-colors">
            About
          </a>
        </nav>
        
        <div className="flex items-center space-x-4">
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>
          
          <Link href="/cart">
            <a className="p-2 rounded-full hover:bg-secondary transition-colors relative">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-accent text-primary text-xs rounded-full h-5 w-5 flex items-center justify-center font-semibold">
                  {itemCount}
                </span>
              )}
            </a>
          </Link>
          
          <button className="p-2 rounded-full hover:bg-secondary transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </button>
          
          <button className="hidden md:block bg-primary text-white px-4 py-2 rounded-md hover:bg-opacity-90 transition-colors">
            Login
          </button>
        </div>
      </div>
      
      {/* Mobile slogan */}
      <div className="md:hidden p-4 bg-secondary">
        <span className="text-sm italic">"A place to land & revalue cornered stuff"</span>
      </div>
    </header>
  );
}
