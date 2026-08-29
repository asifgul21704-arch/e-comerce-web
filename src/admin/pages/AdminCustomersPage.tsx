import React, { useState, useEffect } from 'react';
import { Search, User, ShieldCheck, Mail, Phone, Calendar } from 'lucide-react';
import { IUser } from '../../types';
import { authFetch } from '../../utils/api';

export const AdminCustomersPage: React.FC = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const res = await authFetch('/api/admin/users');
        const data = await res.json();
        if (data.success) {
          setUsers(data.users);
        }
      } catch (e) {
        console.error('Error fetching users', e);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  const filteredUsers = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase()) ||
    (u.phone && u.phone.includes(search))
  );

  return (
    <div className="space-y-6">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-neutral-900 tracking-tight">Customer Directory</h1>
        <p className="text-xs text-neutral-500 mt-0.5">Manage customer accounts and access levels</p>
      </div>

      {/* Search Bar */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs max-w-sm">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name, email, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 bg-neutral-50 border border-neutral-200 rounded-xl text-xs focus:bg-white focus:border-indigo-500 outline-none"
          />
          <Search className="w-4 h-4 text-neutral-400 absolute left-3 top-2.5" />
        </div>
      </div>

      {/* Customers Table */}
      <div className="bg-white border border-neutral-200 rounded-3xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-neutral-50 border-b border-neutral-200 text-neutral-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-6">User</th>
                <th className="py-3.5 px-4">Contact</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Shipping Location</th>
                <th className="py-3.5 px-6 text-right">Joined</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400">Loading customers...</td>
                </tr>
              ) : filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-neutral-400 italic">No customers found.</td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-neutral-50/60 transition">
                    <td className="py-3.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-neutral-100 text-neutral-800 font-bold flex items-center justify-center uppercase border border-neutral-200">
                          {u.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-bold text-neutral-900">{u.name}</p>
                          <p className="text-[11px] text-neutral-400">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-neutral-700 font-medium">{u.phone || 'No phone recorded'}</p>
                    </td>
                    <td className="py-3.5 px-4">
                      {u.role === 'admin' ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 text-amber-800 border border-amber-200 uppercase">
                          <ShieldCheck className="w-3 h-3 text-amber-600" />
                          Admin
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-neutral-100 text-neutral-700 uppercase">
                          <User className="w-3 h-3 text-neutral-500" />
                          Customer
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      <p className="text-neutral-700">{u.address?.city ? `${u.address.city}, ${u.address.country || 'USA'}` : 'Not set'}</p>
                    </td>
                    <td className="py-3.5 px-6 text-right text-neutral-500 whitespace-nowrap">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
};
