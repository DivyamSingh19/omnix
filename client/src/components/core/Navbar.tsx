"use client";
import React, { useState, useEffect } from "react";
import { InteractiveHoverButton } from "../magicui/interactive-hover-button";
import Image from "next/image";

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeItem, setActiveItem] = useState("PROTOCOL");
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleYTClick = () => {};
  
  const navItems = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Features", href: "#features" },
    { name: "About us", href: "#about" },
     
  ];

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const handleNavItemClick = (itemName: React.SetStateAction<string>) => {
    setActiveItem(itemName);
    setIsMobileMenuOpen(false); 
  };

  return (
    <div className="fixed top-0 left-0 w-full z-50 px-1 py-4">
      <nav
        className={`
        relative mx-auto max-w-7xl rounded-2xl transition-all duration-500 ease-out
        ${
          isScrolled
            ? "bg-transparent shadow-2xl shadow-cyan-500/5"
            : "bg-transparent backdrop-blur-lg"
        }
      `}
      >
        {/* Animated gradient border */}
        <div className="absolute inset-0 rounded-2xl bg-transparent opacity-0 hover:opacity-100 transition-opacity duration-700"></div>

        <div className="relative flex items-center justify-between px-8 py-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 group cursor-pointer px-(-10)">
            <div className="relative">
              <div className="w-8 h-8 b rounded-lg flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
                <Image
                  src="/logo.svg"
                  alt="Omnix Logo"
                  width={24}
                  height={24}
                  className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8"
                />
              </div>
              <div className="absolute inset-0 bg-cyan-400 rounded-lg blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent tracking-tight">
              OMNIX
            </span>
          </div>

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-2 border border-slate-800/30 pt-2 pb-2 px-2 py-2 rounded-2xl slate-900/60 backdrop-blur-xl bg-slate-900/20">
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleNavItemClick(item.name)}
                className={`
                  relative px-6 py-3 text-sm font-medium tracking-wide transition-all duration-300 rounded-xl 
                  ${
                    activeItem === item.name
                      ? "text-cyan-300 bg-slate-800/50"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }
                `}
                style={{ animationDelay: `${index * 100}ms` }}
              >
                {item.name}
                {activeItem === item.name && (
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-cyan-400 rounded-full animate-pulse"></div>
                )}
              </a>
            ))}
          </div>

          {/* Desktop Social Icons */}
          <div className="hidden md:flex items-center space-x-4">
            <InteractiveHoverButton onClick={handleYTClick} className="bg-slate-900/20">
              Jesse the goat
            </InteractiveHoverButton>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={toggleMobileMenu}
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors duration-300 relative z-10"
          >
            <svg
              className={`w-6 h-6 transition-transform duration-300 ${isMobileMenuOpen ? 'rotate-90' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          md:hidden absolute top-full left-0 right-0 mt-2 mx-6 rounded-2xl 
          bg-slate-900/20 backdrop-blur-xl border border-slate-800/30 
          transition-all duration-300 ease-out origin-top
          ${isMobileMenuOpen 
            ? 'opacity-100 scale-y-100 translate-y-0' 
            : 'opacity-0 scale-y-95 -translate-y-2 pointer-events-none'
          }
        `}>
          <div className="p-6 space-y-4">
            {/* Mobile Navigation Links */}
            {navItems.map((item, index) => (
              <a
                key={item.name}
                href={item.href}
                onClick={() => handleNavItemClick(item.name)}
                className={`
                  block px-4 py-3 text-base font-medium tracking-wide transition-all duration-300 rounded-xl
                  transform hover:scale-105
                  ${
                    activeItem === item.name
                      ? "text-cyan-300 bg-slate-800/50"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/30"
                  }
                `}
                style={{ 
                  animationDelay: `${index * 100}ms`,
                  transform: isMobileMenuOpen ? 'translateX(0)' : 'translateX(-20px)',
                  transition: `all 0.3s ease-out ${index * 50}ms`
                }}
              >
                <div className="flex items-center justify-between">
                  {item.name}
                  {activeItem === item.name && (
                    <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
                  )}
                </div>
              </a>
            ))}
            
            {/* Mobile Social Button */}
            <div className="pt-4 border-t border-slate-800/30">
              <InteractiveHoverButton 
                onClick={handleYTClick} 
                className="w-full bg-slate-900/20 justify-center"
              >
                Jesse the goat
              </InteractiveHoverButton>
            </div>
          </div>
        </div>

        {/* Floating particles effect */}
        <div className="absolute inset-0 overflow-hidden rounded-2xl pointer-events-none">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-cyan-400 rounded-full opacity-20 animate-ping"
              style={{
                left: `${20 + i * 30}%`,
                top: `${30 + i * 20}%`,
                animationDelay: `${i * 2}s`,
                animationDuration: "4s",
              }}
            ></div>
          ))}
        </div>
      </nav>
    </div>
  );
}