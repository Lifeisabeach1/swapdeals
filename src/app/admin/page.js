'use client';

import { useState, useEffect, useCallback } from 'react';
import { LogOut, Trash2, RefreshCw, Users, Package, AlertCircle, Eye, EyeOff } from 'lucide-react';

const AdminDashboard = () => {
  const [authToken, setAuthToken] = useState(null);
  const [authUser, setAuthUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const [selectedListings, setSelectedListings] = useState([]);

  const getAuthHeaders = useCallback(() => ({
    'Authorization': `Bearer ${authToken}`,
    'Content-Type': 'application/json'
  }), [authToken]);

  const fetchUsers = useCallback(async () => {
    const response = await fetch('/api/admin/users', { headers: getAuthHeaders() });
    const data = await response.json();
    if (data.success && data.users) setUsers(data.users);
  }, [getAuthHeaders]);

  const fetchListings = useCallback(async () => {
    const response = await fetch('/api/admin/trade-listings', { headers: getAuthHeaders() });
    const data = await response.json();
    if (data.success) setListings(data.data || []);
  }, [getAuthHeaders]);

  useEffect(() => {
    if (authUser && authToken) {
      setLoading(true);
      Promise.all([fetchUsers(), fetchListings()])
        .catch(err => setError('Failed to load data'))
        .finally(() => setLoading(false));
    }
  }, [authUser, authToken, fetchUsers, fetchListings]);

  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user and all their listings?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      if (res.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert('User deleted');
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteListing = async (listingId) => {
    if (!confirm('Delete this listing?')) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/trade-listings/${listingId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (res.ok) {
        setListings(listings.filter(l => l.id !== listingId));
        alert('Listing deleted');
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to delete');
      }
    } catch (err) {
      alert('Error: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleBatchDelete = async () => {
    if (selectedListings.length === 0) return;
    if (!confirm(`Delete ${selectedListings.length} listing(s)?`)) return;

    setLoading(true);
    let success = 0, failed = 0;

    for (const id of selectedListings) {
      try {
        const res = await fetch(`/api/admin/trade-listings/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });
        res.ok ? success++ : failed++;
      } catch {
        failed++;
      }
    }

    setLoading(false);
    setSelectedListings([]);
    alert(`Deleted ${success}. Failed: ${failed}`);
    fetchListings();
  };

  if (!authUser) return <AdminLogin onLogin={(token, user) => { setAuthToken(token); setAuthUser(user); }} />;

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-4 mb-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
            <p className="text-sm text-gray-600">{authUser.username || authUser.email}</p>
          </div>
          <button onClick={() => { setAuthToken(null); setAuthUser(null); }} className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700">
            <LogOut size={16} className="inline mr-2" />Logout
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-blue-500 text-white rounded-lg shadow p-6">
            <p className="text-sm opacity-80">Total Users</p>
            <p className="text-3xl font-bold">{users.length}</p>
          </div>
          <div className="bg-green-500 text-white rounded-lg shadow p-6">
            <p className="text-sm opacity-80">Total Listings</p>
            <p className="text-3xl font-bold">{listings.length}</p>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={18} className="text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-4">
          <button onClick={() => setActiveTab('users')} className={`px-4 py-2 rounded ${activeTab === 'users' ? 'bg-blue-600 text-white' : 'bg-white'}`}>
            Users ({users.length})
          </button>
          <button onClick={() => setActiveTab('listings')} className={`px-4 py-2 rounded ${activeTab === 'listings' ? 'bg-green-600 text-white' : 'bg-white'}`}>
            Listings ({listings.length})
          </button>
        </div>

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="font-bold">Users</h2>
              <button onClick={fetchUsers} disabled={loading} className="px-3 py-1 bg-blue-600 text-white rounded text-sm">
                <RefreshCw size={14} className={`inline ${loading ? 'animate-spin' : ''}`} /> Refresh
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Name</th>
                    <th className="px-4 py-2 text-left">Email</th>
                    <th className="px-4 py-2 text-left">Role</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t hover:bg-gray-50">
                      <td className="px-4 py-2">#{user.id}</td>
                      <td className="px-4 py-2 font-medium">{user.name || user.username}</td>
                      <td className="px-4 py-2">{user.email}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}`}>
                          {user.role || 'user'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {user.is_active ? 'Active' : 'Banned'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        {user.role !== 'admin' ? (
                          <button onClick={() => handleDeleteUser(user.id)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs">
                            <Trash2 size={12} className="inline" /> Delete
                          </button>
                        ) : (
                          <span className="text-gray-400 text-xs">Protected</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="p-3 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="font-bold">Trade Listings</h2>
              <div className="flex gap-2">
                {selectedListings.length > 0 && (
                  <button onClick={handleBatchDelete} className="px-3 py-1 bg-red-600 text-white rounded text-sm">
                    <Trash2 size={14} className="inline" /> Delete ({selectedListings.length})
                  </button>
                )}
                <button onClick={fetchListings} disabled={loading} className="px-3 py-1 bg-green-600 text-white rounded text-sm">
                  <RefreshCw size={14} className={`inline ${loading ? 'animate-spin' : ''}`} /> Refresh
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-2">
                      <input type="checkbox" checked={selectedListings.length === listings.length && listings.length > 0}
                        onChange={() => setSelectedListings(selectedListings.length === listings.length ? [] : listings.map(l => l.id))}
                        className="rounded" />
                    </th>
                    <th className="px-4 py-2 text-left">ID</th>
                    <th className="px-4 py-2 text-left">Title</th>
                    <th className="px-4 py-2 text-left">User</th>
                    <th className="px-4 py-2 text-left">Category</th>
                    <th className="px-4 py-2 text-left">Status</th>
                    <th className="px-4 py-2 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {listings.map(listing => (
                    <tr key={listing.id} className={`border-t hover:bg-gray-50 ${selectedListings.includes(listing.id) ? 'bg-green-50' : ''}`}>
                      <td className="px-4 py-2">
                        <input type="checkbox" checked={selectedListings.includes(listing.id)}
                          onChange={() => setSelectedListings(prev => prev.includes(listing.id) ? prev.filter(id => id !== listing.id) : [...prev, listing.id])}
                          className="rounded" />
                      </td>
                      <td className="px-4 py-2">#{listing.id}</td>
                      <td className="px-4 py-2">
                        <div className="font-medium">{listing.title || 'No title'}</div>
                        {listing.description && <div className="text-xs text-gray-500 truncate max-w-xs">{listing.description}</div>}
                      </td>
                      <td className="px-4 py-2">{listing.username || 'Unknown'}</td>
                      <td className="px-4 py-2">{listing.category || 'N/A'}</td>
                      <td className="px-4 py-2">
                        <span className={`px-2 py-1 rounded text-xs ${
                          listing.status === 'active' ? 'bg-blue-100 text-blue-800' :
                          listing.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {listing.status || 'active'}
                        </span>
                      </td>
                      <td className="px-4 py-2">
                        <button onClick={() => handleDeleteListing(listing.id)} className="px-2 py-1 text-red-600 hover:bg-red-50 rounded text-xs">
                          <Trash2 size={12} className="inline" /> Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AdminLogin = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async () => {
    if (!email || !password) return setError('Enter email and password');
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();

      if (data.success && data.user?.role === 'admin') {
        onLogin(data.token, data.user);
      } else if (data.success) {
        setError('Admin access required');
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-8">
        <div className="text-center mb-6">
          <div className="inline-block p-3 bg-blue-100 rounded-full mb-3">
            <Users size={32} className="text-blue-600" />
          </div>
          <h1 className="text-2xl font-bold mb-1">Admin Portal</h1>
          <p className="text-gray-600 text-sm">Sign in to access dashboard</p>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded p-3 mb-4 flex items-center gap-2">
            <AlertCircle size={16} className="text-red-600" />
            <span className="text-red-800 text-sm">{error}</span>
          </div>
        )}

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
              placeholder="admin@example.com" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? 'text' : 'password'} value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="Enter password" />
              <button onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-500">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <button onClick={handleSubmit} disabled={loading || !email || !password}
            className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 font-medium">
            {loading ? 'Signing in...' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;