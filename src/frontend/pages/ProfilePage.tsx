import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Package, Heart, MapPin, KeyRound, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const ProfilePage: React.FC = () => {
  const { user, updateProfile, changePassword, logout } = useAuth();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'profile' | 'address' | 'password'>('profile');

  // Profile Form
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [profileMsg, setProfileMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Address Form
  const [address, setAddress] = useState({
    street: user?.address?.street || '',
    city: user?.address?.city || '',
    postalCode: user?.address?.postalCode || '',
    country: user?.address?.country || 'United States',
  });
  const [addressMsg, setAddressMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [addressLoading, setAddressLoading] = useState(false);

  // Password Form
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [pwdMsg, setPwdMsg] = useState<{ text: string; error?: boolean } | null>(null);
  const [pwdLoading, setPwdLoading] = useState(false);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMsg(null);
    const res = await updateProfile({ name, phone });
    setProfileLoading(false);
    if (res.success) {
      setProfileMsg({ text: 'Profile details saved successfully!' });
      setTimeout(() => setProfileMsg(null), 3000);
    } else {
      setProfileMsg({ text: res.message || 'Failed to update profile.', error: true });
    }
  };

  const handleAddressSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAddressLoading(true);
    setAddressMsg(null);
    const res = await updateProfile({ address });
    setAddressLoading(false);
    if (res.success) {
      setAddressMsg({ text: 'Shipping address updated successfully!' });
      setTimeout(() => setAddressMsg(null), 3000);
    } else {
      setAddressMsg({ text: res.message || 'Failed to update address.', error: true });
    }
  };

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmNewPassword) {
      setPwdMsg({ text: 'New passwords do not match.', error: true });
      return;
    }
    setPwdLoading(true);
    setPwdMsg(null);
    const res = await changePassword(currentPassword, newPassword);
    setPwdLoading(false);
    if (res.success) {
      setPwdMsg({ text: 'Password changed successfully!' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmNewPassword('');
      setTimeout(() => setPwdMsg(null), 3000);
    } else {
      setPwdMsg({ text: res.message || 'Failed to update password.', error: true });
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      
      {/* Header Profile Summary */}
      <div className="bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-full bg-indigo-600 text-white font-black text-2xl flex items-center justify-center uppercase shadow-md shadow-indigo-200">
            {user?.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-xl font-bold text-neutral-900">{user?.name}</h1>
            <p className="text-xs text-neutral-500">{user?.email}</p>
          </div>
        </div>

        <button
          onClick={async () => {
            await logout();
            navigate('/');
          }}
          className="px-4 py-2 text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>

      {/* Profile Body & Tabs */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        
        {/* Navigation Sidebar */}
        <div className="md:col-span-4 bg-white border border-neutral-200 rounded-3xl p-4 shadow-xs space-y-1">
          <button
            onClick={() => setActiveTab('profile')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
              activeTab === 'profile' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <User className="w-4 h-4" />
            <span>My Profile</span>
          </button>

          <button
            onClick={() => setActiveTab('address')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
              activeTab === 'address' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Delivery Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('password')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition text-left ${
              activeTab === 'password' ? 'bg-indigo-600 text-white shadow-xs' : 'text-neutral-700 hover:bg-neutral-100'
            }`}
          >
            <KeyRound className="w-4 h-4" />
            <span>Change Password</span>
          </button>

          <div className="pt-2 border-t border-neutral-100"></div>

          <Link
            to="/orders"
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition"
          >
            <span className="flex items-center gap-3">
              <Package className="w-4 h-4 text-indigo-600" />
              My Orders
            </span>
          </Link>

          <Link
            to="/wishlist"
            className="w-full flex items-center justify-between px-4 py-3 rounded-2xl text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition"
          >
            <span className="flex items-center gap-3">
              <Heart className="w-4 h-4 text-rose-500" />
              My Wishlist
            </span>
          </Link>
        </div>

        {/* Content Box */}
        <div className="md:col-span-8 bg-white border border-neutral-200 rounded-3xl p-6 sm:p-8 shadow-xs">
          
          {/* Profile Details Tab */}
          {activeTab === 'profile' && (
            <form onSubmit={handleProfileSubmit} className="space-y-5">
              <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                Personal Information
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user?.email}
                    className="w-full text-xs p-3 bg-neutral-100 border border-neutral-200 rounded-xl text-neutral-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Phone Number</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {profileMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${profileMsg.error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {profileMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={profileLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                {profileLoading ? 'Saving...' : 'Save Changes'}
              </button>
            </form>
          )}

          {/* Delivery Address Tab */}
          {activeTab === 'address' && (
            <form onSubmit={handleAddressSubmit} className="space-y-5">
              <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                Default Shipping Address
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={address.street}
                    onChange={(e) => setAddress({ ...address, street: e.target.value })}
                    placeholder="123 Main St, Apt 4"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    placeholder="San Francisco"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Postal Code</label>
                  <input
                    type="text"
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    placeholder="94105"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Country</label>
                  <input
                    type="text"
                    value={address.country}
                    onChange={(e) => setAddress({ ...address, country: e.target.value })}
                    placeholder="United States"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {addressMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${addressMsg.error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {addressMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={addressLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                {addressLoading ? 'Saving...' : 'Update Address'}
              </button>
            </form>
          )}

          {/* Password Tab */}
          {activeTab === 'password' && (
            <form onSubmit={handlePasswordSubmit} className="space-y-5">
              <h3 className="text-base font-bold text-neutral-900 border-b border-neutral-100 pb-3">
                Change Password
              </h3>

              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Current Password</label>
                  <input
                    type="password"
                    required
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">New Password (min 6 characters)</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-neutral-700 mb-1">Confirm New Password</label>
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs p-3 bg-neutral-50 border border-neutral-200 rounded-xl focus:bg-white focus:border-indigo-500 outline-none"
                  />
                </div>
              </div>

              {pwdMsg && (
                <div className={`p-3 rounded-xl text-xs font-semibold ${pwdMsg.error ? 'bg-rose-50 text-rose-700' : 'bg-emerald-50 text-emerald-700'}`}>
                  {pwdMsg.text}
                </div>
              )}

              <button
                type="submit"
                disabled={pwdLoading}
                className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold transition shadow-xs"
              >
                {pwdLoading ? 'Updating...' : 'Update Password'}
              </button>
            </form>
          )}

        </div>

      </div>

    </div>
  );
};
