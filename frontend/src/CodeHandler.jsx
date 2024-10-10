import { useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import { googleAuth } from "./api"; // Your API call function

const CodeHandler = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    useEffect(() => {
        const code = searchParams.get("code"); // Get the code from the URL
        if (code) {
            responseGoogle(code);
        } else {
            console.error('No authorization code found in URL');
        }
    }, [searchParams]);

    const responseGoogle = async (code) => {
        try {
            // Send the code to your backend to exchange for a token
            const result = await googleAuth(code);
            if (result && result.data) {
                const { email, name, image, token } = result.data.user; // Ensure your backend returns these fields

                console.log(result);

                // Save user info and token in sessionStorage
                const userInfo = { email, name, token, image };
                sessionStorage.setItem('user-info', JSON.stringify(userInfo));
                console.log("User info saved to sessionStorage");

                // Update the authentication state
                setIsAuthenticated(true);
                console.log("Authentication state updated");

                // Navigate to the dashboard upon successful login
                navigate('/dashboard');
                console.log("Navigated to dashboard");
            } else {
                console.error('Unexpected response structure:', result);
            }
        } catch (e) {
            console.error('Error during Google Login:', e.response ? e.response.data : e);
        }
    };

    return <div className="App">Processing your login...</div>; // Optional loading message
};

export default CodeHandler;
