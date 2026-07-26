import { useRef, useMemo } from "react";

import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function ParticleField({ count = 200 }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  
  // Generate random positions
  const particles = useMemo(() => {
    const temp = [];
    for (let i = 0; i < count; i++) {
      const time = Math.random() * 100;
      const factor = 10 + Math.random() * 100;
      const speed = 0.01 + Math.random() / 200;
      const x = (Math.random() - 0.5) * 15;
      const y = (Math.random() - 0.5) * 15;
      const z = (Math.random() - 0.5) * 15;
      
      temp.push({ time, factor, speed, x, y, z });
    }
    return temp;
  }, [count]);
  
  const dummy = useMemo(() => new THREE.Object3D(), []);
  
  useFrame(() => {
    if (!mesh.current) return;
    
    particles.forEach((particle, i) => {
      let { time, factor, speed, x, y, z } = particle;
      
      // Slowly drift upwards and wobble
      time = particle.time += speed / 2;
      
      const newY = y + time * 2;
      // Loop around if it goes too high
      const wrappedY = ((newY + 7.5) % 15) - 7.5;
      
      dummy.position.set(
        x + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10,
        wrappedY,
        z + Math.cos((time / 10) * factor) + (Math.sin(time * 1) * factor) / 10
      );
      
      const scale = 0.05 + Math.sin(time) * 0.02;
      dummy.scale.set(scale, scale, scale);
      
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    
    mesh.current.instanceMatrix.needsUpdate = true;
  });
  
  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <sphereGeometry args={[1, 16, 16]} />
      <meshStandardMaterial color="#1B6CA8" transparent opacity={0.3} depthWrite={false} />
    </instancedMesh>
  );
}
