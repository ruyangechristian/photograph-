"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Menu, X, Instagram, Youtube, Twitter, Facebook } from "lucide-react"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4 md:py-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="block">
              <h1
                className={`text-xl sm:text-2xl font-light tracking-widest ${isScrolled ? "text-black" : "text-white"}`}
              >
                IREME<span className="font-medium">FOCUS</span>
              </h1>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="/"
              className={`text-sm font-light hover:opacity-70 transition-opacity ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              HOME
            </Link>
            <Link
              href="/galleries"
              className={`text-sm font-light hover:opacity-70 transition-opacity ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              GALLERIES
            </Link>
            <Link
              href="/info"
              className={`text-sm font-light hover:opacity-70 transition-opacity ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              INFO
            </Link>
            <Link
              href="/contact"
              className={`text-sm font-light hover:opacity-70 transition-opacity ${
                isScrolled ? "text-black" : "text-white"
              }`}
            >
              CONTACT
            </Link>
          </nav>

          {/* Social Icons - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition-opacity ${isScrolled ? "text-black" : "text-white"}`}
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition-opacity ${isScrolled ? "text-black" : "text-white"}`}
            >
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition-opacity ${isScrolled ? "text-black" : "text-white"}`}
            >
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className={`hover:opacity-70 transition-opacity ${isScrolled ? "text-black" : "text-white"}`}
            >
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              type="button"
              className={`p-2 rounded-md ${isScrolled ? "text-black" : "text-white"}`}
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              aria-expanded={isMenuOpen}
              aria-label="Toggle navigation menu"
            >
              <span className="sr-only">Open menu</span>
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            <Link href="/" className="block px-3 py-2 text-base font-light" onClick={() => setIsMenuOpen(false)}>
              HOME
            </Link>
            <Link
              href="/galleries"
              className="block px-3 py-2 text-base font-light"
              onClick={() => setIsMenuOpen(false)}
            >
              GALLERIES
            </Link>
            <Link href="/info" className="block px-3 py-2 text-base font-light" onClick={() => setIsMenuOpen(false)}>
              INFO
            </Link>
            <Link href="/contact" className="block px-3 py-2 text-base font-light" onClick={() => setIsMenuOpen(false)}>
              CONTACT
            </Link>
          </div>
          <div className="flex justify-center space-x-6 py-4 border-t border-gray-200">
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Instagram size={20} />
              <span className="sr-only">Instagram</span>
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Youtube size={20} />
              <span className="sr-only">YouTube</span>
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Twitter size={20} />
              <span className="sr-only">Twitter</span>
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-600 hover:text-gray-900"
            >
              <Facebook size={20} />
              <span className="sr-only">Facebook</span>
            </a>
          </div>
        </div>
      )}
    </header>
  )
}
