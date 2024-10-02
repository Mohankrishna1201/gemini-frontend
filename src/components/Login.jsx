import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc';
import { useFirebase } from '../context/firebase';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const firebase = useFirebase();
    const navigate = useNavigate();

    useEffect(() => {
        if (firebase.isLoggedIn) {
            navigate('/main');
        }
    }, [firebase, navigate]);

    const LoginFunction = async (e) => {
        e.preventDefault();
        try {
            const result = await firebase.UserLoginwithEmailandPassword(email, password);
            console.log(result);
            alert(`Logged in with ${email}`);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    const LoginGoogleFunction = async (e) => {
        e.preventDefault();
        try {
            const result = await firebase.UserLoginGoogle();
            console.log(result);
            alert(`Welcome ${result.user.displayName}`);
        } catch (error) {
            console.log(error);
        }
    };

    const ForgotPasswordFunction = async () => {
        if (!email) {
            alert('Please enter your email address.');
            return;
        }
        try {
            await firebase.sendPasswordReset(email);
            alert(`Password reset email sent to ${email}`);
        } catch (error) {
            console.log(error);
            alert(error.message);
        }
    };

    const handleEmailChange = (e) => setEmail(e.target.value);

    const handlePasswordChange = (e) => setPassword(e.target.value);

    const handlePasswordBlur = () => {
        if (password.length > 0 && password.length < 6) {
            alert('Password must contain at least 6 characters');
        }
    };

    return (
        <section className="h-screen flex flex-col md:flex-row justify-center items-center space-y-10 md:space-y-0 md:space-x-16 bg-gradient-to-br from-[#060606] via-[#111829] to-[#060606]">
            {/* Left side with image */}
            <div className="hidden md:block md:w-1/3 max-w-sm">
                <img
                    src="https://cdn.dribbble.com/userupload/16694596/file/original-81c895b73931494ee90812ebdeaa987a.png?resize=1200x1200"
                    alt="Your Company"
                    className="w-[440px] " // Added rounded and shadow for aesthetics
                />
            </div>

            {/* Right side with form */}
            <div className="md:w-1/3 max-w-sm  p-6 rounded-lg shadow-lg">
                <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold  text-center text-gray-200 mb-6">
                        Log in for an account
                    </h2>

                    {/* Social Login Options */}
                    <p className="text-gray-200 text-center font-bold">Sign in with</p>
                    <div className="flex space-x-2 my-4">
                        <button
                            type="button"
                            onClick={LoginGoogleFunction}
                            className="flex mt-2 w-full items-center justify-center rounded-md bg-gray-800 hover:bg-gray-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm transition duration-300"
                        >
                            <FcGoogle className="mr-2 h-5 w-5" />
                            Login with Google
                        </button>
                    </div>

                    <div className="flex items-center my-4">
                        <div className="flex-grow border-t border-neutral-300"></div>
                        <p className="mx-2 text-sm text-gray-500 font-semibold">or</p>
                        <div className="flex-grow border-t border-neutral-300"></div>
                    </div>

                    {/* Login Form */}
                    <form onSubmit={LoginFunction} className="space-y-4">
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            className="block w-full text-sm px-4 py-2 border-0 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-[#098dfb]"
                            value={email}
                            onChange={handleEmailChange}
                            placeholder="Enter your email"
                        />

                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            className="block w-full text-sm px-4 py-2 border-0 rounded bg-gray-800 text-gray-200 focus:ring-2 focus:ring-[#098dfb]"
                            value={password}
                            onChange={handlePasswordChange}
                            onBlur={handlePasswordBlur}
                            placeholder="Enter your password"
                        />

                        <div className="flex justify-between text-sm text-gray-500">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-1" />
                                Remember Me
                            </label>
                            <button
                                onClick={ForgotPasswordFunction}
                                className="text-[#098dfb] hover:text-[#009bb3]"
                            >
                                Forgot Password?
                            </button>
                        </div>

                        <button
                            type="submit"
                            className="w-full py-2 text-sm font-semibold bg-gradient-to-r from-[#a290ff] to-[#098dfb] rounded-lg hover:opacity-90 transition text-white"
                        >
                            Login
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-center text-gray-500">
                        Not a Member?{' '}
                        <Link to="/signup" className="text-[#098dfb] hover:text-[#009bb3]">
                            Signup
                        </Link>
                    </p>
                </div>
            </div>
        </section>

    );
}
