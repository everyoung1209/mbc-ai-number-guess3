
import React, { useState, useEffect, useRef } from 'react';
import { GeminiService } from '../services/geminiService';
import { GameState, GuessRecord } from '../types';

const GuessGame: React.FC = () => {
  const [state, setState] = useState<GameState>({
    target: Math.floor(Math.random() * 100) + 1,
    guesses: [],
    isGameOver: false,
    status: 'playing'
  });
  const [inputValue, setInputValue] = useState('');
  const [hint, setHint] = useState<string>('Welcome to the Mystic Oracle. Can you guess the number between 1 and 100?');
  const [isHintLoading, setIsHintLoading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, [state.status]);

  const resetGame = () => {
    setState({
      target: Math.floor(Math.random() * 100) + 1,
      guesses: [],
      isGameOver: false,
      status: 'playing'
    });
    setInputValue('');
    setHint('A new mystery begins. 1 to 100. Go!');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const val = parseInt(inputValue);
    
    if (isNaN(val) || val < 1 || val > 100) return;
    if (state.guesses.some(g => g.value === val)) return;

    let result: 'higher' | 'lower' | 'correct' = 'correct';
    if (val < state.target) result = 'lower';
    else if (val > state.target) result = 'higher';

    const newGuess: GuessRecord = {
      value: val,
      result,
      timestamp: Date.now()
    };

    const newGuesses = [newGuess, ...state.guesses];
    const isGameOver = result === 'correct';

    setState(prev => ({
      ...prev,
      guesses: newGuesses,
      isGameOver,
      status: isGameOver ? 'won' : 'playing'
    }));

    setInputValue('');

    if (isGameOver) {
      setHint(`Incredible! You pierced the veil. The number was indeed ${state.target}.`);
    } else {
      setIsHintLoading(true);
      // Fixed: result is narrowed to 'higher' | 'lower' since isGameOver is false.
      const aiHint = await GeminiService.getHint(
        state.target, 
        val, 
        result as 'higher' | 'lower', 
        newGuesses.map(g => g.value)
      );
      setHint(aiHint);
      setIsHintLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      {/* Oracle Display */}
      <div className="relative mb-8 p-8 rounded-3xl bg-gradient-to-br from-indigo-900/40 to-slate-900 border border-indigo-500/30 shadow-xl overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-6h2v6zm0-8h-2V7h2v2z"/></svg>
        </div>
        
        <div className="relative z-10 flex flex-col items-center text-center">
          <div className="w-16 h-16 mb-4 rounded-full bg-indigo-500/20 flex items-center justify-center border border-indigo-400/50">
            {isHintLoading ? (
              <div className="w-8 h-8 border-4 border-indigo-400 border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <span className="text-3xl">✨</span>
            )}
          </div>
          <p className="text-xl md:text-2xl font-medium text-indigo-100 leading-relaxed min-h-[4rem]">
            "{hint}"
          </p>
        </div>
      </div>

      {/* Main Game Interface */}
      <div className="grid md:grid-cols-2 gap-6 items-start">
        {/* Input Area */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">
                Your Guess
              </label>
              <input
                ref={inputRef}
                type="number"
                min="1"
                max="100"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                disabled={state.isGameOver}
                placeholder="?"
                className="w-full bg-slate-900 border-2 border-slate-700 rounded-xl px-4 py-4 text-4xl text-center font-bold text-white focus:border-indigo-500 focus:outline-none transition-all placeholder:text-slate-800"
              />
            </div>
            
            {!state.isGameOver ? (
              <button
                type="submit"
                disabled={!inputValue || isHintLoading}
                className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-900/20 transition-all transform active:scale-95"
              >
                SUBMIT GUESS
              </button>
            ) : (
              <button
                type="button"
                onClick={resetGame}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-4 rounded-xl shadow-lg transition-all"
              >
                PLAY AGAIN
              </button>
            )}
          </form>
        </div>

        {/* History Area */}
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 h-[320px] flex flex-col">
          <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">History</h3>
          <div className="flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {state.guesses.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-600 opacity-50 italic">
                <p>No guesses yet</p>
              </div>
            ) : (
              <div className="space-y-2">
                {state.guesses.map((g, idx) => (
                  <div 
                    key={g.timestamp}
                    className={`flex items-center justify-between p-3 rounded-lg border animate-in slide-in-from-top-2 duration-300 ${
                      g.result === 'correct' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300' :
                      'bg-slate-900/80 border-slate-700 text-slate-300'
                    }`}
                  >
                    <span className="font-bold text-lg">#{state.guesses.length - idx}</span>
                    <span className="text-2xl font-bold">{g.value}</span>
                    <span className="text-xs font-bold uppercase tracking-widest px-2 py-1 bg-slate-800 rounded">
                      {g.result === 'correct' ? 'WINNER!' : g.result}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stats / Progress */}
      <div className="mt-8 flex justify-center gap-8">
        <div className="text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Guesses</p>
          <p className="text-3xl font-bold text-white">{state.guesses.length}</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Range</p>
          <p className="text-3xl font-bold text-white">1 - 100</p>
        </div>
        <div className="text-center">
          <p className="text-slate-500 text-xs uppercase font-bold tracking-widest">Difficulty</p>
          <p className="text-3xl font-bold text-white">Normal</p>
        </div>
      </div>
    </div>
  );
};

export default GuessGame;