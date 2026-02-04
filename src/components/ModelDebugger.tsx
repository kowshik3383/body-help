// 'use client';
// import { Canvas, useThree, useFrame } from '@react-three/fiber';
// import { OrbitControls, useGLTF } from '@react-three/drei';
// import * as THREE from 'three';
// import { useRef, useState, useEffect, useCallback } from 'react';

// function SkullModel({ url }) {
//   const { scene } = useGLTF(url);
//   const { camera, gl, size } = useThree();
//   const groupRef = useRef();
//   const [hoveredMesh, setHoveredMesh] = useState(null);
//   const raycaster = useRef(new THREE.Raycaster());
//   const mouse = useRef(new THREE.Vector2());
//   const rafRef = useRef();

//   // Throttled raycast on pointer move (not every frame)
//   const handlePointerMove = useCallback((event) => {
//     mouse.current.x = (event.clientX / size.width) * 2 - 1;
//     mouse.current.y = -(event.clientY / size.height) * 2 + 1;

//     if (rafRef.current) cancelAnimationFrame(rafRef.current);
//     rafRef.current = requestAnimationFrame(() => {
//       raycaster.current.setFromCamera(mouse.current, camera);
//       const intersects = raycaster.current.intersectObject(scene, true);
//       if (intersects.length > 0) {
//         const newMesh = intersects[0].object;
//         if (newMesh.isMesh && newMesh !== hoveredMesh) {
//           // Clone material to avoid shared mutations
//           if (!newMesh.userData.originalMaterial) {
//             newMesh.userData.originalMaterial = newMesh.material.clone();
//           }
//           if (hoveredMesh && hoveredMesh.userData.originalMaterial) {
//             hoveredMesh.material.copy(hoveredMesh.userData.originalMaterial);
//           }
//           newMesh.material.emissive?.setHex(0x444444);
//           newMesh.material.color?.setHex(0xffffff);
//           setHoveredMesh(newMesh);
//         }
//       } else if (hoveredMesh) {
//         if (hoveredMesh.userData.originalMaterial) {
//           hoveredMesh.material.copy(hoveredMesh.userData.originalMaterial);
//         }
//         setHoveredMesh(null);
//       }
//     });
//   }, [camera, size.width, size.height, hoveredMesh, scene]);

//   // Context loss handling
//   useEffect(() => {
//     const handleContextLoss = () => {
//       console.log('WebGL context lost, attempting restore...');
//       setTimeout(() => gl.forceContextRestore?.(), 100);
//     };
//     gl.domElement.addEventListener('webglcontextlost', handleContextLoss);
//     return () => gl.domElement.removeEventListener('webglcontextlost', handleContextLoss);
//   }, [gl]);

//   useFrame(() => {}); // Empty, no heavy logic here

//   return (
//     <group ref={groupRef} onPointerMove={handlePointerMove}>
//       <primitive object={scene} scale={0.01} /> {/* Smaller scale for complex models */}
//     </group>
//   );
// }

// export default function Viewer() {
//   return (
//     <div style={{ width: '100vw', height: '100vh', position: 'relative' }}>
//       <Canvas>
//         <ambientLight intensity={0.5} />
//         <SkullModel url="/models/skeleton-full.glb" />
//         <OrbitControls />
//       </Canvas>
//     </div>
//   );
// }
