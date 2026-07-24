'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/ProtectedLayout';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function PesertaPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [kegiatanData, setKegiatanData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [kegiatanId, setKegiatanId] = useState('');
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [noHp, setNoHp] = useState('');

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/peserta?search=${search}&page=${page}&limit=5`);
      if (res.status === 'success') {
        setData(res.data);
        setTotalPages(res.pagination.totalPages);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchKegiatan = async () => {
    try {
      const res = await fetchApi(`/kegiatan?limit=100`);
      if (res.status === 'success') {
        setKegiatanData(res.data);
      }
    } catch (error) {
      console.error('Failed to fetch kegiatan', error);
    }
  };

  useEffect(() => {
    if (authLoading || !user) return;
    fetchData();
    fetchKegiatan();
  }, [search, page, authLoading, user]);

  const resetForm = () => {
    setKegiatanId('');
    setNama('');
    setEmail('');
    setNoHp('');
    setEditingId(null);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setKegiatanId(item.kegiatan_id.toString());
      setNama(item.nama);
      setEmail(item.email);
      setNoHp(item.no_hp);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        kegiatan_id: Number(kegiatanId),
        nama,
        email,
        no_hp: noHp
      };

      if (editingId) {
        await fetchApi(`/peserta/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi('/peserta', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error('Failed to save', error);
      alert('Error saving data');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Yakin ingin menghapus peserta ini?')) {
      try {
        const res = await fetchApi(`/peserta/${id}`, { method: 'DELETE' });
        if (res.status === 'success') {
          fetchData();
        }
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  return (
    <ProtectedLayout>
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">Data Peserta</h1>
          {user && ['admin', 'operator'].includes(user.role) && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Tambah Peserta
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari nama atau email..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">No HP</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Kegiatan</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">Tidak ada data.</td>
                </tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.no_hp}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.nama_kegiatan}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => router.push(`/peserta/${item.id}`)} className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer transition-colors mr-3 font-semibold">Detail</button>
                      {user && ['admin', 'operator'].includes(user.role) && (
                        <>
                          <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer transition-colors mr-3">Edit</button>
                          {user.role === 'admin' && (
                            <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 hover:underline cursor-pointer transition-colors">Delete</button>
                          )}
                        </>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-between items-center mt-6">
          <button
            disabled={page === 1}
            onClick={() => setPage(p => p - 1)}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            Previous
          </button>
          <span className="text-sm font-medium text-slate-600">Page {page} of {totalPages}</span>
          <button
            disabled={page === totalPages || totalPages === 0}
            onClick={() => setPage(p => p + 1)}
            className="px-4 py-2 border border-slate-300 text-slate-700 bg-white rounded-lg disabled:opacity-50 hover:bg-slate-50 transition-colors"
          >
            Next
          </button>
        </div>

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">{editingId ? 'Edit Peserta' : 'Tambah Peserta'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Kegiatan</label>
                  <select required value={kegiatanId} onChange={e => setKegiatanId(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900">
                    <option value="" disabled>Pilih kegiatan...</option>
                    {kegiatanData.map((k: any) => (
                      <option key={k.id} value={k.id}>{k.judul}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama</label>
                  <input type="text" required value={nama} onChange={e => setNama(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">No HP</label>
                  <input type="text" required value={noHp} onChange={e => setNoHp(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>

                <div className="flex justify-end gap-3 mt-8">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 bg-white hover:bg-slate-50 font-medium transition-colors">Batal</button>
                  <button type="submit" className="px-4 py-2 border border-transparent rounded-lg shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 font-medium transition-colors">Simpan</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </ProtectedLayout>
  );
}
