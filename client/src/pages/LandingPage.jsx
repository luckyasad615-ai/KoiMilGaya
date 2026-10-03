import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import ProfileCard from '../components/ProfileCard';
import SkeletonCard from '../components/SkeletonCard';
import { Heart, Sparkles, ShieldCheck, MapPin, Calendar, CheckCircle2, Star, Users, Coffee, ArrowRight } from 'lucide-react';

const LandingPage = () => {
  const [featuredProfiles, setFeaturedProfiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSampleProfiles = async () => {
      try {
        const res = await API.get('/users');
        if (res.success && res.users) {
          setFeaturedProfiles(res.users.slice(0, 3));
        }
      } catch (err) {
        console.error('Failed to load landing profiles:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchSampleProfiles();
  }, []);

  return (
    <div className="space-y-16 lg:space-y-24 pb-12 bg-radial-glow overflow-hidden">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 lg:pt-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-center lg:items-start text-center lg:text-left gap-6 z-10">
            
            <div className="inline-flex items-center space-x-2 px-4 py-2 rounded-full glass-card border border-rose-500/30 text-rose-300 text-xs font-semibold uppercase tracking-wider animate-bounce">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Koi Mil Gaya (KMG) • Global Physical & Virtual Dating</span>
            </div>

            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black text-white tracking-tight leading-[1.1]">
              Meet Someone <br />
              <span className="text-gradient">Worth Meeting Worldwide</span>
            </h1>

            <p className="text-gray-300 text-base sm:text-lg max-w-2xl font-normal leading-relaxed">
              Discover attractive singles globally. Connect with verified members across USA, UK, UAE, Pakistan, Canada & Worldwide for real physical coffee dates or virtual video catchups.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 w-full sm:w-auto pt-2">
              {isAuthenticated ? (
                <Link
                  to="/discover"
                  className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold btn-gradient flex items-center justify-center space-x-2 shadow-xl shadow-rose-600/30"
                >
                  <span>Welcome Back, {user?.fullName?.split(' ')[0]}! Explore Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-bold btn-gradient flex items-center justify-center space-x-2 shadow-xl shadow-rose-600/30"
                  >
                    <span>Start Exploring Profiles</span>
                    <ArrowRight className="w-5 h-5" />
                  </Link>

                  <Link
                    to="/signup"
                    className="w-full sm:w-auto px-8 py-4 rounded-2xl text-base font-semibold btn-secondary-glass flex items-center justify-center space-x-2"
                  >
                    <span>Create Free Account</span>
                  </Link>
                </>
              )}
            </div>

            {/* Trust highlights */}
            <div className="w-full pt-6 grid grid-cols-3 gap-4 border-t border-white/10 max-w-lg">
              <div>
                <p className="text-xl sm:text-2xl font-bold text-white">Global</p>
                <p className="text-xs text-gray-400">Worldwide Members</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-rose-400">$5 / PKR 499</p>
                <p className="text-xs text-gray-400">Fixed Booking Fee</p>
              </div>
              <div>
                <p className="text-xl sm:text-2xl font-bold text-emerald-400">Crypto Accepted</p>
                <p className="text-xs text-gray-400">USDT / BTC / Card</p>
              </div>
            </div>

          </div>


          {/* Right Visual Banner / Stacked Card Mockup */}
          <div className="lg:col-span-5 relative flex justify-center items-center">
            <div className="relative w-full max-w-sm">
              
              {/* Background ambient glow */}
              <div className="absolute -inset-4 bg-gradient-to-r from-rose-500 to-purple-600 rounded-3xl blur-2xl opacity-40 animate-pulse" />

              {/* Stacked card hero graphic */}
              <div className="relative rounded-3xl overflow-hidden glass-card border border-white/20 p-2 shadow-2xl">
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800"
                  alt="Ayesha Malik Profile"
                  className="w-full h-96 object-cover rounded-2xl"
                />
                
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl glass-card backdrop-blur-xl border border-white/20">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">Ayesha Malik, 24</h4>
                      <p className="text-xs text-rose-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3" /> Lahore, Pakistan • Architect
                      </p>
                    </div>
                    <div className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-rose-500 to-purple-600 text-white text-xs font-bold shadow-md">
                      $5 / Crypto
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 2. FEATURED PROFILES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-10 gap-4">
          <div>
            <div className="flex items-center space-x-2 text-rose-400 text-xs font-semibold tracking-wider uppercase mb-1">
              <Heart className="w-4 h-4 fill-rose-400" />
              <span>Handpicked Members Worldwide</span>
            </div>
            <h2 className="text-3xl font-extrabold text-white">Featured Global Connections</h2>
          </div>
          
          <Link
            to={isAuthenticated ? "/discover" : "/login"}
            className="text-sm font-semibold text-rose-400 hover:text-rose-300 flex items-center space-x-1"
          >
            <span>View All Profiles</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredProfiles.map((profile) => (
              <ProfileCard key={profile._id} profile={profile} />
            ))}
          </div>
        )}
      </section>

      {/* 3. HOW IT WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
          <p className="text-xs font-bold text-rose-400 uppercase tracking-widest">Seamless Global Platform</p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white">How Koi Mil Gaya (KMG) Works</h2>
          <p className="text-gray-400 text-sm">Skip weeks of idle text chatting. Connect and arrange real physical or virtual dates in 4 easy steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          <div className="glass-card p-6 rounded-3xl relative border border-white/10 hover:border-rose-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl mb-4 border border-rose-500/30">
              1
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Explore Global Profiles</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Browse curated, verified user profiles across cities in USA, UK, UAE, Pakistan, Canada, and around the globe.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl relative border border-white/10 hover:border-rose-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center font-bold text-xl mb-4 border border-purple-500/30">
              2
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Schedule Meeting</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Select your preferred meeting date, time slot, and public venue (coffee house, restaurant, cafe, or virtual link).
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl relative border border-white/10 hover:border-rose-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xl mb-4 border border-emerald-500/30">
              3
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Pay via Card or Crypto</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Pay the standard booking fee ($5 / PKR 499) instantly using Crypto (USDT / BTC), Credit Card, or Mobile Wallet.
            </p>
          </div>

          <div className="glass-card p-6 rounded-3xl relative border border-white/10 hover:border-rose-500/40 transition-colors">
            <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center font-bold text-xl mb-4 border border-rose-500/30">
              4
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Connect in Real Life</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Arrive at the confirmed date and location for an authentic, memorable date with your special connection!
            </p>
          </div>

        </div>
      </section>

      {/* 4. TRUST & SAFETY SECTION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="glass-card rounded-3xl p-8 sm:p-12 border border-rose-500/20 relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            
            <div className="space-y-4">
              <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4" />
                <span>Global Safety & Authenticity First</span>
              </div>
              <h2 className="text-3xl font-extrabold text-white">Your Safety Is Our Top Priority</h2>
              <p className="text-gray-300 text-sm leading-relaxed">
                We ensure that physical meetings are conducted with respect and security. All bookings are locked to public venues, and member identity standards are enforced worldwide.
              </p>

              <div className="space-y-3 pt-2">
                <div className="flex items-center space-x-3 text-sm text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Public meeting venues only (Cafes, Restaurants, Lounges)</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>No fake profiles or bot conversations</span>
                </div>
                <div className="flex items-center space-x-3 text-sm text-gray-200">
                  <CheckCircle2 className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>Secure Crypto (USDT/BTC), Card & Wallet payment processing</span>
                </div>
              </div>

              <div className="pt-4">
                <Link
                  to="/safety"
                  className="inline-flex items-center space-x-2 text-xs font-bold text-rose-300 hover:text-white underline underline-offset-4"
                >
                  <span>Read full dating safety guidelines</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
                <Coffee className="w-8 h-8 text-rose-400 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-white">Public Venues</h4>
                <p className="text-xs text-gray-400 mt-1">Coffee shops & lounges</p>
              </div>

              <div className="glass-card p-5 rounded-2xl border border-white/10 text-center">
                <Users className="w-8 h-8 text-purple-400 mx-auto mb-2" />
                <h4 className="text-lg font-bold text-white">Verified Members</h4>
                <p className="text-xs text-gray-400 mt-1">18+ real individuals</p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 5. CALL TO ACTION BANNER */}
      <section className="max-w-5xl mx-auto px-4 text-center">
        <div className="glass-card rounded-3xl p-10 sm:p-14 border border-rose-500/30 relative overflow-hidden bg-gradient-to-tr from-rose-900/40 via-purple-900/20 to-black">
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
            Ready to Find Your Special Someone on KMG?
          </h2>
          <p className="text-gray-300 text-sm max-w-xl mx-auto mb-8">
            Join members worldwide booking real, exciting dates every day with Koi Mil Gaya.
          </p>
          <Link
            to="/signup"
            className="inline-flex items-center space-x-2 px-8 py-4 rounded-2xl text-base font-bold btn-gradient shadow-xl shadow-rose-600/40"
          >
            <span>Create Profile & Explore</span>
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

    </div>
  );
};

export default LandingPage;
