import { Canvas, useFrame } from '@react-three/fiber';
import { useEffect, useMemo, useRef } from 'react';
import type { ReactNode } from 'react';
import * as THREE from 'three';

type ModelSlab = [number, number, number, number, number, number, string];
type ModelBar = [number, number, number, number, number, string];
type ToolTile = [string, string, number, number, number, string];
type InsightPanel = [number, number, number, number, number, string];

const drawToolMark = (context: CanvasRenderingContext2D, label: string, color: string) => {
  context.save();
  context.translate(128, 104);
  context.lineCap = 'round';
  context.lineJoin = 'round';
  context.shadowColor = color;
  context.shadowBlur = 18;
  context.strokeStyle = '#ffffff';
  context.fillStyle = '#ffffff';

  if (label === 'ChatGPT') {
    context.lineWidth = 8.5;
    for (let i = 0; i < 6; i += 1) {
      context.save();
      context.rotate((Math.PI * 2 * i) / 6);
      context.beginPath();
      context.arc(0, -19, 25, 0.16 * Math.PI, 1.16 * Math.PI);
      context.stroke();
      context.restore();
    }
    context.beginPath();
    context.arc(0, 0, 8, 0, Math.PI * 2);
    context.stroke();
  } else if (label === 'Claude') {
    context.font = '900 78px Inter, Arial, sans-serif';
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText('C', 0, 1);
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.arc(18, -4, 17, 0, Math.PI * 2);
    context.fill();
    context.globalCompositeOperation = 'source-over';
    context.fillStyle = 'rgba(255,255,255,0.86)';
    context.beginPath();
    context.arc(21, -7, 6, 0, Math.PI * 2);
    context.fill();
  } else if (label === 'Gemini') {
    context.beginPath();
    context.moveTo(0, -52);
    context.quadraticCurveTo(12, -12, 52, 0);
    context.quadraticCurveTo(12, 12, 0, 52);
    context.quadraticCurveTo(-12, 12, -52, 0);
    context.quadraticCurveTo(-12, -12, 0, -52);
    context.fill();
    context.fillStyle = 'rgba(125,211,252,0.78)';
    context.beginPath();
    context.moveTo(24, -34);
    context.quadraticCurveTo(30, -18, 46, -12);
    context.quadraticCurveTo(30, -6, 24, 10);
    context.quadraticCurveTo(18, -6, 2, -12);
    context.quadraticCurveTo(18, -18, 24, -34);
    context.fill();
  } else {
    context.shadowBlur = 16;
    context.beginPath();
    context.moveTo(-34, -48);
    context.lineTo(40, -2);
    context.lineTo(4, 8);
    context.lineTo(-16, 46);
    context.closePath();
    context.fill();
    context.globalCompositeOperation = 'destination-out';
    context.beginPath();
    context.moveTo(-13, -25);
    context.lineTo(16, -6);
    context.lineTo(-2, -1);
    context.lineTo(-13, 21);
    context.closePath();
    context.fill();
    context.globalCompositeOperation = 'source-over';
    context.strokeStyle = '#ffffff';
    context.lineWidth = 6;
    context.beginPath();
    context.moveTo(2, 10);
    context.lineTo(20, 36);
    context.stroke();
  }

  context.restore();
};

const createToolTexture = (label: string, symbol: string, color: string) => {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const context = canvas.getContext('2d');

  if (!context) return new THREE.CanvasTexture(canvas);
  context.scale(2, 2);

  const gradient = context.createLinearGradient(0, 0, 256, 256);
  gradient.addColorStop(0, color);
  gradient.addColorStop(0.48, '#3B82F6');
  gradient.addColorStop(1, '#8B5CF6');

  context.clearRect(0, 0, 256, 256);
  context.fillStyle = gradient;
  context.beginPath();
  context.roundRect(24, 24, 208, 208, 42);
  context.fill();

  context.fillStyle = 'rgba(10,15,35,0.42)';
  context.beginPath();
  context.roundRect(34, 34, 188, 188, 34);
  context.fill();

  context.fillStyle = 'rgba(255,255,255,0.1)';
  context.beginPath();
  context.arc(128, 104, 58, 0, Math.PI * 2);
  context.fill();

  drawToolMark(context, label, color);

  context.shadowColor = color;
  context.shadowBlur = 12;
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillStyle = 'rgba(2,6,23,0.58)';
  context.beginPath();
  context.roundRect(53, 168, 150, 36, 18);
  context.fill();
  context.fillStyle = '#ffffff';
  context.font = label.length > 6 ? '700 27px Inter, Arial, sans-serif' : '800 34px Inter, Arial, sans-serif';
  context.fillText(label, 128, 187);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  return texture;
};

