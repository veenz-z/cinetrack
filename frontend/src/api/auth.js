import request from './client';

export function register(username, email, password) {
    return request('/auth/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
    });
}

export function login(email, password) {
    return request('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
    });
}

// register/login modules
// simple functions to for react to ask for an api req with just a name