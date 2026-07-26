import { useRef } from "react";

import { useFrame } from '@react-three/fiber';
import { Float, MeshTransmissionMaterial } from '@react-three/drei';
import * as THREE from 'three';

export function DentalOrb() {
  const meshRef = useRef<THREE.Mesh>(null);

  // Use a smooth, abstract shape that represents a tooth/orb, like an icosphere or smooth torus knot
  // Here we use an Icosahedron with some detail, then we'll use a transmission material for that clean, glossy look
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = state.clock.elapsedTime * 0.2;
      meshRef.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.1) * 0.2;
    }
  });

  return (
    <Float
      speed={2} // Animation speed, defaults to 1
      rotationIntensity={0.5} // XYZ rotation intensity, defaults to 1
      floatIntensity={1} // Up/down float intensity, works like a multiplier with floatingRange,defaults to 1
      floatingRange={[-0.1, 0.1]} // Range of y-axis values the object will float within, defaults to [-0.1,0.1]
    >
      <mesh ref={meshRef} scale={1.5}>
        <sphereGeometry args={[1, 64, 64]} />
        {/* We use MeshTransmissionMaterial to give it a premium, glossy, glass-like quality
            that feels clinical and clean */}
        <MeshTransmissionMaterial 
          backside 
          samples={4} 
          thickness={1.5}
          chromaticAberration={0.025}
          anisotropy={0.1}
          distortion={0.1}
          distortionScale={0.1}
          temporalDistortion={0.1}
          color="#ffffff"
          attenuationColor="#ccccff"
          attenuationDistance={2}
          clearcoat={1}
          clearcoatRoughness={0.1}
        />
      </mesh>
      
      {/* Add a subtle inner glow / core */}
      <mesh scale={0.6}>
        <sphereGeometry args={[1, 32, 32]} />
        <meshStandardMaterial color="#0000A1" emissive="#0000A1" emissiveIntensity={0.5} opacity={0.2} transparent />
      </mesh>
    </Float>
  );
}
