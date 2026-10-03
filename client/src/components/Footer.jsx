import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShieldCheck, Lock, FileText, Mail, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-[#090a10] border-t border-white/10 text-gray-400 text-sm mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center">
                <Heart className="w-4 h-4 text-white fill-white" />
              </div>
              <span className="text-xl font-extrabold text-white flex items-center gap-1.5">
                Koi Mil Gaya <span className="text-xs px-1.5 py-0.5 rounded bg-rose-500 text-white font-bold">KMG</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed">
              Worldwide curated physical & virtual dating platform. Connect with vetted, attractive profiles across USA, UK, UAE, Pakistan, Canada, and around the globe.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Navigation</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/" className="hover:text-rose-400 transition-colors">Home Landing</Link>
              </li>
              <li>
                <Link to="/discover" className="hover:text-rose-400 transition-colors">Explore All Profiles</Link>
              </li>
              <li>
                <Link to="/signup" className="hover:text-rose-400 transition-colors">Create Account</Link>
              </li>
              <li>
                <Link to="/login" className="hover:text-rose-400 transition-colors">Member Login</Link>
              </li>
            </ul>
          </div>

          {/* Safety & Legal */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Safety & Terms</h3>
            <ul className="space-y-2.5 text-xs">
              <li>
                <Link to="/safety" className="flex items-center space-x-1.5 hover:text-rose-400 transition-colors">
                  <ShieldCheck className="w-3.5 h-3.5 text-rose-400" />
                  <span>Dating Safety Tips</span>
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="flex items-center space-x-1.5 hover:text-rose-400 transition-colors">
                  <Lock className="w-3.5 h-3.5 text-purple-400" />
                  <span>Privacy Policy</span>
                </Link>
              </li>
              <li>
                <Link to="/terms" className="flex items-center space-x-1.5 hover:text-rose-400 transition-colors">
                  <FileText className="w-3.5 h-3.5 text-blue-400" />
                  <span>Terms & Conditions</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-white font-semibold text-sm mb-4 tracking-wider uppercase">Global Concierge Support</h3>
            <div className="space-y-2.5 text-xs">
              <div className="flex items-center space-x-2 text-gray-400">
                <MapPin className="w-4 h-4 text-rose-400 shrink-0" />
                <span>USA • UK • UAE • Pakistan • Worldwide</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-400">
                <Mail className="w-4 h-4 text-rose-400 shrink-0" />
                <span>support@koimilgaya.com</span>
              </div>
              <div className="pt-2 space-y-1.5">
                <div className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-semibold bg-rose-500/10 text-rose-300 border border-rose-500/20">
                  Meeting Fee: $2 USD / PKR 499 / Crypto (USDT)
                </div>
                <div className="text-[11px] text-emerald-400 font-medium flex items-center gap-1">
                  ⚡ Crypto Payments (USDT) Accepted
                </div>
              </div>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 mt-12 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
          <p>© {new Date().getFullYear()} Koi Mil Gaya (KMG) Global Inc. All rights reserved.</p>
          <p className="mt-2 sm:mt-0 flex items-center gap-1">
            Made with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline" /> for real worldwide connections.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
