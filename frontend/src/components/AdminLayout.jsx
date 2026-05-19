import { NavLink, Outlet } from "react-router-dom";
import { MapPin } from "lucide-react";

const linkClass = ({ isActive }) =>
  `block px-4 py-2.5 text-sm font-poppins rounded-lg transition-colors ${
    isActive ? "bg-primary text-white" : "text-text-dark hover:bg-light-pink"
  }`;

const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-[#faf7f8] flex">
      <aside className="w-56 shrink-0 border-r border-border bg-white pt-24 pb-8 px-3">
        <p className="px-4 text-xs font-poppins uppercase tracking-wider text-text-muted mb-3">
          Admin
        </p>
        <nav className="flex flex-col gap-1">
          <NavLink to="/admin" end className={linkClass}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/products" className={linkClass}>
            Products
          </NavLink>
          <NavLink to="/admin/categories" className={linkClass}>
            Categories
          </NavLink>
          <NavLink to="/admin/orders" className={linkClass}>
            Orders
          </NavLink>
          <NavLink to="/admin/addresses" className={linkClass}>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              Addresses
            </div>
          </NavLink>
          <NavLink to="/admin/contacts" className={linkClass}>
            Contacts
          </NavLink>
        </nav>
        <NavLink
          to="/"
          className="mt-8 block px-4 py-2 text-sm text-primary font-poppins hover:underline"
        >
          ← Back to store
        </NavLink>
      </aside>
      <main className="flex-1 min-w-0 pt-24 pb-12 px-6 lg:px-10">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;