function NeuralParticleField() {
  const points = useRef<THREE.Points>(null);
  const lines = useRef<THREE.LineSegments>(null);
  const positions = useMemo(() => {
    const values = new Float32Array(1260);
    for (let i = 0; i < 420; i += 1) {
      values[i * 3] = (Math.random() - 0.5) * 12;
      values[i * 3 + 1] = (Math.random() - 0.5) * 7;
      values[i * 3 + 2] = (Math.random() - 0.5) * 7;
    }
    return values;
  }, []);
  const links = useMemo(() => {
    const values = new Float32Array(360);
    for (let i = 0; i < 60; i += 1) {
      const a = Math.floor(Math.random() * 420);
      const b = Math.floor(Math.random() * 420);
      values[i * 6] = positions[a * 3];
      values[i * 6 + 1] = positions[a * 3 + 1];
      values[i * 6 + 2] = positions[a * 3 + 2];
      values[i * 6 + 3] = positions[b * 3];
      values[i * 6 + 4] = positions[b * 3 + 1];
      values[i * 6 + 5] = positions[b * 3 + 2];
    }
    return values;
  }, [positions]);

  useFrame((state) => {
    if (!points.current) return;
    points.current.rotation.y = state.clock.elapsedTime * 0.035;
    points.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.2) * 0.04;
    if (lines.current) {
      lines.current.rotation.copy(points.current.rotation);
    }
  });

  return (
    <>
      <points ref={points}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.026} color="#22D3EE" transparent opacity={0.5} sizeAttenuation />
      </points>
      <lineSegments ref={lines}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[links, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22D3EE" transparent opacity={0.07} />
      </lineSegments>
    </>
  );
}

function SceneRig({ children }: { children: ReactNode }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (!group.current) return;
    const x = state.pointer.x || 0;
    const y = state.pointer.y || 0;
    group.current.rotation.y = THREE.MathUtils.lerp(group.current.rotation.y, x * 0.14, 0.035);
    group.current.rotation.x = THREE.MathUtils.lerp(group.current.rotation.x, -y * 0.08, 0.035);
    state.camera.position.x = THREE.MathUtils.lerp(state.camera.position.x, x * 0.45, 0.03);
    state.camera.position.y = THREE.MathUtils.lerp(state.camera.position.y, y * 0.24, 0.03);
    state.camera.lookAt(0, 0, 0);
  });

  return <group ref={group}>{children}</group>;
}

function FloatingAISphere() {
  const group = useRef<THREE.Group>(null);
  const core = useRef<THREE.Mesh>(null);
  const globePoints = useMemo(() => {
    const values = new Float32Array(2100);
    for (let i = 0; i < 700; i += 1) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const radius = 0.78 + Math.random() * 0.018;
      const banding = Math.sin(theta * 3.5) * Math.sin(phi * 5.5);
      const visibleRadius = radius + (banding > 0.18 ? 0.035 : 0);
      values[i * 3] = visibleRadius * Math.sin(phi) * Math.cos(theta);
      values[i * 3 + 1] = visibleRadius * Math.cos(phi);
      values[i * 3 + 2] = visibleRadius * Math.sin(phi) * Math.sin(theta);
    }
    return values;
  }, []);

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = state.clock.elapsedTime * 0.2;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.42) * 0.08;
    group.current.position.y = 0.35 + Math.sin(state.clock.elapsedTime * 0.9) * 0.1;
    if (core.current) {
      core.current.scale.setScalar(1 + Math.sin(state.clock.elapsedTime * 1.4) * 0.025);
    }
  });

  return (
    <group ref={group} position={[0.42, 1.55, -2.45]} scale={1.94}>
      <mesh ref={core}>
        <sphereGeometry args={[0.74, 48, 48]} />
        <meshStandardMaterial
          color="#0A0F23"
          emissive="#8B5CF6"
          emissiveIntensity={0.5}
          roughness={0.22}
          metalness={0.5}
          transparent
          opacity={0.44}
        />
      </mesh>
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[globePoints, 3]} />
        </bufferGeometry>
        <pointsMaterial size={0.018} color="#22D3EE" transparent opacity={0.72} sizeAttenuation />
      </points>
      {[0, 0.62, 1.18].map((rotation, index) => (
        <mesh key={rotation} rotation={[Math.PI / 2 + index * 0.2, rotation, index * 0.42]}>
          <torusGeometry args={[1.05 + index * 0.16, 0.008, 12, 160]} />
          <meshBasicMaterial color={index === 1 ? '#8B5CF6' : '#22D3EE'} transparent opacity={0.42 - index * 0.08} />
        </mesh>
      ))}
      <mesh>
        <sphereGeometry args={[1.38, 32, 32]} />
        <meshBasicMaterial color="#3B82F6" transparent opacity={0.06} wireframe />
      </mesh>
    </group>
  );
}

