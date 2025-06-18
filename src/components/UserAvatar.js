// components/UserAvatar.jsx
'use client';

import Image from 'next/image';

export default function UserAvatar({ user, onClick }) {
  const initials = user.username ? user.username.slice(0, 2).toUpperCase() : 'U';
  
  return (
    <button
      onClick={onClick}
      className="flex items-center space-x-2 bg-green-50 hover:bg-green-100 rounded-full px-3 py-2 transition-colors duration-200"
    >
      <div className="w-8 h-8 bg-gradient-to-r from-green-500 to-green-600 rounded-full flex items-center justify-center text-white text-sm font-semibold">
        {user.avatar ? (
          <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full" />
        ) : (
          initials
        )}
      </div>
      <span className="text-gray-700 font-medium">{user.username}</span>
      <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
      </svg>
    </button>
  );
}