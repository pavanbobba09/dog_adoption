import { generateMatch } from "../models/dogModel";

// handles add/remove of fav dog
export function manageFavorites(currentFavorites, dogId) {
  if (currentFavorites.includes(dogId)) {
    return currentFavorites.filter(id => id !== dogId); // remove if already there
  } else {
    return [...currentFavorites, dogId]; // add if not present
  }
}

// clean and prep search params for api
export function processSearchParams(params) {
  const processedParams = { ...params };

  if (processedParams.breeds && processedParams.breeds.length === 0) {
    delete processedParams.breeds;
  }

  if (!processedParams.sort) {
    processedParams.sort = "breed:asc"; // default sorting
  }

  return processedParams;
}

// call match api and get match id
export async function handleGenerateMatch(favoriteIds) {
  try {
    if (!favoriteIds || favoriteIds.length === 0) {
      return {
        success: false,
        message: "please select atleast one dog"
      };
    }

    const matchResult = await generateMatch(favoriteIds);

    if (matchResult && matchResult.match) {
      return {
        success: true,
        matchId: matchResult.match
      };
    } else {
      return {
        success: false,
        message: "No match found, try diff dogs"
      };
    }
  } catch (error) {
    console.error("Match generation error:", error);
    return {
      success: false,
      message: "something went wrong while matching"
    };
  }
}

// calculate page data like next, prev etc.
export function calculatePagination(currentPage, totalItems, itemsPerPage) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const hasNextPage = currentPage < totalPages;
  const hasPrevPage = currentPage > 1;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);

  if (endPage === totalPages) {
    startPage = Math.max(1, endPage - 4);
  }

  const visiblePages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return {
    currentPage,
    totalPages,
    hasNextPage,
    hasPrevPage,
    visiblePages,
    startItem: (currentPage - 1) * itemsPerPage + 1,
    endItem: Math.min(currentPage * itemsPerPage, totalItems),
    totalItems
  };
}
