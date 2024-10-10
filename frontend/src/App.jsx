import './App.css';
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLogin from './GoogleLogin';
import { BrowserRouter, Route, Routes, Navigate } from 'react-router-dom';
import Dashboard from './Dashboard';
import { useState } from 'react';
import RefreshHandler from './RefreshHandler';
import NotFound from './NotFound';
import CodeHandler from './CodeHandler';

function App() {
    // State to track authentication status
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Wrapper component for Google OAuth
    const GoogleWrapper = () => (
        <GoogleOAuthProvider clientId="356216397084-a553pl8ek7nk57447vcl304gnvqk57h0.apps.googleusercontent.com">
            <GoogleLogin setIsAuthenticated={setIsAuthenticated} /> {/* Pass down setIsAuthenticated */}
        </GoogleOAuthProvider>
    );

    // Private route that checks if the user is authenticated
    const PrivateRoute = ({ element }) => {
        return isAuthenticated ? element : <Navigate to="/login" />;
    };

    return (
        <BrowserRouter>
            <RefreshHandler setIsAuthenticated={setIsAuthenticated} /> {/* Optional: handles token refresh logic */}
            <Routes>
                <Route path="/login" element={<GoogleWrapper />} />
                <Route path="/code" element={<CodeHandler setIsAuthenticated={setIsAuthenticated} />} /> {/* New route for handling code */}
                <Route path="/" element={<Navigate to="/login" />} />
                <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
                <Route path="*" element={<NotFound />} />
            </Routes>
        </BrowserRouter>
    );
}

export default App;
