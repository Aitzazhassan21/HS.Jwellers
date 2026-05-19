import React, { useEffect, useState } from 'react';
import { MessageSquare, Check, ExternalLink, Eye, X } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { backendUrl } from '../config';

const Contacts = ({ token }) => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, [token]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendUrl}/api/admin/contacts`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data.success) {
        setContacts(response.data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
      toast.error('Error fetching contacts');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (id) => {
    try {
      await axios.put(
        `${backendUrl}/api/admin/contacts/${id}/read`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success('Marked as read');
      fetchContacts();
    } catch (error) {
      console.error('Error marking as read:', error);
      toast.error('Error updating contact');
    }
  };

  const filteredContacts = contacts.filter(c => {
    const read = Boolean(c.isRead);
    if (filter === 'unread') return !read;
    if (filter === 'read') return read;
    return true;
  });

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
          <h1 className="text-3xl font-black text-slate-900 mb-2">Contact Messages</h1>
          <p className="text-slate-500">View and manage contact form submissions</p>
        </div>
      </div>

      <div className="flex gap-2">
        {['all','unread','read'].map(f => (
          <button key={f} onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${
              filter === f ? 'bg-blue-600 text-white' : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50'
            }`}>
            {f} <span className="ml-1 opacity-80">(
              {f === 'all' ? contacts.length : f === 'unread' ? contacts.filter(c => !Boolean(c.isRead)).length : contacts.filter(c => Boolean(c.isRead)).length}
            )</span>
          </button>
        ))}
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Name</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Email</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Subject</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Preview</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-3 text-left text-xs font-bold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-3 text-right text-xs font-bold text-slate-500 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredContacts.length === 0 ? (
                <tr><td colSpan="7" className="px-6 py-12 text-center text-slate-500">No messages found.</td></tr>
              ) : filteredContacts.map(contact => (
                <tr key={contact._id}
                  className={`border-b border-slate-50 transition-colors cursor-pointer hover:bg-slate-50 ${
                    !Boolean(contact.isRead) ? 'bg-blue-50/30 font-semibold text-slate-900' : 'text-slate-600'
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <td className="px-6 py-4 text-sm">{contact.name}</td>
                  <td className="px-6 py-4 text-sm">{contact.email}</td>
                  <td className="px-6 py-4 text-sm">{contact.subject}</td>
                  <td className="px-6 py-4 text-sm max-w-xs truncate">{contact.message?.slice(0,50)}{contact.message?.length > 50 ? '...' : ''}</td>
                  <td className="px-6 py-4 text-sm whitespace-nowrap">{new Date(contact.receivedAt).toLocaleDateString('en-GB')}</td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                      Boolean(contact.isRead) ? 'bg-slate-100 text-slate-600' : 'bg-blue-100 text-blue-700'
                    }`}>{Boolean(contact.isRead) ? 'Read' : 'New'}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2" onClick={e => e.stopPropagation()}>
                      {!Boolean(contact.isRead) && (
                        <button onClick={() => markAsRead(contact._id)} className="p-2 hover:bg-green-100 rounded-lg transition-colors text-green-600" title="Mark as read">
                          <Check size={16} />
                        </button>
                      )}
                      <a href={`mailto:${contact.email}?subject=Re: ${contact.subject}`} className="p-2 hover:bg-blue-100 rounded-lg transition-colors text-blue-600" title="Reply">
                        <ExternalLink size={16} />
                      </a>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {selectedContact && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4" onClick={() => setSelectedContact(null)}>
          <div className="bg-white rounded-2xl shadow-xl max-w-lg w-full p-6 space-y-4" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${Boolean(selectedContact.isRead) ? 'bg-slate-100' : 'bg-blue-100'}`}>
                  <MessageSquare className={Boolean(selectedContact.isRead) ? 'text-slate-600' : 'text-blue-600'} size={20} />
                </div>
                <div>
                  <p className="font-bold text-slate-900">{selectedContact.name}</p>
                  <p className="text-sm text-slate-500">{selectedContact.email}</p>
                </div>
              </div>
              <button onClick={() => setSelectedContact(null)} className="p-2 hover:bg-slate-100 rounded-lg">
                <X size={20} />
              </button>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 mb-1">Subject:</p>
              <p className="text-slate-900 font-medium">{selectedContact.subject}</p>
            </div>
            <div>
              <p className="text-sm font-bold text-slate-700 mb-1">Message:</p>
              <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{selectedContact.message}</p>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400">Received: {new Date(selectedContact.receivedAt).toLocaleString('en-GB')}</p>
              <div className="flex gap-2">
                {!Boolean(selectedContact.isRead) && (
                  <button onClick={() => { markAsRead(selectedContact._id); setSelectedContact(null); }} className="px-4 py-2 bg-green-50 text-green-700 rounded-lg text-sm font-medium hover:bg-green-100">Mark as Read</button>
                )}
                <a href={`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject}`} className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg text-sm font-medium hover:bg-blue-100 flex items-center gap-2">
                  <ExternalLink size={14} /> Reply
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Contacts;
