import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { checkExistingSession } from "./presenters/authPresenter";
import LoginPage from "./views/LoginPage";
import SearchPage from "./views/SearchPage";
import MatchPage from "./views/MatchPage";

// this component checks if user logged in, otherwise sends them to login page
const ProtectedRoute = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        const isLoggedIn = await checkExistingSession();
        setIsAuthenticated(isLoggedIn);
      } catch (error) {
        console.error("Auth verification error:", error);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };
    verifyAuth();
  }, []);

  // shows a cute dog while checking if logged in
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="text-7xl mb-4 animate-bounce">🐶</div>
            <p>Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // kicks user to login page if not logged in
  return isAuthenticated ? children : <Navigate to="/" replace />;
};

function App() {
  return (
    <Router>
      <Routes>
        {/* pages everyone can see */}
        <Route path="/" element={<LoginPage />} />
        
        {/* pages only for logged in users */}
        <Route
          path="/search"
          element={
            <ProtectedRoute>
              <SearchPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/match"
          element={
            <ProtectedRoute>
              <MatchPage />
            </ProtectedRoute>
          }
        />
        
        {/* sends wrong urls back to home */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;