import React from 'react';
import { Link } from 'react-router-dom';

function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-4">
      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md text-center">
        <div className="text-9xl mb-4 transform transition-transform duration-300 hover:scale-110">
          🐾
        </div>
        <h1 className="text-4xl font-extrabold mb-2 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">
          404
        </h1>
        <h2 className="text-2xl font-bold mb-6 text-gray-700">Page Not Found</h2>
        <p className="text-gray-600 mb-8">
          Oops! It looks like this puppy ran away. Let's help you find your way back.
        </p>
        <Link 
          to="/" 
          className="inline-block px-6 py-3 bg-gradient-to-r from-indigo-600 to-pink-500 text-white font-semibold rounded-xl shadow-lg hover:shadow-indigo-500/30 transform transition-all duration-300 hover:-translate-y-1"
        >
          Go Back Home
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;