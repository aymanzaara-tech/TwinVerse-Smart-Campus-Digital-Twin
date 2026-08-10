import React from 'react';
import { Box, Layers, Maximize2, ShieldCheck, X } from 'lucide-react';
import { SelectedObjectInfo } from '../types';

interface ObjectInspectorModalProps {
  info: SelectedObjectInfo | null;
  onClose: () => void;
}

export const ObjectInspectorModal: React.FC<ObjectInspectorModalProps> = ({ info, onClose }) => {
  if (!info) return null;

  return (
    <div className="absolute bottom-6 right-6 z-30 w-80 bg-slate-900/90 backdrop-blur-xl border border-slate-700/80 rounded-2xl shadow-2xl p-4 text-xs text-slate-300 space-y-3 animate-slide-up">
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div className="flex items-center gap-2">
          <Box className="w-4 h-4 text-blue-400" />
          <span className="font-bold text-white text-sm">{info.name}</span>
        </div>
        <button onClick={onClose} className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800">
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="grid grid-cols-2 gap-2 text-[11px]">
        <div className="p-2 bg-slate-800/60 rounded-xl">
          <span className="text-slate-400 block text-[10px]">Category</span>
          <span className="font-semibold text-blue-300">{info.category}</span>
        </div>

        <div className="p-2 bg-slate-800/60 rounded-xl">
          <span className="text-slate-400 block text-[10px]">Poly Count</span>
          <span className="font-semibold text-emerald-300">{info.polyCount.toLocaleString()} Triangles</span>
        </div>

        {info.instanceCount && (
          <div className="p-2 bg-slate-800/60 rounded-xl col-span-2">
            <span className="text-slate-400 block text-[10px]">Instanced Nodes</span>
            <span className="font-semibold text-purple-300">{info.instanceCount} Matching Units Instanced</span>
          </div>
        )}

        <div className="p-2 bg-slate-800/60 rounded-xl col-span-2">
          <span className="text-slate-400 block text-[10px]">3D World Position (X, Y, Z)</span>
          <span className="font-mono text-slate-200">
            [{info.position[0]}, {info.position[1]}, {info.position[2]}] m
          </span>
        </div>
      </div>
    </div>
  );
};
