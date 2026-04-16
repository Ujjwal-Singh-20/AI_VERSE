import React, { useState, Suspense, useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Float, ContactShadows, Environment } from '@react-three/drei';
import * as THREE from 'three';
import { generateConfig } from './SeededPRNG';
import { DecisionTree, NeuralNetwork, GraphNetwork, Transformer, ClusterField } from './Archetypes';
import { AttentionField } from './AttentionField';

interface UserAIIdenticonProps {
  seed: string;
}

const ArchetypeMap = {
  DecisionTree,
  NeuralNetwork,
  GraphNetwork,
  Transformer,
  ClusterField
};

export const UserAIIdenticon: React.FC<UserAIIdenticonProps> = ({ seed }) => {
  const config = useMemo(() => generateConfig(seed), [seed]);
  const [nodes, setNodes] = useState<THREE.Vector3[]>([]);
  
  const ArchetypeComponent = ArchetypeMap[config.archetype];

  return (
    <div className="w-full h-full relative group">
      <Canvas camera={{ position: [0, 0, 8], fov: 40 }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.5} />
          <pointLight position={[10, 10, 10]} intensity={1.5} />
          <directionalLight position={[-5, 5, 5]} intensity={1} color={config.colors.neon} />
          
          <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
            <group rotation={[0, 0, 0]}>
              <ArchetypeComponent 
                seed={seed} 
                complexity={config.complexity} 
                density={config.density} 
                symmetry={config.symmetry} 
                colors={config.colors}
                onNodesGenerated={setNodes}
              />
              
              {nodes.length > 0 && (
                <AttentionField 
                  nodes={nodes} 
                  seed={seed} 
                  headCount={config.headCount} 
                  neonColor={config.colors.neon} 
                />
              )}
            </group>
          </Float>

          <ContactShadows 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={10} 
            resolution={512} 
            color={config.colors.base} 
          />
          <Environment preset="night" />
        </Suspense>
        <OrbitControls enableZoom={false} enablePan={false} />
      </Canvas>
      
      {/* Label Overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
        <label className="text-[8px] font-black tracking-[0.4em] text-white/40 uppercase">
          COGNITIVE_SIGNATURE // {config.archetype}_{seed}
        </label>
      </div>
    </div>
  );
};
