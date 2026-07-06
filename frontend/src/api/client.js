const API_URL = import.meta.env.VITE_API_URL; // getting backend server url from


function getToken() { // in here we get the token from local storage
    return localStorage.getItem('token'); // jwt token has been saved after login in browser local storage
}

async function request(endpoint, options = {}) { // instead of writing fetch everytime
    // this function does it all
    const token = getToken(); // if user is not logged in = null

    const headers = { // creating headers
        'Content-Type': 'application/json', // content type is json
        ...(token && { Authorization: `Bearer ${token}` }), // if token was available, make it Bearer token on Authorization
        // why bearer ? bc in backend/middleware/ => authHeader.startsWith('Bearer ')
        ...options.headers, // if any special orders on req => gets merge here
    };

    const response = await fetch(`${API_URL}${endpoint}`, { // sending req
        // if inputs are valid => http://localhost:5000/api/watchlist
        // what does fetch do ?
        // react -> server request -> express -> db -> response
        ...options,
        headers,
    });

    const data = await response.json(); // converts res to json

    if (!response.ok) { // ok => status 200-299 , if not => status 400, 401, 403, 404, 500
        throw new Error(data.error || 'Request failed'); // why throw here?
        // acts like :
        //try {
        //   await request(...)
        // } catch (err) {
        //   console.log(err.message);
        // }
    }

    return data; // successfully returning data
}

export default request; // gets export to be used all across the project

//( ノ・・)ノ
// this whole thing acts like a front desk
// every part of the app calls this function instead of a raw fetch with too much to handle alongside