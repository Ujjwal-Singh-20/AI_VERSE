import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, Compass } from 'lucide-react';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#050B14] text-white overflow-hidden relative">
      {/* Ambient glow layers */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[100px] z-0 animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-[100px] z-0 animate-pulse delay-700" />

      {/* 404 Content */}
      <div className="z-10 w-full px-6 flex flex-col items-center">
        <div className="relative mb-8">
           <h1 className="text-[12rem] md:text-[16rem] font-black tracking-tighter bg-linear-to-b from-white/20 to-transparent bg-clip-text text-transparent font-outfit leading-none select-none">
            404
          </h1>
          <div className="absolute inset-0 flex items-center justify-center">
            <Compass size={80} className="text-blue-500/40 animate-spin-slow" />
          </div>
        </div>

        <div className="max-w-md w-full rounded-3xl border border-white/10 bg-white/5 backdrop-blur-3xl p-8 text-center shadow-2xl relative overflow-hidden group">
          {/* Subtle moving border effect */}
          <div className="absolute -inset-1 bg-linear-to-r from-blue-500/20 via-indigo-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-sm pointer-events-none" />
          
          <div className="relative z-10">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-blue-500/20 bg-blue-500/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-blue-400 font-mono">
              NAVIGATION_ERROR
            </div>

            <h2 className="text-3xl font-black mb-3 tracking-tight font-outfit uppercase">
              Sector_Unknown
            </h2>
            
            <p className="text-slate-400 mb-8 text-sm font-medium font-inter leading-relaxed px-4">
              The system was unable to resolve the requested coordinates. This sector may have been purged or never existed.
            </p>

            <button
              onClick={() => navigate('/')}
              className="w-full flex items-center justify-center gap-3 py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs uppercase tracking-[0.2em] font-mono shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 transition-all cursor-pointer group/btn overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/10 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000" />
              <Home size={16} className="group-hover/btn:-translate-y-0.5 transition-transform" />
              Return_to_Base
            </button>
          </div>
        </div>

        <div className="mt-12 text-slate-600 text-[10px] tracking-[0.4em] uppercase font-mono animate-pulse">
           lost_in_the_simulation
        </div>
      </div>

      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
