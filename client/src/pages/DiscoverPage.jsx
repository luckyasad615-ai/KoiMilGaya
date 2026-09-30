import React, { useState, useEffect } from 'react';
import API from '../services/api';
import ProfileCard from '../components/ProfileCard';
import SkeletonCard from '../components/SkeletonCard';
import { Search, Filter, RefreshCw, Sparkles, MapPin, Users, SlidersHorizontal, HeartX } from 'lucide-react';

const CITIES = ['All', 'Lahore', 'Islamabad', 'Karachi', 'New York', 'London', 'Dubai', 'Toronto', 'Sydney', 'Peshawar', 'Rawalpindi', 'Multan'];
const GENDERS = ['All', 'Female', 'Male', 'Non-Binary'];

const DiscoverPage = () => {
  const [profiles, setProfiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [selectedCity, setSelectedCity] = useState('All');
  const [selectedGender, setSelectedGender] = useState('All');
  const [minAge, setMinAge] = useState(18);
  const [maxAge, setMaxAge] = useState(60);

  const fetchProfiles = async () => {
    try {
      setLoading(true);
      const params = {};
      if (search.trim()) params.search = search.trim();
      if (selectedCity !== 'All') params.city = selectedCity;
      if (selectedGender !== 'All') params.gender = selectedGender;
      if (minAge > 18) params.minAge = minAge;
      if (maxAge < 60) params.maxAge = maxAge;

      const res = await API.get('/users', { params });
      if (res.success && res.users) {
        setProfiles(res.users);
      }
    } catch (err) {
      console.error('Error fetching profiles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfiles();
  }, [selectedCity, selectedGender, minAge, maxAge]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchProfiles();
  };

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCity('All');
    setSelectedGender('All');
    setMinAge(18);
    setMaxAge(60);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden">
        <div className="space-y-2 z-10">
          <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Koi Mil Gaya (KMG) Worldwide</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Explore Global <span className="text-gradient">Member Profiles</span>
          </h1>
          <p className="text-gray-400 text-xs sm:text-sm">
            Find attractive single members locally & worldwide. Book dates for $5 USD / PKR 499 / Crypto (USDT).
          </p>
        </div>

        <div className="z-10 flex items-center gap-3">
          <button
            onClick={fetchProfiles}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold btn-secondary-glass flex items-center space-x-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="glass-card p-6 rounded-3xl border border-white/10 space-y-4">
        
        <form onSubmit={handleSearchSubmit} className="flex flex-col md:flex-row gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-grow">
            <Search className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, interests, bio..."
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            className="px-6 py-3 rounded-xl font-bold btn-gradient text-sm shrink-0 flex items-center justify-center space-x-2"
          >
            <Search className="w-4 h-4" />
            <span>Search</span>
          </button>

        </form>

        {/* Dropdowns & Range Sliders */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-2 border-t border-white/10">
          
          {/* City Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              City
            </label>
            <select
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#161826] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
            >
              {CITIES.map((c) => (
                <option key={c} value={c}>{c === 'All' ? 'All Cities' : c}</option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div>
            <label className="block text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              Gender
            </label>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl bg-[#161826] border border-white/10 text-white text-xs focus:outline-none focus:border-rose-500"
            >
              {GENDERS.map((g) => (
                <option key={g} value={g}>{g === 'All' ? 'All Genders' : g}</option>
              ))}
            </select>
          </div>

          {/* Age Range Slider */}
          <div className="sm:col-span-2 flex flex-col justify-center">
            <div className="flex justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-1.5">
              <span>Age Range</span>
              <span className="text-rose-400 font-bold">{minAge} - {maxAge} years</span>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min="18"
                max="60"
                value={minAge}
                onChange={(e) => setMinAge(Number(e.target.value))}
                className="w-full accent-rose-500"
              />
              <input
                type="range"
                min="18"
                max="60"
                value={maxAge}
                onChange={(e) => setMaxAge(Number(e.target.value))}
                className="w-full accent-purple-500"
              />
              <button
                onClick={handleResetFilters}
                className="px-3 py-1.5 rounded-lg text-xs text-gray-400 hover:text-white bg-white/5 border border-white/10 shrink-0"
              >
                Reset
              </button>
            </div>
          </div>

        </div>

      </div>

      {/* Profiles Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <SkeletonCard key={i} />
          ))}
        </div>
      ) : profiles.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border border-white/10 space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <HeartX className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Profiles Found</h3>
          <p className="text-gray-400 text-xs">
            We couldn't find any profiles matching your search or filters. Try adjusting your city or age preferences.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-6 py-2.5 rounded-xl text-xs font-semibold btn-secondary-glass"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {profiles.map((profile) => (
            <ProfileCard key={profile._id} profile={profile} />
          ))}
        </div>
      )}

    </div>
  );
};

export default DiscoverPage;
