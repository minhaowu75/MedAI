import React from 'react';
import Header from './components/WebpageHeader.tsx'
import ChatContainer from './components/ChatContainer.tsx';

function App() {
    return(
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
            <Header />
            <main className="container mx-auto h-screen flex flex-col" style={{ height: 'calc(100vh - 88px'}}>
                <ChatContainer />
            </main>
        </div>
    );
};
export default App;