import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
    const navigate = useNavigate();

    const handleLogin = () => {
        navigate('/login');
    };
    const handleSignUp = () => {
        navigate('/signup');
    };
    const handleClick = () => {
        navigate('/login');
    };

    return (
        <div className="bg-gradient-to-br from-[#060606] via-[#111829] to-[#060606] min-h-screen text-white flex flex-col items-center p-8">
            {/* Navigation Bar with Logo, Login, and Signup Buttons */}
            <nav className="w-full flex items-center justify-between mb-4">
                {/* Logo */}
                <div className="flex items-center">
                    <img
                        src="https://cdn.dribbble.com/userupload/16878176/file/original-95fc80ccb54800fc5b0be5d388007ef4.png?resize=1200x394"
                        alt="Gemini Logo"
                        className="h-12 mr-4"
                    />
                </div>

                {/* Login and Signup Buttons */}
                <div>
                    <button
                        onClick={handleLogin}
                        className="bg-gray-800 px-4 py-2 rounded-lg shadow-lg hover:bg-gray-700 transition duration-300 mr-2"
                    >
                        Login
                    </button>
                    <button
                        onClick={handleSignUp}
                        className="bg-gradient-to-r from-[#a290ff] to-[#098dfb] px-4 py-2 rounded-lg shadow-lg  hover:opacity-90  transition duration-300"
                    >
                        Signup
                    </button>
                </div>
            </nav>

            <main className="flex-grow flex flex-col items-center text-center mt-12">
                <h1 className="text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-gray-200 via-gray-400 to-gray-600">
                    Welcome to Gemini
                </h1>
                <p className="text-lg mb-12 text-gray-300 max-w-2xl leading-relaxed">
                    Harness the power of Gemini's advanced language understanding to create a personalized and engaging learning experience across various subjects.
                </p>


                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl">
                    {[
                        {
                            title: "Generate Quiz",
                            description: "Create personalized quizzes for a fun and effective learning experience.",
                        },
                        {
                            title: "Upload File",
                            description: "Upload documents and study materials to interact with using AI.",
                        },
                        {
                            title: "Ask Gemini",
                            description: "Get instant answers and assistance from Gemini on any topic.",
                        },
                        {
                            title: "Quiz Score",
                            description: "Track your quiz scores and monitor your progress over time.",
                        },
                        {
                            title: "Progress Tracker",
                            description: "Visualize your learning journey and keep improving with every step.",
                        },
                    ].map((item, index) => (

                        <div onClick={handleClick}
                            key={index}
                            className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition duration-300 cursor-pointer"
                        >
                            <h2 className="text-xl font-semibold mb-2 text-gray-200">{item.title}</h2>
                            <p className="text-sm text-gray-400">{item.description}</p>
                        </div>
                    ))}
                </div>
            </main>

            <footer className="w-full py-4 flex justify-center border-t border-gray-700 mt-8">
                <p className="text-gray-500 text-sm">&copy; 2024 Gemini by Mohan. All Rights Reserved.</p>
            </footer>
        </div>
    );
};

export default HomePage;
