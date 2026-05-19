import { useState, useEffect } from "react";
import { Mail, Phone, Check, X } from "lucide-react";
import { toast } from "react-toastify";
import { contactAPI } from "../../services/api.js";

const AdminContacts = () => {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      const response = await contactAPI.getAll({ limit: 50 });
      const items = response.data?.contacts || response.data?.data?.contacts || [];
      setContacts(Array.isArray(items) ? items : []);
    } catch {
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (contactId, status) => {
    try {
      await contactAPI.updateStatus(contactId, { status });
      toast.success("Contact status updated");
      loadContacts();
    } catch {
      toast.error("Failed to update status");
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      new: "bg-blue-100 text-blue-700",
      read: "bg-gray-100 text-gray-700",
      replied: "bg-green-100 text-green-700",
    };
    return colors[status] || "bg-gray-100 text-gray-700";
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-playfair text-3xl text-text-dark mb-2">Contacts</h1>
        <p className="text-text-muted text-sm font-inter">Contact form submissions.</p>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="w-8 h-8 border-4 border-[#debc65]/20 border-t-[#debc65] rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-[#debc65]/20 overflow-hidden">
          <table className="w-full">
            <thead className="bg-[#FFFCF5] border-b border-[#debc65]/20">
              <tr>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Name</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Email</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Phone</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Subject</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Status</th>
                <th className="text-left px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Date</th>
                <th className="text-right px-4 py-3 text-sm font-semibold text-[#1A1A1A]">Actions</th>
              </tr>
            </thead>
            <tbody>
              {contacts.map((contact) => (
                <tr key={contact._id} className="border-b border-[#debc65]/10 hover:bg-[#FFFCF5]/50">
                  <td className="px-4 py-3">
                    <p className="font-medium text-[#1A1A1A]">{contact.name}</p>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    <a href={`mailto:${contact.email}`} className="hover:text-[#debc65]">
                      {contact.email}
                    </a>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {contact.phone ? (
                      <a href={`tel:${contact.phone}`} className="hover:text-[#debc65]">
                        {contact.phone}
                      </a>
                    ) : (
                      "-"
                    )}
                  </td>
                  <td className="px-4 py-3 text-sm text-[#1A1A1A]">{contact.subject}</td>
                  <td className="px-4 py-3">
                    <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(contact.status)}`}>
                      {contact.status || "new"}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-text-muted">
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {contact.status !== "replied" && (
                        <button
                          onClick={() => handleStatusUpdate(contact._id, "replied")}
                          className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                          title="Mark as replied"
                        >
                          <Check size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleStatusUpdate(contact._id, "read")}
                        className="p-2 text-[#1A1A2E] hover:bg-[#debc65]/10 rounded-lg transition-colors"
                        title="Mark as read"
                      >
                        <Mail size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminContacts;
