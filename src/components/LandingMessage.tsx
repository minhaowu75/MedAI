import React from 'react';
import { Heart, Shield, Clock, Users } from 'lucide-react';

const LandingMessage: React.FC = () => {
    const features = [
        {
            icon: <Heart className="w-5 h-5"/>,
            title: 'Personalized Care',
            description: 'Get health advice tailored to your specific concerns'
        },
        {
            icon: <Shield className="w-5 h-5"/>,
            title: 'Confidential & Secure',
            description: 'Your health information is private and protected'
        },
        {
            icon: <Clock className="w-5 h-5"/>,
            title: '24/7 Available',
            description: 'Get immediate responses to your health questions anytime'
        },
        {
            icon: <Users className="w-5 h-5"/>,
            title: 'Expert Knowledge',
            description: 'Powered by medical knowledge from trained sources'
        }
    ];

    return (
        <div className="text-center py-8 px-4">
            <div className="max-2-2xl mx-auto">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-3">
                        Welcome to HealthBot AI! 👋
                    </h2>
                    <p className="text-gray-600 leading-relaxed">
                        I'm here to help you with your health questions and concerns! Feel free to ask about symptoms, general health advice, wellness tips, or any health-related topics you'd like to discuss!
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {features.map((feature, index) => (
                        <div
                            key={index}
                            className="bg-gradient-to-br from-blue-50 to-teal-50 p-4 rounded-xl border border-blue-100 hover:shadow-md transition-all duration-200"
                        >
                            <div className="flex items-start space-x-3">
                                <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-teal-500 text-white rounded-lg flex items-center justify-center">
                                    {feature.icon}
                                </div>
                                <div className="text-left">
                                    <h3 className="font-semibold text-gray-800 text0sm mb-1">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 text-xs leading-relaxed">
                                        {feature.description}
                                    </p>
                                </div>    
                            </div>
                        </div>
                ))}
                </div>
            
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-left">
                    <p className="text-sm text-amber-800">
                        <span className="font-semibold">IMPORTANT:</span> This AI assistant provides general health information and should not replace professional medical advice. Always consult with healthcare professionals for serious health concerns or emergencies.
                    </p>
                </div>
            </div>
        </div>
    )
}
export default LandingMessage;