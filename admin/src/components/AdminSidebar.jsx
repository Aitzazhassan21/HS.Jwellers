import { NavLink, useLocation } from 'react-router-dom';
import PropTypes from 'prop-types';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Settings,
  LogOut,
  FolderOpen,
  Gem
} from 'lucide-react';

const AdminSidebar = ({ setToken, collapsed = false }) => {
  const location = useLocation();

  const menuItems = [
    { path: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/products', icon: Package, label: 'Products' },
    { path: '/add', icon: Package, label: 'Add Product' },
    { path: '/categories', icon: FolderOpen, label: 'Categories' },
    { path: '/orders', icon: ShoppingCart, label: 'Orders' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  const handleLogout = () => {
    setToken('');
    localStorage.removeItem('token');
  };

  return (
    <aside className={`fixed left-0 top-0 h-screen ${collapsed ? 'w-20' : 'w-64'} bg-[#1A1A2E] text-white flex flex-col z-50 transition-width duration-200`}>
      {/* Logo */}
      <div className="p-6 border-b border-[#debc65]/20">
        <div className="flex items-center gap-3">
          <div className="bg-gradient-to-br from-[#debc65] to-[#C9A84C] p-2 rounded-lg">
            <Gem size={24} />
          </div>
          {!collapsed && (
            <div>
              <h1 className="font-bold text-lg">HS Jewels</h1>
              <p className="text-xs text-slate-400">Admin Panel</p>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto scrollbar-hide">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <NavLink
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                isActive
                  ? 'bg-gradient-to-r from-[#debc65] to-[#C9A84C] text-[#1A1A2E] shadow-lg'
                  : 'text-gray-300 hover:bg-[#debc65]/10 hover:text-[#debc65]'
              }`}
            >
              <Icon size={20} />
              <span className={`font-medium ${collapsed ? 'hidden' : ''}`}>{item.label}</span>
              {item.badge > 0 && (
                <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* User Section */}
      <div className="p-4 border-t border-[#debc65]/20">
        <div className="flex items-center gap-3 mb-4 p-3 bg-[#debc65]/10 rounded-xl">
          <div className="w-10 h-10 bg-gradient-to-br from-[#debc65] to-[#C9A84C] rounded-full flex items-center justify-center text-[#1A1A2E]">
            <span className="font-bold">A</span>
          </div>
          {!collapsed && (
            <div className="flex-1">
              <p className="font-medium text-sm">HS Jwells</p>
              <p className="text-xs text-slate-400">Super Admin</p>
            </div>
          )}
        </div>
        <button
          onClick={handleLogout}
          aria-label="Logout"
          className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-300 hover:bg-red-500 hover:text-white transition-all duration-200"
        >
          <LogOut size={20} />
          <span className={`font-medium ${collapsed ? 'hidden' : ''}`}>Logout</span>
        </button>
      </div>
    </aside>
  );
};

AdminSidebar.propTypes = {
  setToken: PropTypes.func.isRequired,
};

export default AdminSidebar;
