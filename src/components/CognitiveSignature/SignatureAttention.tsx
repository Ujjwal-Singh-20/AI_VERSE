import React, { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Line } from '@react-three/drei';
import * as THREE from 'three';
import type { SignatureConfig } from './SignatureConfig';

interface AttentionProps {
  config: SignatureConfig;
  nodePositions: THREE.Vector3[];
}

export const SignatureAttention: React.FC<AttentionProps> = ({ config, nodePositions }) => {
  const lines = useMemo(() => {
    const result = [];
    const count = Math.floor(config.nodeCount * config.attentionIntensity);
    
    // Deterministic pairs based on node count and seed influence
    for (let i = 0; i < count; i++) {
      const startIdx = i % nodePositions.length;
      const endIdx = (i * 7 + 3) % nodePositions.length;
      if (startIdx !== endIdx) {
        result.push({
          start: nodePositions[startIdx],
          end: nodePositions[endIdx],
          speed: 0.5 + (i % 5) * 0.2,
          offset: i * 0.5
        });
      }
    }
    return result;
  }, [config, nodePositions]);

  const materialsRef = useRef<(THREE.LineBasicMaterial | null)[]>([]);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();
    materialsRef.current.forEach((mat, i) => {
      if (mat) {
        const pulse = Math.sin(time * lines[i].speed + lines[i].offset) * 0.5 + 0.5;
        mat.opacity = pulse * 0.4 * config.attentionIntensity;
      }
    });
  });

  return (
    <group>
      {lines.map((line, i) => (
        <Line
          key={i}
          points={[line.start, line.end]}
          color={config.accentColor}
          lineWidth={1}
          transparent
          opacity={0.2}
          onUpdate={(self: any) => {
            if (self.material instanceof THREE.LineBasicMaterial) {
              materialsRef.current[i] = self.material;
            }
          }}
        />
      ))}
    </group>
  );
};
