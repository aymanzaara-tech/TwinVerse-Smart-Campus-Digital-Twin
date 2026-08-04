import * as THREE from 'three';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';

export function exportSceneToGLTF(scene, filename = 'SeminarHall_DigitalTwin.glb') {
  const exporter = new GLTFExporter();

  const exportGroup = new THREE.Group();
  scene.children.forEach((child) => {
    if (
      child.name === 'HallStructureGroup' ||
      child.name === 'FurnitureGroup' ||
      child.name === 'LightingGroup'
    ) {
      exportGroup.add(child.clone(true));
    }
  });

  exporter.parse(
    exportGroup,
    (gltf) => {
      let blob;
      if (gltf instanceof ArrayBuffer) {
        blob = new Blob([gltf], { type: 'application/octet-stream' });
      } else {
        const output = JSON.stringify(gltf, null, 2);
        blob = new Blob([output], { type: 'application/json' });
      }

      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = filename;
      link.click();
      URL.revokeObjectURL(link.href);
    },
    (error) => {
      console.error('Error exporting GLTF:', error);
    },
    { binary: true }
  );
}

export function exportSceneJSONSchema(scene) {
  const schema = {
    hallName: 'Seminar Hall Digital Twin',
    version: '2.4.0',
    dimensionsMeters: { length: 22.0, width: 13.0, height: 4.0 },
    pbrMaterials: [
      { name: 'DarkWoodPanel', roughness: 0.35, metalness: 0.1, texture: 'MahoganyPanel_PBR' },
      { name: 'CeramicFloorTile', roughness: 0.1, metalness: 0.1, texture: 'CreamTile_PBR' },
      { name: 'AcousticTrianglePattern', roughness: 0.8, metalness: 0.05, texture: 'AcousticPanel_PBR' },
      { name: 'ChairFabricBlue', roughness: 0.6, hexColor: '#1d4ed8' },
      { name: 'ChairFabricGreen', roughness: 0.6, hexColor: '#059669' },
    ],
    lightingNodes: [
      { type: 'StageTrussSpotlights', count: 6, maxIntensityLux: 1200, colorTemperatureK: 3200 },
      { type: 'RecessedCeilingDownlights', count: 16, powerWatts: 24, dimmable: true },
    ],
    seatingMatrix: {
      totalSeats: 144,
      blueSeats: 72,
      greenSeats: 72,
      aisleWidthMeters: 2.0,
      plasticCoverProtectionEnabled: true,
    },
  };

  const blob = new Blob([JSON.stringify(schema, null, 2)], { type: 'application/json' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'SeminarHall_SceneSchema.json';
  link.click();
  URL.revokeObjectURL(link.href);
}
