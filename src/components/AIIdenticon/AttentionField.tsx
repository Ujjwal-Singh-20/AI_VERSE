import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import { createPRNG } from './SeededPRNG';

interface AttentionFieldProps {
  nodes: THREE.Vector3[];
  seed: string;
  headCount: number;
  neonColor: string;
}

export const AttentionField: React.FC<AttentionFieldProps> = ({ nodes, seed, headCount, neonColor }) => {
  const next = createPRNG(seed + 'attention');
  
  // Select headCount pairs of nodes
  const heads = useMemo(() => {
    return Array.from({ length: headCount }).map(() => {
      const idx1 = Math.floor(next() * nodes.length);
      const idx2 = Math.floor(next() * nodes.length);
      return {
        start: nodes[idx1],
        end: nodes[idx2],
        offset: next() * Math.PI * 2,
        speed: 0.5 + next() * 1.5
      };
    });
  }, [nodes, seed, headCount]);

  const groupRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!groupRef.current) return;
    const time = state.clock.getElapsedTime();
    
    // Pulse lines
    groupRef.current.children.forEach((child: any, i) => {
      if (child.material) {
        const head = heads[i];
        if (head) {
          const pulse = (Math.sin(time * head.speed + head.offset) + 1) / 2;
          child.material.opacity = 0.1 + pulse * 0.5;
          child.material.lineWidth = 1 + pulse * 2;
        }
      }
    });
  });

  return (
    <group ref={groupRef}>
      {heads.map((head, i) => (
        <Line 
          key={i}
          points={[head.start, head.end]}
          color={neonColor}
          transparent
          opacity={0.3}
          lineWidth={2}
          blending={THREE.AdditiveBlending}
        />
      ))}
    </group>
  );
};
