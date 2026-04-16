import { Cloud, Clouds, Sky, Sparkles, useGLTF } from '@react-three/drei';
import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

function LowPolyOcean() {
  const geomRef = useRef<THREE.PlaneGeometry>(null);

  useFrame((state) => {
    if (!geomRef.current) return;
    const time = state.clock.getElapsedTime() * 1.2;
    const position = geomRef.current.attributes.position;

    if (!geomRef.current.attributes.color) {
      const colorArray = new Float32Array(position.count * 3);
      geomRef.current.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
    }

    const colors = geomRef.current.attributes.color;

    const deepColor = new THREE.Color("#0a4b80");
    const shallowColor = new THREE.Color("#4ab8f9");
    const tempColor = new THREE.Color();

    for (let i = 0; i < position.count; i++) {
      const x = position.getX(i);
      const y = position.getY(i);

      const wave = Math.sin(x * 0.2 + time) + Math.cos(y * 0.2 + time);
      const z = wave * 0.4;
      position.setZ(i, z);

      const normalizedZ = Math.max(0, Math.min(1, (z + 0.8) / 1.6));
      tempColor.copy(deepColor).lerp(shallowColor, normalizedZ);
      colors.setXYZ(i, tempColor.r, tempColor.g, tempColor.b);
    }

    position.needsUpdate = true;
    colors.needsUpdate = true;
    geomRef.current.computeVertexNormals();
  });

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -4, 0]} receiveShadow>
      <planeGeometry ref={geomRef} args={[250, 250, 100, 100]} />
      <meshStandardMaterial
        vertexColors={true}
        flatShading={false}
        side={THREE.DoubleSide}
        roughness={0.2}
        metalness={0.1}
      />
    </mesh>
  );
}

function IslandTerrain() {
  const { scene } = useGLTF('/assets/island_terrain.glb');

  return (
    <primitive
      object={scene}
      scale={[23, 23, 23]} // Scaled to 25x to ensure track islands fit inside the hole
      position={[0.5, -2, -0.5]}
      rotation={[0, 0, 0]}
      receiveShadow
      castShadow
    />
  );
}

// Preload the terrain
useGLTF.preload('/assets/island_terrain.glb');

export function OceanEnvironment() {
  return (
    <>
      <ambientLight intensity={0.5} color="#ffffff" />
      <directionalLight
        position={[15, 30, -10]}
        intensity={1.2}
        castShadow
        shadow-bias={-0.0001}
        shadow-mapSize={[2048, 2048]}
      />

      <Sky sunPosition={[0, 2, -20]} inclination={0} azimuth={180} turbidity={6} rayleigh={1.5} />
      <fog attach="fog" args={['#a2d2f2', 30, 120]} />

      <Sparkles count={150} scale={50} size={4} speed={0.4} opacity={0.3} color="#ffffff" position={[0, 2, 0]} />

      {/* 3D Terrain Ring surrounding the tracks */}
      <IslandTerrain />

      {/* Clouds Layered at different heights and distances */}
      <Clouds material={THREE.MeshBasicMaterial}>
        <Cloud segments={20} bounds={[10, 2, 10]} volume={6} color="#ffffff" position={[10, 12, -25]} opacity={0.6} />
        <Cloud segments={15} bounds={[10, 2, 10]} volume={5} color="#ffffff" position={[-20, 14, -15]} opacity={0.5} />
        <Cloud segments={25} bounds={[15, 3, 10]} volume={8} color="#ffffff" position={[5, 16, 12]} opacity={0.6} />
        <Cloud segments={10} bounds={[5, 1, 5]} volume={3} color="#e0f0ff" position={[-15, 8, 15]} opacity={0.4} />
        <Cloud segments={30} bounds={[20, 4, 15]} volume={10} color="#ffffff" position={[35, 18, -30]} opacity={0.7} />
        <Cloud segments={30} bounds={[20, 4, 15]} volume={10} color="#ffffff" position={[-40, 15, -40]} opacity={0.5} />
      </Clouds>

      <LowPolyOcean />
    </>
  );
}
