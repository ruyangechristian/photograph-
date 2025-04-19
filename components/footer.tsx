import Link from "next/link"
import { Instagram, Youtube, Twitter, Facebook, Mail, Phone, MapPin } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto py-12 md:py-16 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {/* Logo and About */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="block mb-4">
              <h2 className="text-xl md:text-2xl font-light tracking-widest text-white">
                IREME<span className="font-medium">FOCUS</span>
              </h2>
            </Link>
            <p className="text-sm text-gray-300 text-center md:text-left max-w-xs">
              Professional photography services specializing in capturing your most precious moments.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-medium mb-4 md:mb-6 text-gray-300 uppercase tracking-wider">Quick Links</h3>
            <div className="grid grid-cols-2 gap-x-8 gap-y-3">
              <Link href="/" className="text-sm text-gray-300 hover:text-white">
                Home
              </Link>
              <Link href="/galleries" className="text-sm text-gray-300 hover:text-white">
                Galleries
              </Link>
              <Link href="/info" className="text-sm text-gray-300 hover:text-white">
                Info
              </Link>
              <Link href="/contact" className="text-sm text-gray-300 hover:text-white">
                Contact
              </Link>
            </div>
          </div>

          {/* Contact */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="text-sm font-medium mb-4 md:mb-6 text-gray-300 uppercase tracking-wider">Contact</h3>
            <div className="flex flex-col space-y-3">
              <a href="mailto:info@iremefocus.com" className="text-sm text-gray-300 hover:text-white flex items-center">
                <Mail size={16} className="mr-2" />
                info@iremefocus.com
              </a>
              <a href="tel:0788718396" className="text-sm text-gray-300 hover:text-white flex items-center">
                <Phone size={16} className="mr-2" />
                0788718396
              </a>
              <p className="text-sm text-gray-300 flex items-center">
                <span className="mr-2">@</span>
                ruyange_christian
              </p>
              <p className="text-sm text-gray-300 flex items-center">
                <MapPin size={16} className="mr-2" />
                Available worldwide
              </p>
              <div className="flex space-x-4 mt-4">
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <Instagram size={20} />
                  <span className="sr-only">Instagram</span>
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <Youtube size={20} />
                  <span className="sr-only">YouTube</span>
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <Twitter size={20} />
                  <span className="sr-only">Twitter</span>
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-300 hover:text-white"
                >
                  <Facebook size={20} />
                  <span className="sr-only">Facebook</span>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 md:mt-12 pt-6 md:pt-8 border-t border-gray-800 text-center">
          <p className="text-sm text-gray-400">© {new Date().getFullYear()} IREMEFOCUS. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
