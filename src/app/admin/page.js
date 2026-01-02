// Simple Admin Dashboard - Just Delete Users & Posts
'use client';

import { useState, useEffect } from 'react';
import { LogOut, Trash2, RefreshCw, Users, Package, MessageSquare } from 'lucide-react';

const AdminDashboard = () => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [listings, setListings] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  // Login check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
        }
      } catch {
        handleLogout();
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    setUser(null);
  };

  const getAuthHeaders = () => ({
    'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
    'Content-Type': 'application/json'
  });

  // Fetch data
  useEffect(() => {
    if (user) {
      fetchUsers();
      fetchListings();
      fetchTestimonials();
    }
  }, [user]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.users) setUsers(data.users);
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const fetchListings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.content || data.data) {
        setListings(data.content || data.data);
      }
    } catch (err) {
      setError('Failed to load listings');
    } finally {
      setLoading(false);
    }
  };

  const fetchTestimonials = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/testimonials', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      if (data.testimonials) {
        setTestimonials(data.testimonials);
      }
    } catch (err) {
      setError('Failed to load testimonials');
    } finally {
      setLoading(false);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId) => {
    if (!confirm('Delete this user and all their listings?')) return;
    
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (response.ok) {
        setUsers(users.filter(u => u.id !== userId));
        alert('User deleted');
      } else {
        alert('Failed to delete user');
      }
    } catch (err) {
      alert('Error deleting user');
    } finally {
      setLoading(false);
    }
  };

  // Delete listing
  const handleDeleteListing = async (listingId) => {
    if (!confirm('Delete this listing?')) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/admin/content', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ 
          contentId: listingId, 
          contentType: 'trade' 
        })
      });
      
      if (response.ok) {
        setListings(listings.filter(l => l.id !== listingId));
        alert('Listing deleted');
      } else {
        alert('Failed to delete listing');
      }
    } catch (err) {
      alert('Error deleting listing');
    } finally {
      setLoading(false);
    }
  };

  // Delete testimonial
  const handleDeleteTestimonial = async (testimonialId) => {
    if (!confirm('Delete this testimonial?')) return;
    
    try {
      setLoading(true);
      const response = await fetch('/api/admin/testimonials', {
        method: 'DELETE',
        headers: getAuthHeaders(),
        body: JSON.stringify({ testimonialId })
      });
      
      if (response.ok) {
        setTestimonials(testimonials.filter(t => t.id !== testimonialId));
        alert('Testimonial deleted');
      } else {
        alert('Failed to delete testimonial');
      }
    } catch (err) {
      alert('Error deleting testimonial');
    } finally {
      setLoading(false);
    }
  };

  // Login form
  if (!user) {
    return <AdminLogin onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
              <p className="text-gray-600">Welcome, {user.username || user.email}</p>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-6 mb-6">
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Users</p>
                <p className="text-3xl font-bold text-blue-600">{users.length}</p>
              </div>
              <Users size={32} className="text-blue-500" />
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Total Listings</p>
                <p className="text-3xl font-bold text-green-600">{listings.length}</p>
              </div>
              <Package size={32} className="text-green-500" />
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm">Testimonials</p>
                <p className="text-3xl font-bold text-purple-600">{testimonials.length}</p>
              </div>
              <MessageSquare size={32} className="text-purple-500" />
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mb-6">
          <button
            onClick={() => setActiveTab('users')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              activeTab === 'users'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Users size={18} />
            Users
          </button>
          <button
            onClick={() => setActiveTab('listings')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              activeTab === 'listings'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <Package size={18} />
            Listings
          </button>
          <button
            onClick={() => setActiveTab('testimonials')}
            className={`flex items-center gap-2 px-6 py-3 rounded-lg font-medium ${
              activeTab === 'testimonials'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            <MessageSquare size={18} />
            Testimonials
          </button>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Users</h2>
              <button
                onClick={fetchUsers}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : users.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No users found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map(userItem => (
                      <tr key={userItem.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{userItem.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{userItem.name || userItem.username}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{userItem.email}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                          }`}>
                            {userItem.role || 'user'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          {userItem.role !== 'admin' && (
                            <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="flex items-center gap-1 text-red-600 hover:text-red-900"
                            >
                              <Trash2 size={16} />
                              Delete
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Listings Tab */}
        {activeTab === 'listings' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Listings</h2>
              <button
                onClick={fetchListings}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : listings.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No listings found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Created</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {listings.map(listing => (
                      <tr key={listing.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{listing.id}</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="max-w-xs truncate">{listing.description || 'No description'}</div>
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {listing.seller_username || listing.buyer_username || 'Unknown'}
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            listing.status === 'completed' ? 'bg-green-100 text-green-800' :
                            listing.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                            {listing.status || 'active'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {listing.created_at ? new Date(listing.created_at).toLocaleDateString() : 'N/A'}
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteListing(listing.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* Testimonials Tab */}
        {activeTab === 'testimonials' && (
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-4 bg-gray-50 border-b flex justify-between items-center">
              <h2 className="text-xl font-bold">Testimonials</h2>
              <button
                onClick={fetchTestimonials}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw size={16} />
                Refresh
              </button>
            </div>

            {loading ? (
              <div className="p-8 text-center">Loading...</div>
            ) : testimonials.length === 0 ? (
              <div className="p-8 text-center text-gray-500">No testimonials found</div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Name</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Text</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {testimonials.map(testimonial => (
                      <tr key={testimonial.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 text-sm">{testimonial.id}</td>
                        <td className="px-6 py-4 text-sm font-medium">{testimonial.name}</td>
                        <td className="px-6 py-4 text-sm">{testimonial.location}</td>
                        <td className="px-6 py-4 text-sm">{testimonial.rating} ⭐</td>
                        <td className="px-6 py-4 text-sm">
                          <div className="max-w-xs truncate">{testimonial.text}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-1">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              testimonial.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                            }`}>
                              {testimonial.isActive ? 'Active' : 'Inactive'}
                            </span>
                            {testimonial.isVerified && (
                              <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
                                Verified
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => handleDeleteTestimonial(testimonial.id)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-900"
                          >
                            <Trash2 size={16} />
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Simple Admin Login Component
const AdminLogin = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const result = await response.json();

      // Handle your API structure: { success, token, user }
      if (result.success && result.user?.role === 'admin') {
        localStorage.setItem('adminToken', result.token);
        localStorage.setItem('adminUser', JSON.stringify(result.user));
        onLoginSuccess(result.user);
      } else if (result.success) {
        setError('Admin access required');
      } else {
        setError(result.error || 'Login failed');
      }
    } catch (err) {
      setError('Login failed: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h1 className="text-2xl font-bold text-center mb-6">Admin Login</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="admin@example.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Your password"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AdminDashboard;