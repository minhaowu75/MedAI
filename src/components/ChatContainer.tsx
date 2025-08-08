import React, { useState, useRef, useEffect } from 'react';
import { Trash2 } from 'lucide-react';
import Message from './Message.tsx';
import InputBox from './InputBox.tsx';
import ChatTypingIndicator from './ChatTypingIndicator.tsx';
import LandingMessage from './LandingMessage.tsx';
import { Message as MessageType, ChatState } from '../types';

const ChatContainer: React.FC = () => {
    const [chatState, setChatState] = useState<ChatState>({
        messages: [],
        isTyping: false,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [chatState.messages, chatState.isTyping]);

    const handleSendMessage = (content: string) => {
        const userMessage: MessageType = {
            id: Date.now().toString(),
            content,
            role: 'user',
            timestamp: new Date(),
        };

        setChatState(prev => ({
            ...prev,
            messages: [...prev.messages, userMessage],
            isTyping: true
        }));

        setTimeout(async () => {
            const rawBotResponse = await fetch("http://127.0.0.1:8000/diagnose", {
                method: "POST",
                headers: { "Content-Type": "application/json"},
                body: JSON.stringify({ messages: [...chatState.messages, userMessage].map( msg => ({
                    role: msg.role,
                    content: msg.content
                })) })
            })

            const apiReply = await rawBotResponse.json()
            const botResponse = {
                id: Date.now().toString(),
                content: apiReply.response,
                role: "assistant" as const,
                timestamp: new Date(apiReply.timestamp)
            }

            setChatState(prev => ({
                ...prev,
                messages: [...prev.messages, botResponse],
                isTyping: false
            }));
        }, 1500 + Math.random() * 1000);
    };

    const clearChat = () => {
        setChatState({
            messages: [],
            isTyping: false,
        });
    };

    return (
        <div className="flex flex-col h-full bg-gradient-to-br from-blue-50 to-teal-50">
            {/* Chat Header */}
            <div className="bg-white shadow-sm border-b border-gray-200 p-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800">Health Chat</h2>
                        <p className="text-sm text-gray-500">Ask me about your health concerns</p>
                    </div>

                    {chatState.messages.length > 0 && (
                        <div className="flex space-x-2">
                            <button
                                onClick={clearChat}
                                className="flex items-center space-x-2 px-3 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                            >
                                <Trash2 className="w-4 h-4" />
                                <span>Clear Chat</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>

            <div
                ref={chatContainerRef}
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{ maxHeight: 'calc(100vh - 200px)' }}
            >
                {chatState.messages.length === 0 ? (
                    <LandingMessage /> 
                ) : (
                    <div className="max-w-4xl mx-auto">
                        {chatState.messages.map((message, index) => (
                            <Message
                                key={message.id}
                                message={message}
                                isLatest={index === chatState.messages.length -1}
                            />
                        ))}

                        {chatState.isTyping && <ChatTypingIndicator />}
                        <div ref={messagesEndRef} />
                    </div>
                )}
            </div>

            <div className="flex-shrink-0">
                <InputBox
                    onSendMessage={handleSendMessage}
                    disabled={chatState.isTyping}
                />
            </div>
        </div>
    );
};

export default ChatContainer;