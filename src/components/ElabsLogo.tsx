import { useGLTF } from '@react-three/drei';

export function ElabsLogo() {
  const { scene } = useGLTF('/assets/ELABS_LOGO.glb');

  return (
    <primitive
      object={scene}
      scale={[4.5, 4.5, 4.5]}
      position={[0, -1, 0]}
      rotation={[0, -Math.PI / 2, 0]}
      castShadow
      receiveShadow
    />
  );
}

// Preload the logo
useGLTF.preload('/assets/ELABS_LOGO.glb');
