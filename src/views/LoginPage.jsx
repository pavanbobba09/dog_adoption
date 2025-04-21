import React, { useState, useEffect } from "react";
import { handleLogin, checkExistingSession } from "../presenters/authPresenter";
import { useNavigate } from "react-router-dom";


function LoginPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [nameError, setNameError] = useState("");
  const [emailError, setEmailError] = useState("");
  const [sessionChecked, setSessionChecked] = useState(false);

   const navigate = useNavigate()

  useEffect(() => {
    const checkSession = async () => {
      try {
        const isLoggedIn = await checkExistingSession();
        if (isLoggedIn) {
          navigate("/search"); // user already logged
        }
      } catch (err) {
        console.error("Session check failed:", err);
      } finally {
        setSessionChecked(true);
      }
    };

    checkSession();
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;

    if (name.trim().length < 2) {
      setNameError("Name must be at least 2 characters");
      isValid = false;
    } else {
      setNameError("");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setEmailError("Please enter a valid email address");
      isValid = false;
    } else {
      setEmailError("");
    }

    return isValid;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);
    setError("");

    try {
      const sanitizedName = name.trim();
      const sanitizedEmail = email.trim().toLowerCase();

      const result = await handleLogin(sanitizedName, sanitizedEmail);
      if (result.success) {
        navigate("/search"); 
      } else {
        setError(result.message);
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  if (!sessionChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="text-7xl mb-4 animate-bounce">🐶</div>
            <p>Checking session...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-4 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-white rounded-full opacity-10 animate-pulse"></div>
        <div className="absolute top-20 right-20 w-64 h-64 bg-white rounded-full opacity-10 animate-pulse" style={{ animationDelay: "1s" }}></div>
        <div className="absolute bottom-10 left-1/4 w-32 h-32 bg-white rounded-full opacity-10 animate-pulse" style={{ animationDelay: "1.5s" }}></div>
        <div className="absolute top-1/3 right-1/3 w-24 h-24 bg-white rounded-full opacity-10 animate-pulse" style={{ animationDelay: "2s" }}></div>
        <div className="absolute top-20 left-1/4 text-white opacity-20 text-5xl transform rotate-12">🐾</div>
        <div className="absolute bottom-40 right-20 text-white opacity-20 text-5xl transform -rotate-12">🐾</div>
        <div className="absolute top-1/2 left-20 text-white opacity-20 text-5xl transform rotate-45">🐾</div>
      </div>

      <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-3xl shadow-2xl p-8 w-full max-w-md transition-all duration-500 hover:shadow-pink-500/30 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="text-7xl mb-4 transform transition-transform duration-300 hover:scale-110 hover:rotate-6" role="img" aria-label="Dog emoji">🐶</div>
          <h1 className="text-3xl font-extrabold text-center mb-1 bg-gradient-to-r from-indigo-600 to-pink-500 bg-clip-text text-transparent">Paws & Hearts</h1>
          <p className="text-center text-gray-600 mb-2">Find your perfect furry companion</p>
          <div className="flex items-center w-full mt-2">
            <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
            <div className="mx-2 text-pink-400" role="img" aria-label="Paw print emoji">🐾</div>
            <div className="flex-grow h-0.5 bg-gradient-to-r from-transparent via-pink-200 to-transparent"></div>
          </div>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm animate-fadeIn" role="alert">
            {error}
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-5" noValidate>
          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="name">
              Your Name
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
              </div>
              <input
                id="name"
                type="text"
                placeholder="Enter your full name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => name.trim() && validateForm()}
                className={`w-full pl-10 pr-4 py-3 border ${
                  nameError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                } rounded-xl focus:outline-none focus:ring-2 bg-white bg-opacity-80 shadow-sm`}
                required
                aria-invalid={!!nameError}
              />
            </div>
            {nameError && <p className="mt-1 text-sm text-red-600 ml-1">{nameError}</p>}
          </div>

          <div className="group">
            <label className="block text-sm font-medium text-gray-700 mb-1 ml-1" htmlFor="email">
              Email Address
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400 group-focus-within:text-indigo-500 transition-colors">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                  <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => email.trim() && validateForm()}
                className={`w-full pl-10 pr-4 py-3 border ${
                  emailError ? "border-red-300 focus:ring-red-500" : "border-gray-300 focus:ring-indigo-500"
                } rounded-xl focus:outline-none focus:ring-2 bg-white bg-opacity-80 shadow-sm`}
                required
                aria-invalid={!!emailError}
              />
            </div>
            {emailError && <p className="mt-1 text-sm text-red-600 ml-1">{emailError}</p>}
          </div>

          <div className="flex items-center">
            <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-indigo-600 border-gray-300 rounded" />
            <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
              Remember me
            </label>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-pink-500 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-indigo-500/30 transform transition-all duration-300 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                </svg>
                Finding Dogs...
              </span>
            ) : (
              <span className="flex items-center justify-center group">
                Let's Find a Dog
                <span className="ml-2 group-hover:ml-3 transition-all duration-300">🐾</span>
              </span>
            )}
          </button>
        </form>

        <p className="mt-8 text-center text-xs text-gray-500">
          By logging in, you're taking the first step toward finding a loving companion.
        </p>
      </div>
    </div>
  );
}

export default LoginPage;
