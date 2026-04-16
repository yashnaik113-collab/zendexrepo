import React from 'react';

const UserCard = ({ user }) => {
  const maskPassword = (password) => {
    if (!password) return '******';
    return '*'.repeat(Math.min(password.length, 8));
  };

  return (
    <div className="bg-gray-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 p-6 border border-gray-700 hover:border-blue-500 group">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
            <span className="text-white font-bold text-lg">
              {user.email?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-200 truncate">
            {user.email || user.username || 'No email provided'}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            Password: <span className="font-mono text-gray-400">{maskPassword(user.password)}</span>
          </p>
        </div>
      </div>
      <div className="mt-4 pt-4 border-t border-gray-700">
        <div className="flex items-center justify-between">
          <span className="text-xs text-gray-500">User ID</span>
          <span className="text-xs text-gray-400 font-mono">#{user.id || 'N/A'}</span>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
