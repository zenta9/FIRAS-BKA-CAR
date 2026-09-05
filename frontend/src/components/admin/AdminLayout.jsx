import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import api from '../../services/api';

const sidebarLinks = [
  { path: '/admin', label: 'Tableau de bord', icon: '📊' },
  { path: '/admin/reservations', label: 'Réservations', icon: '📋' },
  { path: '/admin/vehicules', label: 'Véhicules', icon: '🚗' },
  { path: '/admin/clients', label: 'Clients', icon: '👥' },
  { path: '/admin/calendrier', label: 'Calendrier', icon: '📅' },
  { path: '/admin/paiements', label: 'Paiements', icon: '💳' },
  { path: '/admin/rapports', label: 'Rapports', icon: '📈' },
  { path: '/admin/avis', label: 'Avis clients', icon: '⭐' },
  { path: '/admin/parametres', label: 'Paramètres', icon: '⚙️' },
];

export default function AdminLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login');
    }
  }, [token, navigate]);

  const handleLogout = async () => {
    try {
      await api.post('/admin/logout');
    } catch (e) {}
    localStorage.removeItem('admin_token');
    navigate('/admin/login');
  };

  if (!token) return null;

  return (
    <div className="flex h-screen bg-[#0a0a0a]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#0f0f0f] border-r border-[#2a2a2a] flex flex-col">
        <div className="p-5 border-b border-[#2a2a2a]">
          <Link to="/admin" className="flex items-center gap-2">
            <svg className="w-8 h-8" viewBox="0 0 40 40" fill="none">
              <path d="M5 25 C5 25 10 15 20 15 C30 15 35 25 35 25 L33 28 L7 28 Z" fill="#dc2626" />
              <circle cx="12" cy="28" r="4" fill="#333" stroke="#dc2626" strokeWidth="1" />
              <circle cx="28" cy="28" r="4" fill="#333" stroke="#dc2626" strokeWidth="1" />
            </svg>
            <div className="text-lg font-bold">
              <span className="text-white">FIRAS</span>
              <span className="text-[#dc2626]">CAR</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          {sidebarLinks.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`flex items-center gap-3 px-5 py-2.5 text-sm transition ${
                location.pathname === link.path
                  ? 'bg-[#dc2626]/10 text-[#dc2626] border-r-2 border-[#dc2626]'
                  : 'text-gray-400 hover:text-white hover:bg-[#1a1a1a]'
              }`}
            >
              <span>{link.icon}</span>
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-[#2a2a2a]">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 text-sm text-gray-400 hover:text-red-500 w-full transition"
          >
            <span>🚪</span> Déconnexion
          </button>
        </div>
      </aside>

      {/* Main */}
      <main className="flex-1 overflow-y-auto">
        <header className="bg-[#0f0f0f] border-b border-[#2a2a2a] px-6 py-4 flex items-center justify-between">
          <h2 className="text-white font-semibold">
            {sidebarLinks.find((l) => l.path === location.pathname)?.label || 'Admin'}
          </h2>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-[#dc2626] rounded-full flex items-center justify-center text-white text-sm font-bold">
              A
            </div>
            <div>
              <p className="text-white text-sm font-medium">Admin</p>
              <p className="text-gray-500 text-xs">Administrateur</p>
            </div>
          </div>
        </header>
        <div className="p-6">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
