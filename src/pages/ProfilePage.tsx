import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, PlayCircle, LogOut, ArrowLeft } from 'lucide-react';

interface ProgressTrack {
  trackId: string;
  trackName: string;
  levelName: string;
  progress: number; // 0 to 1
}

interface CompletedTrack {
  trackId: string;
  trackName: string;
  completedLevels: string[];
}

import { CognitiveSignature } from '../components/CognitiveSignature/CognitiveSignature';

export const ProfilePage: React.FC<{ onBack: () => void; onResume?: (trackId: string, levelId?: string) => void }> = ({ onBack, onResume }) => {
  const { user, logOut } = useAuth();
  const [profileData, setProfileData] = useState<{ in_progress: ProgressTrack[], completed: CompletedTrack[] } | null>(null);
  const [loading, setLoading] = useState(true);
  const rollNumber = user?.email?.split('@')[0] || "KIIT_000";

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = await user?.getIdToken();
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          // The backend returns user_info, in_progress, and completed
          setProfileData({
            in_progress: result.in_progress || [],
            completed: result.completed || []
          });
        }
      } catch (err) {
        console.error("Error fetching profile", err);
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  const hasProgress = profileData && (profileData.in_progress.length > 0 || profileData.completed.length > 0);

  return (
    <div className="w-screen h-screen bg-[#f8fbff] text-slate-900 flex flex-col p-6 overflow-y-auto overflow-x-hidden font-inter">
      {/* Header Navigation */}
      <div className="w-full max-w-4xl mx-auto flex justify-between items-center mb-12">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-slate-500 hover:text-blue-600 transition-colors font-bold py-2 font-outfit text-sm"
        >
          <ArrowLeft size={18} />
          Back to World
        </button>
        <button
          onClick={logOut}
          className="flex items-center gap-2 text-slate-400 hover:text-red-500 transition-colors text-[10px] font-black underline-offset-4 uppercase tracking-[0.2em] font-mono"
        >
          <LogOut size={14} />
          Sign Out
        </button>
      </div>

      <div className="w-full max-w-2xl mx-auto flex flex-col gap-12">
        {/* User Info */}
        <section className="text-center md:text-left flex flex-col md:flex-row gap-12 items-center bg-white border border-slate-100 p-10 rounded-[48px] shadow-2xl shadow-blue-900/5">
          <div className="w-64 h-64 bg-[#0B0F1A] rounded-[40px] overflow-hidden shadow-2xl relative group border-8 border-white flex items-center justify-center">
            <CognitiveSignature seed={rollNumber} />
            <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </div>
          <div className="flex-1">
            <h1 className="text-5xl font-black text-slate-800 tracking-tighter mb-2 uppercase font-outfit">{user?.displayName}</h1>
            <p className="text-slate-400 font-semibold mb-6 text-lg tracking-tight font-inter">{user?.email}</p>
            <div className="inline-flex items-center gap-3 bg-blue-50 text-blue-700 px-5 py-2 rounded-full text-[10px] font-bold uppercase tracking-[0.15em] border border-blue-100/50 font-mono">
              ROLL_ID: {rollNumber}
            </div>
          </div>
        </section>

        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : !hasProgress ? (
          <section className="bg-blue-50/50 border border-blue-100 rounded-3xl p-12 text-center">
            <p className="text-blue-800/60 font-bold text-lg italic font-outfit">
              “Start your journey to see progress here”
            </p>
          </section>
        ) : (
          <AnimatePresence>
            {/* In Progress Section */}
            {profileData.in_progress.length > 0 && (
              <motion.section
                key="in-progress"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60 ml-1 font-mono">In Progress</h2>
                <div className="grid gap-4">
                  {profileData.in_progress.map((track) => (
                    <div
                      key={track.trackId}
                      onClick={() => onResume?.(track.trackId)}
                      className="group bg-white border border-slate-100 p-6 rounded-3xl shadow-sm hover:shadow-md hover:border-blue-200 transition-all cursor-pointer relative overflow-hidden"
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-lg font-black text-slate-800 font-outfit">{track.trackName}</h3>
                          <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">Current: <span className="text-blue-600 font-black">{track.levelName}</span></p>
                        </div>
                        <PlayCircle size={24} className="text-blue-600 opacity-20 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-blue-500"
                          initial={{ width: 0 }}
                          animate={{ width: `${track.progress * 100}%` }}
                          transition={{ duration: 1, ease: "easeOut" }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}

            {/* Completed Section */}
            {profileData.completed.length > 0 && (
              <motion.section
                key="completed"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="flex flex-col gap-4"
              >
                <h2 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/60 ml-1 font-mono">Completed</h2>
                <div className="grid gap-4">
                  {profileData.completed.map((track) => (
                    <div
                      key={track.trackId}
                      className="bg-emerald-50/30 border border-emerald-100 p-6 rounded-3xl"
                    >
                      <h3 className="text-lg font-black text-emerald-900 mb-4 font-outfit">{track.trackName}</h3>
                      <div className="grid gap-2">
                        {track.completedLevels.map((lvl) => (
                          <div key={lvl} className="flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-emerald-700/70 font-inter">
                            <CheckCircle2 size={16} className="text-emerald-500" />
                            {lvl}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.section>
            )}
          </AnimatePresence>
        )}
      </div>

      <div className="mt-20 py-10 text-center text-slate-300 text-[10px] uppercase font-black tracking-[0.4em] pointer-events-none font-mono">
        Your Learning Journey
      </div>
    </div>
  );
};
