import React, { useState } from 'react';
import {
  Box,
  Camera,
  Compass,
  Download,
  Eye,
  Fan,
  FileCode,
  Grid,
  Layers,
  Lightbulb,
  Maximize2,
  Minimize2,
  Monitor,
  Palette,
  Play,
  Ruler,
  Sliders,
  Sun,
  Tv,
  Zap,
} from 'lucide-react';
import { CameraPreset, LightConfig, MaterialConfig, MeasurePoint, ScreenContent } from '../types';

interface ControlPanelProps {
  lightConfig: LightConfig;
  onLightConfigChange: (newConfig: LightConfig) => void;
  materialConfig: MaterialConfig;
  onMaterialConfigChange: (newConfig: MaterialConfig) => void;
  screenContent: ScreenContent;
  onScreenContentChange: (newContent: ScreenContent) => void;
  cameraPreset: CameraPreset;
  onCameraPresetChange: (preset: CameraPreset) => void;
  isMeasurementMode: boolean;
  onToggleMeasurementMode: () => void;
  measurementDistance: number | null;
  measurementPointA: MeasurePoint | null;
  measurementPointB: MeasurePoint | null;
  fanSpeed: number;
  onFanSpeedChange: (speed: number) => void;
  onOpenExportModal: () => void;
  onOpenTelemetryModal: () => void;
  onOpenApiModal: () => void;
}

