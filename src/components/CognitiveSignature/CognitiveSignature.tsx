import React, { useMemo, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { PerspectiveCamera, OrbitControls, Float } from '@react-three/drei';
import { getSignatureConfig } from './SignatureConfig';
import { NeuralArchetype, GraphArchetype, TransformerArchetype } from './SignatureArchetypes';
import { SignatureAttention } from './SignatureAttention';
import * as THREE from 'three';

interface CognitiveSignatureProps {
  seed: string;
}

const SignatureScene: React.FC<{ seed: string }> = ({ seed }) => {
  const config = useMemo(() => getSignatureConfig(seed), [seed]);

  const nodePositions = useMemo(() => {
    // We need to calculate node positions here to share with attention layer
    // This logic mimics the archetypes but centralized
    const result: THREE.Vector3[] = [];
    if (config.archetype === 'Neural') {
      const layers = 3;
      const nodesPerLayer = Math.ceil(config.nodeCount / layers);
      for (let l = 0; l < layers; l++) {
        for (let i = 0; i < nodesPerLayer; i++) {
          if (result.length >= config.nodeCount) break;
          result.push(new THREE.Vector3((l - (layers - 1) / 2) * 2, (i - (nodesPerLayer - 1) / 2) * 1.2, 0));
        }
      }
    } else if (config.archetype === 'Graph') {
      for (let i = 0; i < config.nodeCount; i++) {
        const phi = Math.acos(-1 + (2 * i) / config.nodeCount);
        const theta = Math.sqrt(config.nodeCount * Math.PI) * phi;
        result.push(new THREE.Vector3(
          config.radius * Math.cos(theta) * Math.sin(phi) * 0.5,
          config.radius * Math.sin(theta) * Math.sin(phi) * 0.5,
          config.radius * Math.cos(phi) * 0.5
        ));
      }
    } else {
      for (let i = 0; i < config.nodeCount; i++) {
        const angle = (i / config.nodeCount) * Math.PI * 2;
        result.push(new THREE.Vector3(Math.cos(angle) * config.radius, Math.sin(angle) * config.radius, 0));
      }
    }
    return result;
  }, [config]);

  return (
    <>
      <color attach="background" args={['#0B0F1A']} />
      <ambientLight intensity={0.2} />
      <pointLight position={[10, 10, 10]} intensity={1} color={config.accentColor} />
      
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group rotation={[0, 0, 0]}>
          {config.archetype === 'Neural' && <NeuralArchetype config={config} />}
          {config.archetype === 'Graph' && <GraphArchetype config={config} />}
          {config.archetype === 'Transformer' && <TransformerArchetype config={config} />}
          
          <SignatureAttention config={config} nodePositions={nodePositions} />
        </group>
      </Float>

      {/* Label and background glow */}
      <mesh position={[0, 0, -5]}>
        <planeGeometry args={[20, 20]} />
        <meshBasicMaterial color="#0B0F1A" transparent opacity={0.5} />
      </mesh>
    </>
  );
};

export const CognitiveSignature: React.FC<CognitiveSignatureProps> = ({ seed }) => {
  return (
    <div className="w-full h-full relative cursor-crosshair">
      <Canvas gl={{ alpha: true }} dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[0, 0, 8]} fov={40} />
        <Suspense fallback={null}>
          <SignatureScene seed={seed} />
        </Suspense>
        <OrbitControls 
          enableZoom={false} 
          enablePan={false} 
          autoRotate 
          autoRotateSpeed={0.5} 
        />
      </Canvas>
      <div className="absolute bottom-4 left-0 right-0 text-center pointer-events-none">
        <span className="text-[10px] font-black tracking-[0.4em] text-white/20 uppercase font-mono">
          Cognitive_Signature // {seed}
        </span>
      </div>
    </div>
  );
};
