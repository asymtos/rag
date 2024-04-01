// ChatBot.js

import { PaperAirplaneIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
const ChatBot = ({ API_KEY }) => {
    const [userMessage, setUserMessage] = useState(''); // State to store user's message
    const [chatMessages, setChatMessages] = useState([]); // State to store chat messages
    // const [inputInitHeight, setInputInitHeight] = useState(0); // State to store initial height of the input textarea

    // Function to handle sending message
    const handleSend = () => {
        if (!userMessage.trim()) return;

        // Append user message to chat messages
        setChatMessages(prevMessages => [...prevMessages, { content: userMessage.trim(), role: 'user' }]);
        setUserMessage('');

        // Generate bot response
        generateResponse();
    };

    // Function to generate bot response
    const generateResponse = () => {
        // Send request to OpenAI API
        fetch('https://api.openai.com/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY}`
            },
            body: JSON.stringify({
                model: 'gpt-3.5-turbo',
                messages: [{ role: 'user', content: userMessage }]
            })
        })
            .then(response => response.json())
            .then(data => {
                const botMessage = data.choices[0].message.content.trim();
                setChatMessages(prevMessages => [...prevMessages, { content: botMessage, role: 'bot' }]);
            })
            .catch(error => console.error('Error:', error));
    };

    // Function to handle user input
    const handleInput = (e) => {
        setUserMessage(e.target.value);
    };

    return (

        <div className="max-w-md mx-auto my-8 p-6 bg-gray-200 rounded-lg shadow-md">
            <div className="mb-4">
                <h2 className="text-lg font-bold text-gray-800">Hii, I am AsymtosBot</h2>
            </div>
            <div className="mb-4 h-40 overflow-y-auto">
                {chatMessages.map((message, index) => (
                    <div key={index} className={`chat ${message.role}`}>
                        {message.role === 'user' ? (
                            <p>{message.content}</p>
                        ) : (
                            <><span className="material-symbols-outlined"></span><p>{message.content}</p></>
                        )}
                    </div>
                ))}
            </div>
            <div className="flex items-center">
                <textarea
                    className="w-full h-16 px-3 py-2 mr-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:border-indigo-500"
                    value={userMessage}
                    onChange={handleInput}
                    placeholder="Type your message..."
                />
                <button onClick={handleSend}>
                    <PaperAirplaneIcon className="h-10 w-10" />
                </button>
            </div>
        </div>
    );
};

export default ChatBot;

