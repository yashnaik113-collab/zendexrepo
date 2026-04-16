const UserCard = ({ user }) => {
  return (
    <div className="bg-dark-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:transform hover:scale-105 border border-dark-700">
      <div className="flex items-center space-x-4">
        <div className="bg-indigo-600 rounded-full w-12 h-12 flex items-center justify-center">
          <span className="text-white text-lg font-semibold">
            {user.email.charAt(0).toUpperCase()}
          </span>
        </div>
        <div className="flex-1">
          <h3 className="text-white font-medium truncate">{user.email}</h3>
          <p className="text-gray-400 text-sm mt-1">
            Password: {'*'.repeat(6)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserCard;
