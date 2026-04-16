import React, { useMemo } from 'react';
import * as THREE from 'three';
import { IdenticonNode } from './IdenticonNode';
import { createPRNG } from './SeededPRNG';
import { Line } from '@react-three/drei';

interface ArchetypeProps {
  seed: string;
  complexity: number;
  density: number;
  symmetry: number;
  colors: {
    base: string;
    neon: string;
    metal: string;
  };
  onNodesGenerated: (nodes: THREE.Vector3[]) => void;
}

// 1. DecisionTree
export const DecisionTree: React.FC<ArchetypeProps> = ({ seed, complexity, colors, onNodesGenerated }) => {
  const next = createPRNG(seed + 'tree');
  
  const { nodes, edges } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [new THREE.Vector3(0, 1.2, 0)];
    const edgeList: [THREE.Vector3, THREE.Vector3][] = [];
    
    const grow = (parent: THREE.Vector3, depth: number) => {
      if (depth >= complexity) return;
      const count = 2; // Fixed branching for compactness
      for (let i = 0; i < count; i++) {
        const child = parent.clone().add(new THREE.Vector3(
          (i - 0.5) * 1.2 * (complexity - depth) * 0.5, 
          -0.6, 
          (next() - 0.5) * 0.4
        ));
        nodeList.push(child);
        edgeList.push([parent, child]);
        grow(child, depth + 1);
      }
    };
    
    grow(nodeList[0], 0);
    onNodesGenerated(nodeList);
    return { nodes: nodeList, edges: edgeList };
  }, [seed, complexity]);

  return (
    <group scale={0.8} position={[0, 0.5, 0]}>
      {nodes.map((pos, i) => (
        <IdenticonNode key={i} position={[pos.x, pos.y, pos.z]} color={colors.base} neonColor={colors.neon} />
      ))}
      {edges.map((edge, i) => (
        <Line key={i} points={edge} color={colors.metal} lineWidth={0.5} transparent opacity={0.2} />
      ))}
    </group>
  );
};

// 2. NeuralNetwork
export const NeuralNetwork: React.FC<ArchetypeProps> = ({ seed, complexity, colors, onNodesGenerated }) => {
  const next = createPRNG(seed + 'nn');
  
  const { nodes, edges } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [];
    const edgeList: [THREE.Vector3, THREE.Vector3][] = [];
    const layers: THREE.Vector3[][] = [];
    
    const layerSpec = [2, complexity, complexity, 2];
    for (let i = 0; i < layerSpec.length; i++) {
      const layerNodes: THREE.Vector3[] = [];
      const nodeCount = layerSpec[i];
      for (let j = 0; j < nodeCount; j++) {
        const node = new THREE.Vector3(
          i * 0.8 - 1.2, 
          j * 0.6 - (nodeCount - 1) * 0.3, 
          (next() - 0.5) * 0.2
        );
        layerNodes.push(node);
        nodeList.push(node);
      }
      layers.push(layerNodes);
    }
    
    for (let i = 0; i < layers.length - 1; i++) {
      layers[i].forEach(start => {
        layers[i+1].forEach(end => {
           if (next() > 0.4) edgeList.push([start, end]);
        });
      });
    }

    onNodesGenerated(nodeList);
    return { nodes: nodeList, edges: edgeList };
  }, [seed, complexity]);

  return (
    <group scale={1.2}>
      {nodes.map((pos, i) => (
        <IdenticonNode key={i} position={[pos.x, pos.y, pos.z]} color={colors.base} neonColor={colors.neon} size={0.12} />
      ))}
      {edges.map((edge, i) => (
        <Line key={i} points={edge} color={colors.metal} lineWidth={0.5} transparent opacity={0.1} />
      ))}
    </group>
  );
};

