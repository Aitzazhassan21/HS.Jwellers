import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Mail, Trash2, Users, Download } from 'lucide-react';
import axios from 'axios';
import { backendUrl } from '../config';
import { toast } from 'react-toastify';

const Newsletter = ({ token }) => {
  const [subscribers, setSubscribers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchSubscribers = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/newsletter/admin`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setSubscribers(response.data.subscribers);
      }
    } catch (error) {
      console.error('Error fetching subscribers:', error);
      toast.error('Error loading subscribers');
    } finally {
      setLoading(false);
    }
  };

  const deleteSubscriber = async (id) => {
    if (!window.confirm('Are you sure you want to remove this subscriber?')) return;
    
    try {
      await axios.delete(`${backendUrl}/api/newsletter/admin/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Subscriber removed');
      fetchSubscribers();
    } catch (error) {
      console.error('Error deleting subscriber:', error);
      toast.error('Error removing subscriber');
    }
  };

  const exportToCSV = () => {
    const csvContent = [
      ['Email', 'Subscribed Date'],
      ...subscribers.map(s => [s.email, new Date(s.subscribedAt).toLocaleDateString()])
    ].map(row => row.join(',')).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'newsletter-subscribers.csv';
    a.click();
  };

  useEffect(() => {
    fetchSubscribers();
  }, [token]);

  const filteredSubscribers = subscribers.filter(s => 
    s.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Newsletter Subscribers</h1>
          <p className="text-slate-500 font-medium">Manage and view subscriber emails collected from the newsletter signup form.</p>
        </div>
        <button
          onClick={exportToCSV}
          className="flex items-center gap-2 px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl transition-colors"
        >
          <Download size={20} />
          Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Users size={24} />
            </div>
            <div>
              <p className="text-blue-100 text-sm font-medium">Total Subscribers</p>
              <p className="text-3xl font-black">{subscribers.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl text-white">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl">
              <Mail size={24} />
            </div>
            <div>
              <p className="text-emerald-100 text-sm font-medium">Export Ready</p>
              <p className="text-3xl font-black">CSV</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
        <input
          type="text"
          placeholder="Search by email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-4 py-3 border-2 border-slate-200 rounded-xl focus:border-blue-600 focus:outline-none transition-colors"
        />
      </div>

      {/* Subscribers Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="p-6 border-b border-slate-50 flex items-center justify-between">
          <h2 className="text-xl font-black text-slate-900">All Subscribers</h2>
          <span className="text-sm font-medium text-slate-500">
            {filteredSubscribers.length} of {subscribers.length} subscribers
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50">
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Email</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider">Subscribed Date</th>
                <th className="px-6 py-4 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredSubscribers.length > 0 ? (
                filteredSubscribers.map((subscriber) => (
                  <tr key={subscriber._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs">
                          <Mail size={14} />
                        </div>
                        <p className="font-bold text-slate-900">{subscriber.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-sm">
                      {new Date(subscriber.subscribedAt).toLocaleDateString('en-GB', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => deleteSubscriber(subscriber._id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        title="Delete subscriber"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                    <Mail className="mx-auto mb-3 text-slate-300" size={48} />
                    <p className="font-medium">No subscribers found</p>
                    <p className="text-sm">Emails from the footer signup will appear here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Newsletter.propTypes = {
  token: PropTypes.string.isRequired,
};

export default Newsletter;
