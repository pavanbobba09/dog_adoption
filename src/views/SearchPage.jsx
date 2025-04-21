import React, { useState, useEffect } from "react";
import { fetchBreeds, searchDogs, fetchDogDetails } from "../models/dogModel";
import { handleLogout } from "../presenters/authPresenter";
import { manageFavorites } from "../presenters/searchPresenter";

function SearchPage() {

  const [breeds, setBreeds] = useState([]);
  const [selectedBreeds, setSelectedBreeds] = useState([]);
  const [sortOrder, setSortOrder] = useState("breed:asc");
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize] = useState(12);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  
  const [dogs, setDogs] = useState([]);
  const [totalDogs, setTotalDogs] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [favorites, setFavorites] = useState([]);

 
  const [isLoading, setIsLoading] = useState(true);
  const [isSearching, setIsSearching] = useState(false);
  const [error, setError] = useState("");

  // load breeds and favorites on first render
  useEffect(() => {
    const loadBreeds = async () => {
      try {
        const breedsData = await fetchBreeds();
        setBreeds(breedsData);
      } catch (err) {
        setError("Failed to load dog breeds. Please try again.");
        console.error("Error loading breeds:", err);
      } finally {
        setIsLoading(false);
      }
    };

    // get user favorites
    const currentUserEmail = sessionStorage.getItem("currentUserEmail");
    
    if (currentUserEmail) {
      const favoritesKey = `dogFavorites_${currentUserEmail}`;
      const savedFavorites = localStorage.getItem(favoritesKey);
      
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    } else {
      const savedFavorites = localStorage.getItem("dogFavorites");
      if (savedFavorites) {
        setFavorites(JSON.parse(savedFavorites));
      }
    }

    loadBreeds();
  }, []);

  // fetching dogs based on filters and pagination
  useEffect(() => {
    const loadDogs = async () => {
      if (isLoading) return;
      setIsSearching(true);
      setError("");
      
      try {
        if (showFavoritesOnly && favorites.length > 0) {
          // show only favorited dogs
          const dogsDetails = await fetchDogDetails(favorites);
          setDogs(dogsDetails);
          setTotalDogs(dogsDetails.length);
          setTotalPages(Math.ceil(dogsDetails.length / pageSize));
        } else if (showFavoritesOnly && favorites.length === 0) {
          // no favorites to show
          setDogs([]);
          setTotalDogs(0);
          setTotalPages(0);
        } else {
          // normal search with filters
          const searchParams = {
            breeds: selectedBreeds.length > 0 ? selectedBreeds : null,
            sort: sortOrder,
            size: pageSize,
            from: (currentPage - 1) * pageSize
          };

          const searchResults = await searchDogs(searchParams);
          setTotalDogs(searchResults.total);
          setTotalPages(Math.ceil(searchResults.total / pageSize));

          if (searchResults.resultIds.length > 0) {
            const dogsDetails = await fetchDogDetails(searchResults.resultIds);
            setDogs(dogsDetails);
          } else {
            setDogs([]);
          }
        }
      } catch (err) {
        setError("Failed to search dogs. Please try again.");
        console.error("Error searching dogs:", err);
      } finally {
        setIsSearching(false);
      }
    };

    loadDogs();
  }, [selectedBreeds, sortOrder, currentPage, pageSize, isLoading, showFavoritesOnly, favorites]);

  // filter breeds by search query
  const filteredBreeds = breeds.filter(breed =>
    breed.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // handling breed selection
  const handleBreedChange = (breed) => {
    setSelectedBreeds(prev => {
      if (prev.includes(breed)) {
        return prev.filter(b => b !== breed);
      } else {
        return [...prev, breed];
      }
    });
    setCurrentPage(1);
    
    if (showFavoritesOnly) {
      setShowFavoritesOnly(false);
    }
  };

  // clear breed filters
  const clearAllBreeds = () => {
    setSelectedBreeds([]);
    setCurrentPage(1);
  };

  // change sort order
  const handleSortChange = (order) => {
    setSortOrder(order);
    setCurrentPage(1);
  };

  // change page
  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  // toggle favorite status for a dog
  const handleFavoriteToggle = (dogId) => {
    const newFavorites = manageFavorites(favorites, dogId);
    setFavorites(newFavorites);
    
    const currentUserEmail = sessionStorage.getItem("currentUserEmail");
    
    if (currentUserEmail) {
      const favoritesKey = `dogFavorites_${currentUserEmail}`;
      localStorage.setItem(favoritesKey, JSON.stringify(newFavorites));
    } else {
      localStorage.setItem("dogFavorites", JSON.stringify(newFavorites));
    }
  };

  // log out user
  const onLogout = async () => {
    await handleLogout();
  };

  // go to match page
  const handleGenerateMatch = () => {
    if (favorites.length === 0) {
      alert("Please select at least one favorite dog to generate a match.");
      return;
    }

    sessionStorage.setItem("matchFavorites", JSON.stringify(favorites));
    window.location.href = "/match";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-600 via-purple-500 to-pink-500">
        <div className="bg-white p-8 rounded-3xl shadow-2xl">
          <div className="flex flex-col items-center">
            <div className="text-7xl mb-4 animate-bounce">🐶</div>
            <p>Fetching available dogs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white shadow-md sticky top-0 z-10 border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <div className="bg-indigo-100 p-2 rounded-xl">
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
                onClick={handleGenerateMatch}
                disabled={favorites.length === 0}
                className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg
                  hover:bg-indigo-700 transition-colors duration-200 disabled:opacity-50
                  disabled:cursor-not-allowed flex items-center space-x-2"
              >
                <span>Find My Match</span>
                <span className="text-lg" role="img" aria-label="Sparkles emoji">✨</span>
                <span className="bg-white/20 px-2.5 py-0.5 rounded-md text-sm">
                  {favorites.length}
                </span>
              </button>
              <button
                onClick={onLogout}
                className="px-4 py-2.5 bg-red-500 text-white rounded-lg
                  hover:bg-red-600 transition-colors duration-200 shadow-sm
                  hover:shadow-md"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error message */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex items-center space-x-2" role="alert">
            <span className="text-xl" role="img" aria-label="Warning emoji">⚠️</span>
            <p>{error}</p>
          </div>
        )}

        {/* Search controls */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-8">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                  <span className="text-indigo-600">🔍</span>
                  Filter by Breed
                </h2>
                <button
                  onClick={() => setIsFilterOpen(!isFilterOpen)}
                  className="md:hidden px-4 py-2 bg-indigo-50 text-indigo-700 rounded-lg text-sm
                    hover:bg-indigo-100 transition-colors flex items-center gap-2"
                >
                  {isFilterOpen ? "Hide Filters" : "Show Filters"}
                </button>
              </div>

              <div className={`${isFilterOpen ? 'block' : 'hidden'} md:block space-y-4`}>
                {/* Search box */}
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search breeds..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-3 pl-12 border-2 border-gray-200 rounded-lg
                      focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500
                      transition-all placeholder-gray-400"
                  />
                  <svg
                    className="absolute left-4 top-3.5 h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>

                {/* Selected breed tags */}
                {selectedBreeds.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {selectedBreeds.map((breed) => (
                      <span
                        key={breed}
                        className="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-lg text-sm
                          flex items-center gap-2 border border-indigo-200"
                      >
                        <span className="font-medium">{breed}</span>
                        <button
                          onClick={() => handleBreedChange(breed)}
                          className="text-indigo-800 hover:text-indigo-900"
                        >
                          ×
                        </button>
                      </span>
                    ))}
                    <button
                      onClick={clearAllBreeds}
                      className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800
                        bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                      Clear all
                    </button>
                  </div>
                )}

                {/* Breeds grid */}
                <div className="bg-gray-50 rounded-lg border-2 border-gray-200 p-4">
                  <div className="max-h-64 overflow-y-auto pr-2 custom-scrollbar">
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
                      {filteredBreeds.map((breed) => (
                        <button
                          key={breed}
                          onClick={() => handleBreedChange(breed)}
                          className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                            ${selectedBreeds.includes(breed)
                              ? "bg-indigo-600 text-white shadow-sm hover:bg-indigo-700"
                              : "bg-white text-gray-700 hover:bg-gray-100 border border-gray-300"
                            }`}
                        >
                          {breed}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sort and filter options */}
            <div className="md:w-48">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Sort By</h2>
              <div className="flex flex-col space-y-2">
                <button
                  onClick={() => handleSortChange("breed:asc")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${sortOrder === "breed:asc"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Breed A-Z
                </button>
                <button
                  onClick={() => handleSortChange("breed:desc")}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                    ${sortOrder === "breed:desc"
                      ? "bg-indigo-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  Breed Z-A
                </button>
                
                <div className="my-2 border-t border-gray-200"></div>
                
                {/* Favorites filter button */}
                <button
                  onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
                  className={`px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-between
                    ${showFavoritesOnly
                      ? "bg-pink-600 text-white shadow-sm"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                >
                  <span>Favorites Only</span>
                  <span className="bg-white/20 px-2.5 py-0.5 rounded-md text-sm ml-2">
                    {favorites.length}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Results stats */}
        <div className="flex justify-between items-center mb-6">
          <p className="text-gray-600 font-medium">
            {isSearching ? (
              <span className="flex items-center space-x-2">
                <svg className="animate-spin h-5 w-5 text-indigo-600" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Searching...</span>
              </span>
            ) : totalDogs > 0 ? (
              <span className="bg-white px-4 py-2 rounded-lg shadow-sm border border-gray-200 flex items-center">
                {showFavoritesOnly && (
                  <span className="mr-2 text-pink-600 font-semibold flex items-center">
                    <span className="text-lg mr-1">❤️</span> Favorites:
                  </span>
                )}
                Showing {(currentPage - 1) * pageSize + 1}-{Math.min(currentPage * pageSize, totalDogs)} of {totalDogs} dogs
              </span>
            ) : (
              <span className="text-gray-500">{showFavoritesOnly ? "No favorites yet" : "No dogs found"}</span>
            )}
          </p>
        </div>

        {/* Dogs grid */}
        {isSearching ? (
          <div className="flex justify-center my-16">
            <div className="relative">
              <div className="animate-spin h-16 w-16 border-4 border-indigo-200 rounded-full border-t-indigo-600"></div>
              <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-2xl">🐾</span>
            </div>
          </div>
        ) : dogs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {dogs.map((dog) => (
              <div
                key={dog.id}
                className="group bg-white rounded-xl shadow-sm hover:shadow-lg
                  transition-all duration-300 border border-gray-200"
              >
                <div className="relative h-56 overflow-hidden rounded-t-xl">
                  <img
                    src={dog.img}
                    alt={`${dog.name} the ${dog.breed}`}
                    className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-300"
                  />
                  <button
                    onClick={() => handleFavoriteToggle(dog.id)}
                    className="absolute top-4 right-4 p-2.5 bg-white rounded-full
                      shadow-lg hover:bg-gray-50 transform transition-all duration-200
                      focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                    aria-label={favorites.includes(dog.id) ? "Remove from favorites" : "Add to favorites"}
                  >
                    {favorites.includes(dog.id) ? (
                      <span className="text-red-500 text-xl">❤️</span>
                    ) : (
                      <span className="text-gray-400 text-xl hover:text-red-500 transition-colors">🤍</span>
                    )}
                  </button>
                </div>
                <div className="p-5">
                  <h3 className="font-bold text-xl mb-2 text-gray-800">{dog.name}</h3>
                  <p className="text-indigo-600 font-medium mb-3">{dog.breed}</p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="block text-gray-500 text-xs">Age</span>
                      <span className="font-semibold text-gray-800">
                        {dog.age} {dog.age === 1 ? "year" : "years"}
                      </span>
                    </div>
                    <div className="bg-gray-50 px-3 py-2 rounded-lg">
                      <span className="block text-gray-500 text-xs">Location</span>
                      <span className="font-semibold text-gray-800">{dog.zip_code}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white rounded-xl shadow-sm">
            <div className="text-8xl mb-6">{showFavoritesOnly ? "❤️" : "🔍"}</div>
            <h3 className="text-2xl font-bold text-gray-800 mb-3">
              {showFavoritesOnly ? "No Favorite Dogs Yet" : "No Dogs Found"}
            </h3>
            <p className="text-gray-500 mb-8">
              {showFavoritesOnly ? 
                "Click the heart icon on dogs you like to add them to your favorites" : 
                "Try adjusting your filters to find more dogs"}
            </p>
            {showFavoritesOnly ? (
              <button
                onClick={() => setShowFavoritesOnly(false)}
                className="px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg
                  hover:bg-indigo-100 transition-colors duration-200"
              >
                Show All Dogs
              </button>
            ) : selectedBreeds.length > 0 && (
              <button
                onClick={clearAllBreeds}
                className="px-6 py-2.5 bg-indigo-50 text-indigo-700 rounded-lg
                  hover:bg-indigo-100 transition-colors duration-200"
              >
                Clear All Filters
              </button>
            )}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center mt-12">
            <nav className="bg-white px-4 py-3 rounded-lg shadow-md border border-gray-200 flex items-center space-x-2" aria-label="Pagination">
              <button
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-lg flex items-center justify-center transition-all duration-200
                      ${currentPage === pageNum
                        ? "bg-indigo-600 text-white shadow-sm"
                        : "text-gray-600 hover:bg-gray-100"
                      }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              <button
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-lg hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
              >
                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </nav>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-8 mt-12 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex justify-center items-center space-x-2 mb-3">
              <span className="text-3xl" role="img" aria-label="Paw print">🐾</span>
              <span className="font-bold text-gray-800">Paws & Hearts</span>
              <span className="text-3xl" role="img" aria-label="Heart">❤️</span>
            </div>
            <p className="text-gray-500">Find Your Perfect Furry Companion</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default SearchPage;