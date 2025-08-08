import React from 'react';
import { Bot } from 'lucide-react';

const ChatTypingIndicator: React.FC = () => {
    return (
        <div className="flex items-start space-x-3 mb-6 animate-fade-in">
            <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-teal-500 text-white flex items-center justify-center shadow-md">
                <Bot className="w-5 h-5"/>
            </div>

            <div className="max-w-xs">
                <div className="bg-white border border-gray-100 p-4 rounded-2xl shadow-sm">
                    <div className="flex space-x-1">
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                        <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    </div>
                </div>
                <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span>HealthBot is typing...</span>
                </div>
            </div>
        </div>
    );
};

export default ChatTypingIndicator;