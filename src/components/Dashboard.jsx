import React, { useEffect, useState } from 'react';
import { useFirebase } from '../context/firebase';
import PreviousQuizzes from './PreviousQuizzes';

const Dashboard = () => {
    const firebase = useFirebase();
    const [quizScores, setQuizScores] = useState([]);
    const [loading, setLoading] = useState(true);
    const [prevQuizzess, setPrevQuizzess] = useState([]);

    const getScores = async () => {
        try {
            const res = await firebase.displayUserQuizMarks();
            if (res && Array.isArray(res)) {
                setQuizScores(res); // Ensure the response is an array
            } else {
                setQuizScores([]); // Handle case when there's no data
            }

            const res2 = await firebase.displayUserQuizzes();
            // Ensure the response is handled correctly
            if (res2 && Array.isArray(res2)) {
                setPrevQuizzess(res2);
            }
        } catch (error) {
            console.error('Error retrieving scores:', error);
            setQuizScores([]); // Clear scores on error
        } finally {
            setLoading(false); // Loading is complete
        }
    };

    useEffect(() => {
        getScores();
    }, []); // Run once on component mount

    return (
        <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#111829] to-[#060606] text-white p-6">
            <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Profile Section */}
                <ProfileSection />

                {/* Quiz Scores Section */}
                <QuizScoresComponent loading={loading} quizScores={quizScores} />
            </div>
            <div className="w-full mt-6 ">
                <PreviousQuizzes quizzes={prevQuizzess} />
            </div>
        </div>
    );
};

const QuizScoresComponent = ({ loading, quizScores }) => {
    return (
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 md:col-span-2 h-96 overflow-y-auto border border-gray-700 custom-scrollbar">
            <h3 className="text-xl font-semibold mb-4">Quiz Scores</h3>

            {loading ? (
                <p className="text-gray-400">Loading...</p>
            ) : quizScores.length > 0 ? (
                <div className=" h-full space-y-4 ">
                    <div className="grid grid-cols-2 gap-4">
                        {quizScores.map((quiz, index) => (
                            <div
                                key={index}
                                className="flex flex-col items-center bg-gray-800 rounded-lg p-4"
                            >
                                <div className="w-16 h-16 bg-[#098dfb] rounded-full flex items-center justify-center text-white text-xl font-bold">
                                    {quiz.score} / {quiz.total}
                                </div>
                                <p className="mt-2 text-sm text-gray-400">Quiz {index + 1}</p>
                            </div>
                        ))}
                    </div>
                </div>
            ) : (
                <p className="text-gray-400">No quiz marks available</p>
            )}
        </div>
    );
};

// Profile Section Component
const ProfileSection = () => {
    const name = localStorage.getItem('name');
    const userID = localStorage.getItem('userID');
    const userEmail = localStorage.getItem('userEmail');
    const userImg = localStorage.getItem('userImg');

    return (
        <div className="bg-gray-900 shadow-lg rounded-lg p-6 md:col-span-1 border border-gray-700">
            <div className="flex flex-col items-center">
                <img
                    className="w-24 h-24 rounded-full border-2 border-gray-500"
                    src={userImg}
                    alt="Profile"
                />
                <h2 className="mt-4 text-2xl font-semibold">{name}</h2>
                <p className="text-gray-400">{userEmail}</p>
                <div className="mt-4">
                    <p className="text-sm text-gray-500">{userID}</p>
                </div>
                <div className="mt-6 w-full">
                    <button className="w-full bg-[#098dfb] hover:bg-[#559fdc] text-white py-2 px-4 rounded">
                        Edit Profile
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
