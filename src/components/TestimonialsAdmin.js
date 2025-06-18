'use client';

import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Eye, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Star, 
  MapPin, 
  Calendar, 
  Award, 
  AlertCircle,
  RefreshCw,
  Filter,
  User,
  MessageSquare
} from 'lucide-react';

const TestimonialsAdmin = ({ getAuthHeaders }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedTestimonial, setSelectedTestimonial] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const itemsPerPage = 20;

  const fetchTestimonials = async (page = 1) => {
    try {
      setLoading(true);
      setError('');
      
      const offset = (page - 1) * itemsPerPage;
      const response = await fetch(
        `/api/admin/testimonials?limit=${itemsPerPage}&offset=${offset}`,
        {
          headers: getAuthHeaders()
        }
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch testimonials');
      }
      
      const data = await response.json();
      setTestimonials(data.testimonials || []);
      setTotalCount(data.pagination?.total || 0);
      setHasMore(data.pagination?.hasMore || false);
    } catch (err) {
      console.error('Error fetching testimonials:', err);
      setError('Failed to load testimonials: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTestimonials(currentPage);
  }, [currentPage]);

  const handleAction = async (testimonialId, action, actionData = {}) => {
    try {
      setActionLoading(true);
      setError('');
      
      let response;
      
      switch (action) {
        case 'verify':
          response = await fetch('/api/admin/testimonials', {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              testimonialId,
              isVerified: true,
              ...actionData
            })
          });
          break;
          
        case 'unverify':
          response = await fetch('/api/admin/testimonials', {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              testimonialId,
              isVerified: false,
              ...actionData
            })
          });
          break;
          
        case 'activate':
          response = await fetch('/api/admin/testimonials', {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              testimonialId,
              isActive: true,
              ...actionData
            })
          });
          break;
          
        case 'deactivate':
          response = await fetch('/api/admin/testimonials', {
            method: 'PATCH',
            headers: getAuthHeaders(),
            body: JSON.stringify({
              testimonialId,
              isActive: false,
              ...actionData
            })
          });
          break;
          
        case 'delete':
          response = await fetch('/api/admin/testimonials', {
            method: 'DELETE',
            headers: getAuthHeaders(),
            body: JSON.stringify({ testimonialId })
          });
          break;
          
        default:
          throw new Error('Invalid action');
      }
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Action failed');
      }
      
      // Refresh testimonials after successful action
      await fetchTestimonials(currentPage);
      setShowModal(false);
      setSelectedTestimonial(null);
      
    } catch (err) {
      console.error('Error performing action:', err);
      setError('Failed to perform action: ' + err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTestimonials = testimonials.filter(testimonial => {
    const matchesSearch = [testimonial.name, testimonial.location, testimonial.text]
      .some(field => field?.toLowerCase().includes(searchTerm.toLowerCase()));
    
    let matchesFilter = true;
    switch (filterStatus) {
      case 'verified':
        matchesFilter = testimonial.isVerified === true;
        break;
      case 'unverified':
        matchesFilter = testimonial.isVerified === false;
        break;
      case 'active':
        matchesFilter = testimonial.isActive === true;
        break;
      case 'inactive':
        matchesFilter = testimonial.isActive === false;
        break;
      case 'all':
      default:
        matchesFilter = true;
    }
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleString();
  };

  const TestimonialModal = () => {
    if (!selectedTestimonial) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
              <h3 className="text-xl font-bold text-gray-900">Testimonial Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XCircle size={24} />
              </button>
            </div>

            {/* Testimonial Card Preview */}
            <div className={`bg-gradient-to-br ${selectedTestimonial.bgColor} rounded-lg p-6 mb-6 border border-gray-200`}>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center text-xl shadow-md mr-3">
                    {selectedTestimonial.avatar}
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800">{selectedTestimonial.name}</h4>
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="w-4 h-4 mr-1" />
                      {selectedTestimonial.location}
                    </div>
                  </div>
                </div>
                {selectedTestimonial.isVerified && (
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded-full">
                    <Award className="w-4 h-4 text-green-600 mr-1" />
                    <span className="text-xs font-medium text-green-700">Verified</span>
                  </div>
                )}
              </div>

              <p className="text-gray-700 italic mb-4">
                {selectedTestimonial.text}
              </p>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="flex text-yellow-500">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star 
                        key={star}
                        className={`w-4 h-4 ${star <= selectedTestimonial.rating ? 'fill-current' : ''}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600 ml-2">
                    ({selectedTestimonial.rating}/5)
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-1" />
                  {formatDate(selectedTestimonial.createdAt)}
                </div>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-3 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-500">Status</label>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedTestimonial.isActive 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {selectedTestimonial.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      selectedTestimonial.isVerified 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedTestimonial.isVerified ? 'Verified' : 'Unverified'}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-500">ID</label>
                  <p className="text-sm text-gray-900 mt-1">#{selectedTestimonial.id}</p>
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-500">Created At</label>
                <p className="text-sm text-gray-900 mt-1">{formatDate(selectedTestimonial.createdAt)}</p>
              </div>
              
              {selectedTestimonial.updatedAt && (
                <div>
                  <label className="text-sm font-medium text-gray-500">Last Updated</label>
                  <p className="text-sm text-gray-900 mt-1">{formatDate(selectedTestimonial.updatedAt)}</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-wrap gap-2">
              {!selectedTestimonial.isVerified ? (
                <button
                  onClick={() => handleAction(selectedTestimonial.id, 'verify')}
                  disabled={actionLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  <span>Verify</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction(selectedTestimonial.id, 'unverify')}
                  disabled={actionLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-yellow-600 text-white rounded hover:bg-yellow-700 transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  <span>Unverify</span>
                </button>
              )}

              {selectedTestimonial.isActive ? (
                <button
                  onClick={() => handleAction(selectedTestimonial.id, 'deactivate')}
                  disabled={actionLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-orange-600 text-white rounded hover:bg-orange-700 transition-colors disabled:opacity-50"
                >
                  <XCircle size={16} />
                  <span>Deactivate</span>
                </button>
              ) : (
                <button
                  onClick={() => handleAction(selectedTestimonial.id, 'activate')}
                  disabled={actionLoading}
                  className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                  <CheckCircle size={16} />
                  <span>Activate</span>
                </button>
              )}

              <button
                onClick={() => {
                  if (confirm('Are you sure you want to delete this testimonial? This action cannot be undone.')) {
                    handleAction(selectedTestimonial.id, 'delete');
                  }
                }}
                disabled={actionLoading}
                className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
              >
                <Trash2 size={16} />
                <span>Delete</span>
              </button>

              <button
                onClick={() => setShowModal(false)}
                className="flex items-center space-x-1 px-3 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors"
              >
                <span>Close</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Testimonials Management</h2>
          <p className="text-gray-600">Manage customer testimonials and reviews</p>
        </div>
        <button
          onClick={() => fetchTestimonials(currentPage)}
          disabled={loading}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
      </div>

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
          <AlertCircle size={20} className="mr-2" />
          <span>{error}</span>
          <button 
            onClick={() => setError('')} 
            className="ml-auto text-red-500 hover:text-red-700"
          >
            ×
          </button>
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <MessageSquare className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Total</p>
              <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Verified</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => t.isVerified).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Eye className="w-8 h-8 text-blue-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Active</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.filter(t => t.isActive).length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="flex items-center">
            <Star className="w-8 h-8 text-yellow-600 mr-3" />
            <div>
              <p className="text-sm font-medium text-gray-500">Avg Rating</p>
              <p className="text-2xl font-bold text-gray-900">
                {testimonials.length > 0 
                  ? (testimonials.reduce((sum, t) => sum + t.rating, 0) / testimonials.length).toFixed(1)
                  : '0.0'
                }
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search size={20} className="absolute left-3 top-2.5 text-gray-400" />
            <input
              type="text"
              placeholder="Search testimonials..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="verified">Verified</option>
              <option value="unverified">Unverified</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && (
        <div className="text-center py-8">
          <RefreshCw size={24} className="animate-spin mx-auto mb-2 text-blue-600" />
          <p className="text-gray-600">Loading testimonials...</p>
        </div>
      )}

      {/* Empty State */}
      {!loading && filteredTestimonials.length === 0 && (
        <div className="bg-gray-50 p-8 rounded-lg text-center">
          <MessageSquare size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">No Testimonials Found</h3>
          <p className="text-gray-500">
            {searchTerm || filterStatus !== 'all' 
              ? 'No testimonials match your current filters.'
              : 'No testimonials have been submitted yet.'
            }
          </p>
        </div>
      )}

      {/* Testimonials Table */}
      {!loading && filteredTestimonials.length > 0 && (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Customer
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Testimonial
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTestimonials.map((testimonial) => (
                  <tr key={testimonial.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm mr-3">
                          {testimonial.avatar}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {testimonial.name}
                          </div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1" />
                            {testimonial.location}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex text-yellow-400">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star 
                              key={star}
                              size={16}
                              className={star <= testimonial.rating ? 'fill-current' : ''}
                            />
                          ))}
                        </div>
                        <span className="ml-1 text-sm text-gray-600">
                          {testimonial.rating}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 max-w-xs truncate">
                        {testimonial.text}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-1">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          testimonial.isActive 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {testimonial.isActive ? 'Active' : 'Inactive'}
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          testimonial.isVerified 
                            ? 'bg-blue-100 text-blue-800' 
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {testimonial.isVerified ? 'Verified' : 'Unverified'}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(testimonial.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            setSelectedTestimonial(testimonial);
                            setShowModal(true);
                          }}
                          className="text-blue-600 hover:text-blue-900 transition-colors flex items-center space-x-1"
                          title="View Details"
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </button>
                        
                        {!testimonial.isVerified && (
                          <button
                            onClick={() => handleAction(testimonial.id, 'verify')}
                            disabled={actionLoading}
                            className="text-green-600 hover:text-green-900 transition-colors flex items-center space-x-1 disabled:opacity-50"
                            title="Verify Testimonial"
                          >
                            <CheckCircle size={16} />
                            <span>Verify</span>
                          </button>
                        )}
                        
                        <button
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this testimonial?')) {
                              handleAction(testimonial.id, 'delete');
                            }
                          }}
                          disabled={actionLoading}
                          className="text-red-600 hover:text-red-900 transition-colors flex items-center space-x-1 disabled:opacity-50"
                          title="Delete Testimonial"
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

      {/* Pagination */}
      {totalCount > itemsPerPage && (
        <div className="flex items-center justify-between">
          <div className="text-sm text-gray-700">
            Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, totalCount)} of {totalCount} testimonials
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
              disabled={currentPage === 1}
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            <span className="px-3 py-2 text-sm bg-blue-600 text-white rounded">
              {currentPage}
            </span>
            <button
              onClick={() => setCurrentPage(prev => prev + 1)}
              disabled={!hasMore}
              className="px-3 py-2 text-sm border rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}

      {/* Modal */}
      {showModal && <TestimonialModal />}
    </div>
  );
};

export default TestimonialsAdmin;