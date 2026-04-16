/**
 * Deterministic PRNG using Mulberry32
 */
export const createPRNG = (seed: string) => {
  // Simple hash for the seed string
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }

  // Mulberry32
  return () => {
    let t = (h += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
};

export type IdenticonArchetype = 'DecisionTree' | 'NeuralNetwork' | 'GraphNetwork' | 'Transformer' | 'ClusterField';

export interface IdenticonConfig {
  archetype: IdenticonArchetype;
  complexity: number;
  density: number;
  symmetry: number;
  attentionIntensity: number;
  headCount: number;
  colors: {
    base: string;
    neon: string;
    metal: string;
  };
}

const ARCHETYPES: IdenticonArchetype[] = ['DecisionTree', 'NeuralNetwork', 'GraphNetwork', 'Transformer', 'ClusterField'];

const PALETTES = {
  DecisionTree: { base: '#1a472a', neon: '#4ade80', metal: '#facc15' },
  NeuralNetwork: { base: '#1e3a8a', neon: '#38bdf8', metal: '#94a3b8' },
  GraphNetwork: { base: '#4c1d95', neon: '#a855f7', metal: '#f472b6' },
  Transformer: { base: '#1e1b4b', neon: '#6366f1', metal: '#818cf8' },
  ClusterField: { base: '#7c2d12', neon: '#fb923c', metal: '#fcd34d' }
};

export const generateConfig = (seed: string): IdenticonConfig => {
  const next = createPRNG(seed);
  
  const archetype = ARCHETYPES[Math.floor(next() * ARCHETYPES.length)];
  
  return {
    archetype,
    complexity: Math.floor(next() * 5) + 3, // 3 - 7
    density: next(),
    symmetry: next(),
    attentionIntensity: next(),
    headCount: Math.floor(next() * 4) + 2, // 2 - 5
    colors: PALETTES[archetype]
  };
};
