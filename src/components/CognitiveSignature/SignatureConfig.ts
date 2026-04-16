// Deterministic PRNG and Config for Cognitive Signature
export type Archetype = 'Neural' | 'Graph' | 'Transformer';

export interface SignatureConfig {
  archetype: Archetype;
  nodeCount: number;
  radius: number;
  attentionIntensity: number;
  symmetry: number;
  accentColor: string;
  seed: string;
}

export const getSignatureConfig = (seed: string): SignatureConfig => {
  // Simple hash
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = (Math.imul(31, h) + seed.charCodeAt(i)) | 0;
  }
  if (h === 0) h = 1;

  // Mulberry32
  const next = () => {
    h = (h + 0x6D2B79F5) | 0;
    let t = Math.imul(h ^ (h >>> 15), h | 1);
    t = (t + Math.imul(t ^ (t >>> 7), t | 61)) | 0;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };

  const archetypes: Archetype[] = ['Neural', 'Graph', 'Transformer'];
  const archetype = archetypes[Math.floor(next() * archetypes.length)];
  
  const nodeCount = Math.floor(next() * 11) + 6; // 6-16
  const radius = next() * 1.5 + 1.5; // 1.5-3.0
  const attentionIntensity = next() * 0.7 + 0.3; // 0.3-1.0
  const symmetry = next();

  const colors = ['#00E5FF', '#8A4FFF', '#4D99FF', '#FF4FD8'];
  const accentColor = colors[Math.floor(next() * colors.length)];

  return {
    archetype,
    nodeCount,
    radius,
    attentionIntensity,
    symmetry,
    accentColor,
    seed
  };
};
