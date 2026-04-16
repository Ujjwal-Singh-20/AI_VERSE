import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useLevels } from '../context/LevelContext';
import { Play, ArrowLeft, Terminal, Bot, CheckCircle, Lock, Book, GripVertical, GripHorizontal, Download, Upload, ExternalLink } from 'lucide-react';
import { FileUpload } from '../components/FileUpload';
import { motion, AnimatePresence } from 'framer-motion';
import Editor from '@monaco-editor/react';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';

// ── Drag-to-resize hook ────────────────────────────────────────────────────
type DragAxis = 'h' | 'v'; // horizontal or vertical

function useResizable(initial: number, min: number, max: number, axis: DragAxis, inverted = false) {
  const [size, setSize] = useState(initial);
  const dragging = useRef(false);
  const startCoord = useRef(0);
  const startSize = useRef(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      if (!dragging.current) return;
      const coord = axis === 'h' ? e.clientX : e.clientY;
      const delta = inverted ? startCoord.current - coord : coord - startCoord.current;
      setSize(Math.max(min, Math.min(max, startSize.current + delta)));
    };
    const onUp = () => {
      dragging.current = false;
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
    return () => { window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp); };
  }, [min, max, axis, inverted]);

  useEffect(() => {
    setSize((current) => Math.max(min, Math.min(max, current)));
  }, [min, max]);

  const onMouseDown = (e: React.MouseEvent) => {
    dragging.current = true;
    startCoord.current = axis === 'h' ? e.clientX : e.clientY;
    startSize.current = size;
    document.body.style.cursor = axis === 'h' ? 'col-resize' : 'row-resize';
    document.body.style.userSelect = 'none';
    e.preventDefault();
  };

  return { size, onMouseDown };
}

// ── Divider handle component ───────────────────────────────────────────────
function Divider({ onMouseDown, axis }: { onMouseDown: (e: React.MouseEvent) => void; axis: DragAxis }) {
  const isH = axis === 'h';
  return (
    <div
      onMouseDown={onMouseDown}
      className={`${isH ? 'w-1 cursor-col-resize h-full' : 'h-1 cursor-row-resize w-full'} bg-white/5 hover:bg-blue-500/50 active:bg-blue-500/70 transition-colors shrink-0 relative group z-30 flex items-center justify-center`}
    >
      {isH
        ? <GripVertical size={10} className="text-white/0 group-hover:text-blue-400 transition-colors" />
        : <GripHorizontal size={10} className="text-white/0 group-hover:text-blue-400 transition-colors" />
      }
    </div>
  );
}

