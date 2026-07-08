import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

function Box() {
  return (
    <mesh>
      <boxGeometry args={[2, 2, 2]} />
      <meshStandardMaterial color="royalblue" />
    </mesh>
  );
}

export default function ThreeScene() {
  return (
    <Canvas camera={{ position: [4, 4, 4] }}>
      <ambientLight />
      <directionalLight position={[5, 5, 5]} />
      <Box />
      <OrbitControls />
    </Canvas>
  );
}