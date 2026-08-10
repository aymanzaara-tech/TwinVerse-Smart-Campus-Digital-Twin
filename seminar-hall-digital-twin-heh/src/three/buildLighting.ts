import * as THREE from 'three';
import { LightConfig } from '../types';

export interface HallLightingObjects {
  group: THREE.Group;
  ambientLight: THREE.AmbientLight;
  sunlight: THREE.DirectionalLight;
  downlights: THREE.PointLight[];
  spotlights: THREE.SpotLight[];
  spotlightTargets: THREE.Object3D[];
  volumetricCones: THREE.Mesh[];
  downlightMeshes: THREE.Mesh[];
  updateLighting: (config: LightConfig) => void;
}

export function buildLighting(config: LightConfig): HallLightingObjects {
  const group = new THREE.Group();
  group.name = 'LightingGroup';

  const hallLength = 22.0;
  const hallWidth = 13.0;
  const hallHeight = 4.0;

  // 1. Ambient Light
  const ambientLight = new THREE.AmbientLight(0xfff3e0, config.ambientIntensity);
  group.add(ambientLight);

  // 2. Sunlight through side windows
  const sunlight = new THREE.DirectionalLight(0xfffaed, config.sunlightIntensity);
  sunlight.position.set(20, 15, -5);
  sunlight.castShadow = true;
  sunlight.shadow.mapSize.width = 2048;
  sunlight.shadow.mapSize.height = 2048;
  sunlight.shadow.camera.near = 0.5;
  sunlight.shadow.camera.far = 40;
  sunlight.shadow.camera.left = -15;
  sunlight.shadow.camera.right = 15;
  sunlight.shadow.camera.top = 15;
  sunlight.shadow.camera.bottom = -15;
  sunlight.shadow.bias = -0.0005;
  group.add(sunlight);

  // 3. Recessed Ceiling Downlights (Grid of 16 Circular Lights on Ceiling)
  const downlights: THREE.PointLight[] = [];
  const downlightMeshes: THREE.Mesh[] = [];

  const xCols = [-4.5, -1.5, 1.5, 4.5];
  const zRows = [-8.0, -3.0, 2.0, 7.0];

  const fixtureGeo = new THREE.CylinderGeometry(0.2, 0.2, 0.04, 24);
  const fixtureMat = new THREE.MeshStandardMaterial({
    color: 0x333333,
    roughness: 0.3,
  });

  const lensGeo = new THREE.CircleGeometry(0.16, 24);
  const lensMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    emissive: 0xffedd5,
    emissiveIntensity: 1.2,
    roughness: 0.1,
  });

  zRows.forEach((z) => {
    xCols.forEach((x) => {
      // Fixture geometry
      const fixture = new THREE.Mesh(fixtureGeo, fixtureMat);
      fixture.position.set(x, hallHeight - 0.02, z);
      group.add(fixture);

      const lens = new THREE.Mesh(lensGeo, lensMat.clone());
      lens.position.set(x, hallHeight - 0.041, z);
      lens.rotation.x = Math.PI / 2;
      group.add(lens);
      downlightMeshes.push(lens);

      // PointLight for area illumination (castShadow disabled to prevent exceeding MAX_TEXTURE_IMAGE_UNITS(16) limit)
      const light = new THREE.PointLight(0xffedd5, config.ceilingIntensity * 0.8, 8.5);
      light.position.set(x, hallHeight - 0.1, z);
      light.castShadow = false;
      group.add(light);
      downlights.push(light);
    });
  });

  // 4. Stage Overhead Lighting Truss Rail & 6 PAR Spotlights (Photo 4)
  const trussZ = -7.5;
  const trussY = hallHeight - 0.4;
  const trussWidth = 10.0;

  // Black metal truss beam
  const trussRailGeo = new THREE.BoxGeometry(trussWidth, 0.08, 0.08);
  const trussRailMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
  const trussRail = new THREE.Mesh(trussRailGeo, trussRailMat);
  trussRail.position.set(0, trussY, trussZ);
  group.add(trussRail);

  // Truss hangers to ceiling
  [-4, 0, 4].forEach((hx) => {
    const hangerGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 8);
    const hanger = new THREE.Mesh(hangerGeo, trussRailMat);
    hanger.position.set(hx, hallHeight - 0.175, trussZ);
    group.add(hanger);
  });

  const spotlights: THREE.SpotLight[] = [];
  const spotlightTargets: THREE.Object3D[] = [];
  const volumetricCones: THREE.Mesh[] = [];

  const spotXPositions = [-4.0, -2.4, -0.8, 0.8, 2.4, 4.0];

  spotXPositions.forEach((sx, index) => {
    // Spotlight Casing Geometry (Photo 4)
    const canGeo = new THREE.CylinderGeometry(0.12, 0.16, 0.3, 16);
    const canMat = new THREE.MeshStandardMaterial({ color: 0x1f2937, metalness: 0.7, roughness: 0.3 });
    const canMesh = new THREE.Mesh(canGeo, canMat);
    canMesh.position.set(sx, trussY - 0.2, trussZ);
    canMesh.rotation.x = 0.4; // Aimed toward stage
    canMesh.name = `Stage Spotlight #${index + 1}`;
    group.add(canMesh);

    // Target object on stage platform (Y = 0.45, Z = -9.3)
    const targetObj = new THREE.Object3D();
    targetObj.position.set(sx * 0.75, 0.45, -9.3);
    group.add(targetObj);
    spotlightTargets.push(targetObj);

    // Orient spotlight casing fixture towards target
    canMesh.lookAt(targetObj.position);
    canMesh.rotateX(Math.PI / 2);

    // Three.js SpotLight
    const spot = new THREE.SpotLight(
      config.spotlightColor,
      config.stageSpotlightsEnabled ? config.spotlightIntensity * 2.5 : 0,
      18,
      Math.PI / 6,
      0.4,
      1.5
    );
    spot.position.set(sx, trussY - 0.3, trussZ);
    spot.target = targetObj;
    spot.castShadow = index === 2 || index === 3; // Key central spotlights cast shadows
    spot.shadow.mapSize.width = 1024;
    spot.shadow.mapSize.height = 1024;
    spot.shadow.bias = -0.001;
    group.add(spot);
    spotlights.push(spot);

    // Volumetric Cone mesh for atmospheric beam
    const coneHeight = 6.0;
    const coneRadius = 1.4;
    const coneGeo = new THREE.ConeGeometry(coneRadius, coneHeight, 32, 1, true);
    coneGeo.translate(0, -coneHeight / 2, 0); // Origin at top tip

    const coneMat = new THREE.MeshBasicMaterial({
      color: new THREE.Color(config.spotlightColor),
      transparent: true,
      opacity: config.stageSpotlightsEnabled ? config.spotlightIntensity * 0.12 : 0,
      side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const coneMesh = new THREE.Mesh(coneGeo, coneMat);
    coneMesh.position.set(sx, trussY - 0.3, trussZ);
    coneMesh.lookAt(targetObj.position);
    coneMesh.rotateX(Math.PI / 2);
    group.add(coneMesh);
    volumetricCones.push(coneMesh);
  });

  // Dynamic Lighting Update Callback
  const updateLighting = (newConfig: LightConfig) => {
    ambientLight.intensity = newConfig.ambientIntensity;
    sunlight.intensity = newConfig.sunlightIntensity;

    // Convert Kelvin color temperature approximation to RGB
    const tempRatio = (newConfig.ceilingWarmth - 2700) / (6500 - 2700);
    const warmthColor = new THREE.Color().setHSL(0.08 * (1 - tempRatio) + 0.55 * tempRatio, 0.6, 0.6);

    downlights.forEach((light) => {
      light.intensity = newConfig.ceilingIntensity * 0.8;
      light.color.copy(warmthColor);
    });

    downlightMeshes.forEach((mesh) => {
      const mat = mesh.material as THREE.MeshStandardMaterial;
      mat.emissive.copy(warmthColor);
      mat.emissiveIntensity = newConfig.ceilingIntensity > 0.1 ? 1.2 : 0.05;
    });

    // Update Stage Spotlights
    const spotColor = new THREE.Color(newConfig.spotlightColor);
    spotlights.forEach((spot) => {
      spot.intensity = newConfig.stageSpotlightsEnabled ? newConfig.spotlightIntensity * 2.5 : 0;
      spot.color.copy(spotColor);
    });

    volumetricCones.forEach((cone) => {
      const mat = cone.material as THREE.MeshBasicMaterial;
      mat.color.copy(spotColor);
      mat.opacity = newConfig.stageSpotlightsEnabled ? newConfig.spotlightIntensity * 0.12 : 0;
    });
  };

  return {
    group,
    ambientLight,
    sunlight,
    downlights,
    spotlights,
    spotlightTargets,
    volumetricCones,
    downlightMeshes,
    updateLighting,
  };
}