// ── Main component ─────────────────────────────────────────────────────────
export const TrackPage = ({ onBack }: { onBack: () => void }) => {
  const { trackId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { tracks, getTrackLevels, isLevelUnlocked, completedLevels, refreshProgress, isAdmin } = useLevels();

  const activeTrack = tracks.find(t => t.id === trackId);
  const trackLevels = getTrackLevels(trackId || '');

  const [activeLevelId, setActiveLevelId] = useState<string | null>(null);
  const [code, setCode] = useState<string>('');
  const [running, setRunning] = useState(false);
  const [stdout, setStdout] = useState('');
  const [stderr, setStderr] = useState('');
  const [aiFeedback, setAiFeedback] = useState<any>(null);
  const [passed, setPassed] = useState<boolean | null>(null);
  const [selectedFile, setSelectedFile] = useState<{ name: string; content: string } | null>(null);
  const lastHandledRequestedLevelRef = useRef<string | null>(null);

  const [viewport, setViewport] = useState(() => ({ width: window.innerWidth, height: window.innerHeight }));

  useEffect(() => {
    const onResize = () => setViewport({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const sidebarMin = Math.round(Math.max(170, viewport.width * 0.12));
  const sidebarMax = Math.round(Math.min(360, viewport.width * 0.3));
  const sidebarInitial = Math.round(Math.max(sidebarMin, Math.min(sidebarMax, viewport.width * 0.19)));

  const rightMin = Math.round(Math.max(300, viewport.width * 0.24));
  const rightMax = Math.round(Math.min(760, viewport.width * 0.5));
  const rightInitial = Math.round(Math.max(rightMin, Math.min(rightMax, viewport.width * 0.33)));

  const consoleMin = Math.round(Math.max(120, viewport.height * 0.16));
  const consoleMax = Math.round(Math.min(420, viewport.height * 0.5));
  const consoleInitial = Math.round(Math.max(consoleMin, Math.min(consoleMax, viewport.height * 0.3)));

  const editorFontSize = Math.round(Math.max(8, Math.min(12, viewport.width * 0.00625)));

  const requestedLevelId = new URLSearchParams(location.search).get('level');

  // Resizable panels
  const sidebar = useResizable(sidebarInitial, sidebarMin, sidebarMax, 'h');
  const rightPanel = useResizable(rightInitial, rightMin, rightMax, 'h', true); // inverted: drag left to grow
  const console_ = useResizable(consoleInitial, consoleMin, consoleMax, 'v', true); // inverted: drag up to grow

  useEffect(() => {
    if (trackLevels.length > 0 && !activeLevelId) {
      if (requestedLevelId) {
        const requestedLevelExists = trackLevels.some((l) => l.level_id === requestedLevelId);
        const requestedLevelAllowed = isAdmin || completedLevels.includes(requestedLevelId) || isLevelUnlocked(trackId!, requestedLevelId);
        if (requestedLevelExists && requestedLevelAllowed) {
          setActiveLevelId(requestedLevelId);
          return;
        }
      }

      const first = trackLevels.find(l => !completedLevels.includes(l.level_id) && isLevelUnlocked(trackId!, l.level_id));
      setActiveLevelId((first || trackLevels[0]).level_id);
    }
  }, [trackLevels, completedLevels, activeLevelId, trackId, isLevelUnlocked, requestedLevelId, isAdmin]);

  useEffect(() => {
    if (!requestedLevelId || !trackLevels.length) return;
    if (lastHandledRequestedLevelRef.current === requestedLevelId) return;

    lastHandledRequestedLevelRef.current = requestedLevelId;
    const requestedLevelExists = trackLevels.some((l) => l.level_id === requestedLevelId);
    const requestedLevelAllowed = isAdmin || completedLevels.includes(requestedLevelId) || isLevelUnlocked(trackId!, requestedLevelId);
    if (requestedLevelExists && requestedLevelAllowed) {
      setActiveLevelId(requestedLevelId);
    }
  }, [requestedLevelId, trackLevels, isAdmin, completedLevels, isLevelUnlocked, trackId, activeLevelId]);

  const activeLevel = trackLevels.find(l => l.level_id === activeLevelId);

  useEffect(() => {
    let active = true;
    if (activeLevel) {
      const loadSavedCode = async () => {
        if (!user) {
          setCode(activeLevel.initial_code || '# Start coding here...');
          return;
        }

        try {
          const rollNumber = user.email!.split('@')[0];
          const codeRef = doc(db, 'users', rollNumber, 'level_code', activeLevel.level_id);
          const snap = await getDoc(codeRef);
          if (active) {
            if (snap.exists()) {
              setCode(snap.data().code);
            } else {
              setCode(activeLevel.initial_code || '# Start coding here...');
            }
          }
        } catch (e) {
          console.error("Error loading saved code", e);
          if (active) setCode(activeLevel.initial_code || '# Start coding here...');
        }
      };

      loadSavedCode();
      setStdout(''); setStderr(''); setAiFeedback(null); setPassed(null); setSelectedFile(null);
    }
    return () => { active = false; };
  }, [activeLevel, user]);

  const handleRunAndEvaluate = async () => {
    if (!activeLevel || !user) return;
    setRunning(true);
    setStdout('Executing against hidden datasets...\n');
    setStderr(''); setAiFeedback(null);
    try {
      const token = await user.getIdToken();
      const geminiKey = localStorage.getItem('gemini_api_key') || '';
      const payload: any = { level_id: activeLevel.level_id, source_code: code, files: [] };
      if (selectedFile) payload.files.push(selectedFile);
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      // --- ENGINE WAKE-UP WORKAROUND (DIRECT PING) ---
      // Directly ping the engine from the browser (like curl) to ensure it's waking up.
      setStdout('Waking up systems...\n');
      try {
        const configRes = await fetch(`${backendUrl}/config/engine-url`);
        if (configRes.ok) {
          const { engine_url } = await configRes.json();
          // Fire a no-cors ping to trigger Render cold-start
          await fetch(`${engine_url}/`, { mode: 'no-cors' }).catch(() => {});
        }
      } catch (e) { /* Silent wake-up */ }

      setStdout('Executing against hidden datasets...\n');

      const res = await fetch(`${backendUrl}/execute-and-evaluate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}`, 'X-Gemini-Key': geminiKey },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`API Error: ${await res.text()}`);
      const result = await res.json();
      setStdout(result.stdout || result.test_results?.map((t: any) => `Dataset ${t.dataset}: ${t.passed ? 'PASS' : 'FAIL'}`).join('\n') || '');
      setStderr(result.stderr || '');
      setPassed(result.passed);
      setAiFeedback(result.ai_feedback);
      if (result.passed) {
        refreshProgress();
        // Save correct code to Firebase
        const rollNumber = user.email!.split('@')[0];
        const codeRef = doc(db, 'users', rollNumber, 'level_code', activeLevel.level_id);
        await setDoc(codeRef, {
          code: code,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }
    } catch (e: any) {
      setStderr(`System Error: ${e.message}`);
    } finally {
      setRunning(false);
    }
  };

  if (!activeTrack || !activeLevel) return <div className="p-10 text-white">Loading track data...</div>;

  const handleLevelSelect = (levelId: string) => {
    setActiveLevelId(levelId);
    lastHandledRequestedLevelRef.current = levelId;
    navigate(`/track/${activeTrack.id}?level=${encodeURIComponent(levelId)}`);
  };

  const handleDownloadDataset = async () => {
    if (!user || !activeLevel) return;
    try {
      const token = await user.getIdToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/levels/${activeLevel.level_id}/download-dataset`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Download failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${activeLevel.level_id}_training_data.zip`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (e: any) {
      alert(`Download error: ${e.message}`);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#050B14] text-slate-300 font-inter overflow-hidden selection:bg-blue-500/30">

      {/* ── LEFT SIDEBAR ──────────────────────────────────────────── */}
      <div style={{ width: sidebar.size }} className="shrink-0 bg-[#03060A] flex flex-col overflow-hidden border-r border-white/5">

        {/* Back button */}
        <div className="p-4 border-b border-white/5 flex items-center gap-3 cursor-pointer hover:bg-white/5 transition-colors shrink-0" onClick={onBack}>
          <ArrowLeft size={14} className="text-slate-400 shrink-0" />
          <div className="min-w-0">
            <div className="text-ui-2xs font-black uppercase tracking-widest truncate" style={{ color: activeTrack.color }}>{activeTrack.name}</div>
            <div className="text-ui-xs text-slate-500 font-mono">Return to Map</div>
          </div>
        </div>

        {/* Level list */}
        <div className="p-3 flex-1 overflow-y-auto custom-scrollbar">
          <div className="text-ui-2xs font-black text-slate-500 uppercase tracking-[0.2em] font-mono mb-3 px-1 flex items-center justify-between">
            Mission_Sequence
            {isAdmin && (
              <span className="text-[8px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.5 rounded font-black uppercase tracking-widest animate-pulse">
                ADMIN_ACTIVE
              </span>
            )}
          </div>
          <div className="space-y-1.5">
            {trackLevels.map(lvl => {
              const unlocked = isLevelUnlocked(activeTrack.id, lvl.level_id);
              const isCompleted = completedLevels.includes(lvl.level_id);
              const isActive = activeLevelId === lvl.level_id;
              return (
                <button key={lvl.level_id} disabled={!unlocked} onClick={() => handleLevelSelect(lvl.level_id)}
                  className={`w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all border ${isActive ? 'bg-[#0B1524] border-blue-500/30' : unlocked ? 'bg-[#0a0f18] border-white/5 hover:border-white/10 hover:bg-[#0c131a]' : 'bg-black/20 border-transparent opacity-50 cursor-not-allowed'}`}>
                  <div className={`w-7 h-7 rounded-full shrink-0 flex items-center justify-center border font-mono text-ui-2xs font-black ${isCompleted ? 'bg-blue-500/20 border-blue-500/40 text-blue-400' : unlocked ? (isActive ? 'bg-white text-black border-white' : 'border-slate-700 text-slate-500') : 'border-slate-800 text-slate-700'}`}>
                    {isCompleted ? <CheckCircle size={12} /> : unlocked ? lvl.level_id : <Lock size={10} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className={`text-ui-xs font-bold truncate ${isActive ? 'text-white' : unlocked ? 'text-slate-300' : 'text-slate-600'}`}>
                      {unlocked ? lvl.level_title : 'CLASSIFIED_'}
                    </div>
                    {isActive && <div className="text-ui-2xs text-blue-400 font-black uppercase tracking-widest font-mono mt-0.5">Active_Target</div>}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Progress bar */}
        <div className="p-4 border-t border-white/5 bg-[#0a0f18] shrink-0">
          <div className="flex justify-between items-center mb-1.5">
            <span className="text-ui-2xs font-black uppercase tracking-widest font-mono text-slate-500">Track_Progress</span>
            <span className="text-ui-2xs font-black font-mono text-blue-400">
              {trackLevels.filter(l => completedLevels.includes(l.level_id)).length} / {trackLevels.length}
            </span>
          </div>
          <div className="w-full h-1 bg-slate-900 rounded-full overflow-hidden">
            <div className="h-full bg-blue-500 transition-all duration-500"
              style={{ width: `${(trackLevels.filter(l => completedLevels.includes(l.level_id)).length / trackLevels.length) * 100}%` }} />
          </div>
        </div>
      </div>

      {/* ── SIDEBAR RESIZE HANDLE ──────────────────────────────────── */}
      <Divider axis="h" onMouseDown={sidebar.onMouseDown} />

      {/* ── CENTER: description ────────────────────────────────────── */}
      <div className="flex-1 flex flex-col bg-[#050B14] min-w-0 overflow-hidden">
        <header className="p-5 pb-4 bg-linear-to-b from-[#0a0f18] to-transparent shrink-0 backdrop-blur-md">
          <h1 className="text-2xl font-black text-white font-outfit uppercase tracking-tighter mb-2 leading-none">
            {activeLevel.level_title}
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed">{activeLevel.system_context}</p>
        </header>

        <div className="p-5 pt-2 flex-1 overflow-y-auto custom-scrollbar space-y-5">
          {/* Objective */}
          <section className="bg-[#0B1524]/50 border border-blue-500/10 rounded-2xl p-4 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 rounded-l-2xl" />
            <div className="text-ui-2xs font-black uppercase tracking-[0.2em] font-mono text-blue-400 mb-2 flex items-center gap-2 pl-2">
              <Terminal size={11} /> The_Objective
            </div>
            <p className="text-slate-300 leading-relaxed font-mono text-ui-xs whitespace-pre-wrap pl-2">{activeLevel.user_task}</p>
          </section>

          {/* Contract */}
          <section>
            <div className="text-ui-2xs font-black uppercase tracking-[0.2em] font-mono text-slate-500 mb-2 border-b border-white/5 pb-2">Contract Requirements</div>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-[#0a0f18] border border-white/5 rounded-xl p-3">
                <span className="text-ui-2xs font-black uppercase tracking-widest font-mono text-emerald-400 block mb-1">Input Mode</span>
                <span className="text-ui-xs font-bold text-white uppercase">{activeLevel.execution_mode}</span>
              </div>
              <div className="bg-[#0a0f18] border border-white/5 rounded-xl p-3">
                <span className="text-ui-2xs font-black uppercase tracking-widest font-mono text-amber-400 block mb-1">Output Format</span>
                <span className="text-ui-xs font-bold text-white uppercase">{activeLevel.output_contract.type}</span>
              </div>
            </div>
          </section>

          {/* ── MODEL MODE: Training Dataset Download + Workflow Guide ── */}
          {activeLevel.execution_mode === 'model' && (
            <section className="bg-linear-to-br from-violet-500/10 to-indigo-500/10 border border-violet-500/20 rounded-2xl p-5 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full bg-violet-500 rounded-l-2xl" />

              <div className="text-ui-2xs font-black uppercase tracking-[0.2em] font-mono text-violet-400 mb-3 flex items-center gap-2 pl-2">
                <Upload size={11} /> Model_Upload_Mode
              </div>

              <div className="pl-2 space-y-4">
                <p className="text-sm text-slate-300 leading-relaxed">
                  This level requires you to <span className="text-white font-bold">train a model locally</span> and upload the <code className="bg-white/10 px-1.5 py-0.5 rounded text-violet-300 text-xs">.pkl</code> file.
                </p>

                {/* Workflow Steps */}
                <div className="grid grid-cols-1 gap-2">
                  {[
                    { step: '1', label: 'Download training dataset', icon: '📥' },
                    { step: '2', label: 'Train model in your local IDE', icon: '🧪' },
                    { step: '3', label: 'Save as model.pkl (pickle.dump)', icon: '💾' },
                    { step: '4', label: 'Upload .pkl file (right panel)', icon: '📤' },
                    { step: '5', label: 'Write inference code in editor', icon: '✍️' },
                    { step: '6', label: 'Run & Evaluate on hidden data', icon: '🎯' },
                  ].map(s => (
                    <div key={s.step} className="flex items-center gap-3 bg-white/5 rounded-xl px-3 py-2">
                      <span className="text-lg">{s.icon}</span>
                      <span className="text-ui-xs text-slate-300">
                        <span className="text-violet-400 font-black mr-1">Step {s.step}:</span>{s.label}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Download Button */}
                {activeLevel.has_training_dataset && (
                  <button
                    onClick={handleDownloadDataset}
                    className="w-full flex items-center justify-center gap-3 py-3.5 rounded-xl bg-violet-600 hover:bg-violet-500 text-white font-black text-ui-xs uppercase tracking-[0.15em] font-mono shadow-lg shadow-violet-600/30 hover:shadow-violet-500/40 transition-all cursor-pointer hover:-translate-y-0.5 active:translate-y-0"
                  >
                    <Download size={16} />
                    Download Training Dataset (.zip)
                  </button>
                )}

                {activeLevel.training_dataset_files && (
                  <div className="text-ui-2xs text-slate-500 font-mono">
                    📦 Includes: {activeLevel.training_dataset_files.join(', ')}
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Failure cases */}
          {activeLevel.failure_cases && activeLevel.failure_cases.length > 0 && (
            <section>
              <div className="text-ui-2xs font-black uppercase tracking-[0.2em] font-mono text-slate-500 mb-2 border-b border-white/5 pb-2">Common Failures</div>
              <ul className="space-y-1.5">
                {activeLevel.failure_cases.map((fc, i) => (
                  <li key={i} className="flex gap-2 text-ui-xs text-rose-300/80 font-mono items-start">
                    <span className="text-ui-2xs bg-rose-500/10 text-rose-500 px-1.5 py-0.5 rounded mt-0.5 shrink-0">-</span> {fc}
                  </li>
                ))}
              </ul>
            </section>
          )}

          {/* Documentation Guide Link */}
          <section className="pt-2">
            <motion.button
              whileHover={{ scale: 1.02, backgroundColor: "rgba(34, 211, 238, 0.15)" }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(`/track/${trackId}/level/${activeLevel.level_id}/docs`)}
              className="w-full flex items-center justify-between p-5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 group transition-all cursor-pointer shadow-lg shadow-cyan-500/5"
            >
              <div className="flex items-center gap-4">
                <div className="bg-cyan-500 shadow-[0_0_15px_rgba(34,211,238,0.4)] p-2.5 rounded-xl text-white group-hover:scale-110 transition-transform">
                  <Book size={20} />
                </div>
                <div className="text-left">
                  <span className="block text-ui-2xs font-black uppercase tracking-[0.2em] font-mono text-cyan-400 group-hover:text-cyan-300 transition-colors">Documentation</span>
                  <span className="text-ui-xs font-bold text-white group-hover:text-cyan-100 transition-colors">Level Guide & Resources</span>
                </div>
              </div>
              <div className="text-cyan-500/30 group-hover:text-cyan-400 transition-colors pr-1">
                <ExternalLink size={20} />
              </div>
            </motion.button>
          </section>
        </div>
      </div>

      {/* ── RIGHT RESIZE HANDLE ────────────────────────────────────── */}
      <Divider axis="h" onMouseDown={rightPanel.onMouseDown} />

      {/* ── RIGHT PANEL: editor + console ─────────────────────────── */}
      <div style={{ width: rightPanel.size }} className="shrink-0 bg-[#0B0F1A] flex flex-col overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.5)]">

        {/* Title bar */}
        <div className="h-9 bg-[#05070A] border-b border-white/5 flex items-center px-4 shrink-0">
          <div className="flex gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
            <div className="w-2.5 h-2.5 rounded-full bg-slate-800" />
          </div>
          <div className="mx-auto text-ui-2xs font-black uppercase tracking-widest font-mono text-slate-500">Evaluation_Engine_v1</div>
        </div>

        {/* Editor area — grows with available space */}
        <div className="flex-1 flex flex-col min-h-0 bg-[#05070A]">
          {activeLevel.execution_mode === 'model' && (
            <div className="h-36 shrink-0 border-b border-white/5">
              <FileUpload onFileSelect={setSelectedFile} accept=".pkl,.csv" />
            </div>
          )}
          <div className="flex-1 min-h-0">
            <Editor
              height="100%" width="100%"
              language="python" theme="vs-dark"
              value={code} onChange={val => setCode(val || '')}
              options={{ minimap: { enabled: false }, fontSize: editorFontSize, fontFamily: '"JetBrains Mono", monospace', padding: { top: 12 }, wordWrap: 'on', scrollbar: { vertical: 'auto' }, overviewRulerBorder: false, hideCursorInOverviewRuler: true, renderLineHighlight: 'none' }}
            />
          </div>
        </div>

        {/* ── CONSOLE RESIZE HANDLE ─────────────────────────────── */}
        <Divider axis="v" onMouseDown={console_.onMouseDown} />

        {/* Console output */}
        <div style={{ height: console_.size }} className="shrink-0 bg-[#030508] flex flex-col overflow-hidden">

          {/* Console toolbar */}
          <div className="h-9 border-b border-white/5 flex items-center justify-between px-4 bg-[#0a0f18] shrink-0">
            <span className="text-ui-2xs font-black uppercase tracking-[0.2em] font-mono text-slate-500">Console_Output</span>
            <button
              onClick={handleRunAndEvaluate}
              disabled={running || (!selectedFile && activeLevel.execution_mode === 'model')}
              className={`h-7 px-4 rounded font-black text-ui-2xs uppercase tracking-widest font-mono transition-all flex items-center gap-2 ${running ? 'bg-blue-500/20 text-blue-400 cursor-wait' : (!selectedFile && activeLevel.execution_mode === 'model' ? 'bg-slate-800 text-slate-500 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_15px_rgba(37,99,235,0.4)]')}`}
            >
              {running ? <div className="w-2 h-2 rounded-full border border-blue-400 border-t-transparent animate-spin" /> : <Play size={9} />}
              {running ? 'Executing...' : 'Run_&_Evaluate'}
            </button>
          </div>

          {/* Console body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar p-3 font-mono text-ui-xs text-slate-300">
            {stderr && <div className="mb-3 whitespace-pre-wrap text-rose-400 bg-rose-500/5 p-2.5 rounded-lg border border-rose-500/10 text-ui-xs">{stderr}</div>}
            {stdout && <div className="whitespace-pre-wrap text-[#A3B8CC] text-ui-xs mb-3">{stdout}</div>}

            <AnimatePresence>
              {aiFeedback && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                  className={`mb-3 p-3 rounded-xl border ${passed ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-rose-500/10 border-rose-500/30'}`}>
                  <div className="flex items-center gap-2 mb-1.5">
                    <Bot size={12} className={passed ? 'text-emerald-400' : 'text-rose-400'} />
                    <span className={`text-ui-2xs font-black uppercase tracking-widest ${passed ? 'text-emerald-400' : 'text-rose-400'}`}>AI Analysis</span>
                  </div>
                  <p className="font-bold text-ui-xs text-white leading-relaxed mb-2">"{aiFeedback.feedback}"</p>
                  {aiFeedback.suggestions?.length > 0 && (
                    <div className="space-y-1 mt-1.5 border-t border-white/10 pt-1.5">
                      <span className="text-ui-2xs uppercase tracking-widest text-slate-500">Suggestions:</span>
                      {aiFeedback.suggestions.map((s: string, i: number) => (
                        <div key={i} className="text-ui-xs text-slate-300 opacity-80 wrap-break-word">• {s}</div>
                      ))}
                    </div>
                  )}
                </motion.div>
              )}
            </AnimatePresence>

            {!stdout && !stderr && !aiFeedback && (
              <div className="flex items-center justify-center h-full text-slate-600 uppercase tracking-widest font-black text-ui-2xs">System Idle_</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
