import React, { useState } from 'react';
import * as THREE from 'three';
import { Check, Copy, Download, FileCode, Layers, ShieldCheck, Sparkles, X } from 'lucide-react';
import { exportSceneJSONSchema, exportSceneToGLTF } from '../utils/exporter';
import { generateUnityControllerScript, generateUnityImportGuide } from '../utils/unityScriptGenerator';

interface UnityExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  scene: THREE.Scene | null;
}

export const UnityExportModal: React.FC<UnityExportModalProps> = ({ isOpen, onClose, scene }) => {
  const [activeTab, setActiveTab] = useState<'export' | 'csharp' | 'guide'>('export');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const csharpCode = generateUnityControllerScript();
  const guideText = generateUnityImportGuide();

  const handleCopyCode = () => {
    navigator.clipboard.writeText(csharpCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadGLB = () => {
    if (scene) {
      exportSceneToGLTF(scene);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="w-full max-w-4xl bg-slate-900 border border-slate-700/80 rounded-3xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-blue-500/10 border border-blue-500/30 rounded-2xl text-blue-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-2">
                Unity & Unreal Engine Export Center
              </h2>
              <p className="text-xs text-slate-400">
                PBR Material Preservation, Optimized Instanced Geometry, & Unity C# Controller API
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-xl transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Header */}
        <div className="flex border-b border-slate-800 bg-slate-950/40 px-6 pt-3 text-xs font-semibold gap-2">
          <button
            onClick={() => setActiveTab('export')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'export' ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Download className="w-4 h-4" /> 3D Model Download (.GLB)
          </button>

          <button
            onClick={() => setActiveTab('csharp')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'csharp' ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <FileCode className="w-4 h-4" /> Unity C# Controller API
          </button>

          <button
            onClick={() => setActiveTab('guide')}
            className={`pb-3 px-4 border-b-2 transition flex items-center gap-2 ${
              activeTab === 'guide' ? 'border-blue-500 text-blue-400 font-bold' : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-4 h-4" /> Setup Walkthrough
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 overflow-y-auto max-h-[70vh] text-xs text-slate-300 space-y-6">
          {/* TAB 1: EXPORT DOWNLOAD */}
          {activeTab === 'export' && (
            <div className="space-y-6">
              <div className="p-5 bg-gradient-to-r from-blue-950/40 to-indigo-950/40 border border-blue-800/50 rounded-2xl space-y-3">
                <h3 className="text-sm font-bold text-blue-200 flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-blue-400" /> Standard PBR & Mesh Specification
                </h3>
                <p className="text-slate-300 leading-relaxed">
                  The exported 3D model features instanced geometry for 144 conference seats, full metallic-roughness PBR textures (Wood paneling, Ceramic tile, Acoustic felt panels), and stage lighting hierarchy. Compatible with Unity 2022+, Unreal Engine 5+, Blender, and WebGL engines.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  <button
                    onClick={handleDownloadGLB}
                    className="p-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold rounded-2xl shadow-xl flex items-center justify-center gap-3 transition"
                  >
                    <Download className="w-5 h-5" />
                    <span>Download 3D Model (.GLB Binary)</span>
                  </button>

                  <button
                    onClick={() => scene && exportSceneJSONSchema(scene)}
                    className="p-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-semibold rounded-2xl shadow flex items-center justify-center gap-3 transition"
                  >
                    <FileCode className="w-5 h-5 text-indigo-400" />
                    <span>Download Scene JSON Schema</span>
                  </button>
                </div>
              </div>

              {/* Optimization Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-slate-300">
                <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Polygon Count</span>
                  <div className="text-base font-bold text-white">~38,500 Triangles</div>
                  <p className="text-[10px] text-emerald-400">Optimized Instanced Seating</p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">PBR Material Channels</span>
                  <div className="text-base font-bold text-white">Roughness / Normal / Metal</div>
                  <p className="text-[10px] text-blue-400">High Visual Fidelity</p>
                </div>

                <div className="p-4 bg-slate-800/50 border border-slate-700/50 rounded-xl space-y-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Lighting Hierarchy</span>
                  <div className="text-base font-bold text-white">6 Spotlights + Downlights</div>
                  <p className="text-[10px] text-amber-400">Preserved Light Nodes</p>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: C# CONTROLLER SCRIPT */}
          {activeTab === 'csharp' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-slate-200">SeminarHallController.cs</span>
                <button
                  onClick={handleCopyCode}
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-semibold flex items-center gap-1.5 transition"
                >
                  {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied C#' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl font-mono text-[11px] text-slate-300 overflow-x-auto max-h-[45vh] leading-relaxed select-all">
                {csharpCode}
              </pre>
            </div>
          )}

          {/* TAB 3: GUIDE */}
          {activeTab === 'guide' && (
            <div className="p-5 bg-slate-950 border border-slate-800 rounded-2xl space-y-3 font-mono text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
              {guideText}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-slate-800 bg-slate-950/60 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-800 hover:bg-slate-700 text-white font-semibold rounded-xl transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
