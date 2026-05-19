import React, { useState } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';
import { Save, Lock } from 'lucide-react';

const Settings = ({ token }) => {
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [passwordSaving, setPasswordSaving] = useState(false);

  const handleChangePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }
    if (passwordData.newPassword.length < 8) {
      toast.error('Password must be at least 8 characters');
      return;
    }
    try {
      setPasswordSaving(true);
      const res = await axios.post(
        `${backendUrl}/api/user/admin/change-password`,
        { currentPassword: passwordData.currentPassword, newPassword: passwordData.newPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (res.data.success) {
        toast.success('Password changed successfully');
        setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      } else {
        toast.error(res.data.message || 'Failed to change password');
      }
    } catch (e) {
      console.error(e);
      toast.error(e.response?.data?.message || 'Failed to change password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const handleFormUpdate = (field, value) => {
    setPasswordData((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Settings</h1>
          <p className="text-slate-500">Change admin password</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 space-y-6 max-w-2xl">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-purple-50 rounded-lg"><Lock className="text-purple-600" size={24} /></div>
          <div>
            <h2 className="text-xl font-bold text-slate-900">Change Password</h2>
            <p className="text-sm text-slate-500">Update your admin login password only.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="current-password" className="block text-sm font-bold text-slate-700 mb-2">Current Password</label>
            <input
              id="current-password"
              type="password"
              value={passwordData.currentPassword}
              onChange={(e) => handleFormUpdate('currentPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="new-password" className="block text-sm font-bold text-slate-700 mb-2">New Password</label>
            <input
              id="new-password"
              type="password"
              value={passwordData.newPassword}
              onChange={(e) => handleFormUpdate('newPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
            />
          </div>
          <div>
            <label htmlFor="confirm-password" className="block text-sm font-bold text-slate-700 mb-2">Confirm New Password</label>
            <input
              id="confirm-password"
              type="password"
              value={passwordData.confirmPassword}
              onChange={(e) => handleFormUpdate('confirmPassword', e.target.value)}
              className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none"
            />
          </div>
          <p className="text-sm text-slate-500">Password must be at least 8 characters long.</p>
        </div>

        <div className="flex justify-end pt-4 border-t border-slate-100">
          <button
            onClick={handleChangePassword}
            disabled={passwordSaving || !passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
            className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-bold rounded-xl hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            <Save size={20} /> {passwordSaving ? 'Changing...' : 'Change Password'}
          </button>
        </div>
      </div>
    </div>
  );
};

Settings.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Settings;