// 3. GraphNetwork
export const GraphNetwork: React.FC<ArchetypeProps> = ({ seed, complexity, density, colors, onNodesGenerated }) => {
  const next = createPRNG(seed + 'graph');
  
  const { nodes, edges } = useMemo(() => {
    const nodeCount = Math.min(complexity * 4, 25);
    const nodeList = Array.from({ length: nodeCount }).map(() => 
      new THREE.Vector3((next() - 0.5) * 2, (next() - 0.5) * 2, (next() - 0.5) * 2)
    );
    
    const edgeList: [THREE.Vector3, THREE.Vector3][] = [];
    for (let i = 0; i < nodeList.length; i++) {
      for (let j = i + 1; j < nodeList.length; j++) {
        if (nodeList[i].distanceTo(nodeList[j]) < 0.8 + density * 0.4) {
          edgeList.push([nodeList[i], nodeList[j]]);
        }
      }
    }
    
    onNodesGenerated(nodeList);
    return { nodes: nodeList, edges: edgeList };
  }, [seed, complexity, density]);

  return (
    <group scale={1.2}>
      {nodes.map((pos, i) => (
        <IdenticonNode key={i} position={[pos.x, pos.y, pos.z]} color={colors.base} neonColor={colors.neon} size={0.1} />
      ))}
      {edges.map((edge, i) => (
        <Line key={i} points={edge} color={colors.metal} lineWidth={1} transparent opacity={0.15} />
      ))}
    </group>
  );
};

// 4. Transformer
export const Transformer: React.FC<ArchetypeProps> = ({ seed, complexity, colors, onNodesGenerated }) => {
   const { nodes, edges } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [];
    const edgeList: [THREE.Vector3, THREE.Vector3][] = [];
    const radius = 1.2;
    const count = complexity * 3;
    
    for (let i = 0; i < count; i++) {
        const angle = (i / count) * Math.PI * 2;
        nodeList.push(new THREE.Vector3(Math.cos(angle) * radius, Math.sin(angle) * radius, (i % 2) * 0.2));
    }
    
    for (let i = 0; i < nodeList.length; i++) {
        for (let j = i + 1; j < nodeList.length; j++) {
            if ((i + j) % 4 === 0) edgeList.push([nodeList[i], nodeList[j]]);
        }
    }

    onNodesGenerated(nodeList);
    return { nodes: nodeList, edges: edgeList };
  }, [seed, complexity]);

  return (
    <group scale={1.2}>
      {nodes.map((pos, i) => (
        <IdenticonNode key={i} position={[pos.x, pos.y, pos.z]} color={colors.base} neonColor={colors.neon} size={0.1} />
      ))}
      {edges.map((edge, i) => (
        <Line key={i} points={edge} color={colors.metal} lineWidth={0.3} transparent opacity={0.08} />
      ))}
    </group>
  );
};

// 5. ClusterField
export const ClusterField: React.FC<ArchetypeProps> = ({ seed, complexity, colors, onNodesGenerated }) => {
  const next = createPRNG(seed + 'cluster');
  
  const { nodes, edges } = useMemo(() => {
    const nodeList: THREE.Vector3[] = [];
    const edgeList: [THREE.Vector3, THREE.Vector3][] = [];
    
    for (let c = 0; c < 3; c++) {
      const center = new THREE.Vector3((next() - 0.5) * 1.5, (next() - 0.5) * 1.5, (next() - 0.5) * 1.5);
      for (let i = 0; i < Math.floor(complexity / 2) + 2; i++) {
        const node = center.clone().add(new THREE.Vector3((next() - 0.5) * 0.5, (next() - 0.5) * 0.5, (next() - 0.5) * 0.5));
        nodeList.push(node);
        edgeList.push([center, node]);
      }
    }

    onNodesGenerated(nodeList);
    return { nodes: nodeList, edges: edgeList };
  }, [seed, complexity]);

  return (
    <group scale={1.2}>
      {nodes.map((pos, i) => (
        <IdenticonNode key={i} position={[pos.x, pos.y, pos.z]} color={colors.base} neonColor={colors.neon} size={0.1} />
      ))}
      {edges.map((edge, i) => (
        <Line key={i} points={edge} color={colors.metal} lineWidth={0.8} transparent opacity={0.2} />
      ))}
    </group>
  );
};
