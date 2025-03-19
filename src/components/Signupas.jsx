import React from 'react';
import { FaUser, FaUserMd, FaSignInAlt } from 'react-icons/fa';
import './Sign.css'; // Assuming you have a CSS file for styles

const SignUp = () => {
    return (
        <div className="signup-container">
            <h1>Welcome to E-Pharmacy</h1>
            <p>Select your role to sign up and start your journey with us.</p>
            <div className="button-container">
                <a href="sign.html" className="button-patient">
                    <FaUser className="icon" /> Sign Up as Patient
                </a>
                <a href="signp.html" className="button-pharmacist">
                    <FaUserMd className="icon" /> Sign Up as Pharmacy
                </a>
            </div>
            <footer>
                <p>Already have an account? <a href="log_in.html"><FaSignInAlt className="icon" /> Log in here</a>.</p>
            </footer>
        </div>
    );
};

export default SignUp;
