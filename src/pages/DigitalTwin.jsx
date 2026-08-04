import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import PageHeader from '@/components/ui/PageHeader';
import { ThreeCanvas } from '@/components/digitaltwin/ThreeCanvas';
import { ControlPanel } from '@/components/digitaltwin/ControlPanel';
import { TelemetryDashboard } from '@/components/digitaltwin/TelemetryDashboard';
import { ObjectInspectorModal } from '@/components/digitaltwin/ObjectInspectorModal';
import { UnityExportModal } from '@/components/digitaltwin/UnityExportModal';
import { ApiSandboxModal } from '@/components/digitaltwin/ApiSandboxModal';

export default function DigitalTwin() {
  const sceneRef = useRef(null);

  // Lighting Configuration State
  const [lightConfig, setLightConfig] = useState({
    ceilingWarmth: 3500,
    ceilingIntensity: 1.0,
    stageSpotlightsEnabled: true,
    spotlightIntensity: 1.8,
    spotlightColor: '#ffffff',
    ambientIntensity: 0.8,
    sunlightIntensity: 0.8,
    timeOfDay: 14,
  });

  // Material & Appearance State
  const [materialConfig, setMaterialConfig] = useState({
    showPlasticCovers: true,
    chairBlueColor: '#1d4ed8',
    chairGreenColor: '#059669',
    floorRoughness: 0.15,
    floorReflectivity: 0.4,
    woodWallDarkness: 0.1,
    acousticPatternStyle: 'photo_matching',
    enableShadows: true,
  });

  // Stage Presentation Screen State
  const [screenContent, setScreenContent] = useState({
    type: 'presentation',
    title: 'SEMINAR HALL DIGITAL TWIN',
    slideIndex: 0,
  });

  // Camera & Interaction State
  const [cameraPreset, setCameraPreset] = useState('overview');
  const [isMeasurementMode, setIsMeasurementMode] = useState(false);
  const [measurementDistance, setMeasurementDistance] = useState(null);
  const [measurementPointA, setMeasurementPointA] = useState(null);
  const [measurementPointB, setMeasurementPointB] = useState(null);
  const [fanSpeed, setFanSpeed] = useState(1.0);
  const [selectedObject, setSelectedObject] = useState(null);

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
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      {/* PageHeader */}
      <PageHeader
        title="Seminar Hall — Interactive 3D Digital Twin"
        subtitle="Real-time WebGL 3D spatial model, IoT sensor telemetry & PBR scene controls"
      >
        <span className="flex items-center gap-2 rounded-full border border-ok/20 bg-ok/10 px-3 py-1.5 text-xs font-medium text-ok">
          <span className="relative flex h-2 w-2">
            <span className="absolute h-full w-full animate-ping rounded-full bg-ok opacity-60" />
            <span className="relative h-2 w-2 rounded-full bg-ok" />
          </span>
          3D Engine Active · 60 FPS
        </span>
      </PageHeader>

      {/* Main 3D Canvas Visualization Container */}
      <div className="card relative h-[calc(100vh-180px)] min-h-[640px] w-full overflow-hidden rounded-2xl border border-line bg-bg/60 shadow-2xl">
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
      </div>

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
    </motion.div>
  );
}
