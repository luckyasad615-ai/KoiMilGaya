import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';
import confetti from 'canvas-confetti';
import { CheckCircle2, Calendar, MapPin, Clock, Heart, Sparkles, ArrowRight, ShieldCheck } from 'lucide-react';

const BookingSuccessPage = () => {
  const { bookingId } = useParams();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Launch celebratory confetti burst!
    confetti({
      particleCount: 120,
      spread: 70,
      origin: { y: 0.6 },
      colors: ['#ff2a70', '#be185d', '#9333ea', '#ffffff']
    });

    const fetchBookingDetails = async () => {
      try {
        const res = await API.get(`/bookings/${bookingId}`);
        if (res.success && res.booking) {
          setBooking(res.booking);
        }
      } catch (err) {
        console.error('Error loading confirmation:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
      </div>
    );
  }

  const profile = booking?.profileId;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      
      {/* Hero Banner */}
      <div className="glass-card p-10 rounded-3xl border border-rose-500/40 text-center space-y-4 shadow-2xl relative overflow-hidden bg-gradient-to-b from-rose-950/40 to-transparent">
        <div className="w-20 h-20 rounded-full bg-gradient-to-tr from-rose-500 to-purple-600 flex items-center justify-center mx-auto shadow-xl shadow-rose-500/40 animate-bounce">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>

        <div className="space-y-1">
          <div className="inline-flex items-center space-x-1.5 text-xs font-bold text-rose-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Booking Confirmed</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black text-white">Your Meeting Is Confirmed!</h1>
          <p className="text-gray-300 text-xs sm:text-sm">
            Payment of $2.00 USD / PKR 499 / Crypto was processed successfully. Have a wonderful meeting!
          </p>
        </div>
      </div>

      {/* Booking Ticket Summary */}
      {booking && (
        <div className="glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-gray-400 text-xs uppercase tracking-wider">Booking ID</p>
              <p className="text-sm font-mono font-bold text-rose-400">#{booking._id}</p>
            </div>

            <div className="px-3.5 py-1.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-bold flex items-center space-x-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Status: {booking.bookingStatus}</span>
            </div>
          </div>

          {/* Profile Details */}
          <div className="flex items-center space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
            <img
              src={profile?.profileImage}
              alt={profile?.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
            />
            <div>
              <h3 className="text-lg font-bold text-white">{profile?.fullName}, {profile?.age}</h3>
              <p className="text-xs text-rose-300 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5" />
                {profile?.city}
              </p>
            </div>
          </div>

          {/* Date, Time, Venue */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-400 block mb-1 flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Date
              </span>
              <span className="text-white font-bold text-sm">{booking.meetingDate}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-400 block mb-1 flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Time
              </span>
              <span className="text-white font-bold text-sm">{booking.meetingTime}</span>
            </div>

            <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
              <span className="text-gray-400 block mb-1 flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Location
              </span>
              <span className="text-white font-bold text-sm truncate block">{booking.meetingLocation}</span>
            </div>
          </div>

          {/* Payment receipt line */}
          <div className="flex items-center justify-between pt-2 border-t border-white/10 text-xs">
            <span className="text-gray-400">Total Amount Paid</span>
            <span className="text-base font-extrabold text-white">$2.00 USD / PKR 499 / Crypto (Paid)</span>
          </div>

        </div>
      )}

      {/* Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 pt-2">
        <Link
          to="/my-bookings"
          className="w-full text-center py-4 rounded-2xl text-sm font-bold btn-gradient flex items-center justify-center space-x-2 shadow-xl shadow-rose-600/30"
        >
          <span>View My Bookings</span>
          <ArrowRight className="w-4 h-4" />
        </Link>

        <Link
          to="/discover"
          className="w-full text-center py-4 rounded-2xl text-sm font-semibold btn-secondary-glass"
        >
          Explore More Profiles
        </Link>
      </div>

    </div>
  );
};

export default BookingSuccessPage;
