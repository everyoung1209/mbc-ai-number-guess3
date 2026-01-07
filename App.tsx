
import React, { useState } from 'react';
import GuessGame from './components/GuessGame';
import ConnectionModal from './components/ConnectionModal';

const App: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-slate-800 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-600 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-900/20">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h1 className="text-xl font-bold tracking-tight text-white hidden sm:block">Mystic <span className="text-indigo-500">Guess</span></h1>
        </div>

        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg border border-slate-700 transition-all group"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500 group-hover:animate-ping"></span>
            <span className="text-sm font-semibold">Connection Test</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <span className="inline-block px-3 py-1 bg-indigo-500/10 text-indigo-400 text-xs font-bold uppercase tracking-widest rounded-full mb-4 border border-indigo-500/20">
            Powered by Gemini 3 Flash
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4">
            The Oracle knows all.
          </h2>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Try to guess the secret number. Our AI Oracle will guide you through the darkness with mystical hints.
          </p>
        </div>

        <GuessGame />
      </main>

      {/* Footer */}
      <footer className="py-8 text-center border-t border-slate-800">
        <p className="text-slate-600 text-sm">
          &copy; 2024 Gemini Mystic Guess. Developed with ❤️ for Gemini API.
        </p>
      </footer>

      {/* Modals */}
      <ConnectionModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
      />

      {/* Tailwind Utility Additions */}
      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #334155;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #475569;
        }
      `}</style>
    </div>
  );
};

export default App;
