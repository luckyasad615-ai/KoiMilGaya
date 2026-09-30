import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, MapPin, Sparkles, Image, Check, AlertCircle, Save, Calendar, Camera, Upload, X } from 'lucide-react';

const GENDERS = ['Female', 'Male', 'Non-Binary', 'Other'];

const OwnProfilePage = () => {
  const { user, updateUserProfile } = useAuth();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    age: user?.age || 22,
    gender: user?.gender || 'Female',
    city: user?.city || 'Lahore',
    profileImage: user?.profileImage || '',
    bio: user?.bio || '',
    interests: user?.interests ? user.interests.join(', ') : '',
  });

  const [imageInputMode, setImageInputMode] = useState('file'); // 'file' or 'url'
  const [saving, setSaving] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrorMsg('Image file size must be smaller than 5MB');
        return;
      }
      setErrorMsg('');
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({ ...prev, profileImage: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    try {
      setSaving(true);
      const res = await updateUserProfile({
        fullName: formData.fullName,
        age: Number(formData.age),
        gender: formData.gender,
        city: formData.city,
        profileImage: formData.profileImage,
        bio: formData.bio,
        interests: formData.interests,
      });

      if (res.success) {
        setSuccessMsg('Your profile has been updated successfully!');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header */}
      <div className="glass-card p-8 rounded-3xl border border-white/10 flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
        <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-rose-500/50 shadow-xl shrink-0">
          <img
            src={user?.profileImage || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=800'}
            alt={user?.fullName}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="text-center sm:text-left">
          <div className="inline-flex items-center space-x-1.5 text-rose-400 text-xs font-bold uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Member Profile</span>
          </div>
          <h1 className="text-2xl font-bold text-white">{user?.fullName}</h1>
          <p className="text-gray-400 text-xs mt-0.5">{user?.email} • Joined {new Date(user?.createdAt || Date.now()).toLocaleDateString()}</p>
        </div>
      </div>

      {/* Status Alerts */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center space-x-3 text-emerald-300 text-xs">
          <Check className="w-5 h-5 shrink-0 text-emerald-400" />
          <span>{successMsg}</span>
        </div>
      )}

      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center space-x-3 text-rose-300 text-xs">
          <AlertCircle className="w-5 h-5 shrink-0 text-rose-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Edit Profile Form */}
      <div className="glass-card p-8 sm:p-10 rounded-3xl border border-white/10 shadow-2xl">
        <h2 className="text-xl font-bold text-white mb-6">Edit Profile Details</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Age
              </label>
              <input
                type="number"
                name="age"
                min="18"
                max="99"
                value={formData.age}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                Gender
              </label>
              <select
                name="gender"
                value={formData.gender}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl bg-[#161826] border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
              >
                {GENDERS.map((g) => (
                  <option key={g} value={g}>{g}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
                City / Location (Worldwide)
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="e.g. London, UK / New York, USA / Lahore, Pakistan"
                required
                className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
              />
            </div>
          </div>

          {/* Profile Photo File Upload */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider">
                Profile Photo
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
                  📁 Upload File
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
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Current Profile Photo</p>
                  <p className="text-[10px] text-gray-400">Click below if you want to upload a new picture from your device.</p>
                </div>
              </div>
            )}

            {imageInputMode === 'file' ? (
              <div className="relative">
                <label className="flex items-center justify-center space-x-3 w-full p-4 rounded-2xl bg-white/5 border-2 border-dashed border-white/20 hover:border-rose-500/60 cursor-pointer transition-all hover:bg-white/10 group">
                  <Camera className="w-6 h-6 text-rose-400 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-semibold text-gray-200 group-hover:text-white">
                    Click to Choose New Photo from Device
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

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Bio
            </label>
            <textarea
              name="bio"
              rows="4"
              value={formData.bio}
              onChange={handleChange}
              placeholder="Share what makes you unique..."
              className="w-full p-4 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-2">
              Interests (Separated by commas)
            </label>
            <input
              type="text"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              placeholder="e.g. Coffee, Hiking, Literature, Art"
              className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-rose-500"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="px-8 py-3.5 rounded-xl font-bold btn-gradient flex items-center justify-center space-x-2 text-sm disabled:opacity-50"
          >
            {saving ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>Save Profile Changes</span>
              </>
            )}
          </button>

        </form>
      </div>

    </div>
  );
};

export default OwnProfilePage;
