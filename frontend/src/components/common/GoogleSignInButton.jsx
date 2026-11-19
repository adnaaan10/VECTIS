
import { useEffect, useRef } from "react";


const GoogleSignInButton = ({ onSuccess, onError }) => {
    const buttonRef = useRef(null);

    useEffect(() => {
        const initializeGoogleSignIn = () => {
            if (!window.google || !buttonRef.current) {
                return;
            }

            window.google.accounts.id.initialize({
                client_id: import.meta.env.VITE_GOOGLE_CLIENT_ID,

                callback: (response) => {
                    if (!response.credential) {
                        onError?.("Google authentication failed.");
                        return;
                    }

                    onSuccess(response.credential);
                },
            });

            window.google.accounts.id.renderButton(
                buttonRef.current,
                {
                    theme: "outline",
                    size: "medium",
                    shape: "rectangular",
                    text: "continue_with",
                    width: 320,
                    logo_alignment:"left",
                }
            );
        };

        initializeGoogleSignIn();
    }, [onSuccess, onError]);

    return (
        <div className="w-full flex justify-center">
            <div ref={buttonRef}></div>
        </div>
    );
};

export default GoogleSignInButton;
