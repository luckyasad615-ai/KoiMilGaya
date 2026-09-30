import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, Sparkles, Building, Wallet, Calendar, MapPin, Clock, Coins, Copy, Check } from 'lucide-react';

const CRYPTO_WALLETS = {
  USDT_TRC20: 'T9xZ8vM2kP7qL4wN1rS5tU3yA6bC8dE0fG',
  USDT_ERC20: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  BTC: '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa',
  ETH: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
  SOL: '7v9E1K2m3N4p5Q6r7S8t9U0v1W2x3Y4z5A6b7C8d'
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [expiry, setExpiry] = useState('12/28');
  const [cvv, setCvv] = useState('123');
  
  // Crypto states
  const [cryptoAsset, setCryptoAsset] = useState('USDT_TRC20');
  const [txHash, setTxHash] = useState('');
  const [copied, setCopied] = useState(false);

  const [simulateOutcome, setSimulateOutcome] = useState('success'); // 'success' or 'fail' toggle for testing

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/bookings/${bookingId}`);
        if (res.success && res.booking) {
          setBooking(res.booking);
        }
      } catch (err) {
        setError(err.message || 'Unable to retrieve booking details');
      } finally {
        setLoading(false);
      }
    };

    fetchBookingDetails();
  }, [bookingId]);

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePayAndConfirm = async (e) => {
    e.preventDefault();
    setError('');

    try {
      setSubmitting(true);
      
      // Step 1: Initialize payment record
      await API.post('/payments/create', {
        bookingId,
        paymentMethod,
        txHash: paymentMethod === 'crypto' ? txHash : undefined,
        cryptoAsset: paymentMethod === 'crypto' ? cryptoAsset : undefined
      });

      // Step 2: Verify payment (Development sandbox simulator / Payment gateway hook)
      const verifyRes = await API.post('/payments/verify', {
        bookingId,
        paymentMethod,
        simulateOutcome,
      });

      if (verifyRes.success && verifyRes.bookingStatus === 'Confirmed') {
        // Redirect to booking confirmation success screen!
        navigate(`/booking-success/${bookingId}`);
      }
    } catch (err) {
      setError(err.message || 'Payment verification failed. Please try again.');
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

  if (!booking) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 glass-card rounded-3xl text-center space-y-4">
        <p className="text-gray-300 text-sm">{error || 'Booking not found'}</p>
        <button onClick={() => navigate('/discover')} className="px-6 py-2.5 rounded-xl font-bold btn-gradient text-xs">
          Return to Discover
        </button>
      </div>
    );
  }

  const profile = booking.profileId;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-rose-400 text-xs font-bold uppercase tracking-wider">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>256-Bit SSL & Blockchain Secured Checkout</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Complete Booking Payment</h1>
        <p className="text-gray-400 text-xs">Confirm your real-life or virtual date with {profile?.fullName}</p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs max-w-3xl mx-auto">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Order Summary */}
        <div className="lg:col-span-5 glass-card p-6 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Meeting Summary</h3>

          {/* Target Profile Thumbnail */}
          <div className="flex items-center space-x-4">
            <img
              src={profile?.profileImage}
              alt={profile?.fullName}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-rose-500 shrink-0"
            />
            <div>
              <h4 className="text-base font-bold text-white">{profile?.fullName}, {profile?.age}</h4>
              <p className="text-xs text-rose-300 flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {profile?.city}
              </p>
            </div>
          </div>

          {/* Meeting Spec Breakdown */}
          <div className="space-y-3 bg-white/5 p-4 rounded-2xl border border-white/10 text-xs">
            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Calendar className="w-3.5 h-3.5 text-rose-400" />
                Date:
              </span>
              <span className="font-semibold text-white">{booking.meetingDate}</span>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-1.5 text-gray-400">
                <Clock className="w-3.5 h-3.5 text-rose-400" />
                Time:
              </span>
              <span className="font-semibold text-white">{booking.meetingTime}</span>
            </div>

            <div className="flex items-center justify-between text-gray-300">
              <span className="flex items-center gap-1.5 text-gray-400">
                <MapPin className="w-3.5 h-3.5 text-rose-400" />
                Venue:
              </span>
              <span className="font-semibold text-white truncate max-w-[180px]">{booking.meetingLocation}</span>
            </div>
          </div>

          {/* Pricing Breakdown */}
          <div className="space-y-2 border-t border-white/10 pt-4 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Standard Meeting Booking Fee</span>
              <span className="text-white font-medium">$5.00 USD / PKR 499</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Service & Verification Tax</span>
              <span className="text-emerald-400 font-medium">0.00 (Free)</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white border-t border-white/10 pt-3">
              <span>Total Amount</span>
              <span className="text-gradient">$5.00 USD / PKR 499 / 5 USDT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Payment Methods Form */}
        <div className="lg:col-span-7 glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white">Select Payment Method</h3>

          {/* Tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-5 h-5 text-rose-400" />
              <span>Card</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'crypto'
                  ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Coins className="w-5 h-5 text-emerald-400" />
              <span className="flex items-center gap-1">Crypto <span className="text-[9px] px-1 bg-emerald-500 text-black rounded font-black">NEW</span></span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('easypaisa')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'easypaisa'
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-lg shadow-rose-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Wallet className="w-5 h-5 text-purple-400" />
              <span>Mobile Wallet</span>
            </button>

            <button
              type="button"
              onClick={() => setPaymentMethod('test_sandbox')}
              className={`p-3 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-1.5 transition-all ${
                paymentMethod === 'test_sandbox'
                  ? 'bg-purple-500/20 border-purple-500 text-white shadow-lg shadow-purple-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Building className="w-5 h-5 text-amber-400" />
              <span>Dev Sandbox</span>
            </button>
          </div>

          <form onSubmit={handlePayAndConfirm} className="space-y-5">
            
            {paymentMethod === 'card' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Card Number
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      CVV / CVC
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      required
                      maxLength="4"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            )}

            {paymentMethod === 'crypto' && (
              <div className="space-y-4 p-5 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    Cryptocurrency Checkout (USDT / BTC / ETH)
                  </span>
                  <span className="text-gray-400 text-[10px]">Instant Web3 Transfer</span>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5">Select Crypto Network / Token</label>
                  <select
                    value={cryptoAsset}
                    onChange={(e) => setCryptoAsset(e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#121420] border border-emerald-500/40 text-white focus:outline-none text-xs font-semibold"
                  >
                    <option value="USDT_TRC20">USDT (TRC20 - Tron Network) • 5.00 USDT</option>
                    <option value="USDT_ERC20">USDT (ERC20 - Ethereum Network) • 5.00 USDT</option>
                    <option value="BTC">Bitcoin (BTC) • 0.00008 BTC</option>
                    <option value="ETH">Ethereum (ETH) • 0.0018 ETH</option>
                    <option value="SOL">Solana (SOL) • 0.035 SOL</option>
                  </select>
                </div>

                {/* Deposit Address Box */}
                <div className="p-4 rounded-xl bg-black/40 border border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-gray-400 text-[11px]">
                    <span>Official KMG Deposit Wallet Address:</span>
                    {copied ? (
                      <span className="text-emerald-400 font-bold flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Copied!
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => copyToClipboard(CRYPTO_WALLETS[cryptoAsset])}
                        className="text-rose-400 hover:text-white font-bold flex items-center gap-1"
                      >
                        <Copy className="w-3.5 h-3.5" /> Copy Address
                      </button>
                    )}
                  </div>

                  <div className="p-3 rounded-lg bg-white/5 font-mono text-[11px] text-emerald-300 break-all border border-emerald-500/20 select-all">
                    {CRYPTO_WALLETS[cryptoAsset]}
                  </div>

                  <p className="text-[10px] text-gray-400">
                    Send exactly <strong className="text-white">5.00 USDT / equivalent</strong> to the address above.
                  </p>
                </div>

                <div>
                  <label className="block text-gray-300 font-semibold mb-1.5">
                    Transaction Hash / TxID (Optional for Dev Test)
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder="e.g. 0x9f8e7d6c5b4a3... or TRX_987654321"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>
            )}

            {paymentMethod === 'easypaisa' && (
              <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-3 text-xs text-gray-300">
                <p className="font-semibold text-white">EasyPaisa / JazzCash Mobile Wallet</p>
                <p className="text-gray-400">Enter your mobile number to receive instant USSD / App payment authorization (PKR 499).</p>
                <input
                  type="text"
                  placeholder="0300 1234567"
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm"
                />
              </div>
            )}

            {/* Test Simulation Toggle */}
            <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/20 space-y-2">
              <label className="block text-[11px] font-bold text-purple-300 uppercase tracking-wider">
                Dev Environment Payment Test Toggle:
              </label>
              <div className="flex gap-4">
                <label className="flex items-center space-x-2 text-xs text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="sim"
                    value="success"
                    checked={simulateOutcome === 'success'}
                    onChange={() => setSimulateOutcome('success')}
                    className="accent-rose-500"
                  />
                  <span>Simulate Payment Success (200 OK)</span>
                </label>
                <label className="flex items-center space-x-2 text-xs text-gray-200 cursor-pointer">
                  <input
                    type="radio"
                    name="sim"
                    value="fail"
                    checked={simulateOutcome === 'fail'}
                    onChange={() => setSimulateOutcome('fail')}
                    className="accent-rose-500"
                  />
                  <span>Simulate Declined Payment</span>
                </label>
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-xl font-bold btn-gradient flex items-center justify-center space-x-2 text-base shadow-xl shadow-rose-600/30 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  <span>
                    {paymentMethod === 'crypto'
                      ? 'Confirm Crypto Transfer & Complete Booking'
                      : paymentMethod === 'easypaisa'
                      ? 'Pay PKR 499 via Wallet & Confirm'
                      : 'Pay $5.00 USD / PKR 499 & Confirm Meeting'}
                  </span>
                </>
              )}
            </button>

          </form>
        </div>

      </div>

    </div>
  );
};

export default PaymentPage;
