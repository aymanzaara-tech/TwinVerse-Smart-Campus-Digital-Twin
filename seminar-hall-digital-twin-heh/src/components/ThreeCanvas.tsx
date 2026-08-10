import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { RotateCcw, RotateCw, ZoomIn, ZoomOut } from 'lucide-react';
import {
  CameraPreset,
  IoTSensorData,
  LightConfig,
  MaterialConfig,
  MeasurePoint,
  ScreenContent,
  SelectedObjectInfo,
} from '../types';
import { buildHallStructure, HallStructureObjects } from '../three/buildHallStructure';
import { buildLighting, HallLightingObjects } from '../three/buildLighting';
import { buildFurniture, FurnitureObjects } from '../three/buildFurniture';
import { MeasurementManager } from '../three/measurementTool';
import { createPresentationScreenTexture } from '../utils/proceduralTextures';
import { exportSceneJSONSchema, exportSceneToGLTF } from '../utils/exporter';

interface ThreeCanvasProps {
  lightConfig: LightConfig;
  materialConfig: MaterialConfig;
  screenContent: ScreenContent;
  cameraPreset: CameraPreset;
  isMeasurementMode: boolean;
  fanSpeed: number;
  onObjectSelect: (info: SelectedObjectInfo | null) => void;
  onMeasurementUpdate: (distMeters: number | null, pA: MeasurePoint | null, pB: MeasurePoint | null) => void;
  sceneRefOut?: React.MutableRefObject<THREE.Scene | null>;
}

