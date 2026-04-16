import { useMemo, useEffect, useRef } from 'react';
import { useLevels } from '../context/LevelContext';
import { ArrowLeft, CheckCircle, Lock, Play } from 'lucide-react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export const SuggestedRoutePage = ({ onBack }: { onBack: () => void }) => {
  const { suggestedRoute, completedLevels, getLevelData, isLevelUnlocked, tracks, isAdmin } = useLevels();
  const scrollRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Re-map the suggested route IDs into actual node data
  const nodes = useMemo(() => {
    return suggestedRoute.map((levelId, index) => {
      const data = getLevelData(levelId);
      const trackMeta = data ? tracks.find(t => t.id === data.track) : null;
      const isCompleted = completedLevels.includes(levelId);
      const isUnlocked = data ? isLevelUnlocked(data.track, levelId) : false;

      return {
        id: levelId,
        index,
        title: data?.level_title || `Unknown Level ${levelId}`,
        trackMeta,
        isCompleted,
        isUnlocked: isUnlocked || isCompleted,
        isNext: !isCompleted && isUnlocked
      };
    });
  }, [suggestedRoute, completedLevels, getLevelData, isLevelUnlocked, tracks]);

  // Find the index of the first incomplete + unlocked node
  const activeIndex = useMemo(() => {
    return nodes.findIndex(n => !n.isCompleted && n.isUnlocked);
  }, [nodes]);

  useEffect(() => {
    // Scroll to active node
    if (activeIndex >= 0 && scrollRef.current) {
      // Calculate offset (rough estimate approx 120px per node)
      const offset = activeIndex * 120 - window.innerWidth / 2 + 60;
      scrollRef.current.scrollTo({ left: offset > 0 ? offset : 0, behavior: 'smooth' });
    }
  }, [activeIndex, nodes]);

  const handleStart = (node: typeof nodes[0]) => {
    if (node.isUnlocked && node.trackMeta) {
      navigate(`/track/${node.trackMeta.id}?level=${node.id}`);
    }
  };

  return (
    <div className="w-screen h-screen bg-[#020617] text-slate-200 overflow-hidden flex flex-col font-inter selection:bg-indigo-500/30">

      {/* HUD Header */}
      <header className="h-20 shrink-0 border-b border-white/5 flex items-center px-8 z-50 bg-[#020617]/50 backdrop-blur-xl justify-between">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-slate-400 hover:bg-white/10 hover:text-white transition-all cursor-pointer"
          >
            <ArrowLeft size={18} strokeWidth={2.5} />
          </button>

          <div>
            <h1 className="text-2xl font-black text-white uppercase tracking-tighter font-outfit leading-none mb-1 flex items-center gap-3">
              <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse" />
              Suggested_Route
              {isAdmin && (
                <span className="ml-3 text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-2 py-0.5 rounded font-black uppercase tracking-widest font-mono animate-pulse">
                  Admin_Override
                </span>
              )}
            </h1>
            <p className="text-[10px] text-slate-500 font-mono font-black uppercase tracking-[0.2em] opacity-80">
              Optimal Global Progression Path
            </p>
          </div>
        </div>

        <div className="font-mono text-xs uppercase tracking-widest text-slate-400">
          {completedLevels.length} / {suggestedRoute.length} <span className="text-indigo-500 font-black ml-2">Completed</span>
        </div>
      </header>

      {/* Horizontal Path */}
      <div
        ref={scrollRef}
        className="flex-1 overflow-x-auto overflow-y-hidden flex items-center relative custom-scrollbar py-32 pl-32 pr-96"
      >
        {/* Main Line */}
        <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -translate-y-1/2 pointer-events-none z-0" />

        <div className="flex items-center gap-8 relative z-10 w-max">
          {nodes.map((node, i) => {
            const isPulsing = node.isNext;

            return (
              <div key={node.id} className="relative group shrink-0 w-max flex flex-col items-center">

                {/* Status Info (Top) */}
                <div className="absolute bottom-20 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none flex flex-col items-center">
                  <div className="bg-[#0f172a] border border-white/10 rounded-xl px-4 py-3 shadow-xl mb-3 flex flex-col items-center gap-1">
                    <span className="text-xs font-black font-outfit uppercase tracking-tight text-white mb-0.5">{node.title}</span>
                    <span className="text-[9px] font-mono tracking-widest uppercase" style={{ color: node.trackMeta?.color }}>
                      {node.trackMeta?.name}
                    </span>
                  </div>
                  <div className="w-px h-6 bg-white/20" />
                </div>

                {/* Node Circle */}
                <div
                  onClick={() => handleStart(node)}
                  className={`w-15 h-15 rounded-full flex items-center justify-center font-black font-mono text-[11px] tracking-widest relative cursor-pointer outline-4 outline-[#020617] scale-100 hover:scale-110 transition-transform ${isPulsing ? 'shadow-[0_0_40px_rgba(255,255,255,0.2)]' : ''}`}
                  style={{
                    backgroundColor: node.isCompleted ? node.trackMeta?.color || '#334155' : (node.isUnlocked ? '#1e293b' : '#0f172a'),
                    color: node.isCompleted ? '#0f172a' : (node.isUnlocked ? '#f8fafc' : '#475569'),
                    borderColor: node.isUnlocked && !node.isCompleted ? node.trackMeta?.color : 'transparent',
                    borderWidth: node.isUnlocked && !node.isCompleted ? '2px' : '0'
                  }}
                >
                  {isPulsing && (
                    <div
                      className="absolute inset-0 rounded-full animate-ping opacity-30"
                      style={{ backgroundColor: node.trackMeta?.color || '#fff' }}
                    />
                  )}

                  {node.isCompleted ? <CheckCircle size={24} strokeWidth={3} /> : (node.isUnlocked ? node.id : <Lock size={18} strokeWidth={3} className="opacity-50" />)}
                </div>

                {/* Action Button (Bottom) */}
                {node.isNext && (
                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    onClick={() => handleStart(node)}
                    className="absolute top-20 bg-white text-[#0f172a] px-5 py-2 rounded-xl text-[10px] font-black font-mono uppercase tracking-[0.2em] flex items-center gap-2 shadow-xl shadow-white/10 hover:shadow-white/20 transition-all hover:-translate-y-1"
                  >
                    <Play size={12} className="fill-[#0f172a]" />
                    Start
                  </motion.button>
                )}

                {/* Connection Line to Next */}
                {i < nodes.length - 1 && (
                  <div className="absolute left-[calc(100%+8px)] top-1/2 -translate-y-1/2 w-8 h-0.5" style={{
                    backgroundColor: node.isCompleted ? (node.trackMeta?.color || '#334155') : '#1e293b'
                  }} />
                )}
              </div>
            );
          })}
        </div>
      </div>

    </div>
  );
};
