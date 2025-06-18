'use client';

import React from 'react';
import { Users, BarChart3, FileText, Shield, ShieldOff, Trash2, Eye } from 'lucide-react';

export const TabButton = ({ id, label, icon: Icon, isActive, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
      isActive 
        ? 'bg-blue-600 text-white' 
        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
    }`}
  >
    <Icon size={18} />
    <span>{label}</span>
  </button>
);

export const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-6 rounded-lg shadow-md border-l-4" style={{ borderLeftColor: color }}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-600 text-sm">{title}</p>
        <p className="text-2xl font-bold" style={{ color }}>{value}</p>
      </div>
      <Icon size={24} style={{ color }} />
    </div>
  </div>
);

export const BanModal = ({ 
  banningUser, 
  banForm, 
  setBanForm, 
  handleBanUser, 
  setShowBanModal 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-96 max-h-screen overflow-y-auto">
      <h3 className="text-lg font-bold mb-4 text-red-600">
        Ban User: {banningUser?.name || banningUser?.username}
      </h3>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Reason *</label>
          <textarea
            value={banForm.reason}
            onChange={(e) => setBanForm({ ...banForm, reason: e.target.value })}
            placeholder="Enter reason for ban..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
            rows={3}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Ban Type</label>
          <select 
            value={banForm.ban_type}
            onChange={(e) => setBanForm({ ...banForm, ban_type: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="manual">Manual Ban</option>
            <option value="violation">Policy Violation</option>
            <option value="spam">Spam</option>
            <option value="harassment">Harassment</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Expires At (Optional)</label>
          <input
            type="datetime-local"
            value={banForm.expires_at}
            onChange={(e) => setBanForm({ ...banForm, expires_at: e.target.value })}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          <p className="text-sm text-gray-500 mt-1">Leave empty for permanent ban</p>
        </div>
      </div>
      <div className="flex justify-end space-x-2 mt-6">
        <button
          onClick={() => {
            setShowBanModal(false);
            setBanForm({ reason: '', ban_type: 'manual', expires_at: '' });
          }}
          className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleBanUser}
          disabled={!banForm.reason}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors disabled:opacity-50"
        >
          Ban User
        </button>
      </div>
    </div>
  </div>
);

export const ContentModal = ({ 
  selectedContent, 
  setShowContentModal, 
  handleDeleteContent 
}) => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg w-full max-w-2xl max-h-screen overflow-y-auto">
      <div className="flex justify-between items-start mb-4">
        <h3 className="text-xl font-bold">
          {selectedContent?.type ? `${selectedContent.type.charAt(0).toUpperCase() + selectedContent.type.slice(1)} Details` : 'Content Details'}
        </h3>
        <button
          onClick={() => setShowContentModal(false)}
          className="text-gray-500 hover:text-gray-700"
        >
          &times;
        </button>
      </div>

      {selectedContent && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold">ID</h4>
              <p>{selectedContent.id}</p>
            </div>
            <div>
              <h4 className="font-semibold">Status</h4>
              <p className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                selectedContent.status === 'completed' 
                  ? 'bg-green-100 text-green-800'
                  : selectedContent.status === 'cancelled'
                  ? 'bg-red-100 text-red-800'
                  : 'bg-blue-100 text-blue-800'
              }`}>
                {selectedContent.status || 'active'}
              </p>
            </div>
            <div>
              <h4 className="font-semibold">Created At</h4>
              <p>{new Date(selectedContent.created_at).toLocaleString()}</p>
            </div>
            <div>
              <h4 className="font-semibold">Updated At</h4>
              <p>{selectedContent.updated_at ? new Date(selectedContent.updated_at).toLocaleString() : 'N/A'}</p>
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Participants</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
              {selectedContent.buyer_username && (
                <div>
                  <h5 className="text-sm text-gray-600">Buyer</h5>
                  <p>{selectedContent.buyer_username}</p>
                </div>
              )}
              {selectedContent.seller_username && (
                <div>
                  <h5 className="text-sm text-gray-600">Seller</h5>
                  <p>{selectedContent.seller_username}</p>
                </div>
              )}
            </div>
          </div>

          <div>
            <h4 className="font-semibold">Description</h4>
            <p className="mt-2 whitespace-pre-line">{selectedContent.description || 'No description available'}</p>
          </div>

          {selectedContent.amount && (
            <div>
              <h4 className="font-semibold">Amount</h4>
              <p>{selectedContent.amount}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              onClick={() => {
                if (confirm(`Are you sure you want to delete this ${selectedContent.type || 'content'}?`)) {
                  handleDeleteContent(selectedContent.id, selectedContent.type || 'trade');
                  setShowContentModal(false);
                }
              }}
              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
            >
              Delete Content
            </button>
          </div>
        </div>
      )}
    </div>
  </div>
);