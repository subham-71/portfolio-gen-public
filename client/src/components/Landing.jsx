import React from 'react';

const Landing = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
      <div className="max-w-4xl mx-auto px-8 py-16 text-white">
        <div className="flex justify-center">
          <div className="mb-5 w-64 h-64 flex items-center justify-center">
            <img src="./logo-1.png" alt="Your Image" className="max-w-full max-h-full" />
          </div>
        </div>
        
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-8 text-center">
          Elevate Your Professional Profile
        </h1>
        <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-12 text-center">
          Showcase your skills with a stunning portfolio website
        </p>
        <div className="flex justify-center">
          <a
            href="/login"
            className="inline-block bg-indigo-500 text-white rounded-lg px-8 py-4 text-lg font-medium transition duration-300 hover:bg-indigo-700 mr-4"
          >
            Login
          </a>
          <a
            href="/signup"
            className="inline-block bg-gray-700 text-white rounded-lg px-8 py-4 text-lg font-medium transition duration-300 hover:bg-gray-900"
          >
            Signup
          </a>
        </div>

        <div className="text-gray-300 text-center mt-20">
          &copy; 2023 Subham
        </div>
      </div>
    </div>
  );
};

export default Landing;
