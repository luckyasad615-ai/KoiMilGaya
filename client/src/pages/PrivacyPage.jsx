import React from 'react';
import { Lock, Shield } from 'lucide-react';

const PrivacyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      <div className="space-y-2">
        <div className="flex items-center space-x-2 text-purple-400 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4" />
          <span>Data Protection Policy</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Privacy Policy</h1>
        <p className="text-gray-400 text-xs">Last updated: September 2026</p>
      </div>

      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 space-y-6 text-sm text-gray-300 leading-relaxed">
        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">1. Information We Collect</h2>
          <p>
            When you register for a Koi Mil Gaya (KMG) account, we collect personal information necessary to deliver our worldwide dating match service, including your full name, email address, age, gender, country, city/location, profile photograph, bio, and interest preferences.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">2. How We Use Your Information</h2>
          <p>
            Your information is used strictly to display your member profile to authorized users on the platform, facilitate physical or virtual meeting bookings, process transaction records (Card / Crypto / Wallet), and maintain safety and security across our platform.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">3. Data Security & Payment Information</h2>
          <p>
            Payment transactions ($5 USD / PKR 499 / Crypto) are processed using encrypted tokenization or direct blockchain verification. We do not store raw credit card credentials on our servers.
          </p>
        </section>

        <section className="space-y-2">
          <h2 className="text-lg font-bold text-white">4. Your Data Control</h2>
          <p>
            You may update or delete your profile information at any time via the "My Profile" dashboard or by reaching out to support@koimilgaya.com.
          </p>
        </section>
      </div>
    </div>
  );
};

export default PrivacyPage;
