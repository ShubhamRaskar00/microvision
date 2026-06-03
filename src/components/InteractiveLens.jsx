import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MeshDistortMaterial, Environment } from '@react-three/drei';
import * as THREE from 'three';

const CursorBlob = ({ isHovering, mouseX, mouseY }) => {
  const groupRef = useRef();
  const materialRef = useRef();
  const wireframeRef = useRef();
  const { viewport } = useThree();

  const prevPointer = useRef({ x: 0, y: 0 });

  useFrame(() => {
    const x = (mouseX * viewport.width) / 2;
    const y = (mouseY * viewport.height) / 2;

    groupRef.current.position.lerp(new THREE.Vector3(x, y, 2), 0.15);

    const velocity = Math.sqrt(
      (mouseX - prevPointer.current.x) ** 2 + 
      (mouseY - prevPointer.current.y) ** 2
    );
    prevPointer.current.x = mouseX;
    prevPointer.current.y = mouseY;

    let targetDistort = 0.15; 
    let targetSpeed = 2;      

    if (velocity > 0.001) {
      const splashForce = velocity * 40; 
      targetDistort = Math.min(0.15 + splashForce, 0.8);
      targetSpeed = Math.min(2 + (splashForce * 10), 12);
    }

    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.08);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05);
    }
    if (wireframeRef.current) {
      wireframeRef.current.distort = THREE.MathUtils.lerp(wireframeRef.current.distort, targetDistort + 0.1, 0.08);
      wireframeRef.current.speed = THREE.MathUtils.lerp(wireframeRef.current.speed, targetSpeed + 1, 0.05);
    }

    const targetScale = isHovering ? 0.8 : 0.5;
    groupRef.current.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.1);
  });

  return (
    <group ref={groupRef}>
      <mesh>
        <sphereGeometry args={[1, 64, 64]} />
        <MeshDistortMaterial
          ref={materialRef}
          color="#ffffff"          
          roughness={0}          
          metalness={0.1}        
          clearcoat={1}            
          clearcoatRoughness={0}
          transmission={1}       // Makes it transparent glass
          ior={1.5}              // Refracts/bends the background
          thickness={2}          
          distort={0.15}           
          speed={2}   
          transparent  
          opacity={0.4}           
        />
      </mesh>
      <mesh scale={1.05}>
        <sphereGeometry args={[1, 32, 32]} />
        <MeshDistortMaterial
          ref={wireframeRef}
          color="#ffffff"
          wireframe={true}
          transparent={true}
          opacity={0.1}           
          distort={0.25}
          speed={3}
        />
      </mesh>
    </group>
  );
};

export default function InteractiveCursor() {
  const [isHovering, setIsHovering] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    // 1. Mouse Move Logic
    const handleMouseMove = (e) => {
      setMousePos({
        x: (e.clientX / window.innerWidth) * 2 - 1,
        y: -(e.clientY / window.innerHeight) * 2 + 1,
      });

      const target = e.target;
      const isInteractive = target.closest('a, button, input, textarea, h1, h2, h3, h4, h5, h6, p, span, li');
      setIsHovering(!!isInteractive);
    };

    // 2. Scroll Logic (Hide in middle of page, show at top/bottom)
    

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    // Transition opacity for smooth fade in/out when scrolling
    <div 
      className="fixed inset-0 z-[100]" 
      style={{ 
        pointerEvents: 'none', 
        transition: 'opacity 0.5s ease-in-out' 
      }}
    >
      <Canvas 
        style={{ pointerEvents: 'none' }} 
        camera={{ position: [0, 0, 10], fov: 45 }} 
        gl={{ antialias: true, alpha: true }}
      >
        <ambientLight intensity={1} color="#ffffff" />
        <CursorBlob isHovering={isHovering} mouseX={mousePos.x} mouseY={mousePos.y} />
        <Environment resolution={256}>
          <group rotation={[-Math.PI / 4, -0.3, 0]}>
            <pointLight position={[0, 5, -10]} intensity={20} color="#00ff66" />
            <pointLight position={[-10, -5, -10]} intensity={20} color="#ff6600" />
          </group>
        </Environment>
      </Canvas>
    </div>
  );
}