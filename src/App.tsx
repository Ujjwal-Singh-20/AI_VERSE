import { Suspense, useState, useEffect, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';
import { Canvas } from '@react-three/fiber';
import { OceanEnvironment } from './components/OceanEnvironment';
import { WorldMap } from './components/WorldMap';
import { OverlayUI } from './components/OverlayUI';
import { Connections } from './components/Connections';
import { AuthProvider, useAuth } from './context/AuthContext';
import { LevelProvider, useLevels } from './context/LevelContext';
import { LandingPage } from './pages/LandingPage';
import { ProfilePage } from './pages/ProfilePage';
import { AdminPage } from './pages/AdminPage';
import { TrackPage } from './pages/TrackPage';
import { LevelDocPage } from './pages/LevelDocPage';
import { SuggestedRoutePage } from './pages/SuggestedRoutePage';
import { NotFoundPage } from './pages/NotFoundPage';
import { SettingsModal } from './components/SettingsModal';
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import { BackendStatus } from './components/BackendStatus';
import { ElabsLogo } from './components/ElabsLogo';
import { Settings, Map } from 'lucide-react';

function AppContent() {
  const { user, loading, logOut, isAdmin } = useAuth();
  const { brainrotMode, setBrainrotMode } = useLevels();
  const [activeTrack, setActiveTrack] = useState<string | null>(null);
  const [showSettings, setShowSettings] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(!!localStorage.getItem('gemini_api_key'));
  const navigate = useNavigate();

  // Re-check API key when settings modal closes
  useEffect(() => {
    if (!showSettings) {
      setHasApiKey(!!localStorage.getItem('gemini_api_key'));
    }
  }, [showSettings]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setBrainrotMode(!brainrotMode);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [brainrotMode, setBrainrotMode]);

  if (loading) return null;

  if (!user) {
    return <LandingPage />;
  }

  return (
    <div className="w-screen h-screen relative bg-[#f0f8ff] overflow-hidden">
      <Routes>
        <Route path="/" element={
          <>
            <BackendStatus />

            <Canvas shadows={{ type: THREE.PCFShadowMap }} camera={{ position: [0, 12, 18], fov: 45 }}>
              <Suspense fallback={null}>
                <OceanEnvironment />
                <ElabsLogo />
                <WorldMap activeTrack={activeTrack} setActiveTrack={setActiveTrack} />
                <Connections />
              </Suspense>
            </Canvas>

            {/* Manual UI Overlay for Selected Track */}
            <div className="absolute inset-0 pointer-events-none z-10 flex justify-end perspective-[1000px]">
              <OverlayUI
                activeTrackId={activeTrack}
                onClose={() => setActiveTrack(null)}
                onEnter={() => navigate(`/track/${activeTrack}`)}
              />
            </div>

            {/* Bottom-Left: */}
            <div className="absolute bottom-6 left-8 flex gap-4 z-50 pointer-events-auto font-mono">
              <button
                className="px-6 py-3 bg-indigo-600/30 hover:bg-indigo-600/50 text-indigo-50 text-ui-2xs font-black rounded-2xl backdrop-blur-xl border-2 border-indigo-500/50 transition-all cursor-pointer shadow-xl hover:shadow-indigo-500/20 uppercase tracking-[0.2em] flex items-center gap-2 hover:scale-[1.05] active:scale-95"
                onClick={() => navigate('/suggested-route')}
              >
                <Map size={14} />
                {brainrotMode ? "PROGRESS_RIZZ" : "SUGGESTED_ROUTE"}
              </button>
              <div className="relative">
                <motion.button
                  className={`px-5 py-3 rounded-2xl backdrop-blur-xl border-2 transition-all cursor-pointer shadow-xl active:scale-95 flex items-center justify-center ${!hasApiKey
                      ? "bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 border-amber-400/50"
                      : "bg-white/20 hover:bg-white/40 text-white border-white/40"
                    }`}
                  onClick={() => setShowSettings(!showSettings)}
                  animate={!hasApiKey ? {
                    scale: [1, 1.1, 1],
                    boxShadow: [
                      "0 0 0px rgba(245, 158, 11, 0)",
                      "0 0 20px rgba(245, 158, 11, 0.4)",
                      "0 0 0px rgba(245, 158, 11, 0)"
                    ]
                  } : { scale: 1 }}
                  transition={!hasApiKey ? {
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut"
                  } : {}}
                >
                  <Settings size={18} />
                </motion.button>

                <AnimatePresence>
                  {!hasApiKey && (
                    <>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        exit={{ scale: 0 }}
                        className="absolute -top-1 -right-1 w-4 h-4 bg-amber-500 rounded-full border-2 border-[#f0f8ff] flex items-center justify-center z-[60]"
                      >
                        <span className="text-[8px] font-black text-white">!</span>
                      </motion.div>

                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-amber-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg whitespace-nowrap shadow-lg uppercase tracking-wider pointer-events-none"
                      >
                        Set API Key
                        <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-amber-500" />
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>

            </div>

            {/* Top-Right: */}
            <div className="absolute top-6 right-8 flex gap-4 z-50 pointer-events-auto font-mono">
              <button
                className="px-6 py-3 bg-blue-600/30 hover:bg-blue-600/50 text-blue-50 text-ui-2xs font-black rounded-2xl backdrop-blur-xl border-2 border-blue-500/50 transition-all cursor-pointer shadow-xl hover:shadow-blue-500/20 uppercase tracking-[0.2em] hover:scale-[1.05] active:scale-95"
                onClick={() => navigate('/profile')}
              >
                {isAdmin
                  ? (brainrotMode ? "MOD_ROOM" : "CONTROL_CENTER")
                  : (brainrotMode ? "THE_VAULT" : "PROFILE_JOURNEY")}
              </button>
              <button
                className="px-6 py-3 bg-white/20 hover:bg-white/40 text-white text-ui-2xs font-black rounded-2xl backdrop-blur-xl border-2 border-white/40 transition-all cursor-pointer shadow-xl uppercase tracking-[0.2em] hover:scale-[1.05] active:scale-95"
                onClick={logOut}
              >
                {brainrotMode ? "BYE_BYE_💀" : "LOG_OUT"}
              </button>
            </div>

            {/* Brainrot Easter Egg Toggle */}
            <button
              className="absolute bottom-6 right-8 text-ui-xs font-bold text-white bg-white/10 hover:bg-white/30 px-3 py-1 rounded-md backdrop-blur-sm border border-white/20 transition-all z-50 cursor-pointer pointer-events-auto shadow-sm"
              onClick={() => setBrainrotMode(!brainrotMode)}
            >
              {brainrotMode ? "v1.0.0 BETA RIZZ 🗣️" : "v1.0.0 👀"}
            </button>

            {/* Title HUD */}
            <div
              className={`absolute top-8 left-1/2 -translate-x-1/2 pointer-events-none z-10 text-center transition-opacity duration-500 ${activeTrack ? "opacity-0" : "opacity-90"
                }`}
            >
              <h1 className="text-ui-title font-black tracking-tighter drop-shadow-[0_10px_30px_rgba(34,211,238,0.4)] uppercase font-outfit text-cyan-100">
                {brainrotMode ? "AI SKIBIDI WORLD" : "AI VERSE"}
              </h1>
              <p className="text-ui-xs mt-3 font-black uppercase tracking-[0.4em] font-mono text-lime-300 drop-shadow-md">
                {brainrotMode
                  ? "click a floating chunk to start cooking 🗣️🔥"
                  : "Select a track to begin your journey"}
              </p>
            </div>
          </>
        } />

        <Route path="/profile" element={
          isAdmin ? <AdminPage onBack={() => navigate('/')} /> : <ProfilePage onBack={() => navigate('/')} onResume={(tid, _) => navigate(`/track/${tid}`)} />
        } />

        <Route path="/track/:trackId" element={
          <TrackPage onBack={() => navigate('/')} />
        } />

        <Route path="/suggested-route" element={
          <SuggestedRoutePage onBack={() => navigate('/')} />
        } />

        <Route path="/track/:trackId/level/:levelId/docs" element={
          <LevelDocPage />
        } />

        {/* Catch-all */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <LevelProvider>
        <Router>
          <AppContent />
        </Router>
      </LevelProvider>
    </AuthProvider>
  );
}
