import { Component, ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

/**
 * Error boundary that catches WebGL context failures and renders a CSS fallback.
 * THREE.js throws synchronously when WebGL is unavailable (server/headless env).
 */
export class WebGLErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback ?? <HeroFallback />;
    }
    return this.props.children;
  }
}

/** CSS-only animated orb shown when WebGL is unavailable */
function HeroFallback() {
  return (
    <div className="absolute inset-0 -z-10 bg-white overflow-hidden">
      {/* Soft blue gradient orb */}
      <div
        className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-20"
        style={{
          background:
            "radial-gradient(circle at center, #1B6CA8 0%, #93C5FD 40%, transparent 70%)",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      {/* Secondary smaller orb */}
      <div
        className="absolute right-32 top-1/3 w-[300px] h-[300px] rounded-full opacity-10"
        style={{
          background:
            "radial-gradient(circle at center, #60A5FA 0%, transparent 70%)",
          animation: "pulse 6s ease-in-out infinite reverse",
        }}
      />
      {/* Floating dots */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="absolute rounded-full bg-blue-300 opacity-30"
          style={{
            width: `${4 + (i % 4) * 3}px`,
            height: `${4 + (i % 4) * 3}px`,
            right: `${5 + (i * 7) % 45}%`,
            top: `${10 + (i * 13) % 80}%`,
            animation: `floatUp ${3 + (i % 3)}s ease-in-out infinite`,
            animationDelay: `${i * 0.4}s`,
          }}
        />
      ))}
      <style>{`
        @keyframes floatUp {
          0%, 100% { transform: translateY(0px); opacity: 0.3; }
          50% { transform: translateY(-20px); opacity: 0.6; }
        }
      `}</style>
    </div>
  );
}
