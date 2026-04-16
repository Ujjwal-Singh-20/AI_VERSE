import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { useLevels } from '../context/LevelContext';

interface OverlayUIProps {
  activeTrackId: string | null;
  onClose: () => void;
  onEnter: () => void;
}

export function OverlayUI({ activeTrackId, onClose, onEnter }: OverlayUIProps) {
  const { tracks, brainrotMode } = useLevels();
  const [cachedTrackId, setCachedTrackId] = useState<string | null>(null);

  useEffect(() => {
    if (activeTrackId) {
      setCachedTrackId(activeTrackId);
    }
  }, [activeTrackId]);

  const activeTrack = tracks.find((t) => t.id === cachedTrackId);

  const brainrotify = (text: string) => {
    if (!brainrotMode) return text;
    const base = text
      .replace(/\bGoal\b/gi, "The Vibe")
      .replace(/\bLearning_Path\b/gi, "Skillz_Acquired")
      .replace(/\bbuild\b/gi, "cook")
      .replace(/\bdata\b/gi, "juice")
      .replace(/\blogic\b/gi, "galaxy brain")
      .replace(/\bAPI\b/gi, "secret sauce")
      .replace(/\bProduction\b/gi, "Ohio Mainstage")
      .replace(/\bMachine Learning\b/gi, "Magic Skibidi")
      .replace(/\bML\b/gi, "Magic Skibidi")
      .replace(/\bModel\b/gi, "Chief")
      .replace(/\bAI\b/gi, "Skibidi Brain")
      .replace(/\bTrack\b/gi, "Journey in Ohio")
      .replace(/\bEvaluation\b/gi, "Vibe Check");

    // Only add a single "ending" emoji if the text is long enough to be a sentence
    if (base.length > 20 && !base.includes("💀")) {
      return `${base} 🗣️🔥`;
    }
    return base;
  };

  return (
    <AnimatePresence>
      {activeTrackId && activeTrack && (
        <motion.div
          key="overlay"
          initial={{ opacity: 0, scale: 0.8, y: 50, rotateZ: -2 }}
          animate={{ opacity: 1, scale: 1, y: 0, rotateZ: 0 }}
          exit={{ opacity: 0, scale: 0.8, y: 50, rotateZ: 2 }}
          transition={{
            type: "spring",
            stiffness: 260,
            damping: 20
          }}
          className="absolute bottom-12 right-12 flex flex-col items-center pointer-events-auto"
          style={{ width: '26.25rem' }}
        >
          <div className="bg-white/50 backdrop-blur-3xl p-10 rounded-[50px] shadow-[0_40px_120px_rgba(0,0,0,0.25)] border-[6px] border-white/90 text-left w-full overflow-hidden relative group">
            {/* Glossy Reflection Overlay */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/10 skew-y-[-10deg] -translate-y-1/2 pointer-events-none" />

            {/* Accent light based on track color */}
            <div
              className="absolute -top-24 -right-24 w-48 h-48 blur-[60px] rounded-full pointer-events-none"
              style={{ backgroundColor: `${activeTrack.color}30` }}
            />

            <header className="mb-8">
              <h2 className="text-4xl font-black text-slate-900 tracking-tighter uppercase font-outfit leading-none mb-3">
                {brainrotify(activeTrack.name)}
              </h2>
              <p className="text-ui-2xs font-black uppercase tracking-[0.2em] font-mono" style={{ color: activeTrack.color }}>
                {brainrotify(activeTrack.subtitle)}
              </p>
            </header>

            <div className="space-y-6 mb-10">
              <section>
                <h3 className="text-ui-2xs font-black text-slate-500 uppercase tracking-[0.2em] font-mono mb-2">{brainrotify("Goal")}</h3>
                <p className="text-sm text-slate-700 font-bold leading-tight">{brainrotify(activeTrack.what_you_build)}</p>
              </section>

              <section>
                <h3 className="text-ui-2xs font-black text-slate-500 uppercase tracking-[0.2em] font-mono mb-2">{brainrotify("Learning_Path")}</h3>
                <div className="flex flex-wrap gap-2">
                  {(activeTrack.what_you_learn || []).map(skill => (
                    <span key={skill} className="px-3 py-1 bg-slate-100 border border-slate-200 rounded-full text-ui-2xs font-black text-slate-500 uppercase tracking-widest font-mono">
                      {brainrotify(skill)}
                    </span>
                  ))}
                </div>
              </section>

              <p className="text-xs text-slate-600 font-medium italic border-l-2 pl-4 py-1" style={{ borderColor: `${activeTrack.color}50` }}>
                "{brainrotify(activeTrack.why_it_matters)}"
              </p>
            </div>

            <div className="flex space-x-4">
              <button
                onClick={onClose}
                className="flex-1 py-4 rounded-2xl font-black text-ui-2xs text-slate-600 uppercase tracking-widest border-2 border-slate-200/60 hover:bg-white/40 transition-all font-mono cursor-pointer"
              >
                {brainrotMode ? 'nah bro 💀' : 'Back'}
              </button>
              <button
                onClick={onEnter}
                style={{ backgroundColor: activeTrack.color }}
                className="flex-[1.5] py-4 rounded-2xl font-black text-ui-2xs text-white shadow-xl uppercase tracking-[0.2em] transition-all hover:scale-[1.02] active:scale-95 font-mono cursor-pointer"
              >
                {brainrotMode ? 'jump into madness 💀' : 'Enter_Track'}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
