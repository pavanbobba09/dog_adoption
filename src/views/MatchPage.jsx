import React, { useState, useEffect } from "react";
import { handleGenerateMatch } from "../presenters/searchPresenter";
import { fetchDogDetails } from "../models/dogModel";
import { handleLogout } from "../presenters/authPresenter";

function MatchPage() {
  const [matchedDog, setMatchedDog] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [isRevealed, setIsRevealed] = useState(false);
  const [previousMatches, setPreviousMatches] = useState(new Set());

  useEffect(() => {
    // First try to get favorites from session storage (directly from search page)
    const storedFavorites = sessionStorage.getItem("matchFavorites");
    
    if (storedFavorites) {
      const parsedFavorites = JSON.parse(storedFavorites);
      setFavorites(parsedFavorites);
      generateMatch(parsedFavorites);
    } else {
      // If not in session, try to get from local storage with user key
      const currentUserEmail = sessionStorage.getItem("currentUserEmail");
      
      if (currentUserEmail) {
        const favoritesKey = `dogFavorites_${currentUserEmail}`;
        const localFavorites = localStorage.getItem(favoritesKey);
        
        if (localFavorites) {
          const parsedLocalFavorites = JSON.parse(localFavorites);
          setFavorites(parsedLocalFavorites);
          generateMatch(parsedLocalFavorites);
        } else {
          setError("No favorites selected. Please select favorites first.");
          setIsLoading(false);
        }
      } else {
        setError("Session expired. Please log in again.");
        setIsLoading(false);
      }
    }
  }, []);

  const generateMatch = async (favoriteIds) => {
    setIsLoading(true);
    setError("");

    try {
      // reset match history if all are shown
      if (previousMatches.size >= favoriteIds.length) {
        setPreviousMatches(new Set());
      }

      // generate match using our presenter
      const result = await handleGenerateMatch(favoriteIds);

      if (result.success) {
        // if same match again, pick diff one
        if (previousMatches.has(result.matchId)) {
          const remainingDogs = favoriteIds.filter(id => !previousMatches.has(id));
          
          if (remainingDogs.length > 0) {
            const alternativeMatchId = remainingDogs[0];
            const [dogDetails] = await fetchDogDetails([alternativeMatchId]);
            setMatchedDog(dogDetails);
            setPreviousMatches(prev => new Set([...prev, alternativeMatchId]));
          } else {
            // fallback to same one if nothing new
            const [dogDetails] = await fetchDogDetails([result.matchId]);
            setMatchedDog(dogDetails);
            setPreviousMatches(new Set([result.matchId]));
          }
        } else {
          const [dogDetails] = await fetchDogDetails([result.matchId]);
          setMatchedDog(dogDetails);
          setPreviousMatches(prev => new Set([...prev, result.matchId]));
        }
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("An error occurred while generating your match.");
      console.error("Match generation error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRevealMatch = () => {
    setIsRevealed(true); // just show the dog
  };

  const handleTryAgain = () => {
    setIsRevealed(false);
    // shuffle favs so we get different match
    if (favorites.length > 1) {
      const shuffledFavorites = [...favorites].sort(() => Math.random() - 0.5);
      generateMatch(shuffledFavorites);
    } else {
      generateMatch(favorites);
    }
  };

  const handleNewSearch = () => {
    window.location.href = "/search";
  };

  const handleContactShelter = () => {
    if (matchedDog) {
      window.location.href = `mailto:shelter@example.com?subject=Interested in Adopting ${matchedDog.name}&body=Hello, I am interested in adopting ${matchedDog.name} (ID: ${matchedDog.id}). Please send me more information about the adoption process.`;
    }
  };

  const onLogout = async () => {
    await handleLogout(); // log user out
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="text-7xl mb-4 animate-bounce">🐾</div>
            <p className="text-lg font-semibold">Finding your perfect match...</p>
            <div className="mt-4 w-16 h-16 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500 p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md text-center">
          <div className="text-7xl mb-4">😔</div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Oops!</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={handleNewSearch}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-500 text-white rounded-xl font-semibold hover:shadow-lg hover:from-indigo-700 hover:to-purple-600 transition-all transform hover:-translate-y-0.5"
          >
            Return to Search
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-100 p-2.5 rounded-xl">
              <span className="text-3xl" role="img" aria-label="Dog emoji">🐶</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-indigo-700">
                Paws & Hearts
              </h1>
              <p className="text-sm text-gray-600">Find your perfect companion</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <button
              onClick={handleNewSearch}
              className="px-5 py-2.5 bg-indigo-600 text-white rounded-lg
                hover:bg-indigo-700 transition-all duration-200 flex items-center gap-2
                shadow-sm hover:shadow-md transform hover:-translate-y-0.5"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              New Search
            </button>
            <button
              onClick={onLogout}
              className="px-5 py-2.5 bg-red-500 text-white rounded-lg
                hover:bg-red-600 transition-all duration-200 shadow-sm
                hover:shadow-md transform hover:-translate-y-0.5"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {!isRevealed ? (
          <div className="text-center">
            <div className="bg-white rounded-3xl shadow-2xl p-12 transform transition-all hover:scale-105">
              <h2 className="text-4xl font-bold mb-6 bg-gradient-to-r from-indigo-600 to-purple-500 bg-clip-text text-transparent">
                Your Perfect Match is Ready!
              </h2>
              <p className="text-gray-600 mb-8 text-lg">
                Based on your favorite selections, we've found a special dog that could be your perfect companion.
              </p>
              <div className="text-9xl mb-8 animate-pulse">❓</div>
              <button
                onClick={handleRevealMatch}
                className="px-10 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-xl font-bold rounded-xl shadow-lg hover:shadow-2xl hover:from-indigo-700 hover:to-purple-700 transform transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2 mx-auto"
              >
                <span>Reveal My Match!</span>
                <span className="text-2xl">✨</span>
              </button>
            </div>
          </div>
        ) : matchedDog && (
          <div className="transform transition-all duration-500 scale-100 opacity-100">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
              <div className="relative">
                <img
                  src={matchedDog.img}
                  alt={`${matchedDog.name} the ${matchedDog.breed}`}
                  className="w-full h-96 object-cover"
                />
                <div className="absolute top-4 right-4">
                  <div className="bg-white bg-opacity-95 rounded-full p-4 shadow-lg">
                    <span className="text-3xl">🏆</span>
                  </div>
                </div>
              </div>

              <div className="p-8">
                <div className="text-center mb-8">
                  <h2 className="text-4xl font-bold text-gray-800 mb-2">
                    Meet {matchedDog.name}!
                  </h2>
                  <p className="text-xl text-gray-600">Your Perfect Match</p>
                  {previousMatches.size > 1 && (
                    <p className="text-sm text-gray-500 mt-2">
                      Match {previousMatches.size} of {favorites.length}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-6 mb-8">
                  <div className="bg-indigo-50 p-5 rounded-xl border border-indigo-100">
                    <h4 className="text-sm font-semibold text-indigo-600 mb-1">Breed</h4>
                    <p className="text-lg font-bold text-gray-800">{matchedDog.breed}</p>
                  </div>
                  <div className="bg-purple-50 p-5 rounded-xl border border-purple-100">
                    <h4 className="text-sm font-semibold text-purple-600 mb-1">Age</h4>
                    <p className="text-lg font-bold text-gray-800">
                      {matchedDog.age} {matchedDog.age === 1 ? "year" : "years"}
                    </p>
                  </div>
                  <div className="bg-pink-50 p-5 rounded-xl border border-pink-100">
                    <h4 className="text-sm font-semibold text-pink-600 mb-1">Location</h4>
                    <p className="text-lg font-bold text-gray-800">ZIP: {matchedDog.zip_code}</p>
                  </div>
                  <div className="bg-blue-50 p-5 rounded-xl border border-blue-100">
                    <h4 className="text-sm font-semibold text-blue-600 mb-1">Dog ID</h4>
                    <p className="text-lg font-bold text-gray-800">{matchedDog.id}</p>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={handleContactShelter}
                    className="flex-1 px-6 py-3.5 bg-gradient-to-r from-green-500 to-emerald-500 text-white font-semibold rounded-xl shadow-md
                      hover:from-green-600 hover:to-emerald-600 transform transition-all duration-300 hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Contact Shelter to Adopt
                  </button>
                  <button
                    onClick={handleTryAgain}
                    className="flex-1 px-6 py-3.5 bg-indigo-100 text-indigo-700 font-semibold rounded-xl
                      hover:bg-indigo-200 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                    Try Another Match
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {isRevealed && matchedDog && (
          <div className="mt-8 bg-indigo-50 rounded-xl p-6 text-center border border-indigo-100">
            <h3 className="text-lg font-semibold text-indigo-800 mb-2">What's Next?</h3>
            <p className="text-indigo-600">
              Click the "Contact Shelter to Adopt" button to get in touch with the shelter and start your adoption journey!
            </p>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-6 mt-auto border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Paws & Hearts - Find Your Perfect Furry Companion
          </p>
        </div>
      </footer>
    </div>
  );
}

export default MatchPage;