
import React, { useState } from 'react';
import { GeminiService } from '../services/geminiService';
import { ConnectionStatus } from '../types';

interface ConnectionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const ConnectionModal: React.FC<ConnectionModalProps> = ({ isOpen, onClose }) => {
  const [status, setStatus] = useState<ConnectionStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleTest = async () => {
    setStatus('testing');
    setErrorMessage(null);
    try {
      const success = await GeminiService.testConnection();
      if (success) {
        setStatus('success');
      } else {
        setStatus('error');
        setErrorMessage("Empty response from API.");
      }
    } catch (error: any) {
      setStatus('error');
      setErrorMessage(error.message || "Unknown error occurred.");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-2 text-white flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-blue-500 animate-pulse"></span>
            API Connection Test
          </h2>
          <p className="text-slate-400 text-sm mb-6">
            This module verifies that your API key (provided via system environment) is active and communicating with Gemini-3-Flash.
          </p>

          <div className="space-y-4">
            <div className={`p-4 rounded-xl border ${
              status === 'idle' ? 'bg-slate-800 border-slate-700' :
              status === 'testing' ? 'bg-blue-900/20 border-blue-700 animate-pulse' :
              status === 'success' ? 'bg-emerald-900/20 border-emerald-700' :
              'bg-red-900/20 border-red-700'
            }`}>
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Status</span>
                <span className={`text-xs uppercase font-bold px-2 py-1 rounded ${
                  status === 'idle' ? 'bg-slate-700' :
                  status === 'testing' ? 'bg-blue-600' :
                  status === 'success' ? 'bg-emerald-600' :
                  'bg-red-600'
                }`}>
                  {status}
                </span>
              </div>
              {errorMessage && (
                <p className="text-red-400 text-xs mt-2 italic">{errorMessage}</p>
              )}
            </div>

            {status === 'success' && (
              <div className="bg-emerald-500/10 text-emerald-400 p-3 rounded-lg text-xs text-center">
                ✓ Connection established. All Gemini features are ready.
              </div>
            )}
          </div>
        </div>

        <div className="bg-slate-800/50 p-4 flex gap-3">
          <button
            onClick={handleTest}
            disabled={status === 'testing'}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            {status === 'testing' ? 'Testing...' : 'Test Now'}
          </button>
          <button
            onClick={onClose}
            className="flex-1 bg-slate-700 hover:bg-slate-600 text-white font-semibold py-2 rounded-lg transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
