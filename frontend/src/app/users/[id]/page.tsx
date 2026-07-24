'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/ProtectedLayout';
import { fetchApi } from '@/lib/api';

export default function UserDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchApi(`/users/${resolvedParams.id}`);
        setData(response.data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  if (loading) {
    return (
      <ProtectedLayout>
        <div className="flex justify-center items-center h-64">
          <p className="text-slate-500">Loading...</p>
        </div>
      </ProtectedLayout>
    );
  }

  if (error || !data) {
    return (
      <ProtectedLayout>
        <div className="bg-red-50 text-red-600 p-4 rounded-lg border border-red-200">
          Error: {error || 'User tidak ditemukan'}
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <button 
            onClick={() => router.push('/users')}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            &larr; Kembali
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Detail User</h1>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-6">
            <div className="h-20 w-20 bg-slate-100 rounded-full flex items-center justify-center text-3xl font-bold text-slate-700 border border-slate-200">
              {data.nama.charAt(0).toUpperCase()}
            </div>
            <div>
              <h2 className="text-2xl font-bold text-slate-900">{data.nama}</h2>
              <p className="text-slate-500">{data.email}</p>
            </div>
            <div className="ml-auto">
              <span className={`px-4 py-1.5 inline-flex text-sm font-semibold rounded-full uppercase tracking-wider ${
                data.role === 'admin' ? 'bg-purple-100 text-purple-800 border border-purple-200' :
                data.role === 'operator' ? 'bg-blue-100 text-blue-800 border border-blue-200' :
                'bg-slate-100 text-slate-800 border border-slate-200'
              }`}>
                {data.role}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">User ID</p>
              <p className="text-slate-900 font-medium">#{data.id}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500 mb-1">Terdaftar Pada</p>
              <p className="text-slate-900 font-medium">{new Date(data.created_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}</p>
            </div>
            <div className="col-span-1 md:col-span-2">
              <p className="text-sm font-medium text-slate-500 mb-1">Terakhir Diupdate</p>
              <p className="text-slate-900 font-medium">{new Date(data.updated_at).toLocaleDateString('id-ID', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </div>
      </div>
    </ProtectedLayout>
  );
}
