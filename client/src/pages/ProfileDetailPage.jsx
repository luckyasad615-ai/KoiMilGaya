import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import API from '../services/api';
import { MapPin, Calendar, Heart, ShieldCheck, ArrowLeft, Sparkles, User, Check, ChevronLeft, ChevronRight, Camera } from 'lucide-react';

const ProfileDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImgIndex, setActiveImgIndex] = useState(0);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/users/${id}`);
        if (res.success && res.user) {
          setProfile(res.user);
        }
      } catch (err) {
        setError(err.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-3xl text-center border border-white/10 space-y-4">
        <h3 className="text-xl font-bold text-white">Profile Unavailable</h3>
        <p className="text-gray-400 text-xs">{error || 'The requested profile could not be loaded.'}</p>
        <Link to="/discover" className="inline-block px-6 py-2.5 rounded-xl text-xs font-bold btn-gradient">
          Back to Discover
        </Link>
      </div>
    );
  }

  const galleryImages = (profile.profileImages && profile.profileImages.length > 0)
    ? profile.profileImages
    : [profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'];

  const handleNextPhoto = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev + 1) % galleryImages.length);
  };

  const handlePrevPhoto = (e) => {
    e.stopPropagation();
    setActiveImgIndex((prev) => (prev - 1 + galleryImages.length) % galleryImages.length);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Back button */}
      <button
        onClick={() => navigate(-1)}
        className="flex items-center space-x-2 text-gray-400 hover:text-white transition-colors text-xs font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to profiles</span>
      </button>

      {/* Main Profile Card Container */}
      <div className="glass-card rounded-3xl border border-white/10 overflow-hidden shadow-2xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
          
          {/* Left Large Portrait Column (With Interactive 3-Photo Carousel) */}
          <div className="lg:col-span-5 relative min-h-[440px] lg:min-h-[580px] bg-black/40 group overflow-hidden">
            <img
              src={galleryImages[activeImgIndex] || galleryImages[0]}
              alt={`${profile.fullName} Photo ${activeImgIndex + 1}`}
              className="w-full h-full object-cover transition-all duration-500 transform scale-100 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-transparent to-black/20" />

            {/* Photo navigation arrows if more than 1 image */}
            {galleryImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevPhoto}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-all border border-white/20 shadow-lg"
                  aria-label="Previous Photo"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextPhoto}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/60 hover:bg-rose-600 text-white backdrop-blur-md transition-all border border-white/20 shadow-lg"
                  aria-label="Next Photo"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}

            {/* City Badge Top Left */}
            <div className="absolute top-4 left-4 z-10">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-[#0d0e15]/80 backdrop-blur-md text-white border border-white/10 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                {profile.city}
              </span>
            </div>

            {/* Photo Counter Top Right */}
            {galleryImages.length > 1 && (
              <div className="absolute top-4 right-4 z-10">
                <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-black/70 backdrop-blur-md text-rose-200 border border-white/15 flex items-center gap-1">
                  <Camera className="w-3 h-3 text-rose-400" />
                  <span>{activeImgIndex + 1} / {galleryImages.length}</span>
                </span>
              </div>
            )}

            {/* Bottom Dots Navigation */}
            {galleryImages.length > 1 && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex items-center space-x-2">
                {galleryImages.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImgIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      idx === activeImgIndex ? 'w-6 bg-rose-500' : 'w-2 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}

          </div>

          {/* Right Profile Details Column */}
          <div className="lg:col-span-7 p-8 sm:p-12 flex flex-col justify-between space-y-8">
            
            <div className="space-y-6">
              
              {/* Header Info */}
              <div>
                <div className="flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider mb-2">
                  <Sparkles className="w-4 h-4 text-yellow-300" />
                  <span>Verified HeartSync Profile</span>
                </div>

                <div className="flex items-baseline space-x-3">
                  <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight">
                    {profile.fullName}
                  </h1>
                  <span className="text-2xl font-bold text-rose-400">, {profile.age}</span>
                </div>

                <div className="flex items-center space-x-4 mt-2 text-xs text-gray-400">
                  <span className="flex items-center space-x-1">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span>{profile.gender}</span>
                  </span>
                  <span>•</span>
                  <span className="flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-rose-400" />
                    <span>{profile.city}, Pakistan</span>
                  </span>
                </div>
              </div>

              {/* Bio Section */}
              <div className="space-y-2">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">About Me</h3>
                <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">
                  {profile.bio || "Hello! I enjoy authentic real-world conversations, exploring coffee shops, and meeting like-minded individuals."}
                </p>
              </div>

              {/* Interests Tags */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-gray-300 uppercase tracking-wider">Interests & Hobbies</h3>
                <div className="flex flex-wrap gap-2">
                  {profile.interests && profile.interests.length > 0 ? (
                    profile.interests.map((interest, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/10 backdrop-blur-md text-rose-200 border border-white/10"
                      >
                        #{interest}
                      </span>
                    ))
                  ) : (
                    <span className="text-xs text-gray-500 italic">No interests specified</span>
                  )}
                </div>
              </div>

              {/* Meeting Guarantee Box */}
              <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 space-y-2 text-xs text-gray-300">
                <div className="flex items-center space-x-2 text-rose-300 font-bold">
                  <ShieldCheck className="w-4 h-4 text-rose-400" />
                  <span>Physical Meeting Guarantee</span>
                </div>
                <p className="text-gray-400 leading-relaxed text-[11px]">
                  Booking a physical meeting with {profile.fullName} requires a standard PKR 499 fee. Once paid, meeting venue and date details are locked & confirmed.
                </p>
              </div>

            </div>

            {/* CTA Button */}
            <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400">Meeting Booking Fee</p>
                <p className="text-xl font-bold text-white">PKR 499 <span className="text-xs text-rose-400 font-normal">flat fee</span></p>
              </div>

              <Link
                to={`/book/${profile._id}`}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl text-sm font-bold btn-gradient flex items-center justify-center space-x-2 shadow-xl shadow-rose-600/30"
              >
                <Calendar className="w-4 h-4" />
                <span>Book Physical Meeting</span>
              </Link>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};

export default ProfileDetailPage;
