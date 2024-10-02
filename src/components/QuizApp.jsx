import React, { useState } from "react";
import axios from "axios";
import * as Survey from "survey-react-ui";
import { Model } from "survey-core";
import "survey-core/modern.min.css"; // SurveyJS base styles
import "../index.css"; // Tailwind and custom styles
import PreviousQuizzes from "./PreviousQuizzes";
import { useFirebase } from "../context/firebase";
import FileUploadComponent from "./FileUpload";

// Apply custom styles to SurveyJS via CSS classes
const QuizApp = () => {
    const [quizzes, setQuizzes] = useState([]);
    const [topic, setTopic] = useState("");
    const [numQuestions, setNumQuestions] = useState(1);
    const [loading, setLoading] = useState(false);
    const [surveyData, setSurveyData] = useState(null);
    const [quizCompleted, setQuizCompleted] = useState(false);
    const [correct, setCorrect] = useState(0);
    const firebase = useFirebase();

    const generateQuiz = async () => {
        if (!topic.trim()) {
            alert("Please enter a topic");
            return;
        }

        setLoading(true);
        try {
            const response = await axios.post("https://gemini-backend-n6aj.onrender.com/askgemini", {
                topic,
                numQuestions
            });

            const newQuestions = response.data.questions.map((q) => ({
                question: q.question,
                correctAnswer: q.correctAnswer.trim(),
                options: q.options[0].split('\n').map(option => option.trim().replace(/^\d+\.\s*/, ''))
            }));

            setQuizzes((prev) => [...prev, ...newQuestions]);

            const surveyQuestions = newQuestions.map((q, index) => ({
                type: "radiogroup",
                name: `question${index + 1}`,
                title: q.question,
                isRequired: true,
                choices: q.options,
                correctAnswer: q.correctAnswer,
            }));

            const surveyJson = {
                questions: surveyQuestions,
            };

            const model = new Model(surveyJson);

            // Apply inline styles to SurveyJS
            model.onAfterRenderQuestion.add((survey, options) => {
                options.htmlElement.style.color = '#ffffff'; // Change text color to white
                options.htmlElement.classList.add('custom-survey-question'); // Add custom class
            });

            setSurveyData(model);
            setTopic("");
            setQuizCompleted(false);
        } catch (error) {
            console.error("Error generating quiz:", error);
            alert("Error generating quiz");
        } finally {
            setLoading(false);
        }
    };

    const storeQuizMarks = async (correct, quizzes) => {
        firebase.handleQuiz(correct, quizzes.length);
        firebase.handleQuizzes(quizzes);
    }
    const onComplete = (survey) => {
        const correctAnswersCount = survey.getAllQuestions().reduce((correctCount, question) => {
            const correctAnswer = question.correctAnswer.toLowerCase().trim();
            const userAnswer = survey.getValue(question.name).toLowerCase().trim();

            if (correctAnswer === userAnswer) {
                return correctCount + 1;
            }

            return correctCount;
        }, 0);

        setCorrect(correctAnswersCount);
        alert(`You got ${correctAnswersCount} out of ${numQuestions} correct!`);
        storeQuizMarks(correctAnswersCount, quizzes);
        console.log(quizzes);
        setQuizCompleted(true); // Mark quiz as completed
    };



    return (
        <div className="min-h-screen bg-gradient-to-br from-[#060606] via-[#111829] to-[#060606] p-8 flex flex-col items-center">
            <div className="bg-gray-900 p-6 rounded-lg shadow-lg w-full max-w-lg mb-8 border border-gray-700">
                <h1 className="text-2xl font-bold mb-4 text-gray-200">Generate a Quiz</h1>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Topic</label>
                    <input
                        type="text"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        placeholder="Enter a topic for quiz"
                        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-300">Number of Questions</label>
                    <input
                        type="number"
                        value={numQuestions}
                        onChange={(e) => setNumQuestions(e.target.value)}
                        placeholder="Enter the number of questions"
                        className="mt-1 block w-full px-3 py-2 bg-gray-800 border border-gray-700 rounded-md shadow-sm text-gray-200 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                        min="1"
                    />
                </div>
                <button
                    onClick={generateQuiz}
                    className={`w-full bg-gradient-to-r from-[#a290ff] to-[#098dfb] text-white px-4 py-2 rounded hover:opacity-90 transition ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
                    disabled={loading}
                >
                    {loading ? "Generating..." : "Generate Quiz"}
                </button>
            </div>

            {surveyData && (
                <div className=" text-white w-full max-w-4xl bg-gray-900 p-4 rounded-lg shadow-lg mt-4 border border-gray-700">
                    <Survey.Survey model={surveyData} onComplete={onComplete} />
                </div>
            )}

            {quizCompleted && (
                <PreviousQuizzes quizzes={quizzes} />
            )}
        </div>
    );
};

export default QuizApp;
