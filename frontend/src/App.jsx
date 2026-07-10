import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Watchlist from './pages/Watchlist';
import ItemDetail from './pages/ItemDetail';

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <NavBar />
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                        path="/watchlist"
                        element={
                            <ProtectedRoute>
                                <Watchlist />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/title/:type/:id" element={<ItemDetail />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;