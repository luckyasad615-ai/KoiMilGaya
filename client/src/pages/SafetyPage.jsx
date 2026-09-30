import React from 'react';
import { ShieldCheck, MapPin, PhoneCall, AlertTriangle, Lock, Eye, HeartHandshake } from 'lucide-react';

const SafetyPage = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-10">
      
      {/* Header */}
      <div className="text-center space-y-3">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/30">
          <ShieldCheck className="w-8 h-8 text-white" />
        </div>
        <h1 className="text-4xl font-extrabold text-white">Dating Safety Tips</h1>
        <p className="text-gray-300 text-sm max-w-xl mx-auto">
          Your safety, dignity, and peace of mind are our highest priorities. Please review these essential guidelines before meeting anyone in person.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
            <MapPin className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">1. Always Meet in a Public Venue</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
            For your first few meetings, always choose a well-lit, busy public location such as a reputed coffee shop, restaurant, or hotel lounge. Never agree to meet at a private residence or isolated area.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
            <PhoneCall className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">2. Inform a Friend or Family Member</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
            Always notify a trusted friend or family member about where you are going, who you are meeting with, and what time you expect to be back. Share your live location on WhatsApp if possible.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">3. Protect Financial Information</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
            Never share sensitive bank details, credit card numbers, seed phrases, OTPs, or private keys with anyone on Koi Mil Gaya (KMG). KMG staff will never ask for your private passwords.
          </p>
        </div>

        <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <h3 className="text-lg font-bold text-white">4. Never Send Money to Strangers</h3>
          <p className="text-gray-300 text-xs leading-relaxed">
            If a member requests financial assistance, wire transfers, or crypto deposits for alleged emergencies, decline immediately and report their profile to our support team.
          </p>
        </div>

      </div>

      {/* Reporting Banner */}
      <div className="glass-card p-8 rounded-3xl border border-rose-500/30 text-center space-y-3 bg-gradient-to-r from-rose-950/40 to-transparent">
        <HeartHandshake className="w-8 h-8 text-rose-400 mx-auto" />
        <h3 className="text-xl font-bold text-white">Report Suspicious Behavior</h3>
        <p className="text-gray-300 text-xs max-w-lg mx-auto leading-relaxed">
          If you encounter inappropriate, abusive, or fake accounts, email us immediately at <span className="text-rose-400 font-semibold">safety@koimilgaya.com</span>. We enforce zero-tolerance for misbehavior.
        </p>
      </div>

    </div>
  );
};

export default SafetyPage;
