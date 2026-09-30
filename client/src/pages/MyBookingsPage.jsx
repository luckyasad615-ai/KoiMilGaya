import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';
import { Calendar, Clock, MapPin, CheckCircle2, AlertCircle, Clock3, ArrowRight, Sparkles, Heart } from 'lucide-react';

const MyBookingsPage = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await API.get('/bookings/my');
        if (res.success && res.bookings) {
          setBookings(res.bookings);
        }
      } catch (err) {
        console.error('Error fetching bookings:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  const getStatusBadge = (bookingStatus, paymentStatus) => {
    if (bookingStatus === 'Confirmed' || paymentStatus === 'paid') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          <span>Confirmed</span>
        </span>
      );
    } else if (bookingStatus === 'Cancelled' || paymentStatus === 'failed') {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-500/20 text-rose-300 border border-rose-500/30 flex items-center gap-1.5">
          <AlertCircle className="w-3.5 h-3.5 text-rose-400" />
          <span>Cancelled / Failed</span>
        </span>
      );
    } else {
      return (
        <span className="px-3 py-1 rounded-full text-xs font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/30 flex items-center gap-1.5">
          <Clock3 className="w-3.5 h-3.5 text-yellow-400 animate-spin" />
          <span>Pending Payment</span>
        </span>
      );
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center space-x-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-yellow-300" />
            <span>Booking History</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">My Physical Meetings</h1>
          <p className="text-gray-400 text-xs mt-1">Track all your booked coffee dates and physical meetings</p>
        </div>

        <Link
          to="/discover"
          className="px-6 py-3 rounded-2xl text-xs font-bold btn-gradient flex items-center justify-center space-x-2 shrink-0"
        >
          <span>Book New Date</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      {/* Bookings List */}
      {loading ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-rose-500/30 border-t-rose-500 rounded-full animate-spin" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="glass-card p-12 rounded-3xl text-center border border-white/10 space-y-4 max-w-md mx-auto my-12">
          <div className="w-16 h-16 rounded-full bg-rose-500/10 border border-rose-500/30 flex items-center justify-center mx-auto text-rose-400">
            <Calendar className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-white">No Meetings Booked</h3>
          <p className="text-gray-400 text-xs">
            You haven't booked any meetings yet. Explore our curated member profiles and schedule a coffee date!
          </p>
          <Link
            to="/discover"
            className="inline-block px-6 py-3 rounded-xl text-xs font-bold btn-gradient"
          >
            Explore Profiles
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const profile = booking.profileId;
            return (
              <div
                key={booking._id}
                className="glass-card p-6 rounded-3xl border border-white/10 hover:border-rose-500/30 transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                {/* Left Profile details */}
                <div className="flex items-center space-x-4">
                  <img
                    src={profile?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
                    alt={profile?.fullName}
                    className="w-20 h-20 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
                  />
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-lg font-bold text-white">{profile?.fullName}, {profile?.age}</h3>
                    </div>
                    <p className="text-xs text-rose-300 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5" />
                      {profile?.city}
                    </p>
                    <p className="text-[11px] text-gray-400 font-mono">
                      Booking #{booking._id}
                    </p>
                  </div>
                </div>

                {/* Date & Location */}
                <div className="grid grid-cols-2 gap-4 text-xs bg-white/5 p-4 rounded-2xl border border-white/10 w-full md:w-auto min-w-[280px]">
                  <div>
                    <span className="text-gray-400 block mb-0.5 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-400" /> Date & Time
                    </span>
                    <span className="text-white font-semibold block">{booking.meetingDate}</span>
                    <span className="text-gray-300 block">{booking.meetingTime}</span>
                  </div>

                  <div>
                    <span className="text-gray-400 block mb-0.5 flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-400" /> Venue
                    </span>
                    <span className="text-white font-semibold truncate block max-w-[130px]">{booking.meetingLocation}</span>
                    <span className="text-gray-300 block">PKR {booking.amount || 499}</span>
                  </div>
                </div>

                {/* Status Badges & Action */}
                <div className="flex flex-col items-start md:items-end gap-3 w-full md:w-auto">
                  {getStatusBadge(booking.bookingStatus, booking.paymentStatus)}

                  {booking.paymentStatus === 'pending' ? (
                    <Link
                      to={`/payment/${booking._id}`}
                      className="px-5 py-2.5 rounded-xl text-xs font-bold btn-gradient flex items-center space-x-1"
                    >
                      <span>Complete PKR 499 Payment</span>
                    </Link>
                  ) : (
                    <Link
                      to={`/booking-success/${booking._id}`}
                      className="text-xs font-semibold text-rose-400 hover:text-white underline underline-offset-4"
                    >
                      View Receipt Details
                    </Link>
                  )}
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
};

export default MyBookingsPage;
