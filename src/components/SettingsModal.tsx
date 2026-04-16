import React, { useState, useEffect } from 'react';
import { X, Key, Eye, EyeOff } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose }) => {
  const [key, setKey] = useState('');
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const stored = localStorage.getItem('gemini_api_key');
      if (stored) setKey(stored);
      setSaved(false);
    }
  }, [isOpen]);

  const handleSave = () => {
    if (key.trim()) {
      localStorage.setItem('gemini_api_key', key.trim());
      setSaved(true);
      setTimeout(() => {
        onClose();
      }, 1000);
    } else {
      localStorage.removeItem('gemini_api_key');
      setSaved(true);
      setTimeout(() => onClose(), 1000);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 50, rotateZ: 2 }}
            animate={{ scale: 1, y: 0, rotateZ: 0 }}
            exit={{ scale: 0.8, y: 50, rotateZ: -2 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
            className="bg-white/60 backdrop-blur-3xl rounded-[60px] p-12 max-w-lg w-full shadow-2xl relative border-[6px] border-white/80 overflow-hidden group"
          >
            {/* Cartoonish Glossy Shine */}
            <div className="absolute top-0 left-0 right-0 h-1/2 bg-white/20 skew-y-[-12deg] -translate-y-1/2 pointer-events-none" />

            <button
              onClick={onClose}
              className="absolute top-6 right-6 text-slate-500 hover:text-slate-800 transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex items-center gap-3 mb-6 text-blue-600">
              <Key size={24} />
              <h2 className="text-2xl font-black font-outfit uppercase tracking-tight">AI Evaluation Key</h2>
            </div>

            <p className="text-sm text-slate-700 mb-6 leading-relaxed font-inter font-medium">
              To evaluate your submissions and receive AI feedback, you must provide your own <a className="text-blue-600 hover:text-blue-500 transition-colors" href="https://aistudio.google.com/app/api-keys" target="_blank" rel="noopener noreferrer">Gemini API key</a>. This key is stored locally in your browser.
            </p>

            <div className="relative mb-6">
              <input
                type={showKey ? "text" : "password"}
                value={key}
                onChange={(e) => setKey(e.target.value)}
                placeholder="AIzaSy..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono text-slate-800 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all font-bold"
              />
              <button
                onClick={() => setShowKey(!showKey)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-blue-600 transition-colors"
              >
                {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>

            <button
              onClick={handleSave}
              className={`w-full py-3 rounded-xl font-black text-xs uppercase tracking-widest font-mono transition-all ${saved ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-500/20'}`}
            >
              {saved ? 'Saved!' : 'Save Key'}
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
