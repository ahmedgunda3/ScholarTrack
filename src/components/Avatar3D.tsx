import React, { Suspense, Component, type ReactNode } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';

interface ErrorBoundaryProps {
  fallback: ReactNode;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class CanvasErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('3D Avatar loading failed:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

function Model({ url }: { url: string }) {
  const { scene } = useGLTF(url);
  return <primitive object={scene} position={[0, -1.8, 0]} scale={1.15} />;
}

interface Avatar3DProps {
  avatarUrl?: string;
  className?: string;
  interactive?: boolean;
}

export const Avatar3D: React.FC<Avatar3DProps> = ({
  avatarUrl,
  className = 'w-full h-full',
  interactive = false,
}) => {
  const modelUrl = avatarUrl && avatarUrl.trim() !== '' 
    ? avatarUrl 
    : 'https://models.readyplayer.me/6460d375e4ced2d120d80e09.glb';

  return (
    <div className={`${className} bg-slate-950 rounded-2xl overflow-hidden relative border border-slate-800 flex items-center justify-center ${!interactive ? 'pointer-events-none' : ''}`}>
      <CanvasErrorBoundary fallback={<div className="text-2xl select-none">👤</div>}>
        <Canvas camera={{ position: [0, 0.2, 3.8], fov: 40 }}>
          <ambientLight intensity={0.9} />
          <directionalLight position={[3, 5, 2]} intensity={1.5} />
          <directionalLight position={[-3, -2, -2]} intensity={0.5} />
          <Suspense fallback={null}>
            <Model url={modelUrl} />
          </Suspense>
          {interactive && <OrbitControls enableZoom={false} target={[0, -0.4, 0]} />}
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
};
