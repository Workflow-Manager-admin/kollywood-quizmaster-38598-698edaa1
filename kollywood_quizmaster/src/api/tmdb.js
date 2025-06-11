//
// TheMovieDB (TMDb) API Utility for Kollywood QuizMaster
//
// Provides helper functions to fetch/search Kollywood (Tamil) movie data using the TMDb API.
// API key is managed within this module (but for true security, use .env in production).
// See: https://developers.themoviedb.org/3
//

const TMDB_API_KEY = '5bc67d3b06aecbd18121a3cbbc16eb59'; // NOTE: In production, store in .env!
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const TAMIL_LANGUAGE_CODE = 'ta';

// Helper to build full URL with params and API key
function buildUrl(endpoint, params = {}) {
  const query = new URLSearchParams({ ...params, api_key: TMDB_API_KEY });
  return `${TMDB_BASE_URL}${endpoint}?${query.toString()}`;
}

// PUBLIC_INTERFACE
/**
 * Search Kollywood (Tamil-language) movies by query string.
 * @param {string} query - Search keyword.
 * @param {number} [page=1] - Page number for pagination.
 * @returns {Promise<object>} - Resolves to TMDb API results object.
 */
export async function searchKollywoodMovies(query, page = 1) {
  // Search movies with original_language 'ta' (Tamil)
  const endpoint = '/search/movie';
  const params = {
    query,
    language: 'en-US',
    page,
    include_adult: false,
    with_original_language: TAMIL_LANGUAGE_CODE,
  };
  // Note: 'with_original_language' is not valid in /search/movie,
  // so we have to post-filter results for Tamil movies.
  const url = buildUrl(endpoint, { query, language: 'en-US', page, include_adult: false });
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`TMDb error: ${resp.status}`);
  const data = await resp.json();
  // Filter only Tamil-language movies
  data.results = (data.results || []).filter(m => m.original_language === TAMIL_LANGUAGE_CODE);
  return data;
}

// PUBLIC_INTERFACE
/**
 * Fetch detailed info for a specific movie by TMDb movie ID.
 * @param {number} movieId
 * @returns {Promise<object>} - Resolves to movie details object.
 */
export async function getMovieDetails(movieId) {
  const endpoint = `/movie/${movieId}`;
  const url = buildUrl(endpoint, { language: 'en-US' });
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`TMDb error: ${resp.status}`);
  return resp.json();
}

// PUBLIC_INTERFACE
/**
 * Fetch a list of recent/popular Kollywood (Tamil-language) movies.
 * @param {"popular"|"now_playing"|"top_rated"|"upcoming"} [listType="popular"]
 * @param {number} [page=1]
 * @returns {Promise<object>} - Resolves to TMDb API results object.
 */
export async function getKollywoodMovies(listType = "popular", page = 1) {
  // Use /discover/movie with filter for Tamil language
  const endpoint = '/discover/movie';
  const params = {
    language: 'en-US',
    sort_by: listType === "top_rated" ? "vote_average.desc" : "popularity.desc",
    page,
    with_original_language: TAMIL_LANGUAGE_CODE,
    include_adult: false,
    // Optionally, restrict year or dates for 'now_playing' or 'upcoming'
    // but for brevity, only use main filters
  };
  const url = buildUrl(endpoint, params);
  const resp = await fetch(url);
  if (!resp.ok) throw new Error(`TMDb error: ${resp.status}`);
  return resp.json();
}

// PUBLIC_INTERFACE
/**
 * Search for person (actor/actress) in TMDb and get movie credits (Tamil only).
 * @param {string} name
 * @returns {Promise<object[]>} - List of Tamil movies the person was in.
 */
export async function searchKollywoodPersonMovies(name) {
  // Step 1: Search for person
  const searchEndpoint = '/search/person';
  const searchUrl = buildUrl(searchEndpoint, { query: name, language: 'en-US' });
  const searchResp = await fetch(searchUrl);
  if (!searchResp.ok) throw new Error(`TMDb error: ${searchResp.status}`);
  const searchData = await searchResp.json();
  if (!searchData.results || searchData.results.length === 0) return [];
  const personId = searchData.results[0].id;
  // Step 2: Get combined_credits (acted in, directed, etc)
  const creditsEndpoint = `/person/${personId}/combined_credits`;
  const creditsUrl = buildUrl(creditsEndpoint, { language: 'en-US' });
  const creditsResp = await fetch(creditsUrl);
  if (!creditsResp.ok) throw new Error(`TMDb error: ${creditsResp.status}`);
  const creditsData = await creditsResp.json();
  // Filter only Tamil movies
  return (creditsData.cast || []).filter(m => m.original_language === TAMIL_LANGUAGE_CODE);
}

// Optionally: other helpers (fetch similar movies, images, etc) could be added here

// Note: For a real application, move API key outside code (e.g., process.env.REACT_APP_TMDB_API_KEY) and use env vars!
