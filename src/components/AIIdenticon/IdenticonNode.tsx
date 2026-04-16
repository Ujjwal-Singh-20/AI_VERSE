import React, { useRef, useState } from 'react';
import { useFrame } from '@react-three/fiber';
import { MeshDistortMaterial } from '@react-three/drei';
import * as THREE from 'three';

interface NodeProps {
  position: [number, number, number];
  color: string;
  neonColor: string;
  size?: number;
}

export const IdenticonNode: React.FC<NodeProps> = ({ position, color, neonColor, size = 0.15 }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  const [hovered, setHovered] = useState(false);
  
  useFrame((state) => {
    if (!meshRef.current) return;
    
    // Subtle float
    const time = state.clock.getElapsedTime();
    meshRef.current.position.y = position[1] + Math.sin(time + position[0]) * 0.05;
    
    // Scale on hover
    const targetScale = hovered ? 1.5 : 1;
    meshRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <mesh 
      ref={meshRef} 
      position={position}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
    >
      <sphereGeometry args={[size, 16, 16]} />
      <MeshDistortMaterial 
        color={hovered ? neonColor : color}
        emissive={hovered ? neonColor : '#000000'}
        emissiveIntensity={hovered ? 2 : 0}
        distort={hovered ? 0.4 : 0}
        speed={2}
        transmission={0.8}
        thickness={0.5}
        roughness={0.1}
      />
    </mesh>
  );
};
