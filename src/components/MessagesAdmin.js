import { useState, useEffect } from 'react';
import { MessageSquare, Trash2, RefreshCw, Clock } from 'lucide-react';

const MessagesAdmin = ({ getAuthHeaders }) => {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const fetchMessages = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/messages', {
        headers: getAuthHeaders()
      });
      const data = await response.json();
      
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      
      setMessages(data.messages || []);
    } catch (err) {
      setError(err.message);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  };

  const deleteMessage = async (id) => {
    if (!confirm('Delete this message?')) return;
    
    try {
      const response = await fetch(`/api/admin/messages/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders()
      });
      
      if (!response.ok) throw new Error('Failed to delete');
      
      setMessages(messages.filter(m => m.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const formatTime = (timestamp) => {
    if (!timestamp) return 'N/A';
    const date = new Date(timestamp);
    const diff = Date.now() - date;
    
    if (diff < 3600000) return `${Math.floor(diff / 60000)}m ago`;
    if (diff < 86400000) return `${Math.floor(diff / 3600000)}h ago`;
    return date.toLocaleDateString();
  };

  useEffect(() => { fetchMessages(); }, []);

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Messages</h2>
        <button
          onClick={fetchMessages}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
        >
          <RefreshCw size={16} className={loading ? 'animate-spin' : ''} />
          Refresh
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        {loading ? (
          <div className="p-8 text-center">Loading...</div>
        ) : messages.length === 0 ? (
          <div className="p-8 text-center text-gray-500">No messages found</div>
        ) : (
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Message</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sender</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Trade</th>
                <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Time</th>
                <th className="px-4 py-3 text-right text-sm font-medium text-gray-500">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {messages.map((msg) => (
                <tr key={msg.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 max-w-xs truncate text-sm text-gray-900">
                    {msg.message || 'No content'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {msg.sender_name || msg.sender_username || 'Unknown'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-900">
                    {msg.trade_id ? `#${msg.trade_id}` : 'N/A'}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock size={14} />
                      {formatTime(msg.created_at)}
                    </div>
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => deleteMessage(msg.id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default MessagesAdmin;