export const ControlPanel: React.FC<ControlPanelProps> = ({
  lightConfig,
  onLightConfigChange,
  materialConfig,
  onMaterialConfigChange,
  screenContent,
  onScreenContentChange,
  cameraPreset,
  onCameraPresetChange,
  isMeasurementMode,
  onToggleMeasurementMode,
  measurementDistance,
  fanSpeed,
  onFanSpeedChange,
  onOpenExportModal,
  onOpenTelemetryModal,
  onOpenApiModal,
}) => {
  const [activeTab, setActiveTab] = useState<'lighting' | 'materials' | 'screen' | 'measure' | 'fans'>('lighting');
  const [isCollapsed, setIsCollapsed] = useState(false);

  const presets: { id: CameraPreset; label: string; icon: any }[] = [
    { id: 'overview', label: 'Overview', icon: Camera },
    { id: 'stage', label: 'Stage View', icon: Tv },
    { id: 'podium', label: 'Podium', icon: Monitor },
    { id: 'chair_view', label: 'Auditor Seat', icon: Eye },
    { id: 'back', label: 'Rear Wall', icon: Layers },
    { id: 'entrance', label: 'Exit Door', icon: Compass },
    { id: 'top_down', label: 'Floorplan', icon: Grid },
  ];

  return (
    <>
      {/* TOP FLOATING TOOLBAR: CAMERA PRESETS & EXPORT BUTTONS */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left: Camera Presets */}
        <div className="flex items-center gap-1.5 p-1.5 bg-slate-900/85 backdrop-blur-md rounded-2xl border border-slate-700/60 shadow-xl pointer-events-auto overflow-x-auto max-w-full">
          {presets.map((p) => {
            const Icon = p.icon;
            const active = cameraPreset === p.id;
            return (
              <button
                key={p.id}
                onClick={() => onCameraPresetChange(p.id)}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 whitespace-nowrap ${
                  active
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-500/25 ring-1 ring-blue-400/50'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{p.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right: Actions (Unity Export, Telemetry, API Sandbox) */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={onOpenTelemetryModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-700/50 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg transition-all"
          >
            <Zap className="w-4 h-4 text-emerald-400 animate-pulse" />
            <span>IoT Sensors</span>
          </button>

          <button
            onClick={onOpenApiModal}
            className="flex items-center gap-2 px-3.5 py-2 bg-indigo-950/80 hover:bg-indigo-900/90 text-indigo-300 border border-indigo-700/50 rounded-xl text-xs font-semibold backdrop-blur-md shadow-lg transition-all"
          >
            <FileCode className="w-4 h-4 text-indigo-400" />
            <span>Scene API</span>
          </button>

          <button
            onClick={onOpenExportModal}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold shadow-lg shadow-blue-500/20 border border-blue-400/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>Unity Export</span>
          </button>
        </div>
      </div>

      {/* FLOATING CONTROLS DRAWER (LEFT SIDE) */}
      <div className="absolute top-20 left-4 z-20 w-88 max-h-[calc(100vh-6rem)] flex flex-col bg-slate-900/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl overflow-hidden transition-all duration-300">
        {/* Panel Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/50">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-4 h-4 text-blue-400" />
            <span className="text-xs font-bold text-slate-200 uppercase tracking-wider">Digital Twin Controls</span>
          </div>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-1 text-slate-400 hover:text-slate-200 rounded-lg hover:bg-slate-800 transition"
          >
            {isCollapsed ? <Maximize2 className="w-3.5 h-3.5" /> : <Minimize2 className="w-3.5 h-3.5" />}
          </button>
        </div>

        {!isCollapsed && (
          <>
            {/* Tab Navigation */}
            <div className="grid grid-cols-5 p-1.5 bg-slate-950/40 border-b border-slate-800 text-xs">
              <button
                onClick={() => setActiveTab('lighting')}
                className={`py-2 flex flex-col items-center gap-1 rounded-lg font-medium transition ${
                  activeTab === 'lighting' ? 'bg-slate-800 text-amber-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                <span className="text-[10px]">Lights</span>
              </button>

              <button
                onClick={() => setActiveTab('materials')}
                className={`py-2 flex flex-col items-center gap-1 rounded-lg font-medium transition ${
                  activeTab === 'materials' ? 'bg-slate-800 text-blue-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-3.5 h-3.5" />
                <span className="text-[10px]">PBR</span>
              </button>

              <button
                onClick={() => setActiveTab('screen')}
                className={`py-2 flex flex-col items-center gap-1 rounded-lg font-medium transition ${
                  activeTab === 'screen' ? 'bg-slate-800 text-purple-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Tv className="w-3.5 h-3.5" />
                <span className="text-[10px]">Screen</span>
              </button>

              <button
                onClick={() => setActiveTab('measure')}
                className={`py-2 flex flex-col items-center gap-1 rounded-lg font-medium transition ${
                  activeTab === 'measure' ? 'bg-slate-800 text-emerald-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span className="text-[10px]">Tape</span>
              </button>

              <button
                onClick={() => setActiveTab('fans')}
                className={`py-2 flex flex-col items-center gap-1 rounded-lg font-medium transition ${
                  activeTab === 'fans' ? 'bg-slate-800 text-cyan-400 shadow-sm' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Fan className="w-3.5 h-3.5" />
                <span className="text-[10px]">HVAC</span>
              </button>
            </div>

            {/* Tab Contents */}
            <div className="p-4 space-y-4 overflow-y-auto max-h-[calc(100vh-14rem)] text-xs text-slate-300">
              {/* TAB 1: LIGHTING CONTROLS */}
              {activeTab === 'lighting' && (
                <div className="space-y-4">
                  {/* Stage Spotlights Toggle */}
                  <div className="p-3 bg-slate-800/50 rounded-xl border border-slate-700/50 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-200 flex items-center gap-2">
                        <Zap className="w-3.5 h-3.5 text-amber-400" /> Stage Truss Spotlights
                      </span>
                      <input
                        type="checkbox"
                        checked={lightConfig.stageSpotlightsEnabled}
                        onChange={(e) =>
                          onLightConfigChange({ ...lightConfig, stageSpotlightsEnabled: e.target.checked })
                        }
                        className="w-4 h-4 accent-amber-500 rounded cursor-pointer"
                      />
                    </div>

                    {lightConfig.stageSpotlightsEnabled && (
                      <>
                        <div className="space-y-1">
                          <div className="flex justify-between text-[11px] text-slate-400">
                            <span>Spotlight Lux</span>
                            <span>{(lightConfig.spotlightIntensity * 100).toFixed(0)} Lux</span>
                          </div>
                          <input
                            type="range"
                            min="0.2"
                            max="3.0"
                            step="0.1"
                            value={lightConfig.spotlightIntensity}
                            onChange={(e) =>
                              onLightConfigChange({ ...lightConfig, spotlightIntensity: parseFloat(e.target.value) })
                            }
                            className="w-full accent-amber-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                          />
                        </div>

                        <div className="space-y-1">
                          <span className="text-[11px] text-slate-400">Spotlight Beam Color</span>
                          <div className="flex items-center gap-2 mt-1">
                            {['#ffffff', '#38bdf8', '#f59e0b', '#ec4899', '#10b981'].map((c) => (
                              <button
                                key={c}
                                onClick={() => onLightConfigChange({ ...lightConfig, spotlightColor: c })}
                                style={{ backgroundColor: c }}
                                className={`w-6 h-6 rounded-full border ${
                                  lightConfig.spotlightColor === c ? 'border-white ring-2 ring-blue-500' : 'border-transparent'
                                }`}
                              />
                            ))}
                            <input
                              type="color"
                              value={lightConfig.spotlightColor}
                              onChange={(e) => onLightConfigChange({ ...lightConfig, spotlightColor: e.target.value })}
                              className="w-6 h-6 rounded border-0 cursor-pointer bg-transparent"
                            />
                          </div>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Ceiling Downlights */}
                  <div className="space-y-3">
                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Ceiling Lights Intensity</span>
                        <span>{(lightConfig.ceilingIntensity * 100).toFixed(0)}%</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="2.0"
                        step="0.05"
                        value={lightConfig.ceilingIntensity}
                        onChange={(e) =>
                          onLightConfigChange({ ...lightConfig, ceilingIntensity: parseFloat(e.target.value) })
                        }
                        className="w-full accent-blue-500 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                      />
                    </div>

                    <div className="space-y-1">
                      <div className="flex justify-between text-[11px] text-slate-400">
                        <span>Color Temperature</span>
                        <span>{lightConfig.ceilingWarmth} K</span>
                      </div>
                      <input
                        type="range"
                        min="2700"
                        max="6500"
                        step="100"
                        value={lightConfig.ceilingWarmth}
                        onChange={(e) =>
                          onLightConfigChange({ ...lightConfig, ceilingWarmth: parseInt(e.target.value) })
                        }
                        className="w-full accent-amber-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Sunlight */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Window Daylight</span>
                      <span>{(lightConfig.sunlightIntensity * 100).toFixed(0)}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="2.0"
                      step="0.1"
                      value={lightConfig.sunlightIntensity}
                      onChange={(e) =>
                        onLightConfigChange({ ...lightConfig, sunlightIntensity: parseFloat(e.target.value) })
                      }
                      className="w-full accent-sky-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: PBR MATERIALS */}
              {activeTab === 'materials' && (
                <div className="space-y-4">
                  {/* Plastic Wrap Covers (Photo feature!) */}
                  <div className="p-3 bg-blue-950/40 rounded-xl border border-blue-800/40 space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <span className="font-semibold text-blue-200 block">Chair Plastic Sheen Covers</span>
                        <span className="text-[10px] text-blue-400">Matches protective wrapping in photos</span>
                      </div>
                      <input
                        type="checkbox"
                        checked={materialConfig.showPlasticCovers}
                        onChange={(e) =>
                          onMaterialConfigChange({ ...materialConfig, showPlasticCovers: e.target.checked })
                        }
                        className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                      />
                    </div>
                  </div>

                  {/* Chair Colors */}
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-200 block">Seating Zone Cushions</span>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                        <span className="text-[10px] text-slate-400 block mb-1">Zone A Color</span>
                        <input
                          type="color"
                          value={materialConfig.chairBlueColor}
                          onChange={(e) =>
                            onMaterialConfigChange({ ...materialConfig, chairBlueColor: e.target.value })
                          }
                          className="w-full h-7 rounded border-0 cursor-pointer bg-transparent"
                        />
                      </div>

                      <div className="p-2 bg-slate-800/60 rounded-lg border border-slate-700/50">
                        <span className="text-[10px] text-slate-400 block mb-1">Zone B Color</span>
                        <input
                          type="color"
                          value={materialConfig.chairGreenColor}
                          onChange={(e) =>
                            onMaterialConfigChange({ ...materialConfig, chairGreenColor: e.target.value })
                          }
                          className="w-full h-7 rounded border-0 cursor-pointer bg-transparent"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Floor Reflection */}
                  <div className="space-y-1">
                    <div className="flex justify-between text-[11px] text-slate-400">
                      <span>Ceramic Tile Roughness</span>
                      <span>{materialConfig.floorRoughness.toFixed(2)}</span>
                    </div>
                    <input
                      type="range"
                      min="0.05"
                      max="0.8"
                      step="0.05"
                      value={materialConfig.floorRoughness}
                      onChange={(e) =>
                        onMaterialConfigChange({ ...materialConfig, floorRoughness: parseFloat(e.target.value) })
                      }
                      className="w-full accent-slate-400 h-1.5 bg-slate-700 rounded-lg cursor-pointer"
                    />
                  </div>

                  {/* Real-time Shadow Mapping */}
                  <div className="flex items-center justify-between p-2.5 bg-slate-800/50 rounded-lg">
                    <span>Shadow Mapping</span>
                    <input
                      type="checkbox"
                      checked={materialConfig.enableShadows}
                      onChange={(e) =>
                        onMaterialConfigChange({ ...materialConfig, enableShadows: e.target.checked })
                      }
                      className="w-4 h-4 accent-blue-500 rounded cursor-pointer"
                    />
                  </div>
                </div>
              )}

              {/* TAB 3: STAGE PRESENTATION SCREEN */}
              {activeTab === 'screen' && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <span className="font-semibold text-slate-200 block">Screen Power & Mode</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => onScreenContentChange({ ...screenContent, type: 'presentation' })}
                        className={`p-2 rounded-lg text-xs font-semibold border ${
                          screenContent.type === 'presentation'
                            ? 'bg-purple-600 text-white border-purple-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        Slide Keynote
                      </button>
                      <button
                        onClick={() => onScreenContentChange({ ...screenContent, type: 'off' })}
                        className={`p-2 rounded-lg text-xs font-semibold border ${
                          screenContent.type === 'off'
                            ? 'bg-red-600 text-white border-red-400'
                            : 'bg-slate-800 text-slate-300 border-slate-700'
                        }`}
                      >
                        Display Off
                      </button>
                    </div>
                  </div>

                  {screenContent.type === 'presentation' && (
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <span className="text-[11px] text-slate-400">Slide Presentation Title</span>
                        <input
                          type="text"
                          value={screenContent.title}
                          onChange={(e) => onScreenContentChange({ ...screenContent, title: e.target.value })}
                          className="w-full bg-slate-950 border border-slate-700 rounded-lg px-2.5 py-1.5 text-xs text-white focus:outline-none focus:border-purple-500"
                        />
                      </div>

                      <div className="flex items-center justify-between p-3 bg-slate-800/60 rounded-xl border border-slate-700">
                        <span className="font-medium text-slate-200">Active Slide #{screenContent.slideIndex + 1}</span>
                        <div className="flex gap-1.5">
                          <button
                            onClick={() =>
                              onScreenContentChange({
                                ...screenContent,
                                slideIndex: (screenContent.slideIndex - 1 + 3) % 3,
                              })
                            }
                            className="px-2.5 py-1 bg-slate-700 hover:bg-slate-600 rounded text-xs text-white"
                          >
                            Prev
                          </button>
                          <button
                            onClick={() =>
                              onScreenContentChange({
                                ...screenContent,
                                slideIndex: (screenContent.slideIndex + 1) % 3,
                              })
                            }
                            className="px-2.5 py-1 bg-purple-600 hover:bg-purple-500 rounded text-xs text-white font-semibold"
                          >
                            Next Slide
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: 3D MEASUREMENT TAPE */}
              {activeTab === 'measure' && (
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-950/40 border border-emerald-700/50 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-emerald-300 flex items-center gap-2">
                        <Ruler className="w-4 h-4 text-emerald-400" /> Tape Measure Tool
                      </span>
                      <button
                        onClick={onToggleMeasurementMode}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition ${
                          isMeasurementMode
                            ? 'bg-emerald-500 text-slate-950 shadow-md'
                            : 'bg-slate-800 text-emerald-400 hover:bg-slate-700'
                        }`}
                      >
                        {isMeasurementMode ? 'Active (Click 2 points)' : 'Enable Measure'}
                      </button>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      Click any two surfaces in the 3D hall model to measure exact real-world dimensions in meters and feet.
                    </p>
                  </div>

                  {measurementDistance !== null && (
                    <div className="p-3 bg-slate-800 rounded-xl border border-emerald-500/40 space-y-1">
                      <span className="text-[10px] uppercase text-emerald-400 tracking-wider font-bold block">
                        Measured Distance
                      </span>
                      <div className="text-xl font-bold text-white">
                        {measurementDistance.toFixed(2)} m
                        <span className="text-xs text-slate-400 font-normal ml-2">
                          ({(measurementDistance * 3.28084).toFixed(1)} ft)
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: FANS & HVAC */}
              {activeTab === 'fans' && (
                <div className="space-y-3">
                  <div className="p-3 bg-cyan-950/40 border border-cyan-800/40 rounded-xl space-y-3">
                    <span className="font-semibold text-cyan-200 flex items-center gap-2">
                      <Fan className="w-4 h-4 text-cyan-400" /> Ceiling Fans Animation Speed
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: 'Off', speed: 0 },
                        { label: 'Low', speed: 0.5 },
                        { label: 'Med', speed: 1.0 },
                        { label: 'High', speed: 2.5 },
                      ].map((item) => (
                        <button
                          key={item.label}
                          onClick={() => onFanSpeedChange(item.speed)}
                          className={`py-1.5 rounded-lg text-xs font-semibold ${
                            fanSpeed === item.speed
                              ? 'bg-cyan-500 text-slate-950 shadow'
                              : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </>
  );
};
