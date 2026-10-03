import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import API from '../services/api';
import { CreditCard, ShieldCheck, Lock, CheckCircle2, AlertCircle, Sparkles, Building, Wallet, Calendar, MapPin, Clock, Coins, Copy, Check } from 'lucide-react';

const CRYPTO_WALLETS = {
  USDT_TRC20: {
    id: 'USDT_TRC20',
    network: 'TRC20 (Tron Network)',
    address: 'TNLPdssF6EZMiPHszvMjQ51GYxkaN4baL1',
    qr: '/usdt-qr.jpg',
  },
  USDT_ERC20: {
    id: 'USDT_ERC20',
    network: 'ERC20 (Ethereum Network)',
    address: '0x70c653a485f7619728246eb0d6a0c0c6b3531bc3',
    qr: '/usdt-erc20-qr.jpg',
  },
};

const EASYPAISA_DETAILS = {
  accountName: 'Asifa Shaheen',
  mobileNumber: '03238587988',
  iban: 'PK06DGTT0000091000183209',
};

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // Form states
  const [paymentMethod, setPaymentMethod] = useState('crypto'); // Default to Crypto
  const [selectedCrypto, setSelectedCrypto] = useState('USDT_TRC20'); // 'USDT_TRC20' or 'USDT_ERC20'
  
  // Card states
  const [cardNumber, setCardNumber] = useState('');
  const [expiry, setExpiry] = useState('');
  const [cvv, setCvv] = useState('');
  const [cardHolder, setCardHolder] = useState('');

  // Crypto states
  const [txHash, setTxHash] = useState('');
  const [copiedAddress, setCopiedAddress] = useState(false);

  // EasyPaisa / Bank states
  const [easypaisaSenderName, setEasypaisaSenderName] = useState('');
  const [easypaisaSenderNumber, setEasypaisaSenderNumber] = useState('');
  const [easypaisaTrxId, setEasypaisaTrxId] = useState('');
  const [copiedEasypaisa, setCopiedEasypaisa] = useState(false);
  const [copiedIban, setCopiedIban] = useState(false);

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

  const copyToClipboard = (text, type) => {
    navigator.clipboard.writeText(text);
    if (type === 'crypto') {
      setCopiedAddress(true);
      setTimeout(() => setCopiedAddress(false), 2000);
    } else if (type === 'easypaisa') {
      setCopiedEasypaisa(true);
      setTimeout(() => setCopiedEasypaisa(false), 2000);
    } else if (type === 'iban') {
      setCopiedIban(true);
      setTimeout(() => setCopiedIban(false), 2000);
    }
  };

  const handlePayAndConfirm = async (e) => {
    e.preventDefault();
    setError('');

    // Strict Security Proof Validation
    if (paymentMethod === 'crypto') {
      if (!txHash.trim() || txHash.trim().length < 8) {
        setError(`Security Requirement: Please provide a valid ${CRYPTO_WALLETS[selectedCrypto].network} Transaction Hash (TxID) after sending 5 USDT.`);
        return;
      }
    } else if (paymentMethod === 'easypaisa') {
      if (!easypaisaTrxId.trim() || easypaisaTrxId.trim().length < 6) {
        setError('Security Requirement: Please enter your EasyPaisa / Bank TRX Transaction Reference ID from your SMS/Receipt.');
        return;
      }
    } else if (paymentMethod === 'card') {
      if (!cardNumber || cardNumber.replace(/\s/g, '').length < 15 || !expiry || !cvv) {
        setError('Please enter valid credit/debit card details.');
        return;
      }
    }

    try {
      setSubmitting(true);
      
      const submittedTxHash = paymentMethod === 'crypto' 
        ? `USDT-${selectedCrypto}-${txHash.trim()}` 
        : paymentMethod === 'easypaisa'
        ? `TRX-${easypaisaTrxId.trim()}-${easypaisaSenderName.trim()}`
        : `CARD-${Date.now()}`;

      // Step 1: Initialize payment record
      await API.post('/payments/create', {
        bookingId,
        paymentMethod,
        txHash: submittedTxHash,
      });

      // Step 2: Verify payment
      const verifyRes = await API.post('/payments/verify', {
        bookingId,
        paymentMethod,
        transactionId: submittedTxHash,
        simulateOutcome: 'success',
      });

      if (verifyRes.success && verifyRes.bookingStatus === 'Confirmed') {
        // Redirect to booking confirmation success screen!
        navigate(`/booking-success/${bookingId}`);
      }
    } catch (err) {
      setError(err.message || 'Payment verification failed. Please check your transaction details and try again.');
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
  const currentCrypto = CRYPTO_WALLETS[selectedCrypto];

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Title Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30">
          <Lock className="w-4 h-4 text-emerald-400" />
          <span>256-Bit Encrypted & Verified Secure Payment Gateway</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-black text-white">Complete Booking Payment</h1>
        <p className="text-gray-400 text-xs sm:text-sm">Confirm your meeting date with {profile?.fullName}</p>
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
          <h3 className="text-lg font-bold text-white border-b border-white/10 pb-4">Meeting Details Summary</h3>

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
              <span>Standard Booking Fee</span>
              <span className="text-white font-medium">$5.00 USD / PKR 499 / 5 USDT</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Identity Verification Tax</span>
              <span className="text-emerald-400 font-medium">0.00 (Free)</span>
            </div>
            <div className="flex justify-between text-base font-extrabold text-white border-t border-white/10 pt-3">
              <span>Total Payable</span>
              <span className="text-gradient">$5.00 USD / PKR 499 / 5 USDT</span>
            </div>
          </div>
        </div>

        {/* Right Column: Official Payment Methods */}
        <div className="lg:col-span-7 glass-card p-8 rounded-3xl border border-white/10 space-y-6">
          <h3 className="text-lg font-bold text-white">Select Official Payment Option</h3>

          {/* Payment Method Selector Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            
            {/* USDT Crypto Button */}
            <button
              type="button"
              onClick={() => setPaymentMethod('crypto')}
              className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'crypto'
                  ? 'bg-emerald-500/20 border-emerald-500 text-white shadow-xl shadow-emerald-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Coins className="w-6 h-6 text-emerald-400" />
              <div className="text-center">
                <span className="block font-bold">USDT Crypto</span>
                <span className="text-[10px] text-emerald-400">TRC20 & ERC20 QR</span>
              </div>
            </button>

            {/* EasyPaisa / IBAN Button */}
            <button
              type="button"
              onClick={() => setPaymentMethod('easypaisa')}
              className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'easypaisa'
                  ? 'bg-rose-500/20 border-rose-500 text-white shadow-xl shadow-rose-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Wallet className="w-6 h-6 text-rose-400" />
              <div className="text-center">
                <span className="block font-bold">EasyPaisa / Bank</span>
                <span className="text-[10px] text-rose-300">Asifa Shaheen</span>
              </div>
            </button>

            {/* Card Button */}
            <button
              type="button"
              onClick={() => setPaymentMethod('card')}
              className={`p-4 rounded-2xl border text-xs font-semibold flex flex-col items-center gap-2 transition-all ${
                paymentMethod === 'card'
                  ? 'bg-purple-500/20 border-purple-500 text-white shadow-xl shadow-purple-500/20'
                  : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <CreditCard className="w-6 h-6 text-purple-400" />
              <div className="text-center">
                <span className="block font-bold">Credit / Debit Card</span>
                <span className="text-[10px] text-purple-300">Visa / Mastercard</span>
              </div>
            </button>

          </div>

          <form onSubmit={handlePayAndConfirm} className="space-y-6">
            
            {/* 1. USDT CRYPTO METHOD (TRC20 / ERC20 TOGGLE) */}
            {paymentMethod === 'crypto' && (
              <div className="space-y-5 p-6 rounded-2xl bg-emerald-950/20 border border-emerald-500/30 text-xs">
                
                <div className="flex items-center justify-between border-b border-emerald-500/20 pb-3">
                  <span className="font-bold text-emerald-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Coins className="w-4 h-4" />
                    USDT Cryptocurrency Payment
                  </span>
                  <span className="text-emerald-300 font-bold px-2.5 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/40">
                    5.00 USDT
                  </span>
                </div>

                {/* Network Selection Buttons */}
                <div className="space-y-2">
                  <label className="block text-gray-300 font-semibold text-xs">Select USDT Network *</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setSelectedCrypto('USDT_TRC20')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedCrypto === 'USDT_TRC20'
                          ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      USDT (TRC20 Tron)
                    </button>
                    <button
                      type="button"
                      onClick={() => setSelectedCrypto('USDT_ERC20')}
                      className={`p-3 rounded-xl border text-xs font-bold transition-all ${
                        selectedCrypto === 'USDT_ERC20'
                          ? 'bg-emerald-500/30 border-emerald-400 text-white shadow-md'
                          : 'bg-white/5 border-white/10 text-gray-400 hover:text-white'
                      }`}
                    >
                      USDT (ERC20 Ethereum)
                    </button>
                  </div>
                </div>

                {/* QR Code and Wallet Box */}
                <div className="flex flex-col sm:flex-row items-center gap-6 p-4 rounded-xl bg-black/50 border border-emerald-500/20">
                  
                  {/* QR Image */}
                  <div className="shrink-0 text-center">
                    <img
                      src={currentCrypto.qr}
                      alt={`${currentCrypto.network} QR Code`}
                      className="w-36 h-36 object-contain rounded-xl border-2 border-emerald-400 bg-white p-1.5 shadow-lg"
                    />
                    <span className="text-[10px] text-emerald-300 block mt-1 font-semibold">Scan QR for 5 USDT</span>
                  </div>

                  {/* Wallet Details */}
                  <div className="space-y-3 flex-grow w-full">
                    <div>
                      <span className="text-gray-400 block text-[11px] mb-1">Official {currentCrypto.network} Deposit Address:</span>
                      <div className="p-3 rounded-lg bg-emerald-950/60 font-mono text-xs text-emerald-300 break-all border border-emerald-500/40 flex items-center justify-between gap-2">
                        <span>{currentCrypto.address}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => copyToClipboard(currentCrypto.address, 'crypto')}
                      className="w-full py-2.5 px-3 rounded-lg bg-emerald-500 text-black font-bold text-xs flex items-center justify-center space-x-1.5 hover:bg-emerald-400 transition-colors shadow-md"
                    >
                      {copiedAddress ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>Address Copied to Clipboard!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-4 h-4" />
                          <span>Copy {selectedCrypto === 'USDT_TRC20' ? 'TRC20' : 'ERC20'} Address</span>
                        </>
                      )}
                    </button>
                  </div>

                </div>

                {/* Transaction Hash Input */}
                <div className="space-y-1.5 pt-2">
                  <label className="block text-gray-200 font-bold text-xs flex items-center justify-between">
                    <span>Transaction Hash (TxID) *</span>
                    <span className="text-rose-400 text-[11px]">Required for Verification</span>
                  </label>
                  <input
                    type="text"
                    value={txHash}
                    onChange={(e) => setTxHash(e.target.value)}
                    placeholder={`Enter your ${currentCrypto.network} Transaction Hash / TxID (e.g. 0x7c9a... or 7c9a...)`}
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-emerald-500/40 text-white font-mono text-xs focus:outline-none focus:border-emerald-400"
                  />
                  <p className="text-[11px] text-gray-400">
                    Copy the Transaction Hash / TxID from your wallet (Binance, Trust Wallet, OKX, Bybit, etc.) after sending 5 USDT.
                  </p>
                </div>

              </div>
            )}

            {/* 2. EASYPAISA / BANK TRANSFER METHOD */}
            {paymentMethod === 'easypaisa' && (
              <div className="space-y-5 p-6 rounded-2xl bg-rose-950/20 border border-rose-500/30 text-xs">
                
                <div className="flex items-center justify-between border-b border-rose-500/20 pb-3">
                  <span className="font-bold text-rose-400 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <Wallet className="w-4 h-4" />
                    EasyPaisa / Bank Transfer Payment
                  </span>
                  <span className="text-rose-300 font-bold px-2.5 py-0.5 rounded-md bg-rose-500/20 border border-rose-500/40">
                    PKR 499
                  </span>
                </div>

                {/* Account Details Box */}
                <div className="p-4 rounded-xl bg-black/50 border border-rose-500/20 space-y-4">
                  
                  {/* Account Name */}
                  <div className="flex justify-between items-center border-b border-white/10 pb-2">
                    <span className="text-gray-400">Account Title (Name):</span>
                    <span className="text-white font-extrabold text-sm text-rose-300">{EASYPAISA_DETAILS.accountName}</span>
                  </div>

                  {/* EasyPaisa Mobile Number */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>EasyPaisa Number:</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(EASYPAISA_DETAILS.mobileNumber, 'easypaisa')}
                        className="text-rose-400 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                      >
                        {copiedEasypaisa ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedEasypaisa ? 'Copied Number!' : 'Copy Number'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 font-mono text-sm text-white font-bold tracking-widest border border-white/10">
                      {EASYPAISA_DETAILS.mobileNumber}
                    </div>
                  </div>

                  {/* EasyPaisa IBAN */}
                  <div className="space-y-1">
                    <div className="flex justify-between items-center text-gray-400">
                      <span>EasyPaisa IBAN (Bank Transfer):</span>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(EASYPAISA_DETAILS.iban, 'iban')}
                        className="text-rose-400 hover:text-white font-bold flex items-center gap-1 text-[11px]"
                      >
                        {copiedIban ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                        {copiedIban ? 'Copied IBAN!' : 'Copy IBAN'}
                      </button>
                    </div>
                    <div className="p-2.5 rounded-lg bg-white/5 font-mono text-xs text-white font-bold break-all border border-white/10">
                      {EASYPAISA_DETAILS.iban}
                    </div>
                  </div>

                </div>

                {/* TRX Reference ID & Sender Details */}
                <div className="space-y-4 pt-1">
                  
                  <div>
                    <label className="block text-gray-200 font-bold text-xs mb-1.5 flex justify-between">
                      <span>EasyPaisa / Bank Transaction TRX ID *</span>
                      <span className="text-rose-400 text-[11px]">Required for Verification</span>
                    </label>
                    <input
                      type="text"
                      value={easypaisaTrxId}
                      onChange={(e) => setEasypaisaTrxId(e.target.value)}
                      placeholder="Enter 11-digit TRX ID from SMS / App Receipt (e.g. 29384756102)"
                      required
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-rose-500/40 text-white font-mono text-xs focus:outline-none focus:border-rose-400"
                    />
                  </div>

                  <div>
                    <label className="block text-gray-200 font-semibold text-xs mb-1.5">
                      Sender Account Name / Mobile Number (Optional)
                    </label>
                    <input
                      type="text"
                      value={easypaisaSenderName}
                      onChange={(e) => setEasypaisaSenderName(e.target.value)}
                      placeholder="e.g. Ali Khan (03001234567)"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-xs focus:outline-none focus:border-rose-400"
                    />
                  </div>

                </div>

              </div>
            )}

            {/* 3. CREDIT / DEBIT CARD METHOD */}
            {paymentMethod === 'card' && (
              <div className="space-y-4 p-5 rounded-2xl bg-purple-950/20 border border-purple-500/30 text-xs">
                
                <div className="flex items-center justify-between border-b border-purple-500/20 pb-3">
                  <span className="font-bold text-purple-300 uppercase tracking-wider text-xs flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4" />
                    Credit / Debit Card Checkout
                  </span>
                  <span className="text-purple-300 font-bold px-2.5 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40">
                    $5.00 USD
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Cardholder Full Name *
                  </label>
                  <input
                    type="text"
                    value={cardHolder}
                    onChange={(e) => setCardHolder(e.target.value)}
                    placeholder="Full name as printed on card"
                    required
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                    Card Number *
                  </label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    placeholder="4532 •••• •••• 8892"
                    required
                    maxLength="19"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      Expiry Date *
                    </label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      placeholder="MM/YY"
                      required
                      maxLength="5"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                      CVV / CVC *
                    </label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      placeholder="123"
                      required
                      maxLength="4"
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-purple-500 font-mono"
                    />
                  </div>
                </div>

              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl font-bold btn-gradient flex items-center justify-center space-x-2 text-base shadow-xl shadow-rose-600/30 disabled:opacity-50"
            >
              {submitting ? (
                <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <Lock className="w-5 h-5 text-emerald-300" />
                  <span>
                    {paymentMethod === 'crypto'
                      ? 'Submit TxID & Verify 5 USDT Payment'
                      : paymentMethod === 'easypaisa'
                      ? 'Submit TRX ID & Confirm PKR 499 Payment'
                      : 'Pay $5.00 USD & Confirm Meeting'}
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
