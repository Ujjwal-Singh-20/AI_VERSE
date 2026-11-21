import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Canvas } from '@react-three/fiber';
import { OceanEnvironment } from '../components/OceanEnvironment';

export const LandingPage: React.FC = () => {
  const { signIn, continueAsGuest, loading } = useAuth();

  return (
    <div className="w-screen h-screen flex flex-col items-center justify-center bg-[#071425] text-white overflow-hidden relative">
      {/* Hazy Home Preview */}
      <div className="absolute inset-0 z-0">
        <Canvas shadows camera={{ position: [0, 12, 18], fov: 45 }}>
          <OceanEnvironment />
        </Canvas>
      </div>

      {/* Blur/Dim layer to create hazy preview */}
      <div className="absolute inset-0 z-1 bg-[#04111f]/45 backdrop-blur-[6px]" />

      {/* Ambient glow layers */}
      <div className="absolute -top-28 -left-16 w-96 h-96 rounded-full bg-cyan-300/20 blur-[72px] z-2" />
      <div className="absolute -bottom-24 -right-16 w-104 h-104 rounded-full bg-blue-500/20 blur-[80px] z-2" />

      {/* Overlay Content */}
      <div className="z-10 w-full px-6">
        <div className="max-w-xl mx-auto rounded-4xl border border-white/30 bg-white/12 backdrop-blur-2xl shadow-[0_25px_80px_rgba(4,17,35,0.55)] p-8 md:p-10 text-center animate-in fade-in duration-1000 slide-in-from-bottom-8">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-sky-100/30 bg-sky-100/10 px-4 py-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-sky-100/90 font-mono">
            PATTERNS TO PURPOSE
          </div>

          <h1 className="text-5xl md:text-7xl font-black mb-4 tracking-tighter bg-linear-to-r from-cyan-100 to-blue-100 bg-clip-text text-transparent font-outfit leading-[0.95]">
            AI VERSE
          </h1>
          <p className="text-sky-100/75 mb-8 text-base md:text-lg max-w-lg mx-auto font-medium font-inter leading-relaxed">
            Access an interactive AI learning environment with guided tracks, mission-based levels, and structured progress mapping.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <button
              onClick={signIn}
              disabled={loading}
              className="group relative w-full sm:w-auto px-7 py-3.5 bg-white/90 text-blue-900 font-black rounded-full overflow-hidden transition-all hover:scale-105 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_28px_rgba(180,235,255,0.45)] hover:shadow-[0_0_46px_rgba(74,184,249,0.5)] cursor-pointer font-outfit uppercase tracking-widest text-xs flex items-center justify-center gap-2"
            >
              <span>{loading ? "AUTHENTICATING..." : "ENTER WITH KIIT ID"}</span>
              <svg
                className="w-4 h-4 group-hover:translate-x-1 transition-transform"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </button>

            <button
              onClick={continueAsGuest}
              className="w-full sm:w-auto px-6 py-3.5 bg-white/10 hover:bg-white/20 text-white font-bold rounded-full border border-white/25 transition-all hover:scale-105 active:scale-95 cursor-pointer font-outfit uppercase tracking-widest text-xs flex items-center justify-center gap-2 backdrop-blur-md"
            >
              <span>TRY DEMO (GUEST)</span>
            </button>
          </div>

          <p className="mt-6 text-[10px] text-blue-100/55 uppercase tracking-[0.3em] font-mono">
            KIIT emails save global progress • Guests explore in sandbox
          </p>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-10 z-10 text-blue-100/30 text-[10px] tracking-[0.5em] uppercase font-mono">
        Built for Builders
      </div>
    </div>
  );
};
