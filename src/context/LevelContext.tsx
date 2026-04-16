import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './AuthContext';

export interface Level {
  level_id: string;
  track: string;
  level_title: string;
  resource_link: string;
  resource_links?: { title: string; link: string }[];
  execution_mode: 'code' | 'model' | 'api';
  input_contract: any;
  output_contract: any;
  goal: string;
  system_context: string;
  user_task: string;
  initial_code: string;
  failure_cases: string[];
  hint_system: any[];
  why_this_matters: string;
  evaluation_type?: string;
  _phase?: number;
  has_training_dataset?: boolean;
  training_dataset_description?: string;
  training_dataset_files?: string[];
  guide_markdown?: string;
}

export interface TrackData {
  id: string;
  name: string;
  subtitle: string;
  color: string;
  icon: string;
  description: string;
  what_you_build: string;
  what_you_learn: string[];
  why_it_matters: string;
  levels: Level[];
}

interface LevelContextType {
  tracks: TrackData[];
  suggestedRoute: string[];
  completedLevels: string[];
  isAdmin: boolean;
  loading: boolean;
  refreshLevels: () => Promise<void>;
  refreshProgress: () => Promise<void>;
  isLevelUnlocked: (trackId: string, levelId: string) => boolean;
  getTrackLevels: (trackId: string) => Level[];
  getLevelData: (levelId: string) => Level | undefined;
  brainrotMode: boolean;
  setBrainrotMode: (val: boolean) => void;
}

const LevelContext = createContext<LevelContextType | null>(null);

export const LevelProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, isAdmin } = useAuth();
  const [tracks, setTracks] = useState<TrackData[]>([]);
  const [suggestedRoute, setSuggestedRoute] = useState<string[]>([]);
  const [completedLevels, setCompletedLevels] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch static level data
  const refreshLevels = React.useCallback(async () => {
    try {
      const token = user ? await user.getIdToken() : null;
      const headers: any = {};
      if (token) headers['Authorization'] = `Bearer ${token}`;
      
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/levels`, { headers });
      if (res.ok) {
        const data = await res.json();
        setTracks(data.tracks || []);
        setSuggestedRoute(data.suggested_route || []);
      }
    } catch (e) {
      console.error("Error fetching levels", e);
    }
  }, [user]);

  // Initial levels fetch
  useEffect(() => {
    refreshLevels();
  }, [refreshLevels]);

  // Fetch user progression
  const refreshProgress = React.useCallback(async () => {
    if (!user) return;
    try {
      const token = await user.getIdToken();
      const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
      const res = await fetch(`${backendUrl}/user/profile`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        // Flatten completed levels
        const allCompleted: string[] = [];
        (data.completed || []).forEach((t: any) => {
          allCompleted.push(...(t.completedLevels || []));
        });
        setCompletedLevels(allCompleted);
      }
    } catch (e) {
      console.error("Error fetching progress", e);
    }
  }, [user]);

  useEffect(() => {
    if (user) {
      refreshProgress().finally(() => setLoading(false));
    } else {
      setLoading(false);
      setCompletedLevels([]);
    }
  }, [user, refreshProgress]);

  const getTrackLevels = (trackId: string) => {
    return tracks.find(t => t.id === trackId)?.levels || [];
  };

  const getLevelData = (levelId: string) => {
    for (const track of tracks) {
      const level = track.levels.find(l => l.level_id === levelId);
      if (level) return level;
    }
    return undefined;
  };

  const isLevelUnlocked = (trackId: string, levelId: string) => {
    if (isAdmin) return true;
    
    // A level is unlocked if it's the first level, OR if all previous levels in the sequence are completed
    const trackLevels = getTrackLevels(trackId);
    if (!trackLevels.length) return false;
    
    const levelIdx = trackLevels.findIndex(l => l.level_id === levelId);
    if (levelIdx === -1) return false; // not found
    if (levelIdx === 0) return true; // first level always unlocked
    
    // Check if the strictly previous level is completed. 
    // Usually, you might require ALL previous, but strict linear sequence is best evaluated by checking if levelIdx - 1 is completed
    const previousLevelId = trackLevels[levelIdx - 1].level_id;
    return completedLevels.includes(previousLevelId);
  };

  const [brainrotMode, setBrainrotMode] = useState(false);

  return (
    <LevelContext.Provider value={{
      tracks,
      suggestedRoute,
      completedLevels,
      isAdmin,
      loading,
      refreshLevels,
      refreshProgress,
      isLevelUnlocked,
      getTrackLevels,
      getLevelData,
      brainrotMode,
      setBrainrotMode
    }}>
      {children}
    </LevelContext.Provider>
  );
};

export const useLevels = () => {
  const context = useContext(LevelContext);
  if (!context) throw new Error("useLevels must be used within LevelProvider");
  return context;
};
