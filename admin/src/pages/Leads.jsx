import React, { useEffect, useState } from 'react';
import { Mail, Copy, Check, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const Leads = ({ token }) => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, [token]);

  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:4000';

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/admin/leads`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setLeads(response.data.leads);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      toast.error('Error fetching leads');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    toast.success('Coupon code copied!');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Lead Emails</h1>
          <p className="text-slate-500">Manage captured emails and coupon codes</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <table className="w-full">
          <thead className="bg-slate-50 border-b border-slate-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm font-bold text-slate-700">Email</th>
              <th className="text-left px-6 py-4 text-sm font-bold text-slate-700">Coupon Code</th>
              <th className="text-left px-6 py-4 text-sm font-bold text-slate-700">Claimed Date</th>
              <th className="text-left px-6 py-4 text-sm font-bold text-slate-700">Status</th>
              <th className="text-left px-6 py-4 text-sm font-bold text-slate-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead._id} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 rounded-lg">
                      <Mail className="text-blue-600" size={20} />
                    </div>
                    <span className="font-medium text-slate-900">{lead.email}</span>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <code className="px-3 py-1 bg-slate-100 rounded-lg font-mono text-sm">{lead.couponCode}</code>
                    <button
                      onClick={() => copyToClipboard(lead.couponCode)}
                      className="p-1 hover:bg-slate-200 rounded-lg transition-colors"
                    >
                      <Copy size={16} className="text-slate-500" />
                    </button>
                  </div>
                </td>
                <td className="px-6 py-4 text-slate-600">
                  {new Date(lead.claimedAt).toLocaleDateString('en-GB')}
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${
                    lead.isUsed 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-slate-100 text-slate-700'
                  }`}>
                    {lead.isUsed ? (
                      <>
                        <Check size={14} />
                        Used
                      </>
                    ) : (
                      <>
                        <X size={14} />
                        Unused
                      </>
                    )}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <button className="text-blue-600 hover:text-blue-800 font-medium text-sm">
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Leads;