function FloatingToolTiles() {
  const group = useRef<THREE.Group>(null);
  const tools = useMemo<ToolTile[]>(
    () => [
      ['ChatGPT', '◎', -0.72, 2.36, -1.25, '#3B82F6'],
      ['Claude', 'C', 2.18, 2.16, -1.32, '#8B5CF6'],
      ['Gemini', '✦', 1.32, 3.18, -2.05, '#22D3EE'],
      ['Cursor', '⌁', -1.28, 1.58, -1.12, '#22D3EE'],
    ],
    [],
  );
  const textures = useMemo(
    () => tools.map(([label, symbol, , , , color]) => createToolTexture(label, symbol, color)),
    [tools],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      child.rotation.y = Math.sin(state.clock.elapsedTime * 0.65 + index) * 0.18;
      child.rotation.x = Math.cos(state.clock.elapsedTime * 0.55 + index) * 0.12;
      child.position.y += Math.sin(state.clock.elapsedTime * 1.2 + index) * 0.0014;
    });
  });

  return (
    <group ref={group}>
      {tools.map(([label, , x, y, z, color], index) => (
        <group key={label} position={[x, y, z]} rotation={[0.22, -0.44, 0.12]}>
          <mesh>
            <boxGeometry args={[1.04, 1.04, 0.24]} />
            <meshStandardMaterial
              color="#0A0F23"
              emissive={color}
              emissiveIntensity={0.52}
              roughness={0.2}
              metalness={0.7}
              transparent
              opacity={0.86}
            />
          </mesh>
          <mesh position={[0, 0, 0.126]}>
            <planeGeometry args={[0.96, 0.96]} />
            <meshBasicMaterial map={textures[index]} transparent />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function FloatingInsightPanels() {
  const group = useRef<THREE.Group>(null);
  const panels = useMemo<InsightPanel[]>(
    () => [
      [-3.55, 0.85, -1.55, 1.05, 0.52, '#22D3EE'],
      [-2.28, 2.82, -2.2, 0.9, 0.44, '#3B82F6'],
      [3.08, 0.92, -1.85, 1.12, 0.5, '#8B5CF6'],
      [2.8, -0.72, -1.35, 0.82, 0.4, '#22D3EE'],
      [-1.35, -1.35, -1.65, 1.22, 0.46, '#3B82F6'],
    ],
    [],
  );
  const nodes = useMemo(
    () => [
      [-4.1, 1.86, -1.7, '#22D3EE'],
      [-2.9, -0.25, -1.05, '#8B5CF6'],
      [0.05, 2.72, -2.15, '#22D3EE'],
      [3.55, 1.84, -1.25, '#3B82F6'],
      [1.96, -1.72, -1.02, '#8B5CF6'],
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      child.rotation.y = Math.sin(state.clock.elapsedTime * 0.35 + index) * 0.08;
      child.rotation.x = Math.cos(state.clock.elapsedTime * 0.28 + index) * 0.045;
      child.position.y += Math.sin(state.clock.elapsedTime * 0.9 + index * 0.7) * 0.0012;
    });
  });

  return (
    <group ref={group}>
      {panels.map(([x, y, z, width, height, color], index) => (
        <group key={`insight-${index}`} position={[x, y, z]} rotation={[0.12, index % 2 ? -0.32 : 0.28, index % 2 ? -0.08 : 0.08]}>
          <mesh>
            <boxGeometry args={[width, height, 0.055]} />
            <meshStandardMaterial
              color="#11152E"
              emissive={color}
              emissiveIntensity={0.24}
              roughness={0.2}
              metalness={0.72}
              transparent
              opacity={0.52}
            />
          </mesh>
          {[0, 1, 2].map((bar) => (
            <mesh
              key={bar}
              position={[
                -width * 0.28 + bar * width * 0.24,
                -height * 0.18 + bar * height * 0.08,
                0.05,
              ]}
            >
              <boxGeometry args={[width * 0.08, height * (0.24 + bar * 0.12), 0.035]} />
              <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.68} roughness={0.18} metalness={0.45} />
            </mesh>
          ))}
          <mesh position={[width * 0.28, height * 0.14, 0.055]}>
            <torusGeometry args={[height * 0.16, 0.008, 10, 52]} />
            <meshBasicMaterial color={color} transparent opacity={0.78} />
          </mesh>
        </group>
      ))}

      {nodes.map(([x, y, z, color], index) => (
        <group key={`node-${index}`} position={[x as number, y as number, z as number]}>
          <mesh>
            <sphereGeometry args={[0.065, 20, 20]} />
            <meshBasicMaterial color={color as string} transparent opacity={0.95} />
          </mesh>
          <mesh>
            <torusGeometry args={[0.18, 0.005, 8, 48]} />
            <meshBasicMaterial color={color as string} transparent opacity={0.5} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function SpendIntelligenceModel() {
  const group = useRef<THREE.Group>(null);
  const connectorPositions = useMemo(
    () =>
      new Float32Array([
        -2.5, 0.95, -1.35, -0.9, 0.35, -1.1,
        -0.9, 0.35, -1.1, 0.8, 0.78, -1.25,
        0.8, 0.78, -1.25, 2.35, -0.1, -1.45,
        -1.8, -0.85, -1.2, -0.9, 0.35, -1.1,
        0.15, -0.72, -1.05, 0.8, 0.78, -1.25,
        2.35, -0.1, -1.45, 1.25, -1.05, -1.2,
      ]),
    [],
  );
  const slabs = useMemo<ModelSlab[]>(
    () => [
      [-2.5, 0.95, -1.35, 1.2, 0.18, 0.68, '#22D3EE'],
      [-0.9, 0.35, -1.1, 1.45, 0.2, 0.78, '#3B82F6'],
      [0.8, 0.78, -1.25, 1.18, 0.18, 0.66, '#22D3EE'],
      [2.35, -0.1, -1.45, 1.36, 0.2, 0.7, '#8B5CF6'],
      [-1.8, -0.85, -1.2, 1.02, 0.16, 0.56, '#3B82F6'],
      [0.15, -0.72, -1.05, 1.18, 0.16, 0.62, '#3B82F6'],
      [1.25, -1.05, -1.2, 0.98, 0.16, 0.52, '#8B5CF6'],
    ],
    [],
  );
  const bars = useMemo<ModelBar[]>(
    () => [
      [-2.85, 1.18, -0.96, 0.18, 0.58, '#22D3EE'],
      [-2.55, 1.1, -0.95, 0.18, 0.36, '#3B82F6'],
      [-2.25, 1.24, -0.95, 0.18, 0.72, '#8B5CF6'],
      [-1.2, 0.58, -0.68, 0.16, 0.42, '#3B82F6'],
      [-0.9, 0.66, -0.68, 0.16, 0.58, '#22D3EE'],
      [-0.6, 0.5, -0.68, 0.16, 0.28, '#3B82F6'],
      [0.55, 0.98, -0.88, 0.15, 0.36, '#3B82F6'],
      [0.85, 1.04, -0.88, 0.15, 0.48, '#22D3EE'],
      [1.15, 1.14, -0.88, 0.15, 0.68, '#8B5CF6'],
      [2.08, 0.12, -1.02, 0.17, 0.52, '#22D3EE'],
      [2.38, 0.22, -1.02, 0.17, 0.74, '#8B5CF6'],
      [2.68, 0.04, -1.02, 0.17, 0.38, '#22D3EE'],
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.35) * 0.08;
    group.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.24) * 0.035;
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.8) * 0.07;
  });

  return (
    <group ref={group} position={[0, -0.92, -2.05]} scale={0.78}>
      <lineSegments>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[connectorPositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#22D3EE" transparent opacity={0.24} />
      </lineSegments>

      {slabs.map(([x, y, z, width, height, depth, color], index) => (
        <mesh key={`slab-${index}`} position={[x as number, y as number, z as number]} rotation={[0.04, -0.16, 0.04]}>
          <boxGeometry args={[width as number, height as number, depth as number]} />
          <meshStandardMaterial
            color="#11152E"
            emissive={color as string}
            emissiveIntensity={0.18}
            roughness={0.18}
            metalness={0.66}
            transparent
            opacity={0.78}
          />
        </mesh>
      ))}

      {bars.map(([x, y, z, width, height, color], index) => (
        <mesh key={`bar-${index}`} position={[x, y + height / 2, z]}>
          <boxGeometry args={[width, height, 0.16]} />
          <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.58} roughness={0.22} metalness={0.52} />
        </mesh>
      ))}
    </group>
  );
}

function FloatingPrisms() {
  const group = useRef<THREE.Group>(null);
  const prisms = useMemo(
    () => [
      [-4.5, 1.8, -2.3, 0.75, '#3B82F6'],
      [4.2, 1.35, -2.6, 0.62, '#8B5CF6'],
      [-3.8, -1.6, -1.4, 0.5, '#22D3EE'],
      [3.3, -1.75, -1.1, 0.58, '#3B82F6'],
      [0.2, 2.55, -3.1, 0.42, '#8B5CF6'],
    ],
    [],
  );

  useFrame((state) => {
    if (!group.current) return;
    group.current.children.forEach((child, index) => {
      child.rotation.x += 0.002 + index * 0.0004;
      child.rotation.y += 0.003 + index * 0.0005;
      child.position.y += Math.sin(state.clock.elapsedTime + index) * 0.0009;
    });
  });

  return (
    <group ref={group}>
      {prisms.map(([x, y, z, scale, color], index) => (
        <mesh key={index} position={[x as number, y as number, z as number]} scale={scale as number}>
          <boxGeometry args={[0.7, 0.7, 0.7]} />
          <meshStandardMaterial
            color={color as string}
            emissive={color as string}
            emissiveIntensity={0.36}
            roughness={0.18}
            metalness={0.78}
            transparent
            opacity={0.72}
          />
        </mesh>
      ))}
    </group>
  );
}

function GridPlane() {
  const grid = useRef<THREE.GridHelper>(null);
  useEffect(() => {
    if (!grid.current) return;
    const materials = Array.isArray(grid.current.material) ? grid.current.material : [grid.current.material];
    materials.forEach((material) => {
      material.transparent = true;
      material.opacity = 0.055;
      material.depthWrite = false;
    });
  }, []);

  useFrame((state) => {
    if (!grid.current) return;
    grid.current.position.z = (state.clock.elapsedTime * 0.45) % 1;
  });
  return <gridHelper ref={grid} args={[18, 34, '#214a7a', '#111827']} position={[0, -2.25, 0]} rotation={[0, 0, 0]} />;
}

interface ThreeBackgroundProps {
  mode?: 'absolute' | 'fixed';
}

export default function ThreeBackground({ mode = 'absolute' }: ThreeBackgroundProps) {
  const placement = mode === 'fixed' ? 'fixed inset-0 z-0' : 'absolute inset-0 -z-10';

  return (
    <div className={`pointer-events-none ${placement} opacity-100`}>
      <Canvas camera={{ position: [0, 0.1, 6.2], fov: 58 }} dpr={[1, 1.6]} performance={{ min: 0.5 }}>
        <fog attach="fog" args={['#050816', 6, 13]} />
        <ambientLight intensity={0.54} />
        <pointLight position={[2.2, 3.5, 3]} intensity={2.4} color="#3B82F6" />
        <pointLight position={[-4, -2, 2]} intensity={1.45} color="#8B5CF6" />
        <SceneRig>
          <NeuralParticleField />
          <FloatingAISphere />
          <FloatingToolTiles />
          <FloatingInsightPanels />
          <FloatingPrisms />
          <SpendIntelligenceModel />
          <GridPlane />
        </SceneRig>
      </Canvas>
    </div>
  );
}
