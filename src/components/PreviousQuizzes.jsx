import React from "react";

const PreviousQuizzes = ({ quizzes }) => {
    return (
        <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-7xl mx-auto mt-6 border border-gray-700 overflow-y-auto border custom-scrollbar">
            <h2 className="text-xl font-bold text-white mb-4">
                Previous Quiz Questions and Answers
            </h2>
            {quizzes.length > 0 ? (
                <ul className="list-disc list-inside space-y-4">
                    {quizzes.map((quiz, index) => (
                        <li key={index} className="mb-2">
                            <p className="font-medium text-gray-200">Q: {quiz.question}</p>
                            <p className="text-[#098dfb]">Answer: {quiz.correctAnswer}</p>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-gray-400">No previous quizzes have been stored yet.</p>
            )}
        </div>
    );
};

export default PreviousQuizzes;
