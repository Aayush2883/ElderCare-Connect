import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { Users, Search, Trash2 } from 'lucide-react';

const UsersManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const fetchUsers = async () => {
    try {
      // We can fetch users list. Since the admin has a dedicated API, wait - we can fetch patients/caregivers or we can fetch a general list.
      // Wait, is there a general user API? In our route plan:
      // Let's create an endpoint GET /api/auth/users (Admin only) to query all users. We can add this route to our authRoutes and authController! That's super clean and robust. Let's do that!
      const { data } = await API.get('/api/auth/users');
      setUsers(data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleDeleteUser = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;
    try {
      await API.delete(`/api/auth/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert(err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter ? u.role === roleFilter : true;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div class="max-w-7xl mx-auto px-4 py-16 text-center">
        <div class="inline-block animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-primary-500 mb-4"></div>
        <p class="text-slate-600 font-medium">Loading users base...</p>
      </div>
    );
  }

  return (
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 class="text-3xl font-extrabold text-slate-800 flex items-center gap-2">
          <Users className="h-8 w-8 text-primary-500" />
          <span>User Accounts Registry</span>
        </h1>
        <p class="text-slate-500 font-medium">Verify profiles, search registered accounts, and manage system permissions.</p>
      </div>

      {/* Filter Toolbar */}
      <div class="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4">
        <div class="flex-1 relative">
          <span class="absolute inset-y-0 left-0 pl-3 flex items-center text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name or email..."
            class="pl-10 w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-semibold"
          />
        </div>

        <div class="w-full md:w-64">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            class="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-primary-500 font-bold text-slate-700"
          >
            <option value="">All Roles</option>
            <option value="user">User (Family)</option>
            <option value="caregiver">Caregiver</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      {/* Users table */}
      <div class="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {filteredUsers.length === 0 ? (
          <div class="p-8 text-center text-slate-500">No users match your filters.</div>
        ) : (
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50 border-b border-slate-100 text-xs font-bold uppercase tracking-wider text-slate-400 font-extrabold">
                  <th class="px-8 py-4">Name</th>
                  <th class="px-8 py-4">Email Address</th>
                  <th class="px-8 py-4">Phone Number</th>
                  <th class="px-8 py-4">Role Badge</th>
                  <th class="px-8 py-4">Joined Date</th>
                  <th class="px-8 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-100 text-sm font-medium">
                {filteredUsers.map((u) => (
                  <tr key={u._id} class="hover:bg-slate-50 transition">
                    <td class="px-8 py-4 text-slate-800 font-bold">{u.name}</td>
                    <td class="px-8 py-4 text-slate-600">{u.email}</td>
                    <td class="px-8 py-4 text-slate-600">{u.phone}</td>
                    <td class="px-8 py-4">
                      <span class={`px-2.5 py-1 rounded-full text-xs font-bold uppercase border ${
                        u.role === 'admin'
                          ? 'bg-red-50 text-red-700 border-red-200'
                          : u.role === 'caregiver'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : 'bg-primary-50 text-primary-700 border-primary-200'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td class="px-8 py-4 text-slate-500">
                      {new Date(u.createdAt).toLocaleDateString()}
                    </td>
                    <td class="px-8 py-4 text-center">
                      {u.role !== 'admin' ? (
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          class="p-2 text-slate-400 hover:text-red-500 rounded-xl transition"
                          title="Delete User"
                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      ) : (
                        <span class="text-xs text-slate-400 font-semibold uppercase">Protected</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default UsersManagement;
