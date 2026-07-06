import request from './client';

export function getWatchlist() {
    return request('/watchlist');
}

export function addToWatchlist(item) {
    return request('/watchlist', {
        method: 'POST',
        body: JSON.stringify(item),
    });
}

export function updateWatchlistItem(id, updates) {
    return request(`/watchlist/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(updates),
    });
}

export function removeFromWatchlist(id) {
    return request(`/watchlist/${id}`, { method: 'DELETE' });
}

// watchlist modules
// simple functions to for react to ask for an api req with just a name