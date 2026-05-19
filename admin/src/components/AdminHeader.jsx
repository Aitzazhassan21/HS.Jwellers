import React from 'react';
import { Bell, Search, User, Menu } from 'lucide-react';

const AdminHeader = ({ collapsed, setCollapsed }) => {
  return (
    <header className={`fixed top-0 ${collapsed ? 'left-20' : 'left-64'} right-0 h-16 bg-[#FFFCF5] border-b border-[#debc65]/20 flex items-center justify-between px-6 z-40 transition-left duration-200`}>
      <div className="flex items-center gap-4 flex-1">
        <button onClick={() => setCollapsed(!collapsed)} className="p-2 mr-2 text-sm rounded-lg hover:bg-[#debc65]/10">
          <Menu size={18} />
        </button>
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-xl border border-[#debc65]/30 focus:outline-none focus:ring-2 focus:ring-[#debc65]"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="relative p-2 hover:bg-[#debc65]/10 rounded-xl transition-colors">
          <Bell className="text-[#1A1A2E]" size={20} />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-[#debc65]/20">
          <div className="w-10 h-10 bg-gradient-to-br from-[#debc65] to-[#C9A84C] rounded-full flex items-center justify-center">
            <User className="text-[#1A1A2E]" size={20} />
          </div>
          <div className="hidden md:block">
            <p className="font-medium text-sm text-[#1A1A1A]">Admin</p>
            <p className="text-xs text-text-muted">admin@sapphireoptics.co.uk</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
