import { useGLTF, Float, Html } from '@react-three/drei';
import { useRef, useMemo } from 'react';
import { useFrame } from '@react-three/fiber';
import { motion, AnimatePresence } from 'framer-motion';
import * as THREE from 'three';

interface IslandProps {
  url: string;
  position: [number, number, number];
  rotation?: [number, number, number];
  name: string;
  description: string;
  isActive: boolean;
  isHovered: boolean;
  color: string;
  onClick: () => void;
  onHover: (hovered: boolean) => void;
}

export function Island({ url, position, rotation = [0, 0, 0], name, isActive, isHovered, color, onClick, onHover }: IslandProps) {
  const { scene } = useGLTF(url);
  const groupRef = useRef<THREE.Group>(null);

  // Clone the scene so we can mutate it or use it multiple times independently if needed
  const clonedScene = useMemo(() => scene.clone(true), [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Scale animation
    const targetScale = isHovered ? 2.5 : 2.0;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), delta * 5);

    // Animate glow / materials if needed here on hover
    clonedScene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        const mat = mesh.material as THREE.MeshStandardMaterial;
        // Make sure it looks like matte plastic
        if (mat) {
          mat.roughness = Math.max(0.6, mat.roughness);
          mat.metalness = Math.min(0.1, mat.metalness);

          if (isHovered && !isActive) {
            mat.emissive = new THREE.Color(0x222222);
            mat.emissiveIntensity = 0.2;
          } else {
            mat.emissive = new THREE.Color(0x000000);
            mat.emissiveIntensity = 0;
          }
        }
      }
    });
  });

  return (
    <Float
      speed={1.5}
      rotationIntensity={0.15}
      floatIntensity={isHovered ? 2 : 1}
      floatingRange={[-0.2, 0.4]}
    >
      <group
        ref={groupRef}
        position={position}
        rotation={rotation}
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          onHover(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={() => {
          onHover(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <primitive object={clonedScene} />

        {/* Hover Label */}
        <Html center position={[0, 1.2, 0]} pointerEvents="none">
          <AnimatePresence>
            {isHovered && !isActive && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.8 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 5, scale: 0.9 }}
                className="whitespace-nowrap px-4 py-2 rounded-xl backdrop-blur-md border border-white/20 shadow-2xl flex flex-col items-center gap-1"
                style={{ background: `${color}22` }}
              >
                {/* <div className="text-[10px] font-black uppercase tracking-[0.3em] opacity-50" style={{ color }}>
                  Track_Active
                </div> */}
                <div className="text-sm font-black text-white uppercase tracking-tighter font-outfit">
                  {name}
                </div>

                {/* Pointer Decor */}
                <div
                  className="w-1.5 h-1.5 rounded-full absolute -bottom-3 left-1/2 -translate-x-1/2 shadow-[0_0_10px_rgba(255,255,255,0.5)]"
                  style={{ backgroundColor: color }}
                />
              </motion.div>
            )}
          </AnimatePresence>
        </Html>
      </group>
    </Float>
  );
}

// Preload the tracks
useGLTF.preload('/assets/builder_track%20(1).glb');
useGLTF.preload('/assets/genai_track.glb');
useGLTF.preload('/assets/agenticai_track.glb');
useGLTF.preload('/assets/deployer_track.glb');
