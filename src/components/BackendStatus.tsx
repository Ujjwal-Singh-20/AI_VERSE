import React, { useEffect, useState } from 'react';
// import { motion } from 'framer-motion';
import { Wifi, WifiOff, Loader2 } from 'lucide-react';
import { useLevels } from '../context/LevelContext';

export const BackendStatus: React.FC = () => {
  const { brainrotMode, refreshLevels, refreshProgress } = useLevels();
  const [status, setStatus] = useState<'loading' | 'online' | 'offline'>('loading');
  const [retries, setRetries] = useState(0);

  useEffect(() => {
    const pingBackend = async () => {
      try {
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/`);
        if (response.ok) {
          setStatus('online');

          // --- ENGINE WAKE-UP WORKAROUND (DIRECT PING) ---
          // This pings the engine directly from the browser to ensure Render wakes up.
          try {
            const configRes = await fetch(`${backendUrl}/config/engine-url`);
            if (configRes.ok) {
              const { engine_url } = await configRes.json();
              fetch(`${engine_url}/`, { mode: 'no-cors' }).catch(() => {});
            }
          } catch (e) { /* Silent background wake-up fail */ }
        } else {
          throw new Error();
        }
      } catch (err) {
        if (retries < 30) { // Keep trying for cold start
          setTimeout(() => setRetries(r => r + 1), 2000);
        } else {
          setStatus('offline');
        }
      }
    };

    pingBackend();
  }, [retries]);

  // Handle auto-refresh when online
  useEffect(() => {
    if (status === 'online') {
      refreshLevels();
      refreshProgress();
    }
  }, [status, refreshLevels, refreshProgress]);

  return (
    <div className="fixed top-6 left-8 z-[100] flex items-center gap-3 bg-white/10 backdrop-blur-xl border border-white/20 px-4 py-2 rounded-2xl shadow-xl pointer-events-auto">
      <div className="relative flex items-center justify-center w-2 h-2">
        {status === 'loading' && (
          <>
            <div className="absolute inset-0 bg-yellow-400 rounded-full animate-ping opacity-75" />
            <div className="relative w-2 h-2 bg-yellow-500 rounded-full" />
          </>
        )}
        {status === 'online' && (
          <>
            <div className="absolute inset-0 bg-emerald-400 rounded-full animate-ping opacity-40" />
            <div className="relative w-2 h-2 bg-emerald-500 rounded-full" />
          </>
        )}
        {status === 'offline' && (
          <div className="relative w-2 h-2 bg-red-500 rounded-full" />
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 leading-none mb-1">
          {brainrotMode ? "VIBE_CHECK" : "Systems"}
        </span>
        <span className="flex items-center gap-1.5 text-xs font-bold text-white leading-none">
          {status === 'loading' && (
            <>
              <Loader2 size={10} className="animate-spin" />
              {brainrotMode ? "COOKING_..." : "COLD_STARTING"}
            </>
          )}
          {status === 'online' && (
            <>
              <Wifi size={10} className="text-emerald-400" />
              {brainrotMode ? "BIG_W_ONLINE" : "CORE_ONLINE"}
            </>
          )}
          {status === 'offline' && (
            <>
              <WifiOff size={10} className="text-red-400" />
              {brainrotMode ? "L_RIZZ_DC" : "DISCONNECTED"}
            </>
          )}
        </span>
      </div>
    </div>
  );
};
