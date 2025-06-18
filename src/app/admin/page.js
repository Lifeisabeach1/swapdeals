'use client';

import React, { useState, useEffect } from 'react';
import { Users, Settings, BarChart3, FileText, Search, Shield, LogOut, Trash2, Eye, ShieldOff, Package, MessageSquare } from 'lucide-react';
import AdminLogin from '@/components/AdminLogin';
import { TabButton, StatCard, BanModal, ContentModal } from '@/components/AdminComponents';
import TradeListingsAdmin from '@/components/TradeListingsAdmin';
import TestimonialsAdmin from '@/components/TestimonialsAdmin';
import MessagesAdmin from '@/components/MessagesAdmin';

const AdminDashboard = () => {
  // State management
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState({ users: [], content: [], bans: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Ban modal state
  const [showBanModal, setShowBanModal] = useState(false);
  const [banningUser, setBanningUser] = useState(null);
  const [banForm, setBanForm] = useState({ reason: '', ban_type: 'manual', expires_at: '' });
  
  // Search and filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [contentSearchTerm, setContentSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [contentFilter, setContentFilter] = useState('all');
  
  // Content modal state
  const [selectedContent, setSelectedContent] = useState(null);
  const [showContentModal, setShowContentModal] = useState(false);

  // Authentication check
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    const userData = localStorage.getItem('adminUser');
    
    if (token && userData) {
      try {
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role === 'admin') {
          setUser(parsedUser);
        } else {
          handleLogout();
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

  // Generic API call handler
  const apiCall = async (url, options = {}) => {
    const response = await fetch(url, {
      headers: getAuthHeaders(),
      ...options
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      if (response.status === 401) {
        handleLogout();
        return null;
      }
      throw new Error(data.error || `Request failed (${response.status})`);
    }
    
    return data;
  };

  // Data fetching functions
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await apiCall('/api/admin/users');
      if (result) setData(prev => ({ ...prev, users: result.users || [] }));
    } catch (err) {
      setError('Failed to load users: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchContent = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await apiCall('/api/admin/content');
      if (result) setData(prev => ({ ...prev, content: result.content || result.data || [] }));
    } catch (err) {
      setError('Failed to load content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchBans = async () => {
    try {
      const result = await apiCall('/api/admin/bans');
      if (result) setData(prev => ({ ...prev, bans: result.data || [] }));
    } catch (err) {
      setError('Failed to load bans: ' + err.message);
    }
  };

  const fetchAllData = () => Promise.all([fetchUsers(), fetchContent(), fetchBans()]);

  useEffect(() => {
    if (user) fetchAllData();
  }, [user]);

  // Action handlers
  const handleBanUser = async () => {
    if (!banForm.reason || !banningUser) {
      setError('Please provide a reason for the ban');
      return;
    }
    
    try {
      setLoading(true);
      setError('');
      
      await apiCall('/api/admin/bans', {
        method: 'POST',
        body: JSON.stringify({
          user_id: banningUser.id,
          reason: banForm.reason,
          ban_type: banForm.ban_type,
          expires_at: banForm.expires_at || null
        })
      });

      setShowBanModal(false);
      setBanningUser(null);
      setBanForm({ reason: '', ban_type: 'manual', expires_at: '' });
      
      await Promise.all([fetchUsers(), fetchBans()]);
      alert('User banned successfully');
    } catch (err) {
      setError('Failed to ban user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleUnbanUser = async (userId) => {
    if (!confirm('Are you sure you want to unban this user?')) return;
    
    try {
      setLoading(true);
      setError('');
      
      await apiCall(`/api/admin/bans/${userId}`, { method: 'DELETE' });
      await Promise.all([fetchUsers(), fetchBans()]);
      alert('User unbanned successfully');
    } catch (err) {
      setError('Failed to unban user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user? This action cannot be undone and will delete all their trade listings.')) return;
    
    try {
      setLoading(true);
      setError('');
      
      await apiCall(`/api/admin/users/${userId}`, { method: 'DELETE' });
      await fetchAllData();
      alert('User deleted successfully');
    } catch (err) {
      setError('Failed to delete user: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteContent = async (contentId, contentType = 'trade') => {
    if (!confirm(`Are you sure you want to delete this ${contentType}? This action cannot be undone.`)) return;
    
    try {
      setLoading(true);
      setError('');
      
      await apiCall('/api/admin/content', {
        method: 'DELETE',
        body: JSON.stringify({ contentId, contentType })
      });

      setShowContentModal(false);
      setSelectedContent(null);
      await fetchContent();
      alert('Content deleted successfully');
    } catch (err) {
      setError('Failed to delete content: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleViewContent = (item) => {
    setSelectedContent(item);
    setShowContentModal(true);
  };

  // Helper functions
  const isUserBanned = (user) => user.banned === true || user.status === 'banned';

  const stats = {
    totalUsers: data.users.length,
    activeUsers: data.users.filter(u => !isUserBanned(u)).length,
    bannedUsers: data.users.filter(u => isUserBanned(u)).length,
    totalContent: data.content.length,
    publishedContent: data.content.filter(c => c.status === 'published' || c.status === 'completed').length
  };

  const filteredUsers = data.users.filter(user => {
    const matchesSearch = [user.name, user.email, user.username].some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'banned' && isUserBanned(user)) ||
                         (filterStatus === 'active' && !isUserBanned(user));
    return matchesSearch && matchesStatus;
  });

  const filteredContent = data.content.filter(item => {
    const matchesSearch = [item.description, item.buyer_username, item.seller_username, item.id?.toString()]
      .some(field => field?.toLowerCase().includes(contentSearchTerm.toLowerCase()));
    const matchesFilter = contentFilter === 'all' || 
                         (contentFilter === 'completed' && item.status === 'completed') ||
                         (contentFilter === 'active' && (!item.status || item.status === 'active')) ||
                         (contentFilter === 'cancelled' && item.status === 'cancelled');
    return matchesSearch && matchesFilter;
  });

  // Render components
  const ErrorAlert = () => error && (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
      <button onClick={() => setError('')} className="float-right text-red-500 hover:text-red-700">×</button>
      {error}
    </div>
  );

  const LoadingSpinner = () => loading && (
    <div className="bg-blue-50 p-4 rounded-lg text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-blue-700">Loading data...</p>
    </div>
  );

  const RefreshButton = ({ onClick, icon: Icon, text }) => (
    <button
      onClick={onClick}
      disabled={loading}
      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
    >
      <Icon size={16} />
      <span>{text}</span>
    </button>
  );

  const SearchAndFilter = ({ searchValue, onSearchChange, searchPlaceholder, filterValue, onFilterChange, filterOptions }) => (
    <div className="flex flex-col sm:flex-row gap-4">
      <div className="relative flex-1">
        <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchValue}
          onChange={(e) => onSearchChange(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <select
        value={filterValue}
        onChange={(e) => onFilterChange(e.target.value)}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {filterOptions.map(option => (
          <option key={option.value} value={option.value}>{option.label}</option>
        ))}
      </select>
    </div>
  );

  const EmptyState = ({ icon: Icon, title, description }) => (
    <div className="bg-gray-50 p-8 rounded-lg text-center">
      <Icon size={48} className="mx-auto text-gray-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-600 mb-2">{title}</h3>
      <p className="text-gray-500">{description}</p>
    </div>
  );

  const renderOverview = () => (
    <div className="space-y-6">
      <ErrorAlert />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <StatCard title="Total Users" value={stats.totalUsers} icon={Users} color="#3B82F6" />
        <StatCard title="Active Users" value={stats.activeUsers} icon={Users} color="#10B981" />
        <StatCard title="Banned Users" value={stats.bannedUsers} icon={Shield} color="#EF4444" />
        <StatCard title="Total Content" value={stats.totalContent} icon={FileText} color="#F59E0B" />
        <StatCard title="Published Content" value={stats.publishedContent} icon={FileText} color="#8B5CF6" />
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-4">
          <RefreshButton onClick={fetchUsers} icon={Users} text="Refresh Users" />
          <RefreshButton onClick={fetchContent} icon={FileText} text="Refresh Content" />
          <RefreshButton onClick={fetchBans} icon={Shield} text="Refresh Bans" />
        </div>
      </div>

      <LoadingSpinner />
    </div>
  );

  const renderUsers = () => (
    <div className="space-y-6">
      <ErrorAlert />
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">User Management</h2>
        <RefreshButton onClick={fetchUsers} icon={Users} text="Refresh Users" />
      </div>

      <SearchAndFilter
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        searchPlaceholder="Search users..."
        filterValue={filterStatus}
        onFilterChange={setFilterStatus}
        filterOptions={[
          { value: 'all', label: 'All Users' },
          { value: 'active', label: 'Active' },
          { value: 'banned', label: 'Banned' }
        ]}
      />

      {loading ? (
        <div className="text-center py-8">Loading users...</div>
      ) : filteredUsers.length === 0 ? (
        <EmptyState icon={Users} title="No Users Found" description="No users match your current filters." />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredUsers.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {userItem.name || userItem.username || 'Unknown'}
                        </div>
                        <div className="text-sm text-gray-500">{userItem.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                      }`}>
                        {userItem.role || 'user'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        isUserBanned(userItem) ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                      }`}>
                        {isUserBanned(userItem) ? 'Banned' : 'Active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {userItem.created_at ? new Date(userItem.created_at).toLocaleDateString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {userItem.role !== 'admin' && (
                          <>
                            {isUserBanned(userItem) ? (
                              <button
                                onClick={() => handleUnbanUser(userItem.id)}
                                disabled={loading}
                                className="text-green-600 hover:text-green-900 transition-colors flex items-center space-x-1 disabled:opacity-50"
                                title="Unban User"
                              >
                                <ShieldOff size={16} />
                                <span>Unban</span>
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  setBanningUser(userItem);
                                  setShowBanModal(true);
                                }}
                                disabled={loading}
                                className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1 disabled:opacity-50"
                                title="Ban User"
                              >
                                <Shield size={16} />
                                <span>Ban</span>
                              </button>
                            )}
                            <button
                              onClick={() => handleDeleteUser(userItem.id)}
                              className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1"
                              title="Delete User"
                              disabled={loading}
                            >
                              <Trash2 size={16} />
                              <span>Delete</span>
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  const renderContent = () => (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h2 className="text-2xl font-bold">Content Management</h2>
        <RefreshButton onClick={fetchContent} icon={FileText} text="Refresh Content" />
      </div>

      <SearchAndFilter
        searchValue={contentSearchTerm}
        onSearchChange={setContentSearchTerm}
        searchPlaceholder="Search content..."
        filterValue={contentFilter}
        onFilterChange={setContentFilter}
        filterOptions={[
          { value: 'all', label: 'All Content' },
          { value: 'active', label: 'Active' },
          { value: 'completed', label: 'Completed' },
          { value: 'cancelled', label: 'Cancelled' }
        ]}
      />

      {loading ? (
        <div className="text-center py-8">Loading content...</div>
      ) : filteredContent.length === 0 ? (
        <EmptyState icon={FileText} title="No Content Found" description="No content matches your current filters." />
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Details</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Participants</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredContent.map((item) => (
                  <tr 
                    key={item.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => handleViewContent(item)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900 capitalize">
                        {item.type || 'trade'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 line-clamp-2">
                        {item.description || 'No description'}
                      </div>
                      {item.amount && (
                        <div className="text-sm text-gray-500">
                          Amount: {item.amount}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {item.buyer_username && <div>Buyer: {item.buyer_username}</div>}
                        {item.seller_username && <div>Seller: {item.seller_username}</div>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        item.status === 'completed' 
                          ? 'bg-green-100 text-green-800'
                          : item.status === 'cancelled'
                          ? 'bg-red-100 text-red-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}>
                        {item.status || 'active'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.created_at ? new Date(item.created_at).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewContent(item);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors flex items-center space-x-1"
                          title="View Details"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteContent(item.id, item.type || 'trade');
                          }}
                          className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1"
                          title="Delete Content"
                        >
                          <Trash2 size={16} />
                          <span>Delete</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );

  if (!user) {
    return <AdminLogin onLoginSuccess={setUser} />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {user.username}!</p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
          >
            <LogOut size={16} />
            <span>Logout</span>
          </button>
        </div>

        <div className="flex flex-wrap gap-4 mb-8">
          {[
            { id: 'overview', label: 'Overview', icon: BarChart3 },
            { id: 'users', label: 'Users', icon: Users },
            { id: 'trade-listings', label: 'Trade Listings', icon: Package },
            { id: 'messages', label: 'Messages', icon: MessageSquare },
            { id: 'testimonials', label: 'Testimonials', icon: MessageSquare },
            { id: 'content', label: 'Content', icon: FileText },
            { id: 'settings', label: 'Settings', icon: Settings }
          ].map(tab => (
            <TabButton
              key={tab.id}
              id={tab.id}
              label={tab.label}
              icon={tab.icon}
              isActive={activeTab === tab.id}
              onClick={setActiveTab}
            />
          ))}
        </div>

        <div className="min-h-96">
          {activeTab === 'overview' && renderOverview()}
          {activeTab === 'users' && renderUsers()}
          {activeTab === 'trade-listings' && (
            <TradeListingsAdmin getAuthHeaders={getAuthHeaders} />
          )}
          {activeTab === 'messages' && (
            <MessagesAdmin getAuthHeaders={getAuthHeaders} />
          )}
          {activeTab === 'testimonials' && (
            <TestimonialsAdmin getAuthHeaders={getAuthHeaders} />
          )}
          {activeTab === 'content' && renderContent()}
          {activeTab === 'settings' && (
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-4">Settings</h2>
              <p className="text-gray-600">Admin settings panel - customize your preferences here.</p>
            </div>
          )}
        </div>
      </div>

      {showBanModal && (
        <BanModal
          banningUser={banningUser}
          banForm={banForm}
          setBanForm={setBanForm}
          handleBanUser={handleBanUser}
          setShowBanModal={setShowBanModal}
        />
      )}
      {showContentModal && (
        <ContentModal
          selectedContent={selectedContent}
          setShowContentModal={setShowContentModal}
          handleDeleteContent={handleDeleteContent}
        />
      )}
    </div>
  );
};

export default AdminDashboard;