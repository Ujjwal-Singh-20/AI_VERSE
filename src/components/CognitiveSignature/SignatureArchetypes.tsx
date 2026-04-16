import React, { useMemo } from 'react';
import * as THREE from 'three';
import type { SignatureConfig } from './SignatureConfig';

interface ArchetypeProps {
  config: SignatureConfig;
}

export const NeuralArchetype: React.FC<ArchetypeProps> = ({ config }) => {
  const nodes = useMemo(() => {
    const result = [];
    const layers = 3;
    const nodesPerLayer = Math.ceil(config.nodeCount / layers);
    
    for (let l = 0; l < layers; l++) {
      for (let i = 0; i < nodesPerLayer; i++) {
        if (result.length >= config.nodeCount) break;
        const x = (l - (layers - 1) / 2) * 2;
        const y = (i - (nodesPerLayer - 1) / 2) * 1.2;
        result.push(new THREE.Vector3(x, y, 0));
      }
    }
    return result;
  }, [config]);

  return (
    <group>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial 
            emissive={config.accentColor} 
            emissiveIntensity={2} 
            color={config.accentColor}
            transparent
            opacity={0.8}
          />
        </mesh>
      ))}
    </group>
  );
};

export const GraphArchetype: React.FC<ArchetypeProps> = ({ config }) => {
  const nodes = useMemo(() => {
    const result = [];
    // Pseudo-random but deterministic based on config.seed (via config derivation)
    // We'll just use the radius and some trig for a "brain-like" cluster
    for (let i = 0; i < config.nodeCount; i++) {
      const phi = Math.acos(-1 + (2 * i) / config.nodeCount);
      const theta = Math.sqrt(config.nodeCount * Math.PI) * phi;
      const x = config.radius * Math.cos(theta) * Math.sin(phi) * 0.5;
      const y = config.radius * Math.sin(theta) * Math.sin(phi) * 0.5;
      const z = config.radius * Math.cos(phi) * 0.5;
      result.push(new THREE.Vector3(x, y, z));
    }
    return result;
  }, [config]);

  return (
    <group>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.12, 16, 16]} />
          <meshStandardMaterial 
            emissive={config.accentColor} 
            emissiveIntensity={1.5} 
            color={config.accentColor}
          />
        </mesh>
      ))}
    </group>
  );
};

export const TransformerArchetype: React.FC<ArchetypeProps> = ({ config }) => {
  const nodes = useMemo(() => {
    const result = [];
    const radius = config.radius;
    for (let i = 0; i < config.nodeCount; i++) {
      const angle = (i / config.nodeCount) * Math.PI * 2;
      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      result.push(new THREE.Vector3(x, y, 0));
    }
    return result;
  }, [config]);

  return (
    <group>
      {nodes.map((pos, i) => (
        <mesh key={i} position={pos}>
          <sphereGeometry args={[0.18, 16, 16]} />
          <meshStandardMaterial 
            emissive={config.accentColor} 
            emissiveIntensity={2.5} 
            color={config.accentColor}
          />
        </mesh>
      ))}
    </group>
  );
};
