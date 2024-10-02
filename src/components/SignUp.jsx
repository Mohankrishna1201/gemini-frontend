import React, { useState, useEffect } from 'react';
import { useFirebase } from '../context/firebase';
import { FcGoogle } from 'react-icons/fc';
import { Link, useNavigate } from 'react-router-dom';

export default function SignUp({ onLogIn }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const firebase = useFirebase();
    const navigate = useNavigate();

    useEffect(() => {
        if (firebase.isLoggedIn) {
            navigate('/main');
        }
    }, [firebase, navigate, firebase.isLoggedIn]);

    const LoginFunction = async (e) => {
        e.preventDefault();
        try {
            const result = await firebase.UserSignUpwithEmailandPassword(email, password);
            console.log(result);
            alert(`Signed up with ${email}`);
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
            onLogIn(result);
            alert(`Welcome ${result.user.displayName}`);
        } catch (error) {
            console.log(error);
        }
    };

    const handlePasswordBlur = () => {
        if (password.length > 0 && password.length < 6) {
            alert('Password must contain at least 6 characters');
        }
    };

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
    };

    return (
        <section className="h-screen flex flex-col md:flex-row justify-center items-center space-y-10 md:space-y-0 md:space-x-16 bg-gradient-to-br from-[#060606] via-[#111829] to-[#060606]">
            {/* Left side with image - hidden on mobile */}
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
                    <h2 className="text-2xl font-bold text-center text-gray-200 mb-6">
                        Sign up for an account
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

                    {/* Signup Form */}
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

                        <button
                            type="submit"
                            className="w-full py-2 text-sm font-semibold bg-gradient-to-r from-[#a290ff] to-[#098dfb] rounded-lg hover:opacity-90 transition text-white"
                        >
                            Signup
                        </button>
                    </form>

                    <p className="mt-4 text-sm text-center text-gray-500">
                        Already a member?{' '}
                        <Link to="/login" className="text-[#098dfb] hover:text-[#009bb3]">
                            login
                        </Link>
                    </p>
                </div>
            </div>
        </section>

    );
}