export const ThreeCanvas: React.FC<ThreeCanvasProps> = ({
  lightConfig,
  materialConfig,
  screenContent,
  cameraPreset,
  isMeasurementMode,
  fanSpeed,
  onObjectSelect,
  onMeasurementUpdate,
  sceneRefOut,
}) => {
  const mountRef = useRef<HTMLDivElement | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);

  const hallStructRef = useRef<HallStructureObjects | null>(null);
  const hallLightingRef = useRef<HallLightingObjects | null>(null);
  const hallFurnitureRef = useRef<FurnitureObjects | null>(null);

  const measurementManagerRef = useRef<MeasurementManager | null>(null);
  const raycasterRef = useRef(new THREE.Raycaster());
  const mouseRef = useRef(new THREE.Vector2());

  // Target camera positions for smooth interpolation
  const targetCamPos = useRef(new THREE.Vector3(0, 2.5, 9.0));
  const targetLookAt = useRef(new THREE.Vector3(0, 1.8, -4.0));
  const isCameraTransitioning = useRef(false);

  useEffect(() => {
    if (!mountRef.current) return;

    const width = mountRef.current.clientWidth;
    const height = mountRef.current.clientHeight;

    // 1. Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x0f172a);
    scene.fog = new THREE.FogExp2(0x0f172a, 0.012);
    sceneRef.current = scene;
    if (sceneRefOut) sceneRefOut.current = scene;

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 100);
    camera.position.set(0, 2.8, 9.5);
    cameraRef.current = camera;

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = materialConfig.enableShadows;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;

    mountRef.current.innerHTML = '';
    mountRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // 4. OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableRotate = true;
    controls.enableZoom = true;
    controls.enablePan = true;
    controls.zoomSpeed = 1.2;
    controls.rotateSpeed = 0.8;
    controls.minDistance = 0.5;
    controls.maxDistance = 40.0;
    controls.maxPolarAngle = Math.PI - 0.05; // Full 360 rotation & vertical tilt
    controls.target.set(0, 1.8, -4.0);
    controlsRef.current = controls;

    // Stop auto-camera transition when user starts dragging/zooming manually
    controls.addEventListener('start', () => {
      isCameraTransitioning.current = false;
    });

    // 5. Build 3D Scene Components
    const hallStruct = buildHallStructure(materialConfig);
    scene.add(hallStruct.group);
    hallStructRef.current = hallStruct;

    const hallLighting = buildLighting(lightConfig);
    scene.add(hallLighting.group);
    hallLightingRef.current = hallLighting;

    const hallFurniture = buildFurniture(materialConfig);
    scene.add(hallFurniture.group);
    hallFurnitureRef.current = hallFurniture;

    // 6. Measurement Tool Manager
    measurementManagerRef.current = new MeasurementManager(scene);

    // Initial Screen Texture
    const screenTex = createPresentationScreenTexture(screenContent.slideIndex, screenContent.title);
    hallStruct.screenMaterial.map = screenTex;
    hallStruct.screenMaterial.needsUpdate = true;

    // 7. Animation Loop
    let animationFrameId: number;
    const clock = new THREE.Clock();

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      const delta = clock.getDelta();

      // Smooth Camera Interpolation ONLY during camera preset transitions
      if (isCameraTransitioning.current && cameraRef.current && controlsRef.current) {
        cameraRef.current.position.lerp(targetCamPos.current, delta * 4.0);
        controlsRef.current.target.lerp(targetLookAt.current, delta * 4.0);
        if (
          cameraRef.current.position.distanceTo(targetCamPos.current) < 0.05 &&
          controlsRef.current.target.distanceTo(targetLookAt.current) < 0.05
        ) {
          isCameraTransitioning.current = false;
        }
      }
      controlsRef.current?.update();

      // Fan Rotation Animation
      if (hallFurnitureRef.current && fanSpeed > 0) {
        hallFurnitureRef.current.fanBladeGroups.forEach((blades) => {
          blades.rotation.y += delta * 4.0 * fanSpeed;
        });
      }

      renderer.render(scene, camera);
    };

    animate();

    // Resize Handler
    const handleResize = () => {
      if (!mountRef.current || !rendererRef.current || !cameraRef.current) return;
      const w = mountRef.current.clientWidth;
      const h = mountRef.current.clientHeight;
      cameraRef.current.aspect = w / h;
      cameraRef.current.updateProjectionMatrix();
      rendererRef.current.setSize(w, h);
    };

    const resizeObserver = new ResizeObserver(handleResize);
    resizeObserver.observe(mountRef.current);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
      renderer.dispose();
    };
  }, []);

  // Update Lighting when config changes
  useEffect(() => {
    if (hallLightingRef.current) {
      hallLightingRef.current.updateLighting(lightConfig);
    }
  }, [lightConfig]);

  // Update Materials when config changes
  useEffect(() => {
    if (hallFurnitureRef.current) {
      hallFurnitureRef.current.updateMaterials(materialConfig);
    }
    if (hallStructRef.current) {
      hallStructRef.current.woodWallMaterial.color.setRGB(
        1 - materialConfig.woodWallDarkness * 0.3,
        1 - materialConfig.woodWallDarkness * 0.3,
        1 - materialConfig.woodWallDarkness * 0.3
      );
      hallStructRef.current.floorMaterial.roughness = materialConfig.floorRoughness;
    }
    if (rendererRef.current) {
      rendererRef.current.shadowMap.enabled = materialConfig.enableShadows;
    }
  }, [materialConfig]);

  // Update Stage Screen Content
  useEffect(() => {
    if (hallStructRef.current) {
      if (screenContent.type === 'off') {
        hallStructRef.current.screenMaterial.color.setHex(0x111111);
        hallStructRef.current.screenMaterial.emissive.setHex(0x000000);
        hallStructRef.current.screenMaterial.map = null;
      } else {
        const tex = createPresentationScreenTexture(screenContent.slideIndex, screenContent.title);
        hallStructRef.current.screenMaterial.color.setHex(0xffffff);
        hallStructRef.current.screenMaterial.emissive.setHex(0xffffff);
        hallStructRef.current.screenMaterial.map = tex;
      }
      hallStructRef.current.screenMaterial.needsUpdate = true;
    }
  }, [screenContent]);

  // Handle Camera Presets
  useEffect(() => {
    isCameraTransitioning.current = true;
    switch (cameraPreset) {
      case 'overview':
        targetCamPos.current.set(0, 3.2, 9.0);
        targetLookAt.current.set(0, 1.8, -4.0);
        break;
      case 'stage':
        targetCamPos.current.set(0, 1.2, -6.5);
        targetLookAt.current.set(0, 2.2, -10.5);
        break;
      case 'back':
        targetCamPos.current.set(0, 2.2, 8.5);
        targetLookAt.current.set(0, 2.0, -10.0);
        break;
      case 'podium':
        targetCamPos.current.set(-2.5, 1.5, -8.0);
        targetLookAt.current.set(0, 1.8, 2.0);
        break;
      case 'entrance':
        targetCamPos.current.set(5.5, 1.6, 4.0);
        targetLookAt.current.set(-2.0, 1.8, -4.0);
        break;
      case 'chair_view':
        targetCamPos.current.set(-1.8, 1.25, 1.0);
        targetLookAt.current.set(0, 1.8, -10.0);
        break;
      case 'top_down':
        targetCamPos.current.set(0, 18.0, 0.01);
        targetLookAt.current.set(0, 0, 0);
        break;
    }
  }, [cameraPreset]);

  // Quick manual camera helper functions
  const handleZoomIn = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, 1.5);
    controlsRef.current.update();
  };

  const handleZoomOut = () => {
    if (!cameraRef.current || !controlsRef.current) return;
    const dir = new THREE.Vector3();
    cameraRef.current.getWorldDirection(dir);
    cameraRef.current.position.addScaledVector(dir, -1.5);
    controlsRef.current.update();
  };

  const handleRotateLeft = () => {
    if (!controlsRef.current) return;
    controlsRef.current.azimuthAngle += 0.3;
    controlsRef.current.update();
  };

  const handleRotateRight = () => {
    if (!controlsRef.current) return;
    controlsRef.current.azimuthAngle -= 0.3;
    controlsRef.current.update();
  };

  // Click & Raycast Interaction Handler
  const handlePointerDown = (e: React.PointerEvent) => {
    if (!mountRef.current || !cameraRef.current || !sceneRef.current) return;

    const rect = mountRef.current.getBoundingClientRect();
    mouseRef.current.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseRef.current.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

    raycasterRef.current.setFromCamera(mouseRef.current, cameraRef.current);

    // If measurement tape tool active
    if (isMeasurementMode && measurementManagerRef.current) {
      const intersects = raycasterRef.current.intersectObjects(sceneRef.current.children, true);
      if (intersects.length > 0) {
        const hitPoint = intersects[0].point;
        const state = measurementManagerRef.current.addPoint(hitPoint);
        onMeasurementUpdate(state.distanceMeters, state.pointA, state.pointB);
      }
      return;
    }

    // Interactive Object Selection
    const interactiveTargets: THREE.Mesh[] = [];
    if (hallStructRef.current) interactiveTargets.push(...hallStructRef.current.interactiveObjects);
    if (hallFurnitureRef.current) {
      interactiveTargets.push(...hallFurnitureRef.current.interactiveFurniture);
      interactiveTargets.push(hallFurnitureRef.current.framesMesh);
      interactiveTargets.push(hallFurnitureRef.current.blueChairsMesh);
      interactiveTargets.push(hallFurnitureRef.current.greenChairsMesh);
    }

    const intersects = raycasterRef.current.intersectObjects(interactiveTargets, true);

    if (intersects.length > 0) {
      const hit = intersects[0].object as THREE.Mesh;
      const pos: [number, number, number] = [
        Number(intersects[0].point.x.toFixed(2)),
        Number(intersects[0].point.y.toFixed(2)),
        Number(intersects[0].point.z.toFixed(2)),
      ];

      const objectInfo: SelectedObjectInfo = {
        name: hit.name || 'Hall Element',
        category: hit.userData.category || 'Interior',
        position: pos,
        materials: hit.material ? (Array.isArray(hit.material) ? hit.material.map((m) => m.name) : [hit.material.type]) : ['PBR Material'],
        polyCount: hit.userData.polyCount || 120,
        instanceCount: hit instanceof THREE.InstancedMesh ? hit.count : undefined,
      };

      onObjectSelect(objectInfo);
    } else {
      onObjectSelect(null);
    }
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      <div
        ref={mountRef}
        onPointerDown={handlePointerDown}
        className={`w-full h-full ${isMeasurementMode ? 'cursor-crosshair' : 'cursor-grab active:cursor-grabbing'}`}
      />

      {/* Floating 3D Navigation Controls Widget (Zoom, Rotate, Helper) */}
      <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 p-1.5 bg-slate-900/80 backdrop-blur-md border border-slate-700/70 rounded-2xl shadow-xl">
        <button
          onClick={handleZoomIn}
          title="Zoom In (or Scroll Wheel Up)"
          className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/80 rounded-xl transition flex items-center justify-center"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={handleZoomOut}
          title="Zoom Out (or Scroll Wheel Down)"
          className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/80 rounded-xl transition flex items-center justify-center"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-slate-700/60 mx-1" />

        <button
          onClick={handleRotateLeft}
          title="Rotate Left (or Drag Mouse)"
          className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/80 rounded-xl transition flex items-center justify-center"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          onClick={handleRotateRight}
          title="Rotate Right (or Drag Mouse)"
          className="p-2 text-slate-300 hover:text-white bg-slate-800/80 hover:bg-blue-600/80 rounded-xl transition flex items-center justify-center"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <div className="hidden sm:flex items-center gap-2 pl-2 pr-3 text-[11px] font-medium text-slate-400 border-l border-slate-700/60">
          <span>Drag to Rotate • Right-click / Shift to Pan • Scroll to Zoom</span>
        </div>
      </div>
    </div>
  );
};
