import request from './client';

export function searchTMDB(query, type = 'movie') {
    return request(`/tmdb/search?query=${encodeURIComponent(query)}&type=${type}`);
}

export function getTMDBDetails(type, id) {
    return request(`/tmdb/details/${type}/${id}`);
}

// tmdb api module
// simple functions to for react to ask for an api req with just a name