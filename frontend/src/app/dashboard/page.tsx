'use client';

import { useEffect, useState } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { useAuth } from '@/context/AuthContext';
import { fetchApi } from '@/lib/api';

export default function DashboardPage() {
  const { user, loading: authLoading } = useAuth();
  const [stats, setStats] = useState({ kegiatan: 0, peserta: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Tunggu sampai auth selesai dan user sudah terverifikasi
    if (authLoading || !user) return;

    const fetchStats = async () => {
      try {
        const [resKegiatan, resPeserta] = await Promise.all([
          fetchApi('/kegiatan?limit=1'),
          fetchApi('/peserta?limit=1')
        ]);
        
        setStats({
          kegiatan: resKegiatan.pagination?.total ?? 0,
          peserta: resPeserta.pagination?.total ?? 0,
        });
      } catch (error) {
        console.error('Error fetching stats', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [authLoading, user]);


  return (
    <ProtectedLayout>
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8">
        <h1 className="text-2xl font-bold text-slate-900 mb-4">
          Dashboard
        </h1>
        <p className="text-slate-600">
          Selamat datang, <span className="font-semibold text-slate-800">{user?.nama}</span>! 
          Anda login sebagai <span className="uppercase text-indigo-600 font-bold ml-1">{user?.role}</span>.
        </p>
        
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-indigo-200 transition-colors">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Kegiatan</h3>
            <p className="text-4xl font-bold mt-3 text-indigo-600">
              {loading ? '...' : stats.kegiatan}
            </p>
          </div>
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 hover:border-emerald-200 transition-colors">
            <h3 className="text-sm font-medium text-slate-500 uppercase tracking-wider">Total Peserta</h3>
            <p className="text-4xl font-bold mt-3 text-emerald-600">
              {loading ? '...' : stats.peserta}
            </p>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
