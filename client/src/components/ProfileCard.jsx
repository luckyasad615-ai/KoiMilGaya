import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { MapPin, Calendar, Heart } from 'lucide-react';

const ProfileCard = ({ profile }) => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const handleCardClick = () => {
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/profile/${profile._id}`);
    }
  };

  const handleViewProfile = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/profile/${profile._id}`);
    }
  };

  const handleBookMeeting = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      navigate('/login');
    } else {
      navigate(`/book/${profile._id}`);
    }
  };

  return (
    <div 
      onClick={handleCardClick}
      className="group relative rounded-3xl overflow-hidden glass-card glass-card-hover cursor-pointer flex flex-col h-[480px]"
    >
      {/* Background Image Container */}
      <div className="relative w-full h-full overflow-hidden">
        <img
          src={profile.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
          alt={profile.fullName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0e15] via-[#0d0e15]/40 to-transparent opacity-90 group-hover:opacity-95 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between z-10">
          <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#0d0e15]/60 backdrop-blur-md text-white border border-white/10 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-rose-400" />
            {profile.city}
          </span>
          <span className="w-8 h-8 rounded-full bg-rose-500/20 backdrop-blur-md border border-rose-500/40 flex items-center justify-center text-rose-300">
            <Heart className="w-4 h-4 fill-rose-500/30 group-hover:fill-rose-500 transition-colors" />
          </span>
        </div>

        {/* Bottom Profile Details */}
        <div className="absolute bottom-0 left-0 right-0 p-5 z-10 flex flex-col justify-end">
          <div className="flex items-baseline space-x-2 mb-1">
            <h3 className="text-2xl font-bold text-white tracking-tight group-hover:text-rose-300 transition-colors">
              {profile.fullName}
            </h3>
            <span className="text-xl font-semibold text-rose-400">, {profile.age}</span>
          </div>

          <p className="text-gray-300 text-xs line-clamp-2 mb-3 leading-relaxed">
            {profile.bio || "Passionate about meaningful conversations, coffee, and finding a genuine connection."}
          </p>

          {/* Interest tags (2-3 tags) */}
          <div className="flex flex-wrap gap-1.5 mb-4">
            {profile.interests && profile.interests.slice(0, 3).map((interest, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg text-[11px] font-medium bg-white/10 backdrop-blur-md text-gray-200 border border-white/10"
              >
                #{interest}
              </span>
            ))}
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-2.5 pt-1">
            <button
              onClick={handleViewProfile}
              className="w-full text-center py-2.5 px-3 rounded-xl text-xs font-medium btn-secondary-glass flex items-center justify-center space-x-1"
            >
              <span>View Profile</span>
            </button>

            <button
              onClick={handleBookMeeting}
              className="w-full py-2.5 px-3 rounded-xl text-xs font-semibold btn-gradient flex items-center justify-center space-x-1.5"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book Meeting</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ProfileCard;
