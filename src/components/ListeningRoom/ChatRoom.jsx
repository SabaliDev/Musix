import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';

// const SERVER_URL = process.env.REACT_APP_SERVER_URL || 'http://localhost:8080';
const SERVER_URL = 'http://localhost:8080';
const socket = io(SERVER_URL);

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.on('chatHistory', (history) => {
      setMessages(history);
    });

    socket.on('newChatMessage', (message) => {
      setMessages((prevMessages) => [...prevMessages, message]);
    });

    return () => {
      socket.off('chatHistory');
      socket.off('newChatMessage');
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (inputMessage.trim()) {
      socket.emit('chatMessage', inputMessage);
      setInputMessage('');
    }
  };

  return (
    <div className="bg-gray-800 rounded-lg p-4 flex flex-col h-[500px]"> {/* Fixed height */}
      <h3 className="text-xl font-semibold mb-4 text-white">Chat</h3>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.map((msg) => (
          <div key={msg.id} className="message mb-2">
            <div className="inline-block p-2 rounded-lg bg-gray-700">
              <p className="text-sm text-white">{msg.text}</p>
              <span className="text-xs text-gray-400">
                {new Date(msg.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSendMessage} className="flex mt-auto">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-grow p-2 rounded-l-lg bg-gray-700 text-white"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition duration-300"
        >
          Send
        </button>
      </form>
    </div>
  );
};

export default Chat;