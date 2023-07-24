import React, { useState } from 'react';
import { useAuth } from "../../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const SignupPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confPassword, setConfPassword] = useState('');
  const [otp, setOTP] = useState('');
  const [error, setError] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const { signup } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const base_url = "https://portfolio-gen-backend.onrender.com";
  const handleEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handlePasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const handleConfPasswordChange = (event) => {
    setConfPassword(event.target.value);
  };

  const handleOTPChange = (event) => {
    setOTP(event.target.value);
  };

  const notifySuccess = (message) => {
      toast.success(message);
    };



  async function handleSubmit(e) {
    e.preventDefault();
    if (password !== confPassword) {
      return setError('Passwords do not match');
    }
    else{    
        setIsLoading(true);
        try {
        setError('');

        const data = {
          email: email,
        }

        const response = await fetch(`${base_url}/email/sendotp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        });
        
        if (response.status !== 200) {
          return setError('Failed to send OTP');
        }
        else{
          notifySuccess("OTP sent to your email address. \n Please check spam too.");
          setIsOtpSent(true);
        }
        
      } catch {
        setError('Failed to create an account');
      }
      setIsLoading(false);
    }
  }

  const handleOTPSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      setError('');

      const data = {
        email: email,
        otp : otp,
      }

      const response = await fetch(`${base_url}/email/verifyotp`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      
      if (response.status !== 200) {
        return setError('Failed to verify OTP');
      }
      else{
        await signup(email, password, name);
        notifySuccess("Account created successfully");
        navigate('/login');
        setIsOtpSent(false);
      }
      
    } catch {
      setError('Failed to create an account');
    }
    setIsLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="bg-gray-100 rounded-lg p-8 w-full max-w-md">
        <h2 className="text-2xl text-center text-gray-800 mb-8">Sign up</h2>

        {!isOtpSent ? (
          <form onSubmit={handleSubmit}>
            <div className="mb-6">
              <label htmlFor="name" className="block text-gray-800 font-medium mb-2">
                Name:
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={handleNameChange}
                className="w-full py-2 px-4 bg-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>
            <div className="mb-6">
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
            </div>

            <div className="mb-6">
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
            </div>
            <div className="mb-6">
              <label htmlFor="confpassword" className="block text-gray-800 font-medium mb-2">
                Confirm Password:
              </label>
              <input
                type="password"
                id="confpassword"
                value={confPassword}
                onChange={handleConfPasswordChange}
                className="w-full py-2 px-4 bg-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-center mb-6">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
              >
                Sign up
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleOTPSubmit}>
            <div className="mb-6">
              <label htmlFor="otp" className="block text-gray-800 font-medium mb-2">
                Enter OTP:
              </label>
              <input
                type="password"
                id="otp"
                value={otp}
                onChange={handleOTPChange}
                className="w-full py-2 px-4 bg-gray-500 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                required
              />
            </div>

            <div className="flex justify-center mb-6">
              <button
                type="submit"
                className="px-4 py-2 bg-indigo-500 text-white rounded-lg hover:bg-indigo-700 focus:outline-none transition duration-300"
              >
                Verify OTP
              </button>
            </div>
          </form>
        )}

        <div className="text-center">
          <p className="text-gray-800">
            Already have an account?{' '}
            <a href="/login" className="text-indigo-500 font-medium">
              Log in
            </a>
          </p>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>

      {isLoading && (
            <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-opacity-50 bg-gray-900">
              <div className="loader"> Processing OTP...</div>
            </div>
          )}
      <ToastContainer /> 
    </div>
  );
};

export default SignupPage;
