import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Calendar, Compass, LogOut, Menu, X, Sparkles } from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/');
    setMobileMenuOpen(false);
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 glass-nav transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="relative w-10 h-10 rounded-xl bg-gradient-to-tr from-rose-600 via-rose-500 to-purple-600 flex items-center justify-center shadow-lg shadow-rose-500/30 group-hover:scale-105 transition-transform">
              <Heart className="w-5 h-5 text-white fill-white animate-pulse" />
              <div className="absolute -top-1 -right-1">
                <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-white group-hover:text-rose-400 transition-colors flex items-center gap-1.5">
                Koi Mil Gaya <span className="text-xs px-2 py-0.5 rounded-md bg-gradient-to-r from-rose-500 to-purple-600 font-extrabold text-white">KMG</span>
              </span>
              <span className="block text-[10px] uppercase tracking-widest text-rose-300/80 font-semibold -mt-0.5">
                Worldwide Connections
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {isAuthenticated ? (
              <>
                <Link
                  to="/discover"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/discover')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-inner'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Compass className="w-4 h-4" />
                  <span>Discover</span>
                </Link>

                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/my-bookings')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-inner'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <Calendar className="w-4 h-4" />
                  <span>My Bookings</span>
                </Link>

                <Link
                  to="/profile"
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/profile')
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-inner'
                      : 'text-gray-300 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <div className="w-6 h-6 rounded-full overflow-hidden border border-rose-400/50">
                    <img
                      src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'}
                      alt={user?.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <span>My Profile</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-rose-400 hover:bg-rose-500/10 transition-all border border-transparent hover:border-rose-500/20 ml-2"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/') ? 'text-rose-400 font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Home
                </Link>

                <Link
                  to="/discover"
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                    isActive('/discover') ? 'text-rose-400 font-semibold' : 'text-gray-300 hover:text-white'
                  }`}
                >
                  Explore Profiles
                </Link>

                <Link
                  to="/login"
                  className="px-5 py-2.5 rounded-xl text-sm font-medium btn-secondary-glass"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold btn-gradient"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>

          {/* Mobile Hamburger Button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden glass-card border-x-0 border-t border-b border-white/10 px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
          {isAuthenticated ? (
            <>
              <div className="flex items-center space-x-3 px-3 py-2 border-b border-white/10 pb-3 mb-2">
                <img
                  src={user?.profileImage}
                  alt={user?.fullName}
                  className="w-10 h-10 rounded-full object-cover border-2 border-rose-500"
                />
                <div>
                  <p className="text-white font-semibold text-sm">{user?.fullName}</p>
                  <p className="text-gray-400 text-xs">{user?.city} • {user?.age} yrs</p>
                </div>
              </div>

              <Link
                to="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-200 hover:bg-rose-500/20 hover:text-rose-300 font-medium"
              >
                <Compass className="w-5 h-5 text-rose-400" />
                <span>Discover Profiles</span>
              </Link>

              <Link
                to="/my-bookings"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-200 hover:bg-rose-500/20 hover:text-rose-300 font-medium"
              >
                <Calendar className="w-5 h-5 text-rose-400" />
                <span>My Bookings</span>
              </Link>

              <Link
                to="/profile"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-3 px-4 py-3 rounded-xl text-gray-200 hover:bg-rose-500/20 hover:text-rose-300 font-medium"
              >
                <User className="w-5 h-5 text-rose-400" />
                <span>My Profile</span>
              </Link>

              <button
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-rose-400 bg-rose-500/10 font-medium"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-gray-200 font-medium hover:bg-white/5"
              >
                Home
              </Link>

              <Link
                to="/discover"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-gray-200 font-medium hover:bg-white/5"
              >
                Explore Profiles
              </Link>

              <div className="pt-2 flex flex-col gap-2">
                <Link
                  to="/login"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl font-medium btn-secondary-glass"
                >
                  Log In
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMobileMenuOpen(false)}
                  className="w-full text-center py-3 rounded-xl font-semibold btn-gradient"
                >
                  Sign Up
                </Link>
              </div>
            </>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
