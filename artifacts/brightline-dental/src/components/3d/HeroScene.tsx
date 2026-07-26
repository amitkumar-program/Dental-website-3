import { useMemo } from 'react';
import { Canvas } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { DentalOrb } from './DentalOrb';
import { ParticleField } from './ParticleField';
import { isWebGLAvailable } from '@/lib/webgl-detect';

/** CSS-only animated fallback when WebGL is unavailable (headless / old browser) */
function CssFallback() {
  return (
    <div className="absolute inset-0 -z-10 bg-white overflow-hidden">
      <div
        className="absolute right-[-5%] top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,161,0.18) 0%, rgba(100,100,220,0.10) 45%, transparent 70%)',
          animation: 'orbPulse 5s ease-in-out infinite',
        }}
      />
      <div
        className="absolute right-24 top-1/3 w-[320px] h-[320px] rounded-full"
        style={{
          background:
            'radial-gradient(circle at center, rgba(0,0,180,0.12) 0%, transparent 70%)',
          animation: 'orbPulse 7s ease-in-out infinite reverse',
        }}
      />
      {[...Array(14)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-300"
          style={{
            width: `${3 + (i % 4) * 3}px`,
            height: `${3 + (i % 4) * 3}px`,
            opacity: 0.25,
            right: `${4 + (i * 7) % 48}%`,
            top: `${8 + (i * 13) % 82}%`,
            animation: `dotFloat ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.35}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes orbPulse {
          0%, 100% { transform: translateY(-50%) scale(1); opacity: 1; }
          50% { transform: translateY(-50%) scale(1.06); opacity: 0.8; }
        }
        @keyframes dotFloat {
          0%, 100% { transform: translateY(0); opacity: 0.25; }
          50% { transform: translateY(-18px); opacity: 0.5; }
        }
      `}</style>
    </div>
  );
}

export default function HeroScene() {
  const webgl = useMemo(() => isWebGLAvailable(), []);

  if (!webgl) {
    return <CssFallback />;
  }

  return (
    <div className="absolute inset-0 -z-10 bg-white">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} dpr={[1, 2]}>
        <ambientLight intensity={0.5} />
        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
        <pointLight position={[-10, -10, -10]} intensity={0.5} />

        {/* Environment setup for reflections */}
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <Lightformer intensity={4} rotation-x={Math.PI / 2} position={[0, 5, -9]} scale={[10, 10, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, 1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={2} rotation-y={Math.PI / 2} position={[-5, -1, -1]} scale={[10, 2, 1]} />
            <Lightformer intensity={2} rotation-y={-Math.PI / 2} position={[10, 1, 0]} scale={[20, 2, 1]} />
            <Lightformer type="ring" intensity={2} rotation-y={Math.PI / 2} position={[-0.1, -1, -5]} scale={10} />
          </group>
        </Environment>

        {/* Center object */}
        <group position={[2, 0, 0]}>
          <DentalOrb />
        </group>

        {/* Background particles */}
        <ParticleField count={150} />
      </Canvas>
    </div>
  );
}
