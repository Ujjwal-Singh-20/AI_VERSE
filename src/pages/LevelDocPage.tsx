import { useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Book, ExternalLink, Activity, Info, Lightbulb } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useLevels } from '../context/LevelContext';

export const LevelDocPage = () => {
  const { trackId, levelId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { tracks, loading } = useLevels();

  const track = tracks.find(t => t.id === trackId);
  const level = track?.levels.find(l => l.level_id === levelId);

  // Scroll to top on mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (loading) {
    return (
      <div className="w-full h-screen flex items-center justify-center bg-[#0a0f18]">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-12 h-12 border-4 border-cyan-500/30 border-t-cyan-400 rounded-full"
        />
      </div>
    );
  }

  if (!level) {
    return (
      <div className="w-full h-screen flex flex-col items-center justify-center bg-[#0a0f18] text-white">
        <h1 className="text-4xl font-black mb-4">404_GUIDE_NOT_FOUND</h1>
        <button
          onClick={() => navigate(`/track/${trackId}`)}
          className="px-6 py-3 bg-white/10 hover:bg-white/20 rounded-xl flex items-center gap-2 border border-white/20 transition-all"
        >
          <ArrowLeft size={18} /> BACK_TO_TRACK
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-y-auto bg-[#0a0f18] text-slate-200 font-inter selection:bg-cyan-500/30 custom-scrollbar">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none opacity-20">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12 relative z-10">
        {/* Navigation */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(`/track/${trackId}${location.state?.fromLevel ? `?level=${levelId}` : ''}`)}
          className="group flex items-center gap-2 text-slate-400 hover:text-cyan-400 transition-colors mb-12 font-mono text-xs tracking-widest uppercase"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span>RETURN_TO_CHALLENGE</span>
        </motion.button>

        {/* Header */}
        <header className="mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-4"
          >
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-lg border border-white/10"
              style={{ backgroundColor: `${track?.color}22`, color: track?.color }}
            >
              {track?.icon || '?'}
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.4em] opacity-50 font-mono" style={{ color: track?.color }}>
                {track?.name} / Documentation
              </p>
              <h1 className="text-5xl font-black text-white tracking-tighter mt-2 font-outfit uppercase">
                {level.level_title}
              </h1>
            </div>
          </motion.div>
        </header>

        {/* Main Content Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-slate-900/50 backdrop-blur-3xl border border-white/5 rounded-3xl p-8 md:p-14 shadow-2xl mb-12"
        >
          <div className="max-w-3xl mx-auto">
            {level.guide_markdown ? (
              <ReactMarkdown 
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => <h1 className="text-3xl font-black text-white mb-8 font-outfit uppercase tracking-tighter border-b border-white/10 pb-4">{children}</h1>,
                  h2: ({ children }) => <h2 className="text-xl font-black text-cyan-400 mt-12 mb-5 font-outfit uppercase tracking-widest">{children}</h2>,
                  p: ({ children }) => <p className="text-slate-300/90 text-base leading-[1.7] mb-6 font-inter">{children}</p>,
                  strong: ({ children }) => <strong className="text-white font-bold">{children}</strong>,
                  ul: ({ children }) => <ul className="list-disc pl-6 mb-8 space-y-3">{children}</ul>,
                  li: ({ children }) => <li className="text-slate-300/90 text-base leading-[1.7] font-inter">{children}</li>,
                  code: ({ children }) => <code className="bg-cyan-500/10 text-cyan-300 px-1.5 py-0.5 rounded font-mono text-xs">{children}</code>,
                  hr: () => <hr className="border-white/5 my-12" />,
                  blockquote: ({ children }) => <blockquote className="border-l-4 border-cyan-500/30 pl-6 italic my-8 text-slate-400">{children}</blockquote>
                }}
              >
                {level.guide_markdown}
              </ReactMarkdown>
            ) : (
              <div className="py-20 text-center opacity-50 italic font-mono uppercase tracking-widest">
                <Info className="mx-auto mb-4" size={48} />
                No custom documentation provided for this level yet.
              </div>
            )}
          </div>
        </motion.div>

        {/* Level Features / Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4 text-cyan-400">
              <Activity size={20} />
              <h3 className="font-black uppercase tracking-wider text-sm">Challenge Objective</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {level.goal}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            className="p-6 rounded-2xl bg-white/5 border border-white/10"
          >
            <div className="flex items-center gap-3 mb-4 text-amber-400">
              <Lightbulb size={20} />
              <h3 className="font-black uppercase tracking-wider text-sm">Why It Matters</h3>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed">
              {level.why_this_matters}
            </p>
          </motion.div>
        </div>

        {/* Extra Resources */}
        {level.resource_links && level.resource_links.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="border-t border-white/10 pt-12"
          >
            <h2 className="text-xl font-black text-white uppercase tracking-widest mb-8 flex items-center gap-3">
              <Book size={24} className="text-cyan-400" />
              Additional Resources
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {level.resource_links.map((res, i) => (
                <a
                  key={i}
                  href={res.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group p-4 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 hover:border-cyan-500/50 transition-all flex items-center justify-between"
                >
                  <span className="font-bold group-hover:text-cyan-400 transition-colors uppercase text-sm tracking-tighter">{res.title}</span>
                  <ExternalLink size={16} className="opacity-30 group-hover:opacity-100 group-hover:text-cyan-400 transition-all" />
                </a>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};
