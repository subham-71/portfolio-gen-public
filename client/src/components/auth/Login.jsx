import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, resetPassword } = useAuth();
  const navigate = useNavigate();
  const [resetPasswordMode, setResetPasswordMode] = useState(false);
  const [resetPasswordEmail, setResetPasswordEmail] = useState('');
  const [resetPasswordError, setResetPasswordError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const notifySuccess = (message) => {
      toast.success(message);
    };

  const handleResetPasswordEmailChange = (event) => {
    setResetPasswordEmail(event.target.value);
  };

  const handleForgotPassword = async () => {
    try {
      await resetPassword(resetPasswordEmail);
      setResetPasswordEmail('');
      setResetPasswordMode(false);
      setResetPasswordError('');
      notifySuccess('A password reset email has been sent to your email address.');
    } catch (error) {
      setResetPasswordError('Failed to send reset password email. Please try again.');
    }
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      if (resetPasswordMode) {
        await handleForgotPassword();
      } else {
        await login(email, password);
        navigate('/dashboard');
      }
    } catch {
      alert("Failed to Log in");
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-100 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl text-center text-gray-800 mb-8">Login</h2>

        <form onSubmit={handleSubmit}>
          {!resetPasswordMode && <div className="mb-6">
            <label htmlFor="email" className="block text-gray-800 font-medium mb-2">
              Email:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={handleEmailChange}
              className="w-full py-2 px-4 bg-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>}

          {!resetPasswordMode && <div className="mb-6">
            <label htmlFor="password" className="block text-gray-800 font-medium mb-2">
              Password:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={handlePasswordChange}
              className="w-full py-2 px-4 bg-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>}

          {!resetPasswordMode && (
            <div className="flex justify-center space-x-4 mb-6">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
              >
                Log in
              </button>
              <button
                type="button"
                onClick={() => setResetPasswordMode(true)}
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-300"
              >
                Forgot password
              </button>
            </div>
          )}

          {resetPasswordMode && (
            <div>
              <div className="mb-6">
                <label htmlFor="resetPasswordEmail" className="block text-gray-800 font-medium mb-2">
                  Email:
                </label>
                <input
                  type="email"
                  id="resetPasswordEmail"
                  value={resetPasswordEmail}
                  onChange={handleResetPasswordEmailChange}
                  className="w-full py-2 px-4 bg-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-center space-x-4 mb-6">
                <button
                  type="button"
                  onClick={() => setResetPasswordMode(false)}
                  className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
                >
                  Back to login
                </button>
                <button
                  type="button"
                  onClick={handleForgotPassword}
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 focus:outline-none transition duration-300"
                >
                  Reset password
                </button>
              </div>
              {resetPasswordError && (
                <div className="text-red-500 text-center mb-4">
                  {resetPasswordError}
                </div>
              )}
            </div>
          )}
        </form>

        <div className="text-center">
          <p className="text-gray-800">
            Haven't registered yet?{' '}
            <a href="/signup" className="text-indigo-500 font-medium">
              Sign up
            </a>
          </p>
        </div>
      </div>

      {isLoading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-gray-900">
              <div className="loader"> Processing request...</div>
            </div>
          )}
      <ToastContainer /> 
    </div>
  );
};

export default Login;