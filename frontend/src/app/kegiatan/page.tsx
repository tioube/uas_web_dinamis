'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import ProtectedLayout from '@/components/ProtectedLayout';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

export default function KegiatanPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [jenisFilter, setJenisFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);

  // Form State
  const [judul, setJudul] = useState('');
  const [jenisKegiatanId, setJenisKegiatanId] = useState(1);
  const [tanggal, setTanggal] = useState('');
  const [lokasi, setLokasi] = useState('');
  const [status, setStatus] = useState('aktif');
  const [posterFile, setPosterFile] = useState<File | null>(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/kegiatan?search=${search}&status=${statusFilter}&jenis=${jenisFilter}&page=${page}&limit=5`);
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

  useEffect(() => {
    if (authLoading || !user) return;
    fetchData();
  }, [search, statusFilter, jenisFilter, page, authLoading, user]);

  const resetForm = () => {
    setJudul('');
    setJenisKegiatanId(1);
    setTanggal('');
    setLokasi('');
    setStatus('aktif');
    setPosterFile(null);
    setEditingId(null);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setJudul(item.judul);
      setJenisKegiatanId(item.jenis_kegiatan_id);
      setTanggal(new Date(item.tanggal).toISOString().split('T')[0]);
      setLokasi(item.lokasi);
      setStatus(item.status);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('File harus berupa gambar (jpg, png, dsb).');
        e.target.value = '';
        setPosterFile(null);
        return;
      }
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran gambar maksimal adalah 2MB.');
        e.target.value = '';
        setPosterFile(null);
        return;
      }
      setPosterFile(file);
    } else {
      setPosterFile(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        judul,
        jenis_kegiatan_id: jenisKegiatanId,
        tanggal,
        lokasi,
        status
      };

      let res;
      let targetId = editingId;
      if (editingId) {
        res = await fetchApi(`/kegiatan/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetchApi('/kegiatan', {
          method: 'POST',
          body: JSON.stringify(payload)
        });
        targetId = res.data.id;
      }

      if (res.status === 'success' && posterFile && targetId) {
        const formData = new FormData();
        formData.append('poster', posterFile);

        await fetchApi(`/kegiatan/${targetId}/upload`, {
          method: 'POST',
          body: formData,
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
    if (confirm('Yakin ingin menghapus kegiatan ini?')) {
      try {
        const res = await fetchApi(`/kegiatan/${id}`, { method: 'DELETE' });
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
          <h1 className="text-2xl font-bold text-slate-900">Manajemen Kegiatan</h1>
          {user && ['admin', 'operator'].includes(user.role) && (
            <button
              onClick={() => handleOpenModal()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
            >
              + Tambah Kegiatan
            </button>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input
            type="text"
            placeholder="Cari judul..."
            className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <select
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Status</option>
            <option value="aktif">Status: Aktif</option>
            <option value="selesai">Status: Selesai</option>
            <option value="batal">Status: Batal</option>
          </select>
          <select
            className="px-4 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900"
            value={jenisFilter}
            onChange={(e) => {
              setJenisFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="">Semua Jenis</option>
            <option value="1">Jenis: Seminar</option>
            <option value="2">Jenis: Workshop</option>
            <option value="3">Jenis: Lomba</option>
            <option value="4">Jenis: Pelatihan</option>
            <option value="5">Jenis: Pengabdian Masyarakat</option>
          </select>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Poster</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Judul</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Jenis</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Tanggal</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">Tidak ada data.</td>
                </tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.poster ? (
                        <img src={`http://localhost:3000${item.poster}`} alt="poster" className="h-10 w-10 object-cover rounded-md border border-slate-200" />
                      ) : (
                        <div className="h-10 w-10 bg-slate-100 rounded-md flex items-center justify-center text-xs text-slate-400 border border-slate-200">No Img</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.judul}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.nama_jenis}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{new Date(item.tanggal).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${item.status === 'aktif' ? 'bg-green-100 text-green-800 border border-green-200' :
                          item.status === 'selesai' ? 'bg-indigo-100 text-indigo-800 border border-indigo-200' :
                            'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => router.push(`/kegiatan/${item.id}`)} className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer transition-colors mr-3 font-semibold">Detail</button>
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
              <h2 className="text-2xl font-bold mb-6 text-slate-900">{editingId ? 'Edit Kegiatan' : 'Tambah Kegiatan'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Judul</label>
                  <input type="text" required value={judul} onChange={e => setJudul(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Jenis Kegiatan ID</label>
                  <select value={jenisKegiatanId} onChange={e => setJenisKegiatanId(Number(e.target.value))} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900">
                    <option value={1}>Seminar</option>
                    <option value={2}>Workshop</option>
                    <option value={3}>Lomba</option>
                    <option value={4}>Pelatihan</option>
                    <option value={5}>Pengabdian Masyarakat</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal</label>
                  <input type="date" required value={tanggal} onChange={e => setTanggal(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Lokasi</label>
                  <input type="text" required value={lokasi} onChange={e => setLokasi(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Status</label>
                  <select value={status} onChange={e => setStatus(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900">
                    <option value="aktif">Aktif</option>
                    <option value="selesai">Selesai</option>
                    <option value="batal">Batal</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Upload Poster (Opsional)</label>
                  <input type="file" accept="image/*" onChange={handleFileChange} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
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
