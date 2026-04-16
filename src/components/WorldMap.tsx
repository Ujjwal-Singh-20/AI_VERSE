import { useState, useRef, useEffect } from 'react';
import { Island } from './Island';
import { CameraControls } from '@react-three/drei';
import { Connections } from './Connections';
import { useLevels } from '../context/LevelContext';

export const POSITIONS: Record<string, { pos: [number, number, number], url: string, rotation?: [number, number, number] }> = {
  'builder': { pos: [0, 0, 6.5], url: '/assets/builder_track (1).glb' },
  'genai': { pos: [6.18, 0, 2.0], url: '/assets/genai_track.glb' },
  'agentic': { pos: [3.82, 0, -5.26], url: '/assets/agenticai_track.glb' },
  'deployment': { pos: [-3.82, 0, -5.26], url: '/assets/deploy_track.glb', rotation: [0, Math.PI, 0] },
  'ml_pipeline': { pos: [-6.18, 0, 2.0], url: '/assets/mlpipeline_track.glb', rotation: [0, Math.PI, 0] }
};

export function WorldMap({ activeTrack, setActiveTrack }: { activeTrack: string | null; setActiveTrack: (id: string | null) => void }) {
  const [hoveredTrack, setHoveredTrack] = useState<string | null>(null);
  const cameraControlsRef = useRef<CameraControls>(null);
  const { tracks } = useLevels();

  useEffect(() => {
    if (!cameraControlsRef.current) return;

    if (activeTrack && POSITIONS[activeTrack]) {
      const [x, y, z] = POSITIONS[activeTrack].pos;
      if (x === 0 && z === 0) {
        // Center island handling
        cameraControlsRef.current.setLookAt(
          8, y + 6, 8,
          x, y, z,
          true
        );
      } else {
        const len = Math.sqrt(x * x + z * z);
        const nx = x / len;
        const nz = z / len;

        cameraControlsRef.current.setLookAt(
          x + nx * 8, y + 4, z + nz * 8,
          x, y - 1.5, z,
          true
        );
      }
    } else {
      cameraControlsRef.current.setLookAt(
        0, 12, 18,
        0, 0, 0,
        true
      );
    }
  }, [activeTrack]);

  return (
    <>
      <CameraControls
        ref={cameraControlsRef}
        minDistance={5}
        maxDistance={60}
        maxPolarAngle={Math.PI / 2.1}
        makeDefault
      />
      <group>
        <Connections />
        {tracks.map((track) => (
          <Island
            key={track.id}
            url={POSITIONS[track.id]?.url}
            position={POSITIONS[track.id]?.pos || [0, 0, 0]}
            rotation={POSITIONS[track.id]?.rotation || [0, 0, 0]}
            name={track.name}
            description={track.description}
            color={track.color}
            isActive={activeTrack === track.id}
            isHovered={hoveredTrack === track.id}
            onClick={() => setActiveTrack(activeTrack === track.id ? null : track.id)}
            onHover={(hovered) => setHoveredTrack(hovered ? track.id : null)}
          />
        ))}
      </group>
    </>
  );
}
