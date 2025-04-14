import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, FileText, Calendar } from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.setItem('isLoggedIn', 'false');
    localStorage.removeItem('userRole');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex flex-col">
      <div className="bg-blue-600 text-white py-4 px-6 flex justify-between items-center shadow-md">
        <h1 className="text-2xl font-bold">Admin Panel</h1>
        <button
          onClick={handleLogout}
          className="flex items-center gap-1 bg-white text-blue-700 px-3 py-1 rounded-lg hover:bg-gray-200 transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
      
      <div className="flex flex-grow items-center justify-center">
        <div className="space-y-6 text-center">
          <h2 className="text-4xl font-extrabold text-gray-800 mb-8">
            Welcome to Admin Dashboard
          </h2>

          <button
            // This should navigate to a dedicated route for creating posts
            onClick={() => navigate('/admin-dashboard/create-post')}
            className="bg-green-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-green-600 transition transform hover:scale-105"
          >
            ➕ Create Post
          </button>

          <button
            onClick={() => navigate('/admin-dashboard/verify-posts')}
            className="bg-blue-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-blue-600 transition transform hover:scale-105"
          >
            ✅ Verify Posts
          </button>

          <button
            onClick={() => navigate('/admin-dashboard/view-posts')}
            className="bg-purple-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-purple-600 transition transform hover:scale-105"
          >
            👁️ View Posts
          </button>
          
          <button
            onClick={() => navigate('/admin-dashboard/upload-magazine')}
            className="bg-orange-500 text-white px-8 py-3 rounded-full shadow-lg hover:bg-orange-600 transition transform hover:scale-105"
          >
            <FileText className="w-5 h-5 inline mr-2" />
            Upload Magazine
          </button>
        </div>
      </div>
    </div>
  );
}