import { useRef, useState, useEffect } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { MeshDistortMaterial, Float, Environment } from '@react-three/drei';
import * as THREE from 'three';

const RealisticWaterBlob = () => {
  const groupRef = useRef();
  const materialRef = useRef();
  const wireframeRef = useRef();
  
  // Custom Global Mouse Tracker
  const mouse = useRef({ x: 0, y: 0 });
  const prevMouse = useRef({ x: 0, y: 0 });
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    // 1. Track Scroll for Parallax
    const handleScroll = () => setScrollY(window.scrollY);
    
    // 2. Track Mouse GLOBALLY (Bypasses CSS blocking issues)
    const handleMouseMove = (e) => {
      // Normalize mouse coordinates from -1 to +1
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1;
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  useFrame((state) => {
    const time = state.clock.getElapsedTime();

    // Calculate Mouse Distance to the center of the screen
    const dist = Math.sqrt(mouse.current.x ** 2 + mouse.current.y ** 2);
    
    // Calculate Velocity (How fast the mouse is swiping)
    const velocity = Math.sqrt(
      (mouse.current.x - prevMouse.current.x) ** 2 + 
      (mouse.current.y - prevMouse.current.y) ** 2
    );
    
    // Store current mouse for next frame
    prevMouse.current.x = mouse.current.x;
    prevMouse.current.y = mouse.current.y;

    // --- REAL WATER PHYSICS LOGIC ---
    let targetDistort = 0.15; // Calm baseline
    let targetSpeed = 2;      // Slow idle flow

    // If mouse is near the center liquid (radius < 0.6)
    if (dist < 0.6) {
      // Multiply velocity heavily so even small fast movements cause big ripples
      const splashForce = velocity * 40; 
      
      targetDistort = Math.min(0.25 + splashForce, 0.8); // Cap max distortion at 0.8
      targetSpeed = Math.min(2 + (splashForce * 10), 12); // Speed up the flow to simulate turbulence
    }

    // Apply scroll depth to distortion (gets more chaotic as you scroll down)
    targetDistort += (scrollY * 0.0002);

    // Apply the physics smoothly (Lerp creates the heavy "water" feel)
    if (materialRef.current) {
      materialRef.current.distort = THREE.MathUtils.lerp(materialRef.current.distort, targetDistort, 0.08);
      materialRef.current.speed = THREE.MathUtils.lerp(materialRef.current.speed, targetSpeed, 0.05);
    }
    
    if (wireframeRef.current) {
      wireframeRef.current.distort = THREE.MathUtils.lerp(wireframeRef.current.distort, targetDistort + 0.1, 0.08);
      wireframeRef.current.speed = THREE.MathUtils.lerp(wireframeRef.current.speed, targetSpeed + 1, 0.05);
    }

    // --- MOUSE MAGNETIC TILT ---
    // The liquid slightly rotates to "look" at your cursor
    const tiltX = mouse.current.y * Math.PI * 0.15;
    const tiltY = mouse.current.x * Math.PI * 0.15;
    
    groupRef.current.rotation.x = THREE.MathUtils.lerp(groupRef.current.rotation.x, tiltX, 0.05);
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, tiltY, 0.05);

    // --- PARALLAX SCROLL ---
    const targetY = -(scrollY * 0.002);
    groupRef.current.position.y = THREE.MathUtils.lerp(groupRef.current.position.y, targetY, 0.05);
  });

  return (
    <group ref={groupRef} scale={1.4}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        
        {/* CORE WATER BLOB */}
        <mesh>
          <sphereGeometry args={[1, 256, 256]} />
          <MeshDistortMaterial
            ref={materialRef}
            color="#050505"          
            roughness={0.05}          
            metalness={0.9}          
            clearcoat={1}            
            clearcoatRoughness={0.1}
            distort={0.15}           
            speed={2}                
          />
        </mesh>

        {/* DELICATE ABSTRACT WIREFRAME */}
        <mesh scale={1.05}>
          <sphereGeometry args={[1, 32, 32]} />
          <MeshDistortMaterial
            ref={wireframeRef}
            color="#ffffff"
            wireframe={true}
            transparent={true}
            opacity={0.08}           
            distort={0.25}
            speed={3}
          />
        </mesh>

      </Float>
    </group>
  );
};

export default function ThreeBackground() {
  return (
    // 'pointer-events-none' ensures the background doesn't block you from clicking buttons on the website
    <div className="fixed inset-0 z-0 bg-[#020502] overflow-hidden pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5], fov: 45 }} gl={{ antialias: true }}>
        
        <Environment preset="studio" />
        <ambientLight intensity={1} color="#ffffff" />
        
        {/* LIGHTING SETUP */}
        <pointLight position={[-4, 0, 2]} intensity={40} distance={15} color="#22c55e" /> 
        <pointLight position={[4, 0, 2]} intensity={40} distance={15} color="#f97316" />   
        <spotLight position={[0, 5, 5]} intensity={5} color="#ffffff" penumbra={1} />

        <RealisticWaterBlob />
      </Canvas>

      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_40%,rgba(2,5,2,1)_100%)] pointer-events-none"></div>
    </div>
  );
}