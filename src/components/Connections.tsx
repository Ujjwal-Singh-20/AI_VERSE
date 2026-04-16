import { QuadraticBezierLine } from '@react-three/drei';
import { POSITIONS } from './WorldMap';
import * as THREE from 'three';

export function Connections() {
  const positionsArray = Object.values(POSITIONS).map(p => p.pos);

  return (
    <group>
      {positionsArray.map((pos, i) => {
        const nextPos = positionsArray[(i + 1) % positionsArray.length];
        
        const midX = (pos[0] + nextPos[0]) / 2;
        const midZ = (pos[2] + nextPos[2]) / 2;
        const midY = 1.5; // gentle arc height
        
        return (
          <QuadraticBezierLine
            key={`conn-${i}`}
            start={new THREE.Vector3(pos[0], pos[1], pos[2])}
            end={new THREE.Vector3(nextPos[0], nextPos[1], nextPos[2])}
            mid={new THREE.Vector3(midX, midY, midZ)}
            color="#8fb6ff"
            lineWidth={1.5}
            dashed
            dashScale={2}
            dashSize={5}
            gapSize={4}
            opacity={0.4}
            transparent
          />
        );
      })}
    </group>
  );
}
