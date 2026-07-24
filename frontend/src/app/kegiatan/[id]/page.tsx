'use client';

import { useState, useEffect, use } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/ProtectedLayout';
import { fetchApi } from '@/lib/api';

export default function KegiatanDetail({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchApi(`/kegiatan/${resolvedParams.id}`);
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
          Error: {error || 'Kegiatan tidak ditemukan'}
        </div>
      </ProtectedLayout>
    );
  }

  return (
    <ProtectedLayout>
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-8 border-b border-slate-100 pb-6">
          <button 
            onClick={() => router.push('/kegiatan')}
            className="text-slate-500 hover:text-slate-700 transition-colors"
          >
            &larr; Kembali
          </button>
          <h1 className="text-3xl font-bold text-slate-900">Detail Kegiatan</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="col-span-1">
            {data.poster ? (
              <img 
                src={`http://localhost:3000${data.poster}`} 
                alt={data.judul} 
                onClick={() => setIsModalOpen(true)}
                className="w-full rounded-xl border border-slate-200 shadow-sm cursor-pointer hover:opacity-90 hover:ring-4 ring-indigo-100 transition-all"
                title="Klik untuk memperbesar"
              />
            ) : (
              <div className="w-full aspect-[3/4] bg-slate-100 rounded-xl flex items-center justify-center text-slate-400 border border-slate-200">
                Tidak ada poster
              </div>
            )}
          </div>
          <div className="col-span-2 space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 mb-2">{data.judul}</h2>
              <span className={`px-3 py-1 inline-flex text-sm font-semibold rounded-full ${
                data.status === 'aktif' ? 'bg-green-100 text-green-800 border border-green-200' :
                data.status === 'selesai' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                'bg-red-100 text-red-800 border border-red-200'
              }`}>
                {data.status.toUpperCase()}
              </span>
            </div>

            <div className="grid grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Jenis Kegiatan</p>
                <p className="text-slate-900 font-medium">{data.nama_jenis}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 mb-1">Tanggal</p>
                <p className="text-slate-900 font-medium">{new Date(data.tanggal).toLocaleDateString('id-ID', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                })}</p>
              </div>
              <div className="col-span-2">
                <p className="text-sm font-medium text-slate-500 mb-1">Lokasi</p>
                <p className="text-slate-900 font-medium">{data.lokasi}</p>
              </div>
            </div>
            
            <div className="pt-4 flex gap-4">
              <button onClick={() => router.push(`/peserta?kegiatan_id=${data.id}`)} className="px-5 py-2.5 bg-indigo-50 text-indigo-700 hover:bg-indigo-100 rounded-lg font-medium transition-colors border border-indigo-200">
                Lihat Peserta
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      {isModalOpen && data?.poster && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-in fade-in duration-200"
          onClick={() => setIsModalOpen(false)}
        >
          <div className="relative max-w-5xl max-h-[90vh] w-full h-full flex items-center justify-center group">
            <button 
              className="absolute top-4 right-4 text-white hover:bg-white/20 transition-colors text-3xl font-light rounded-full w-12 h-12 flex items-center justify-center z-50 backdrop-blur-md bg-black/40"
              onClick={(e) => {
                e.stopPropagation();
                setIsModalOpen(false);
              }}
              title="Tutup"
            >
              &times;
            </button>
            <img 
              src={`http://localhost:3000${data.poster}`} 
              alt={data.judul} 
              className="max-w-full max-h-full object-contain rounded-lg shadow-2xl"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}
    </ProtectedLayout>
  );
}
