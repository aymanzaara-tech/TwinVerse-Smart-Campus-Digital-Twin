import React, { useRef, useState } from 'react';
import * as THREE from 'three';
import {
  CameraPreset,
  LightConfig,
  MaterialConfig,
  MeasurePoint,
  ScreenContent,
  SelectedObjectInfo,
} from './types';
import { ThreeCanvas } from './components/ThreeCanvas';
import { ControlPanel } from './components/ControlPanel';
import { TelemetryDashboard } from './components/TelemetryDashboard';
import { UnityExportModal } from './components/UnityExportModal';
import { ApiSandboxModal } from './components/ApiSandboxModal';
import { ObjectInspectorModal } from './components/ObjectInspectorModal';

export default function App() {
  const sceneRef = useRef<THREE.Scene | null>(null);

  // Lighting Configuration State
  const [lightConfig, setLightConfig] = useState<LightConfig>({
    ceilingWarmth: 3500, // Warm 3500K LED
    ceilingIntensity: 1.0,
    stageSpotlightsEnabled: false,
    spotlightIntensity: 1.8,
    spotlightColor: '#ffffff',
    ambientIntensity: 0.8,
    sunlightIntensity: 0.8,
    timeOfDay: 14,
  });

  // Material & Appearance State (Matching uploaded photos)
  const [materialConfig, setMaterialConfig] = useState<MaterialConfig>({
    showPlasticCovers: true, // Photo feature: protective plastic wrapping over cushions
    chairBlueColor: '#1d4ed8', // Royal Blue
    chairGreenColor: '#059669', // Emerald Green
    floorRoughness: 0.15, // Polished ceramic tile gloss
    floorReflectivity: 0.4,
    woodWallDarkness: 0.1,
    acousticPatternStyle: 'photo_matching',
    enableShadows: true,
  });

  // Stage Presentation Screen State
  const [screenContent, setScreenContent] = useState<ScreenContent>({
    type: 'presentation',
    title: 'SEMINAR HALL DIGITAL TWIN',
    slideIndex: 0,
  });

  // Camera & Interaction State
  const [cameraPreset, setCameraPreset] = useState<CameraPreset>('overview');
  const [isMeasurementMode, setIsMeasurementMode] = useState(false);
  const [measurementDistance, setMeasurementDistance] = useState<number | null>(null);
  const [measurementPointA, setMeasurementPointA] = useState<MeasurePoint | null>(null);
  const [measurementPointB, setMeasurementPointB] = useState<MeasurePoint | null>(null);
  const [fanSpeed, setFanSpeed] = useState<number>(1.0); // HVAC fan rotation speed
  const [selectedObject, setSelectedObject] = useState<SelectedObjectInfo | null>(null);

  // Modal States
  const [isTelemetryModalOpen, setIsTelemetryModalOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isApiModalOpen, setIsApiModalOpen] = useState(false);

  // API Sandbox Tests
  const handleRunLightingTest = () => {
    setLightConfig((prev) => ({
      ...prev,
      stageSpotlightsEnabled: true,
      spotlightColor: '#38bdf8',
      spotlightIntensity: 2.5,
    }));
  };

  const handleRunSlideTest = () => {
    setScreenContent((prev) => ({
      ...prev,
      slideIndex: (prev.slideIndex + 1) % 3,
    }));
  };

  const handleRunCameraTest = () => {
    setCameraPreset('podium');
  };

  return (
    <div className="relative w-screen h-screen bg-slate-950 font-sans overflow-hidden select-none">
      {/* 1. Main WebGL 3D Canvas */}
      <ThreeCanvas
        lightConfig={lightConfig}
        materialConfig={materialConfig}
        screenContent={screenContent}
        cameraPreset={cameraPreset}
        isMeasurementMode={isMeasurementMode}
        fanSpeed={fanSpeed}
        onObjectSelect={(info) => setSelectedObject(info)}
        onMeasurementUpdate={(dist, pA, pB) => {
          setMeasurementDistance(dist);
          setMeasurementPointA(pA);
          setMeasurementPointB(pB);
        }}
        sceneRefOut={sceneRef}
      />

      {/* 2. Floating Control Panel Drawer & Presets Toolbar */}
      <ControlPanel
        lightConfig={lightConfig}
        onLightConfigChange={setLightConfig}
        materialConfig={materialConfig}
        onMaterialConfigChange={setMaterialConfig}
        screenContent={screenContent}
        onScreenContentChange={setScreenContent}
        cameraPreset={cameraPreset}
        onCameraPresetChange={setCameraPreset}
        isMeasurementMode={isMeasurementMode}
        onToggleMeasurementMode={() => setIsMeasurementMode(!isMeasurementMode)}
        measurementDistance={measurementDistance}
        measurementPointA={measurementPointA}
        measurementPointB={measurementPointB}
        fanSpeed={fanSpeed}
        onFanSpeedChange={setFanSpeed}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        onOpenTelemetryModal={() => setIsTelemetryModalOpen(true)}
        onOpenApiModal={() => setIsApiModalOpen(true)}
      />

      {/* 3. Object Metadata Inspector Card */}
      <ObjectInspectorModal info={selectedObject} onClose={() => setSelectedObject(null)} />

      {/* 4. IoT Sensor Telemetry Modal */}
      <TelemetryDashboard isOpen={isTelemetryModalOpen} onClose={() => setIsTelemetryModalOpen(false)} />

      {/* 5. Unity GLB Export & C# API Modal */}
      <UnityExportModal isOpen={isExportModalOpen} onClose={() => setIsExportModalOpen(false)} scene={sceneRef.current} />

      {/* 6. Web JS API Sandbox Modal */}
      <ApiSandboxModal
        isOpen={isApiModalOpen}
        onClose={() => setIsApiModalOpen(false)}
        onRunLightingTest={handleRunLightingTest}
        onRunSlideTest={handleRunSlideTest}
        onRunCameraTest={handleRunCameraTest}
      />
    </div>
  );
}
