import React, { useState } from 'react';
import Markdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import Loader from './Loader'; // Assuming the loader is in the same folder

const FileUploadComponent = () => {
    const [fileName, setFileName] = useState('');
    const [uploadedFileUri, setUploadedFileUri] = useState('');
    const [chatResponse, setChatResponse] = useState('');
    const [question, setQuestion] = useState('');
    const [loading, setLoading] = useState(false); // New state for handling the loader

    const handleFileUpload = async () => {
        const fileInput = document.getElementById('fileInput');
        const file = fileInput.files[0];

        if (!file) {
            alert('Please select a file before uploading.');
            return;
        }

        setFileName(`Uploaded file: ${file.name}`);
        setLoading(true); // Show loader during file upload

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://gemini-backend-n6aj.onrender.com/upload', {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Failed to upload file: ${response.status}`);
            }

            const result = await response.json();
            setUploadedFileUri(result.fileUri);
            alert('File uploaded successfully.');
        } catch (error) {
            console.error('Error during file upload:', error);
            alert('Failed to upload file.');
        } finally {
            setLoading(false); // Hide loader once upload is done
        }
    };

    const handleAsk = async (e) => {
        e.preventDefault();

        if (!question.trim()) {
            alert('Please enter a question.');
            return;
        }

        setLoading(true); // Show loader while fetching chat response

        try {
            const response = await fetch('https://gemini-backend-n6aj.onrender.com/ask', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ question }),
            });

            if (!response.ok) {
                throw new Error('Failed to get an answer from the server.');
            }

            const result = await response.json();
            setChatResponse(result.text); // Update the state with the response
        } catch (error) {
            console.error('Error fetching response:', error);
            alert('Failed to get response from the server.');
        } finally {
            setLoading(false); // Hide loader after response is received
        }
    };

    return (
        <div className="flex h-screen p-6 bg-gradient-to-br from-[#060606] via-[#111829] to-[#060606]">
            {/* Left Side: File Upload Section */}
            <div className="w-1/4 bg-gray-900 shadow-lg rounded-lg p-6 mr-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4 text-gray-200">Upload PDF or Any File</h2>
                <form id="uploadForm" encType="multipart/form-data" className="mb-6">
                    <input
                        type="file"
                        id="fileInput"
                        name="file"
                        accept="*/*"
                        className="mb-4 p-3 bg-gray-800 border border-gray-700 rounded w-full text-gray-300"
                    />
                    <button
                        type="button"
                        onClick={handleFileUpload}
                        className="w-full bg-gradient-to-r from-[#a290ff] to-[#098dfb] text-white px-4 py-2 rounded hover:opacity-90 transition"
                    >
                        Upload File
                    </button>
                    {fileName && <h1 className="mt-4 text-sm text-gray-400">{fileName}</h1>}
                </form>
            </div>

            {/* Right Side: Chat Interface Section */}
            <div className="w-3/4 bg-gray-900 shadow-lg rounded-lg p-6 flex flex-col justify-between border border-gray-700">
                <div>
                    <h2 className="text-xl font-semibold mb-4 text-gray-200">AI Chat Assistant</h2>
                    <div className="flex-1 bg-gray-800 p-6 rounded-lg overflow-y-auto mb-4 shadow-inner" style={{ maxHeight: '500px' }}>
                        {loading ? (
                            <Loader /> // Show loader while loading
                        ) : chatResponse ? (
                            <div className="p-3 bg-gray-700 text-gray-200 shadow-sm rounded-lg markdown-content">
                                <Markdown remarkPlugins={[remarkGfm]}>{chatResponse}</Markdown>
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center">Type your question below to start chatting...</p>
                        )}
                    </div>
                </div>

                <form onSubmit={handleAsk} className="flex mt-4">
                    <input
                        type="text"
                        value={question}
                        onChange={(e) => setQuestion(e.target.value)}
                        placeholder="Ask a question..."
                        className="flex-1 bg-gray-800 text-gray-200 border border-gray-600 rounded-lg p-3 mr-4 shadow-inner focus:outline-none focus:ring-2 focus:ring-gray-500"
                    />
                    <button
                        type="submit"
                        className="bg-gradient-to-r from-[#a290ff] to-[#098dfb] text-white px-4 py-3 rounded-lg hover:opacity-90 transition"
                    >
                        Ask
                    </button>
                </form>
            </div>
        </div>
    );
};

export default FileUploadComponent;
