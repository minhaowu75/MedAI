import React from 'react';
import { Heart, Stethoscope } from 'lucide-react';

const Header: React.FC = () => {
    return (
        <header className="bg-gradient-to-r from-blue-600 to-teal-600 text-white shadow-lg">
            <div className="container mx-auto px-4 py-6">
                <div className="flex items-center justify-center space-x-3">
                    <div className="relative">
                        <Heart className="w-8 h-8 text-red-300"/>
                        <Stethoscope className="w-4 h-4 absolute -top-1 -right-1 text-white"/>
                    </div>
                    <div className="text-center">
                       <h1 className="text-2xl md:text-3xl font-bold tracking-tight">MedAI</h1>
                       <p className="text-blue-100 text-sm font-medium">Your personal health assistant</p> 
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
