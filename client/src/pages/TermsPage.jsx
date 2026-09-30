import React from 'react';
import { FileText } from 'lucide-react';

const TermsPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-blue-400 text-xs font-bold uppercase tracking-wider">
          <FileText className="w-4 h-4" />
          <span>User Agreement</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Terms & Conditions</h1>
        <p className="text-gray-400 text-xs">Last updated: September 2026</p>
      </div>

      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Eligibility</h2>
          <p>
            You must be at least 18 years of age to register for or use Koi Mil Gaya (KMG). By creating an account, you represent and warrant that you are 18 years old or older.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. Meeting Booking Fee & Crypto Payments</h2>
          <p>
            A standard booking fee of $5.00 USD / PKR 499 (or USDT / Crypto equivalent) is required for each meeting arranged on Koi Mil Gaya (KMG). Meeting confirmation is conditional upon payment verification via Card, Crypto (USDT/BTC/ETH), or Mobile Wallet.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Code of Conduct</h2>
          <p>
            Members agree to treat each other with respect worldwide, honor scheduled meeting dates at public venues or virtual links, and refrain from harassment, hate speech, fraud, or misrepresentation.
          </p>
        </section>
      </div>
    </div>
  );
};

export default TermsPage;
