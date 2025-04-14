import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { BookOpen, Home, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext'; // Import context

export default function Header() {
  const { isLoggedIn, userRole, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="bg-white shadow-md">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-blue-600" />
          </Link>
          <h1 className="text-2xl font-bold text-center text-gray-800">
            University Magazine Portal
          </h1>
          <div className="flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-600 hover:text-blue-600 flex items-center space-x-1"
            >
              <Home className="h-5 w-5" />
              <span>Home</span>
            </Link>
            {isLoggedIn ? (
              <>
                {userRole === 'student' && (
                  <>
                    <Link
                      to="/create-post"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      Create Post
                    </Link>
                    <Link
                      to="/posts"
                      className="text-gray-600 hover:text-blue-600"
                    >
                      Posts
                    </Link>
                  </>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 flex items-center space-x-1"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-1"
              >
                <LogIn className="h-5 w-5" />
                <span>Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
