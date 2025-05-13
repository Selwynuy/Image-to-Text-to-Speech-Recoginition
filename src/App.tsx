import React from 'react';
import ImageToSpeech from './components/ImageToSpeech';

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 flex flex-col items-center justify-center">
          <div className="flex items-center space-x-4">
            {/* Logo SVG */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6h13M9 6l-7 7 7 7" />
            </svg>
            <h1 className="text-3xl font-bold text-gray-900">
              Image to Speech Converter
            </h1>
          </div>
        </div>
      </header>
      <main>
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <ImageToSpeech />
        </div>
      </main>
    </div>
  );
}

export default App;
