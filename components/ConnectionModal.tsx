
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
        setErrorMessage("API로부터 응답이 없습니다.");
      }
    } catch (error: any) {
      setStatus('error');
      // API Key 미설정 시의 에러 핸들링
      const msg = error.message?.includes('API_KEY') 
        ? "환경 변수(API_KEY)가 설정되지 않았습니다." 
        : (error.message || "연결 테스트 중 알 수 없는 에러가 발생했습니다.");
      setErrorMessage(msg);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4 animate-in fade-in duration-300">
      <div className="bg-slate-900 border border-slate-700 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in duration-300">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-indigo-500/20 rounded-lg">
              <svg className="w-6 h-6 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white">시스템 연결 테스트</h2>
          </div>
          
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            보안 지침에 따라 API KEY는 시스템 환경 변수에서 안전하게 로드됩니다. <br/>
            아래 버튼을 눌러 현재 설정된 키의 <strong>Gemini 3 Flash</strong> 통신 상태를 확인하세요.
          </p>

          <div className="space-y-4">
            <div className={`p-5 rounded-xl border transition-all duration-500 ${
              status === 'idle' ? 'bg-slate-800/50 border-slate-700' :
              status === 'testing' ? 'bg-indigo-900/20 border-indigo-700 animate-pulse' :
              status === 'success' ? 'bg-emerald-900/20 border-emerald-700' :
              'bg-red-900/20 border-red-700'
            }`}>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-semibold text-slate-300 uppercase tracking-wider">연결 상태</span>
                <span className={`text-xs uppercase font-black px-2 py-1 rounded shadow-sm ${
                  status === 'idle' ? 'bg-slate-700 text-slate-300' :
                  status === 'testing' ? 'bg-indigo-600 text-white' :
                  status === 'success' ? 'bg-emerald-600 text-white' :
                  'bg-red-600 text-white'
                }`}>
                  {status === 'idle' ? '대기 중' : status === 'testing' ? '테스트 중' : status === 'success' ? '정상' : '오류'}
                </span>
              </div>
              
              {status === 'success' && (
                <div className="text-emerald-400 text-sm font-medium animate-in slide-in-from-bottom-1">
                  ✓ Gemini API가 정상적으로 응답합니다. 모든 기능을 사용할 수 있습니다.
                </div>
              )}
              
              {errorMessage && (
                <div className="text-red-400 text-sm font-medium mt-2 leading-tight italic">
                  ⚠ {errorMessage}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="bg-slate-800/50 p-5 flex gap-3 border-t border-slate-800">
          <button
            onClick={handleTest}
            disabled={status === 'testing'}
            className="flex-1 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-3 rounded-xl transition-all shadow-lg shadow-indigo-900/20 active:scale-95"
          >
            {status === 'testing' ? '연결 확인 중...' : '연결 테스트 실행'}
          </button>
          <button
            onClick={onClose}
            className="px-6 bg-slate-700 hover:bg-slate-600 text-white font-bold py-3 rounded-xl transition-all"
          >
            닫기
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectionModal;
