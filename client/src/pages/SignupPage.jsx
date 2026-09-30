import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Heart, User, Mail, Lock, MapPin, Sparkles, Image, Info, AlertCircle, ArrowRight, Upload, Camera, X } from 'lucide-react';

const COUNTRIES = ['Pakistan', 'United States', 'United Kingdom', 'United Arab Emirates', 'Canada', 'Australia', 'Germany', 'Saudi Arabia', 'France', 'Worldwide / Other'];
const CITIES = ['Lahore', 'Islamabad', 'Karachi', 'New York', 'London', 'Dubai', 'Toronto', 'Sydney', 'Peshawar', 'Rawalpindi', 'Multan', 'Los Angeles'];
const GENDERS = ['Female', 'Male', 'Non-Binary', 'Other'];
const POPULAR_INTERESTS = ['Coffee', 'Hiking', 'Architecture', 'Literature', 'Tennis', 'Fashion', 'Fine Dining', 'Music', 'Tech Startups', 'Fitness', 'Photography', 'Travel'];

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: 22,
    gender: 'Female',
    country: 'Pakistan',
    city: 'Lahore',
    customCity: '',
    profileImage: '',
    bio: '',
    interestsInput: '',
    selectedInterests: [],
  });

  const [imageInputMode, setImageInputMode] = useState('file'); // 'file' or 'url'
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('Image file size must be smaller than 5MB');
        return;
      }
      setError('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setFormData((prev) => ({ ...prev, profileImage: '' }));
  };

  const toggleInterest = (interest) => {
    setFormData((prev) => {
      const exists = prev.selectedInterests.includes(interest);
      if (exists) {
        return { ...prev, selectedInterests: prev.selectedInterests.filter((i) => i !== interest) };
      } else {
        return { ...prev, selectedInterests: [...prev.selectedInterests, interest] };
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const finalCity = formData.customCity.trim() || formData.city;
    const finalLocation = formData.country ? `${finalCity}, ${formData.country}` : finalCity;

    // Validation
    if (!formData.fullName || !formData.email || !formData.password || !finalCity) {
      setError('Please fill in all required fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError('Password and Confirm Password do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    if (Number(formData.age) < 18) {
      setError('You must be at least 18 years old to join');
      return;
    }

    // Default image if blank
    const imageToUse = formData.profileImage.trim() || 
      (formData.gender === 'Male'
        ? 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800'
        : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800');

    // Combine selected preset interests + custom typed interests
    const customInterests = formData.interestsInput
      ? formData.interestsInput.split(',').map((i) => i.trim()).filter(Boolean)
      : [];
    const allInterests = Array.from(new Set([...formData.selectedInterests, ...customInterests]));

    try {
      setSubmitting(true);
      const res = await signup({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        age: Number(formData.age),
        gender: formData.gender,
        country: formData.country,
        city: finalLocation,
        profileImage: imageToUse,
        bio: formData.bio,
        interests: allInterests,
      });

      if (res.success) {
        navigate('/discover');
      }
    } catch (err) {
      setError(err.message || 'Failed to register account');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-2xl mx-auto">
      <div className="glass-card p-8 sm:p-12 rounded-3xl border border-white/10 relative shadow-2xl space-y-8">
        
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-purple-600 flex items-center justify-center mx-auto shadow-lg shadow-rose-500/30">
            <Sparkles className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-3xl font-extrabold text-white tracking-tight">Create Your Profile</h2>
          <p className="text-gray-400 text-xs">Join Koi Mil Gaya (KMG) to discover genuine connections worldwide</p>
        </div>

        {/* Error Alert */}
        {error && (
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs">
            <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          
          {/* Grid 1: Name & Email */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="text"
                  name="fullName"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="e.g. Mahnoor Khan"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="name@example.com"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Grid 2: Passwords */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="At least 6 characters"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Confirm Password *
              </label>
              <div className="relative">
                <Lock className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Repeat password"
                  required
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            </div>
          </div>

          {/* Grid 3: Age, Gender, Country, City */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Age *
              </label>
              <input
                type="number"
                name="age"
                min="18"
                max="99"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Gender *
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#161826] border border-white/10 text-white focus:outline-none focus:border-rose-500 text-sm"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Country *
              </label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#161826] border border-white/10 text-white focus:outline-none focus:border-rose-500 text-sm"
              >
                {COUNTRIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                City *
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. Lahore, London, NY"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white focus:outline-none focus:border-rose-500 text-sm"
              />
            </div>
          </div>

          {/* Profile Photo File Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Profile Photo (Optional)
              </label>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setImageInputMode('file')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                    imageInputMode === 'file'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  📁 Choose File
                </button>
                <button
                  type="button"
                  onClick={() => setImageInputMode('url')}
                  className={`text-[11px] px-2.5 py-1 rounded-lg font-medium transition-all ${
                    imageInputMode === 'url'
                      ? 'bg-rose-500 text-white font-bold'
                      : 'bg-white/5 text-gray-400 hover:text-white'
                  }`}
                >
                  🔗 Image Link
                </button>
              </div>
            </div>

            {formData.profileImage && (
              <div className="flex items-center space-x-4 p-3 rounded-2xl bg-white/5 border border-white/10">
                <div className="relative w-16 h-16 rounded-xl overflow-hidden border-2 border-rose-500 shrink-0">
                  <img
                    src={formData.profileImage}
                    alt="Profile Preview"
                    className="w-full h-full object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute top-1 right-1 p-1 bg-black/70 rounded-full text-white hover:bg-rose-600"
                    title="Remove Photo"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Photo Loaded</p>
                  <p className="text-[10px] text-gray-400">Your profile picture is ready for display.</p>
                </div>
              </div>
            )}

            {imageInputMode === 'file' ? (
              <div className="relative">
                <label className="flex items-center justify-center space-x-3 w-full p-4 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-rose-500/60 cursor-pointer transition-all hover:bg-white/10 group">
                  <Camera className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                    {formData.profileImage ? 'Change Selected Photo' : 'Click to Upload Photo from Device'}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                </label>
              </div>
            ) : (
              <div className="relative">
                <Image className="w-5 h-5 text-gray-400 absolute left-4 top-3.5" />
                <input
                  type="url"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleChange}
                  placeholder="https://images.unsplash.com/... (Paste image link)"
                  className="w-full pl-12 pr-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
                />
              </div>
            )}
          </div>

          {/* Bio */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Short Bio
            </label>
            <textarea
              name="bio"
              rows="3"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Tell others a little about your personality, hobbies, and ideal coffee meeting..."
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 focus:outline-none focus:border-rose-500 text-sm"
            />
          </div>

          {/* Interests */}
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Select Your Interests
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {POPULAR_INTERESTS.map((interest) => {
                const isSelected = formData.selectedInterests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
                      isSelected
                        ? 'bg-gradient-to-r from-rose-600 to-purple-600 text-white border border-rose-400'
                        : 'bg-white/5 text-gray-300 border border-white/10 hover:border-white/20'
                    }`}
                  >
                    {isSelected ? '✓ ' : '+ '}{interest}
                  </button>
                );
              })}
            </div>

            <input
              type="text"
              name="interestsInput"
              value={formData.interestsInput}
              onChange={handleChange}
              placeholder="Or add custom interests separated by commas (e.g. Cooking, Painting)"
              className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white placeholder-gray-500 text-xs"
            />
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-xl font-bold btn-gradient flex items-center justify-center space-x-2 text-base disabled:opacity-50"
          >
            {submitting ? (
              <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <span>Complete Registration</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </form>

        <div className="text-center pt-4 border-t border-white/10">
          <p className="text-gray-400 text-xs">
            Already registered?{' '}
            <Link to="/login" className="text-rose-400 hover:text-rose-300 font-semibold underline underline-offset-4">
              Sign In
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default SignupPage;
