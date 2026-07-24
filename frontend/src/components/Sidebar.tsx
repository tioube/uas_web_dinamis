'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

export default function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  if (!user) return null;

  const getLinks = () => {
    const common = [
      { name: 'Dashboard', href: '/dashboard' },
      { name: 'Kegiatan', href: '/kegiatan' },
      { name: 'Peserta', href: '/peserta' },
    ];
    
    if (user.role === 'admin') {
      return [...common, { name: 'User Management', href: '/users' }];
    }
    
    return common;
  };

  const links = getLinks();

  return (
    <div className="w-64 bg-white border-r border-slate-200 flex flex-col min-h-screen">
      <div className="p-4 bg-white border-b border-slate-100 text-xl font-bold text-indigo-600 flex items-center justify-center">
        UAI Event System
      </div>
      <div className="p-4 flex flex-col gap-2 flex-grow">
        <div className="text-sm text-slate-500 mb-4 px-2">
          Logged in as: <span className="text-slate-800 font-semibold block">{user.nama} ({user.role})</span>
        </div>
        {links.map((link) => {
          const isActive = pathname.startsWith(link.href);
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'hover:bg-slate-50 text-slate-600'
              }`}
            >
              {link.name}
            </Link>
          );
        })}
      </div>
      <div className="p-4 border-t border-slate-200">
        <button
          onClick={logout}
          className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 font-medium rounded-lg transition-colors"
        >
          Logout
        </button>
      </div>
    </div>
  );
}
