import { createContext, useContext, useState, useEffect } from 'react'; // some tools from react

const AuthContext = createContext(null); // creating a context
// a context is a global placeholder for data and info

export function AuthProvider({ children }) { // its job is to hold login info
    const [user, setUser] = useState(null); // holds user info
    const [loading, setLoading] = useState(true); // we still dont know if user is logged in or not

    useEffect(() => { // while loading
        const storedUser = localStorage.getItem('user'); // read user (reads token and user from local storage)
        if (storedUser) { // if was logged in
            setUser(JSON.parse(storedUser)); // make it a json
        }
        setLoading(false); // end of loading
    }, []);

    function loginUser(userData, token) { // after success login :
        localStorage.setItem('token', token); // token gets saved
        localStorage.setItem('user', JSON.stringify(userData)); //user gets saved
        // stringify bc local storage only stores strings
        setUser(userData); // updated states
    }

    function logoutUser() { // runs when user want to log out
        localStorage.removeItem('token'); // token gets removed
        localStorage.removeItem('user'); // user gets removet
        setUser(null); // user is now null
    }

    return ( // provider means make the context public
        // value is usable through whole program
        <AuthContext.Provider value={{ user, loginUser, logoutUser, loading }}>
            {children /*anything on AuthProvider (which in here app gets rendered )*/}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext); // return everything in Context
}


//  ╥﹏╥
// Context is like a building-wide publi address system instead of passsing note from each door of the building (props)
//any component anywhere can call useAuth() and know whos logged in instantly

// why loading ?
//on page refresh theres a small gap before useEffect checks localStorage
//Without tracking loading our app could show a Login screen for a second even for someone who is already logged in