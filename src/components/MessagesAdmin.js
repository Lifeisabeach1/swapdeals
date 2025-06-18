'use client';

import React, { useState, useEffect } from 'react';
import { 
  MessageSquare, 
  Search, 
  Trash2, 
  Eye, 
  RefreshCw, 
  User, 
  Calendar, 
  Filter,
  X,
  AlertTriangle,
  Clock
} from 'lucide-react';

const MessagesAdmin = ({ getAuthHeaders }) => {
  // State management
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterTrade, setFilterTrade] = useState('all');
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState({ show: false, messageId: null });
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [messagesPerPage] = useState(20);

  // Fetch messages from API
  const fetchMessages = async () => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch('/api/admin/messages', {
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || `Request failed (${response.status})`);
      }
      
      setMessages(data.messages || []);
    } catch (err) {
      setError('Failed to load messages: ' + err.message);
      console.error('Error fetching messages:', err);
    } finally {
      setLoading(false);
    }
  };

  // Delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      setLoading(true);
      setError('');
      
      const response = await fetch(`/api/admin/messages/${messageId}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete message');
      }
      
      // Remove message from local state
      setMessages(prev => prev.filter(msg => msg.id !== messageId));
      setDeleteConfirm({ show: false, messageId: null });
      
      // Close modal if the deleted message was being viewed
      if (selectedMessage?.id === messageId) {
        setShowMessageModal(false);
        setSelectedMessage(null);
      }
      
    } catch (err) {
      setError('Failed to delete message: ' + err.message);
      console.error('Error deleting message:', err);
    } finally {
      setLoading(false);
    }
  };

  // View message details
  const handleViewMessage = (message) => {
    setSelectedMessage(message);
    setShowMessageModal(true);
  };

  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    
    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return minutes < 1 ? 'Just now' : `${minutes}m ago`;
    }
    
    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }
    
    // More than 24 hours
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Get unique trades for filter
  const uniqueTrades = [...new Set(messages.map(msg => msg.trade_id))].filter(Boolean);

  // Filter messages
  const filteredMessages = messages.filter(message => {
    const matchesSearch = [
      message.message,
      message.sender_name,
      message.sender_username,
      message.trade_id?.toString()
    ].some(field => 
      field?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'read' && message.read_at) ||
                         (filterStatus === 'unread' && !message.read_at) ||
                         (filterStatus === 'deleted' && message.is_deleted);
    
    const matchesTrade = filterTrade === 'all' || 
                        message.trade_id?.toString() === filterTrade;
    
    return matchesSearch && matchesStatus && matchesTrade;
  });

  // Pagination
  const indexOfLastMessage = currentPage * messagesPerPage;
  const indexOfFirstMessage = indexOfLastMessage - messagesPerPage;
  const currentMessages = filteredMessages.slice(indexOfFirstMessage, indexOfLastMessage);
  const totalPages = Math.ceil(filteredMessages.length / messagesPerPage);

  // Load data on component mount
  useEffect(() => {
    fetchMessages();
  }, []);

  // Error Alert Component
  const ErrorAlert = () => error && (
    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle size={20} className="mr-2" />
          <span>{error}</span>
        </div>
        <button 
          onClick={() => setError('')} 
          className="text-red-500 hover:text-red-700"
        >
          <X size={16} />
        </button>
      </div>
    </div>
  );

  // Loading Spinner
  const LoadingSpinner = () => loading && (
    <div className="bg-blue-50 p-4 rounded-lg text-center mb-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
      <p className="mt-2 text-blue-700">Loading messages...</p>
    </div>
  );

  // Message Modal Component
  const MessageModal = () => {
    if (!showMessageModal || !selectedMessage) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Message Details</h3>
              <button
                onClick={() => setShowMessageModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
          </div>
          
          <div className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-500">Message ID</label>
                <p className="text-gray-900">{selectedMessage.id}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Trade ID</label>
                <p className="text-gray-900">{selectedMessage.trade_id || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sender</label>
                <p className="text-gray-900">
                  {selectedMessage.sender_name || selectedMessage.sender_username || 'Unknown'}
                </p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Status</label>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  selectedMessage.read_at 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {selectedMessage.read_at ? 'Read' : 'Unread'}
                </span>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500">Sent At</label>
                <p className="text-gray-900">{formatTimestamp(selectedMessage.created_at)}</p>
              </div>
              {selectedMessage.read_at && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Read At</label>
                  <p className="text-gray-900">{formatTimestamp(selectedMessage.read_at)}</p>
                </div>
              )}
            </div>
            
            <div>
              <label className="text-sm font-medium text-gray-500">Message Content</label>
              <div className="mt-2 p-4 bg-gray-50 rounded-lg">
                <p className="text-gray-900 whitespace-pre-wrap">
                  {selectedMessage.message || 'No content available'}
                </p>
              </div>
            </div>
          </div>
          
          <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
            <button
              onClick={() => setShowMessageModal(false)}
              className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              Close
            </button>
            <button
              onClick={() => {
                setDeleteConfirm({ show: true, messageId: selectedMessage.id });
                setShowMessageModal(false);
              }}
              className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2"
            >
              <Trash2 size={16} />
              <span>Delete Message</span>
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Delete Confirmation Modal
  const DeleteConfirmModal = () => {
    if (!deleteConfirm.show) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
          <div className="p-6">
            <div className="flex items-center mb-4">
              <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                <AlertTriangle className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Delete Message</h3>
                <p className="text-gray-600">This action cannot be undone.</p>
              </div>
            </div>
            
            <p className="text-gray-700 mb-6">
              Are you sure you want to permanently delete this message? This will remove it from the database and cannot be recovered.
            </p>
            
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeleteConfirm({ show: false, messageId: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                disabled={loading}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteMessage(deleteConfirm.messageId)}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors flex items-center space-x-2"
                disabled={loading}
              >
                {loading ? (
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                ) : (
                  <Trash2 size={16} />
                )}
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Pagination Component
  const Pagination = () => {
    if (totalPages <= 1) return null;

    return (
      <div className="flex items-center justify-between px-6 py-3 bg-white border-t border-gray-200">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Previous
          </button>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{indexOfFirstMessage + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastMessage, filteredMessages.length)}
              </span>{' '}
              of <span className="font-medium">{filteredMessages.length}</span> messages
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              {[...Array(totalPages)].map((_, index) => {
                const page = index + 1;
                if (
                  page === 1 ||
                  page === totalPages ||
                  (page >= currentPage - 1 && page <= currentPage + 1)
                ) {
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  );
                } else if (
                  page === currentPage - 2 ||
                  page === currentPage + 2
                ) {
                  return <span key={page} className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">...</span>;
                }
                return null;
              })}
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <ErrorAlert />
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Messages Management</h2>
          <p className="text-gray-600">View and manage all trade messages</p>
        </div>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search messages, users, trade IDs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Status</option>
            <option value="read">Read</option>
            <option value="unread">Unread</option>
            <option value="deleted">Deleted</option>
          </select>

          {/* Trade Filter */}
          <select
            value={filterTrade}
            onChange={(e) => setFilterTrade(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Trades</option>
            {uniqueTrades.map(tradeId => (
              <option key={tradeId} value={tradeId}>Trade #{tradeId}</option>
            ))}
          </select>
        </div>
      </div>

      <LoadingSpinner />

      {/* Messages Table */}
      {!loading && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {currentMessages.length === 0 ? (
            <div className="p-8 text-center">
              <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-600 mb-2">No Messages Found</h3>
              <p className="text-gray-500">No messages match your current filters.</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Message
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Sender
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Trade
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {currentMessages.map((message) => (
                      <tr key={message.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="max-w-xs truncate text-sm text-gray-900">
                            {message.message || 'No content'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center mr-3">
                              <User size={16} className="text-gray-600" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900">
                                {message.sender_name || message.sender_username || 'Unknown'}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {message.sender_id}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {message.trade_id ? `#${message.trade_id}` : 'N/A'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            message.is_deleted
                              ? 'bg-red-100 text-red-800'
                              : message.read_at 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {message.is_deleted ? 'Deleted' : message.read_at ? 'Read' : 'Unread'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {formatTimestamp(message.created_at)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleViewMessage(message)}
                              className="text-blue-600 hover:text-blue-900 transition-colors flex items-center space-x-1"
                              title="View Message"
                            >
                              <Eye size={16} />
                              <span>View</span>
                            </button>
                            <button
                              onClick={() => setDeleteConfirm({ show: true, messageId: message.id })}
                              className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1"
                              title="Delete Message"
                              disabled={loading}
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
              <Pagination />
            </>
          )}
        </div>
      )}

      {/* Modals */}
      <MessageModal />
      <DeleteConfirmModal />
    </div>
  );
};

export default MessagesAdmin;