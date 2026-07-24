'use client';

import { useState, useEffect } from 'react';
import ProtectedLayout from '@/components/ProtectedLayout';
import { fetchApi } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export default function UsersPage() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  
  // Form State
  const [nama, setNama] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('viewer');
  const [password, setPassword] = useState(''); // Only for create

  useEffect(() => {
    if (!authLoading && user?.role !== 'admin') {
      router.push('/dashboard');
    }
  }, [user, authLoading, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetchApi(`/users`);
      if (res.status === 'success') {
        setData(res.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchData();
    }
  }, [user]);

  const resetForm = () => {
    setNama('');
    setEmail('');
    setRole('viewer');
    setPassword('');
    setEditingId(null);
  };

  const handleOpenModal = (item?: any) => {
    if (item) {
      setEditingId(item.id);
      setNama(item.nama);
      setEmail(item.email);
      setRole(item.role);
    } else {
      resetForm();
    }
    setShowModal(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload: any = { nama, email, role };
      if (!editingId && password) {
        payload.password = password;
      }

      if (editingId) {
        await fetchApi(`/users/${editingId}`, {
          method: 'PUT',
          body: JSON.stringify(payload)
        });
      } else {
        await fetchApi('/users', {
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
    if (confirm('Yakin ingin menghapus user ini?')) {
      try {
        const res = await fetchApi(`/users/${id}`, { method: 'DELETE' });
        if (res.status === 'success') {
          fetchData();
        }
      } catch (error) {
        alert('Gagal menghapus data');
      }
    }
  };

  const handleResetPassword = async (id: number) => {
    if (confirm('Yakin ingin mereset password user ini?')) {
      try {
        const res = await fetchApi(`/users/${id}/reset-password`, { method: 'POST' });
        if (res.status === 'success') {
          alert(`Password reset initiated. Token: ${res.data.resetToken}`);
        }
      } catch (error) {
        alert('Gagal reset password');
      }
    }
  };

  if (user?.role !== 'admin') return null;

  return (
    <ProtectedLayout>
      <div className="bg-white shadow-sm border border-slate-200 rounded-xl p-8 relative">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900">User Management</h1>
          <button 
            onClick={() => handleOpenModal()}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            + Tambah User
          </button>
        </div>

        <div className="overflow-x-auto border border-slate-200 rounded-lg">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Nama</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Role</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Loading...</td>
                </tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={4} className="px-6 py-4 text-center text-gray-500">Tidak ada data.</td>
                </tr>
              ) : (
                data.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-slate-900">{item.nama}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">{item.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500 uppercase">{item.role}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                       <button onClick={() => router.push(`/users/${item.id}`)} className="text-slate-600 hover:text-slate-900 hover:underline cursor-pointer transition-colors mr-3 font-semibold">Detail</button>
                       <button onClick={() => handleOpenModal(item)} className="text-indigo-600 hover:text-indigo-900 hover:underline cursor-pointer transition-colors mr-3">Edit</button>
                       <button onClick={() => handleResetPassword(item.id)} className="text-yellow-600 hover:text-yellow-900 hover:underline cursor-pointer transition-colors mr-3">Reset Password</button>
                       <button onClick={() => handleDelete(item.id)} className="text-red-600 hover:text-red-900 hover:underline cursor-pointer transition-colors">Delete</button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Form Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-slate-900/50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-md w-full max-h-[90vh] overflow-y-auto border border-slate-100">
              <h2 className="text-2xl font-bold mb-6 text-slate-900">{editingId ? 'Edit User' : 'Tambah User'}</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Nama Lengkap</label>
                  <input type="text" required value={nama} onChange={e => setNama(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" />
                </div>
                {!editingId && (
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">Password Baru (Biarkan kosong jika tidak ingin mengubah)</label>
                    <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900" placeholder="********" />
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Role</label>
                  <select value={role} onChange={e => setRole(e.target.value)} className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 text-slate-900">
                    <option value="viewer">Viewer</option>
                    <option value="operator">Operator</option>
                    <option value="admin">Admin</option>
                  </select>
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
