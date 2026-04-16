import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { ArrowLeft, Users, ShieldCheck, Search, LogOut } from 'lucide-react';
import { motion } from 'framer-motion';

interface UserProgress {
  roll_number: string;
  display_name: string;
  email: string;
  role: string;
  in_progress: any[];
  completed: any[];
}

interface AllProgress {
  members: UserProgress[];
  users: UserProgress[];
}

export const AdminPage: React.FC<{ onBack: () => void }> = ({ onBack }) => {
  const { user, logOut } = useAuth();
  const [data, setData] = useState<AllProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserProgress | null>(null);

  useEffect(() => {
    const fetchAllProgress = async () => {
      try {
        const token = await user?.getIdToken();
        const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
        const response = await fetch(`${backendUrl}/admin/all-progress`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        if (response.ok) {
          const result = await response.json();
          setData(result);
        }
      } catch (err) {
        console.error("Error fetching admin data", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAllProgress();
  }, [user]);

  const filteredMembers = data?.members.filter(m =>
    m.display_name.toLowerCase().includes(search.toLowerCase()) ||
    m.roll_number.includes(search)
  ) || [];

  const filteredUsers = data?.users.filter(u =>
    u.display_name.toLowerCase().includes(search.toLowerCase()) ||
    u.roll_number.includes(search)
  ) || [];

  return (
    <div className="w-screen h-screen bg-[#f8fbff] text-slate-900 flex flex-col p-6 overflow-y-auto font-sans relative">
      {/* Header */}
      <div className="w-full max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div className="flex items-center gap-6">
          <button
            onClick={onBack}
            className="p-3 bg-white rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-all group cursor-pointer"
          >
            <ArrowLeft size={20} className="text-slate-400 group-hover:text-blue-600" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-800 tracking-tight uppercase font-outfit">Control Center</h1>
            <p className="text-slate-500 font-black text-[10px] uppercase tracking-[0.3em] mt-1 font-mono">AI VERSE // ADMINISTRATION</p>
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="relative">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" />
            <input
              type="text"
              placeholder="Search roll number..."
              className="pl-12 pr-6 py-3 bg-white border border-slate-100 rounded-2xl shadow-inner focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-80 text-sm font-bold transition-all font-inter"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <button
            onClick={logOut}
            className="flex items-center gap-2 text-slate-500 hover:text-red-500 transition-all text-[10px] font-black uppercase tracking-[0.2em] font-mono cursor-pointer"
          >
            <LogOut size={16} />
            SIGN_OUT
          </button>
        </div>
      </div>

      <div className="w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Members Column */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 text-[10px] font-black text-blue-700 uppercase tracking-[0.3em] font-mono">
              <ShieldCheck size={16} />
              Platform Members ({filteredMembers.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {loading ? <Skeleton /> : filteredMembers.map(m => (
              <UserCard key={m.roll_number} user={m} onClick={() => setSelectedUser(m)} />
            ))}
          </div>
        </section>

        {/* Regular Users Column */}
        <section className="flex flex-col gap-6">
          <div className="flex items-center justify-between px-2">
            <h2 className="flex items-center gap-2 text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] font-mono">
              <Users size={16} />
              Enrolled Users ({filteredUsers.length})
            </h2>
          </div>

          <div className="grid gap-4">
            {loading ? <Skeleton /> : filteredUsers.map(u => (
              <UserCard key={u.roll_number} user={u} onClick={() => setSelectedUser(u)} />
            ))}
          </div>
        </section>
      </div>

      {/* Full Journey Modal */}
      <AnimatePresence>
        {selectedUser && (
          <FullJourneyModal
            user={selectedUser}
            onClose={() => setSelectedUser(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

import { CognitiveSignature } from '../components/CognitiveSignature/CognitiveSignature';
import { CheckCircle2, PlayCircle, X } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';

const FullJourneyModal = ({ user, onClose }: { user: UserProgress; onClose: () => void }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-xl flex items-center justify-center p-6"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.9, opacity: 0, y: 20 }}
        className="bg-white w-full max-w-4xl h-[80vh] rounded-[48px] shadow-2xl overflow-hidden flex flex-col md:flex-row border border-white/20"
      >
        {/* Left: Signature & Info */}
        <div className="w-full md:w-2/5 bg-[#0B0F1A] p-10 flex flex-col items-center justify-center text-center relative">
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/5 hover:bg-white/10 rounded-full text-white/40 hover:text-white transition-all cursor-pointer"
          >
            <X size={24} />
          </button>

          <div className="w-64 h-64 mb-8">
            <CognitiveSignature seed={user.roll_number} />
          </div>

          <h2 className="text-3xl font-black text-white uppercase tracking-tight font-outfit mb-2">{user.display_name}</h2>
          <p className="text-blue-400/60 font-mono text-[10px] uppercase tracking-[0.3em] mb-8">{user.email}</p>

          <div className="flex gap-4">
            <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-white/20 uppercase font-mono mb-1">Status</p>
              <p className={`text-[10px] font-black uppercase tracking-widest font-mono ${user.role === 'admin' ? 'text-red-400' : 'text-blue-400'}`}>{user.role}</p>
            </div>
            <div className="bg-white/5 px-4 py-2 rounded-2xl border border-white/10">
              <p className="text-[10px] font-black text-white/20 uppercase font-mono mb-1">ID</p>
              <p className="text-[10px] font-black uppercase tracking-widest font-mono text-white/80">{user.roll_number}</p>
            </div>
          </div>
        </div>

        {/* Right: Detailed Journey List */}
        <div className="flex-1 bg-white p-12 overflow-y-auto">
          <div className="flex flex-col gap-10">
            {/* In Progress */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-blue-600/60 mb-6 font-mono">Current_Focus</h3>
              <div className="flex flex-col gap-4">
                {user.in_progress.length === 0 ? (
                  <p className="text-slate-300 font-bold italic text-sm">No active tracks...</p>
                ) : user.in_progress.map((track, i) => (
                  <div key={i} className="p-6 bg-slate-50 border border-slate-100 rounded-3xl relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <h4 className="font-black text-slate-800 font-outfit uppercase">{track.trackName}</h4>
                        <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest font-mono">Lv: {track.levelName}</p>
                      </div>
                      <PlayCircle size={20} className="text-blue-600/30 group-hover:text-blue-600 transition-all" />
                    </div>
                    <div className="w-full h-1.5 bg-white border border-slate-100 rounded-full overflow-hidden">
                      <div className="h-full bg-blue-500" style={{ width: `${(track.progress || 0.1) * 100}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Completed */}
            <section>
              <h3 className="text-[10px] font-black uppercase tracking-[0.3em] text-emerald-600/60 mb-6 font-mono">Completed_Modules</h3>
              <div className="grid grid-cols-1 gap-4">
                {user.completed.length === 0 ? (
                  <p className="text-slate-300 font-bold italic text-sm">No completions yet...</p>
                ) : user.completed.map((track, i) => (
                  <div key={i} className="p-6 bg-emerald-50/50 border border-emerald-100 rounded-3xl">
                    <h4 className="font-black text-emerald-900 font-outfit uppercase mb-4">{track.trackName}</h4>
                    <div className="flex flex-wrap gap-2">
                      {track.completedLevels?.map((lvl: string) => (
                        <div key={lvl} className="flex items-center gap-2 bg-white border border-emerald-100 px-3 py-1 rounded-full text-[9px] font-black text-emerald-600 uppercase tracking-widest font-mono">
                          <CheckCircle2 size={12} />
                          {lvl}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const UserCard = ({ user, onClick }: { user: UserProgress; onClick: () => void }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    whileHover={{ y: -5, scale: 1.01 }}
    onClick={onClick}
    className="bg-white border border-slate-200 p-6 rounded-[32px] shadow-sm hover:shadow-2xl hover:border-blue-300 transition-all group cursor-pointer"
  >
    <div className="flex justify-between items-start">
      <div className="flex gap-4">
        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-black text-[10px] font-mono ${user.role === 'admin' ? 'bg-red-50 text-red-600' : (user.role === 'member' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-400')}`}>
          {user.roll_number.slice(-4)}
        </div>
        <div>
          <h3 className="font-black text-slate-800 group-hover:text-blue-600 transition-colors uppercase tracking-tight line-clamp-1 font-outfit">{user.display_name}</h3>
          <p className="text-[10px] font-bold text-slate-500 tracking-widest font-mono">ID: {user.roll_number}</p>
        </div>
      </div>

      {user.role !== 'user' && (
        <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border font-mono ${user.role === 'admin' ? 'bg-red-50 text-red-600 border-red-100' : 'bg-blue-50 text-blue-600 border-blue-100'}`}>
          {user.role}
        </span>
      )}
    </div>

    <div className="mt-6 flex flex-col gap-3">
      <div className="flex justify-between items-center text-[9px] font-black uppercase tracking-[0.2em] text-slate-500 px-1 font-mono">
        <span>Audit_Progress</span>
        <span className="text-slate-800">{user.completed.length} / {user.in_progress.length + user.completed.length} Tracks</span>
      </div>
      <div className="w-full h-1.5 bg-slate-50 rounded-full overflow-hidden flex">
        {user.completed.map((_, i) => (
          <div key={i} className="h-full bg-emerald-400 flex-1 border-r border-white/20 last:border-0" />
        ))}
        {user.in_progress.map((_, i) => (
          <div key={i} className="h-full bg-blue-400 flex-1 border-r border-white/20 last:border-0" />
        ))}
        {(user.in_progress.length + user.completed.length === 0) && <div className="h-full bg-slate-100 w-full" />}
      </div>
    </div>
  </motion.div>
);

const Skeleton = () => (
  <div className="flex flex-col gap-4">
    {[1, 2, 3].map(i => (
      <div key={i} className="h-32 bg-slate-100 rounded-[32px] animate-pulse" />
    ))}
  </div>
);
