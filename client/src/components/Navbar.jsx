import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const location = useLocation();
  const { currentUser, logout, updatePassword } = useAuth();
  const [showDropdown, setShowDropdown] = useState(false);
  const navigate = useNavigate();

  const isActiveLink = (pathname) => {
    return location.pathname === pathname;
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.log('Logout Error:', error);
    }
  };

  const handlePasswordChange = async () => {
    try {
    const newPassword = prompt('Enter your new password');
    if (newPassword) {
      await updatePassword(newPassword);
      console.log('Password changed successfully');
    }
  } catch (error) {
    alert('Failed to change password! Login and retry.');
  }
  };

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown);
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-6">
            <Link
              to="/dashboard"
              className={`${
                isActiveLink('/dashboard') ? 'text-white font-bold text-lg' : 'text-gray-300'
              } hover:text-white`}
            >
              Home
            </Link>
            <Link
              to="/experiences"
              className={`${
                isActiveLink('/experiences') ? 'text-white font-bold text-lg' : 'text-gray-300'
              } hover:text-white`}
            >
              Experiences
            </Link>
            <Link
              to="/projects"
              className={`${
                isActiveLink('/projects') ? 'text-white font-bold text-lg' : 'text-gray-300'
              } hover:text-white`}
            >
              Projects
            </Link>
          </div>
          <div className="relative">
            <button
              onClick={toggleDropdown}
              className="text-white focus:outline-none"
              aria-label="Profile"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 4c3.866 0 7 3.134 7 7 0 3.866-3.134 7-7 7s-7-3.134-7-7c0-3.866 3.134-7 7-7zm0 2c2.761 0 5 2.239 5 5 0 2.761-2.239 5-5 5s-5-2.239-5-5c0-2.761 2.239-5 5-5zM15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </button>
            {showDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg">
                <div className="py-1">
                  <button
                    onClick={handlePasswordChange}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Change Password
                  </button>
                </div>
                <div className="border-t border-gray-100"></div>
                <div className="py-1">
                  <button
                    onClick={handleLogout}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                  >
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
