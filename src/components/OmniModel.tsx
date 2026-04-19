import { useRef, useMemo, useState, Suspense } from "react";
import { useFrame, useLoader } from "@react-three/fiber";
import { RoundedBox, Text, ContactShadows, Float } from "@react-three/drei";
import * as THREE from "three";
import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";

interface OmniModelProps {
  chassisColor: string;
  keycapColor: string;
}

const KEY_SYMBOLS = [
  "○", "∧", "⌘",
  "<", "≡", ">",
  "[_]", "∨", "⚙"
];

interface KeyCapProps {
  position: [number, number, number];
  color: string;
  symbol: string;
}

const KeyCap = ({ position, color, symbol }: KeyCapProps) => {
  const [pressed, setPressed] = useState(false);
  const groupRef = useRef<THREE.Group>(null);
  const targetY = useRef(0);

  useFrame(() => {
    if (groupRef.current) {
      // Tactile 'snap' feel: faster lerp when pressing, slower when releasing
      targetY.current = pressed ? -0.12 : 0;
      groupRef.current.position.y = THREE.MathUtils.lerp(
        groupRef.current.position.y,
        targetY.current,
        pressed ? 0.4 : 0.2
      );
    }
  });

  return (
    <group position={position}>
      {/* Translucent Glowing Base */}
      <RoundedBox args={[0.58, 0.12, 0.58]} radius={0.08} smoothness={4} position={[0, -0.04, 0]}>
        <meshStandardMaterial 
          color="#ffffff" 
          transparent 
          opacity={0.4} 
          emissive="#ffffff" 
          emissiveIntensity={0.2} 
        />
      </RoundedBox>
      
      {/* Animated keycap */}
      <group
        ref={groupRef}
        onPointerDown={(e) => { e.stopPropagation(); setPressed(true); }}
        onPointerUp={() => setPressed(false)}
        onPointerLeave={() => setPressed(false)}
      >
        {/* Main cap body */}
        <RoundedBox args={[0.54, 0.28, 0.54]} radius={0.14} smoothness={4} position={[0, 0.12, 0]}>
          <meshStandardMaterial color={color} metalness={0.05} roughness={0.5} />
        </RoundedBox>
        
        {/* Concave top surface */}
        <RoundedBox args={[0.44, 0.02, 0.44]} radius={0.1} smoothness={4} position={[0, 0.25, 0]}>
          <meshStandardMaterial color={color} metalness={0.02} roughness={0.9} />
        </RoundedBox>

        {/* Symbol */}
        <Text
          position={[0, 0.265, 0]}
          rotation={[-Math.PI / 2, 0, 0]}
          fontSize={0.2}
          color="#4b5563"
          anchorX="center"
          anchorY="middle"
        >
          {symbol}
        </Text>
        
        {/* Internal key light */}
        <pointLight position={[0, 0.1, 0]} intensity={0.5} color="#ffffff" distance={0.8} />
      </group>
    </group>
  );
};

const STLModel = ({ url, color }: { url: string, color: string }) => {
  const geom = useLoader(STLLoader, url);
  
  // Center the geometry once loaded
  useMemo(() => {
    geom.center();
  }, [geom]);

  const meshRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    if (meshRef.current) {
      // Subtle breathing animation for the chassis
      const s = 1 + Math.sin(state.clock.elapsedTime * 1.5) * 0.005;
      meshRef.current.scale.set(s, s, s);
    }
  });

  return (
    <mesh ref={meshRef} geometry={geom} rotation={[-Math.PI / 2, 0, 0]} scale={0.018}>
      <meshStandardMaterial 
        color={color} 
        metalness={0.9} 
        roughness={0.15} 
        envMapIntensity={2.5}
      />
    </mesh>
  );
};

const OmniModel = ({ chassisColor, keycapColor }: OmniModelProps) => {
  const groupRef = useRef<THREE.Group>(null);
  const sideGlowRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    if (groupRef.current) {
      // Default tilt + mouse interaction
      const targetRotationX = -0.4 + state.pointer.y * 0.15;
      const targetRotationY = state.pointer.x * 0.25;
      
      groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, targetRotationX, 0.05);
      groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotationY, 0.05);
    }
    if (sideGlowRef.current) {
      sideGlowRef.current.intensity = 1.5 + Math.sin(state.clock.elapsedTime * 3) * 0.5;
    }
  });

  const keyPositions = useMemo(() => {
    const positions: [number, number, number][] = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        // Centered 3x3 grid
        positions.push([(col - 1) * 0.75, 0.28, (row - 0.1) * 0.75]);
      }
    }
    return positions;
  }, []);

  return (
    <Suspense fallback={null}>
      {/* Studio Lighting Setup for the Model */}
      <group>
        {/* Key Light: Bright, from front-top-right */}
        <directionalLight position={[5, 5, 5]} intensity={2} color="#ffffff" castShadow />
        
        {/* Fill Light: Softer, from front-top-left */}
        <pointLight position={[-5, 3, 5]} intensity={1.2} color="#ffffff" />
        
        {/* Rim Light: From back to highlight edges and silhouette */}
        <spotLight position={[0, 8, -8]} intensity={3} angle={0.4} penumbra={1} color="#ffffff" />
        
        {/* Accent Light: Subtle blue tint for tech feel */}
        <pointLight position={[0, -2, 5]} intensity={0.5} color="#3b82f6" />
      </group>

      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <group ref={groupRef} scale={0.85}>
          {/* Main Chassis from STL */}
          <group position={[0, -0.5, 0]}>
            <STLModel url="/omni_1.stl" color={chassisColor} />
          </group>

          {/* Top Glass/Transparent Section - Kept for visual flair */}
          <group position={[0, 0.26, -1.0]}>
            <RoundedBox args={[3.0, 0.05, 1.8]} radius={0.15} smoothness={8}>
              <meshPhysicalMaterial 
                color="#ffffff" 
                transparent 
                opacity={0.05} 
                transmission={0.95} 
                thickness={0.1} 
                roughness={0.02} 
              />
            </RoundedBox>
            
            {/* Screen Area */}
            <mesh position={[0, -0.01, 0]}>
              <planeGeometry args={[1.8, 1.2]} />
              <meshStandardMaterial color="#000000" />
            </mesh>
            
            {/* Screen Content */}
            <group position={[0, 0.03, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <Text fontSize={0.08} color="#ffffff" position={[0, 0.45, 0]} anchorY="top">
                OMNI OS v1.0
              </Text>
              <pointLight position={[0, 0.1, 0]} intensity={1.5} color="#3b82f6" distance={2} />
            </group>
            
            {/* Side Glow Lights */}
            <pointLight ref={sideGlowRef} position={[0, 0.5, -1]} intensity={1} color={chassisColor} distance={3} />
          </group>

          {/* 3x3 Keys Section */}
          <group position={[0, 0, 0.4]}>
            {keyPositions.map((pos, i) => (
              <KeyCap 
                key={`key-${i}`} 
                position={pos} 
                color={keycapColor} 
                symbol={KEY_SYMBOLS[i]} 
              />
            ))}
          </group>

          {/* Ground Reflection / Shadow */}
          <ContactShadows 
            position={[0, -1.2, 0]} 
            opacity={0.4} 
            scale={10} 
            blur={2} 
            far={4} 
          />
        </group>
      </Float>
    </Suspense>
  );
};


export default OmniModel;
