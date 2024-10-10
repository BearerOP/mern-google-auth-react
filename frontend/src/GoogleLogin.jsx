import { useEffect } from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleAuth } from "./api";  // Assuming this is your backend function to handle Google auth
import { useNavigate } from 'react-router-dom';

const GoogleLogin = () => {
    const navigate = useNavigate();

    const responseGoogle = async (authResult) => {
        console.log(authResult);

        try {
            if (authResult["code"]) {
                console.log(authResult["code"]);

                // Exchange the authorization code for a token on the backend
                const result = await googleAuth(authResult.code);
                console.log(result);

                // Extract the necessary user info and token from the backend response
                const { email, name, image } = result.data.user;
                const token = result.data.token;

                // Save user info and token in sessionStorage
                const obj = { email, name, token, image };
                console.log(obj);
                
                sessionStorage.setItem('user-info', JSON.stringify(obj));

                // Navigate to the dashboard upon successful login
                navigate('/dashboard');
            } else {
                console.error("Auth result does not contain code:", authResult);
                throw new Error(authResult);
            }
        } catch (e) {
            console.log('Error during Google Login...', e);
        }
    };

    // Initialize Google login with redirect flow
    const googleLogin = useGoogleLogin({
        onSuccess: responseGoogle,
        onError: (error) => console.error("Login Failed: ", error),
        flow: "auth-code",  // Use authorization code flow
        redirect_uri: "http://localhost:5173/code",  // Make sure this matches your redirect URL in the Google Cloud Console
		ux_mode:"redirect"
    });

    useEffect(() => {
        // Automatically trigger the login process when the component mounts
        googleLogin();
    }, [googleLogin]);

    return (
        <div className="App">
            <button onClick={googleLogin}>
                Sign in with Google
            </button>
			</div>
    );
};

export default GoogleLogin;