import { useState, useEffect } from 'react';
import { usersAPI } from '../services/api';
import UserCard from '../components/UserCard';
import Navbar from '../components/Navbar';

const Dashboard = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await usersAPI.getUsers();
      setUsers(data);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-900">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Manage your users</p>
        </div>

        <div className="bg-dark-800 rounded-xl p-6 mb-8 border border-dark-700">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-semibold text-white">Total Users</h2>
              <p className="text-gray-400 text-sm mt-1">Number of registered users</p>
            </div>
            <div className="text-4xl font-bold text-indigo-500">
              {loading ? '-' : users.length}
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4 mb-6">
            <p className="text-red-400">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
          </div>
        ) : users.length === 0 ? (
          <div className="bg-dark-800 rounded-xl p-12 border border-dark-700 text-center">
            <p className="text-gray-400 text-lg">No users found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((user, index) => (
              <UserCard key={user.id || index} user={user} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
