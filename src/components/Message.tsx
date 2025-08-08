import React from 'react';
import { Bot, User, Clock } from 'lucide-react';
import { Message as MessageType} from '../types'

interface MessageProps {
    message: MessageType;
    isLatest?: boolean;
}

const Message: React.FC<MessageProps> = ({ message, isLatest }) => {
    const isBot = message.role === 'assistant';
    const formatTime = (date: Date) => {
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
        <div
            className={`flex items-start space-x-3 mb-6 animate-fade-in ${
                isBot? 'justify-start': 'justify-end flex-row-reverse space-x-reverse'
            } ${isLatest ? 'animate-slide-up' : ''}`}
        >
            <div
                className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center shadow-md ${
                    isBot
                        ? 'bg-gradient-to-br from-blue-500 to-teal-500 text-white'
                        : 'bg-gradient-to-br from-gray-600 to-gray-700 text-white'
                }`}
            >
                {isBot ? <Bot className="w-5 h-5 />" /> : <User className="w-5 h-5" />}
            </div>
            
            <div className={`max-w-xs md:max-w-md lg:max-w-lg ${isBot ? 'mr-auto' : 'ml-auto'}`}>
                <div
                    className={`p-4 rounded-2xl shadow-sm ${
                        isBot
                            ? 'bg-white border border-gray-100 text-gray-800'
                            : 'bg-gradient-to-r from-blue-500 to-teal-500 text-white'
                    }`}
                >
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                </div>
            
                <div
                    className={`flex items-center mt-2 text-xs text-gray-500 ${
                        isBot ? 'justify-start' : 'justify-end'
                    }`}
                >
                    <Clock className="w-3 h-3 mr-1" />
                    <span>{formatTime(message.timestamp)}</span>
                </div>
            </div>
        </div>
    );
};

export default Message;