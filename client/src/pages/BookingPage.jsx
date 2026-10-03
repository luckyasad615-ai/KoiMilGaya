import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Clock, MapPin, MessageSquare, ShieldCheck, ArrowRight, AlertCircle, Sparkles } from 'lucide-react';

const BookingPage = () => {
  const { profileId } = useParams();
  const navigate = useNavigate();

  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form fields
  const [meetingDate, setMeetingDate] = useState('');
  const [meetingTime, setMeetingTime] = useState('18:00');
  const [meetingLocation, setMeetingLocation] = useState('Second Cup Coffee Lounge');
  const [message, setMessage] = useState('');

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchTargetProfile = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/users/${profileId}`);
        if (res.success && res.user) {
          setProfile(res.user);
          // Set default date to tomorrow
          const tomorrow = new Date();
          tomorrow.setDate(tomorrow.getDate() + 1);
          setMeetingDate(tomorrow.toISOString().split('T')[0]);
        }
      } catch (err) {
        setError(err.message || 'Profile not found');
      } finally {
        setLoading(false);
      }
    };

    fetchTargetProfile();
  }, [profileId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!meetingDate || !meetingTime || !meetingLocation.trim()) {
      setError('Please fill out date, time, and meeting location');
      return;
    }

    try {
      setSubmitting(true);
      const res = await API.post('/bookings', {
        profileId,
        meetingDate,
        meetingTime,
        meetingLocation,
        message,
      });

      if (res.success && res.booking) {
        // Redirect to payment checkout page with booking ID!
        navigate(`/payment/${res.booking._id}`);
      }
    } catch (err) {
      setError(err.message || 'Failed to create meeting booking');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-3xl text-center space-y-4">
        <p className="text-gray-300 text-sm">{error || 'Profile unavailable'}</p>
        <button onClick={() => navigate('/discover')} className="px-6 py-2.5 rounded-xl font-bold btn-gradient text-xs">
          Return to Discover
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-4 h-4 text-yellow-300" />
          <span>Step 1 of 2: Schedule Meeting</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Book Physical Meeting</h1>
        <p className="text-gray-400 text-xs">Configure time and location for your physical date</p>
      </div>

      {/* Target Person Card */}
      <div className="glass-card p-6 rounded-3xl border border-rose-500/30 flex items-center space-x-4">
        <img
          src={profile.profileImage}
          alt={profile.fullName}
          className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
        />
        <div className="space-y-1">
          <h3 className="text-lg font-bold text-white">{profile.fullName}, {profile.age}</h3>
          <p className="text-xs text-rose-300 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5" />
            {profile.city} • Verified Member
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          
          {/* Date */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Meeting Date *
            </label>
            <div className="relative">
              <Calendar className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="date"
                value={meetingDate}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setMeetingDate(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Time */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Preferred Time *
            </label>
            <div className="relative">
              <Clock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
              <input
                type="time"
                value={meetingTime}
                onChange={(e) => setMeetingTime(e.target.value)}
                required
                className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

        </div>

        {/* Location */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Meeting Location / Public Venue *
          </label>
          <div className="relative">
            <MapPin className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <input
              type="text"
              value={meetingLocation}
              onChange={(e) => setMeetingLocation(e.target.value)}
              placeholder="e.g. Starbucks Times Square NY / Costa Coffee London / Gloria Jean's Lahore"
              required
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>
          <p className="text-[11px] text-gray-400 mt-1.5">
            For dating safety, all physical meetings should take place in a public cafe or lounge (or virtual video link).
          </p>
        </div>

        {/* Message */}
        <div>
          <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
            Optional Note / Message
          </label>
          <div className="relative">
            <MessageSquare className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
            <textarea
              rows="3"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder={`Hi ${profile.fullName}, looking forward to grabbing coffee and having a great chat!`}
              className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-sm focus:outline-none focus:border-rose-500"
            />
          </div>
        </div>

        {/* Fee Highlight Card */}
        <div className="p-5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/40 border border-rose-500/30 flex items-center justify-between">
          <div>
            <span className="text-xs text-rose-300 font-semibold block">Required Global Booking Fee</span>
            <span className="text-2xl font-black text-white">$2.00 USD / PKR 499 / Crypto</span>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-yellow-500/10 text-yellow-300 text-[11px] font-bold border border-yellow-500/30">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Card / Crypto / Wallet</span>
            </span>
          </div>
        </div>

        {/* Submit button */}
        <button
          type="submit"
          disabled={submitting}
          className="w-full py-4 rounded-xl font-bold btn-gradient flex items-center justify-center space-x-2 text-base shadow-xl shadow-rose-600/30 disabled:opacity-50"
        >
          {submitting ? (
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          ) : (
            <>
              <span>Proceed to Checkout ($2 / PKR 499 / Crypto)</span>
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

      </form>
    </div>
  );
};

export default BookingPage;
