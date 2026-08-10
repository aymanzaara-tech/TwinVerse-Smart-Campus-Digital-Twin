import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { MaterialConfig } from '../types';
import { createPlasticWrapTexture, createPodiumEmblemTexture } from '../utils/proceduralTextures';

export interface FurnitureObjects {
  group: THREE.Group;
  fanBladeGroups: THREE.Group[];
  interactiveFurniture: THREE.Mesh[];
  framesMesh: THREE.InstancedMesh;
  blueChairsMesh: THREE.InstancedMesh;
  greenChairsMesh: THREE.InstancedMesh;
  updateMaterials: (config: MaterialConfig) => void;
}

// =========================================================================
// Helper: Create Anatomically Accurate Chair Frame Geometry (Photo Matching)
// =========================================================================
function createExactChairFrameGeometry(): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];

  const seatWidth = 0.50;
  const seatDepth = 0.46;
  const seatHeight = 0.44; // Leg height
  const legRadius = 0.012; // 24mm steel tube

  // 1. Four Tubular Steel Legs
  const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, seatHeight, 12);

  // Front-Left
  const flLeg = legGeo.clone();
  flLeg.translate(-seatWidth / 2 + 0.03, seatHeight / 2, seatDepth / 2 - 0.03);
  geometries.push(flLeg);

  // Front-Right
  const frLeg = legGeo.clone();
  frLeg.translate(seatWidth / 2 - 0.03, seatHeight / 2, seatDepth / 2 - 0.03);
  geometries.push(frLeg);

  // Rear-Left
  const blLeg = legGeo.clone();
  blLeg.translate(-seatWidth / 2 + 0.03, seatHeight / 2, -seatDepth / 2 + 0.03);
  geometries.push(blLeg);

  // Rear-Right
  const brLeg = legGeo.clone();
  brLeg.translate(seatWidth / 2 - 0.03, seatHeight / 2, -seatDepth / 2 + 0.03);
  geometries.push(brLeg);

  // 2. Rubber Glider Feet at Bottom
  const footGeo = new THREE.CylinderGeometry(0.016, 0.018, 0.02, 12);
  [
    [-seatWidth / 2 + 0.03, 0.01, seatDepth / 2 - 0.03],
    [seatWidth / 2 - 0.03, 0.01, seatDepth / 2 - 0.03],
    [-seatWidth / 2 + 0.03, 0.01, -seatDepth / 2 + 0.03],
    [seatWidth / 2 - 0.03, 0.01, -seatDepth / 2 + 0.03],
  ].forEach(([x, y, z]) => {
    const foot = footGeo.clone();
    foot.translate(x, y, z);
    geometries.push(foot);
  });

  // 3. Side Armrest Metal Tubular Loops (Left & Right)
  const armHeight = 0.18;
  const armTubeGeo = new THREE.CylinderGeometry(legRadius, legRadius, armHeight, 10);

  const armLeftSup = armTubeGeo.clone();
  armLeftSup.translate(-seatWidth / 2 - 0.01, seatHeight + armHeight / 2, 0.05);
  geometries.push(armLeftSup);

  const armRightSup = armTubeGeo.clone();
  armRightSup.translate(seatWidth / 2 + 0.01, seatHeight + armHeight / 2, 0.05);
  geometries.push(armRightSup);

  // Horizontal Armrest Tube
  const armHorizGeo = new THREE.CylinderGeometry(legRadius, legRadius, seatDepth - 0.02, 10);
  armHorizGeo.rotateX(Math.PI / 2);

  const armLeftTop = armHorizGeo.clone();
  armLeftTop.translate(-seatWidth / 2 - 0.01, seatHeight + armHeight, 0);
  geometries.push(armLeftTop);

  const armRightTop = armHorizGeo.clone();
  armRightTop.translate(seatWidth / 2 + 0.01, seatHeight + armHeight, 0);
  geometries.push(armRightTop);

  // 4. Black Molded Arm Pads (Left & Right)
  const padGeo = new THREE.BoxGeometry(0.045, 0.018, 0.28);
  const padLeft = padGeo.clone();
  padLeft.translate(-seatWidth / 2 - 0.01, seatHeight + armHeight + 0.012, 0);
  geometries.push(padLeft);

  const padRight = padGeo.clone();
  padRight.translate(seatWidth / 2 + 0.01, seatHeight + armHeight + 0.012, 0);
  geometries.push(padRight);

  // 5. Under-Seat Black Plastic Pan
  const panGeo = new THREE.BoxGeometry(seatWidth - 0.02, 0.03, seatDepth - 0.02);
  panGeo.translate(0, seatHeight + 0.015, 0);
  geometries.push(panGeo);

  // 6. Rear Metal Connecting Struts
  const strutGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.18, 8);
  const strutLeft = strutGeo.clone();
  strutLeft.translate(-seatWidth / 3, seatHeight + 0.08, -seatDepth / 2 + 0.02);
  geometries.push(strutLeft);

  const strutRight = strutGeo.clone();
  strutRight.translate(seatWidth / 3, seatHeight + 0.08, -seatDepth / 2 + 0.02);
  geometries.push(strutRight);

  const merged = BufferGeometryUtils.mergeGeometries(geometries);
  merged.computeVertexNormals();
  return merged;
}

// =========================================================================
// Helper: Create Cushion Geometry (Seat Pad + Back Pad)
// =========================================================================
function createExactChairCushionGeometry(): THREE.BufferGeometry {
  const geometries: THREE.BufferGeometry[] = [];

  const seatWidth = 0.50;
  const seatDepth = 0.46;
  const seatHeight = 0.44;

  // 1. Plush Seat Cushion (Waterfall curve front)
  const seatCushionGeo = new THREE.BoxGeometry(seatWidth - 0.01, 0.07, seatDepth - 0.01);
  seatCushionGeo.translate(0, seatHeight + 0.03 + 0.035, 0.005);
  geometries.push(seatCushionGeo);

  // 2. Ergonomic Backrest Cushion & Full Back Shell (Upholstered in Chair Color)
  const backCushionGeo = new THREE.BoxGeometry(seatWidth - 0.02, 0.44, 0.065);
  backCushionGeo.rotateX(-0.12);
  backCushionGeo.translate(0, seatHeight + 0.03 + 0.22, -seatDepth / 2 + 0.035);
  geometries.push(backCushionGeo);

  const merged = BufferGeometryUtils.mergeGeometries(geometries);
  merged.computeVertexNormals();
  return merged;
}

export function buildFurniture(config: MaterialConfig): FurnitureObjects {
  const group = new THREE.Group();
  group.name = 'FurnitureGroup';

  const interactiveFurniture: THREE.Mesh[] = [];
  const fanBladeGroups: THREE.Group[] = [];

  // 1. Generate Base Chair Geometries
  const frameGeo = createExactChairFrameGeometry();
  const cushionGeo = createExactChairCushionGeometry();

  // Materials
  const plasticTex = createPlasticWrapTexture();

  const frameMat = new THREE.MeshStandardMaterial({
    color: 0x1e293b,
    metalness: 0.7,
    roughness: 0.3,
  });

  const blueMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.chairBlueColor),
    roughness: config.showPlasticCovers ? 0.15 : 0.65,
    metalness: config.showPlasticCovers ? 0.1 : 0.0,
    bumpMap: config.showPlasticCovers ? plasticTex : null,
    bumpScale: 0.025,
  });

  const greenMat = new THREE.MeshStandardMaterial({
    color: new THREE.Color(config.chairGreenColor),
    roughness: config.showPlasticCovers ? 0.15 : 0.65,
    metalness: config.showPlasticCovers ? 0.1 : 0.0,
    bumpMap: config.showPlasticCovers ? plasticTex : null,
    bumpScale: 0.025,
  });

  // ==========================================
  // 2. SEATING MATRIX INSTANCING (23 Rows x 12 Seats, leaving clear entrance space at Exit Door)
  // ==========================================
  const rows = 23; // 23 rows of chairs in each division (left & right)
  const seatsPerRowPerSide = 6; // 6 seats left + 6 seats right = 12 seats per row

  // Door cross-aisle clearance and Control Room enclosure clearance:
  // 1. Remove chairs in rows 12 & 13 on left division to create clear passage at main Exit Door
  // 2. Remove chairs in back rows (r >= 20, c >= 9) on right division that sit inside Control Room enclosure
  const isDoorClearanceZone = (r: number, c: number) => {
    if ((r === 12 || r === 13) && c < seatsPerRowPerSide) {
      return true;
    }
    if (r >= 20 && c >= 9) {
      return true;
    }
    return false;
  };

  let totalSeats = 0;
  let blueCount = 0;
  let greenCount = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < seatsPerRowPerSide * 2; c++) {
      if (isDoorClearanceZone(r, c)) continue;
      totalSeats++;
      if (r % 2 === 0) {
        blueCount++;
      } else {
        greenCount++;
      }
    }
  }

  // Frame Instanced Mesh (Holds tubular legs & plastic shells for all chairs)
  const framesMesh = new THREE.InstancedMesh(frameGeo, frameMat, totalSeats);
  framesMesh.name = 'Conference Chair Steel Frames';
  framesMesh.castShadow = true;
  framesMesh.receiveShadow = true;

  // Blue Chairs InstancedMesh
  const blueChairsMesh = new THREE.InstancedMesh(cushionGeo, blueMat, blueCount);
  blueChairsMesh.name = 'Royal Blue Cushioned Chairs';
  blueChairsMesh.castShadow = true;
  blueChairsMesh.receiveShadow = true;

  // Green Chairs InstancedMesh
  const greenChairsMesh = new THREE.InstancedMesh(cushionGeo, greenMat, greenCount);
  greenChairsMesh.name = 'Emerald Green Cushioned Chairs';
  greenChairsMesh.castShadow = true;
  greenChairsMesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  let seatIdx = 0;
  let blueIdx = 0;
  let greenIdx = 0;

  const rowSpacing = 0.82; // Z spacing between rows
  const seatSpacing = 0.72; // X spacing between adjacent chairs
  const centerAisleWidth = 2.0; // Central walkway aisle
  const startZ = -8.5; // First row starting Z coordinate

  for (let r = 0; r < rows; r++) {
    const rowZ = startZ + r * rowSpacing;

    // Floor Step Elevation: 1 step tier for each 3 rows of chairs
    const stepTierIndex = Math.floor(r / 3);
    const stepY = stepTierIndex * 0.16;

    for (let c = 0; c < seatsPerRowPerSide * 2; c++) {
      if (isDoorClearanceZone(r, c)) continue; // Leave wide open entrance passage at exit door

      let xPos = 0;
      if (c < seatsPerRowPerSide) {
        // Left Division
        xPos = -centerAisleWidth / 2 - (seatsPerRowPerSide - 1 - c) * seatSpacing - 0.25;
      } else {
        // Right Division
        xPos = centerAisleWidth / 2 + (c - seatsPerRowPerSide) * seatSpacing + 0.25;
      }

      dummy.position.set(xPos, stepY, rowZ);
      dummy.rotation.y = Math.PI + (Math.random() * 0.02 - 0.01); // Rotated 180 deg to face front stage & screen
      dummy.updateMatrix();

      // Set Frame instance matrix
      framesMesh.setMatrixAt(seatIdx, dummy.matrix);
      seatIdx++;

      // Alternate blue and green seats by row (Row 0=blue, Row 1=green, etc.)
      const isBlue = r % 2 === 0;

      if (isBlue && blueIdx < blueCount) {
        blueChairsMesh.setMatrixAt(blueIdx, dummy.matrix);
        blueIdx++;
      } else if (greenIdx < greenCount) {
        greenChairsMesh.setMatrixAt(greenIdx, dummy.matrix);
        greenIdx++;
      }
    }
  }

  framesMesh.instanceMatrix.needsUpdate = true;
  blueChairsMesh.instanceMatrix.needsUpdate = true;
  greenChairsMesh.instanceMatrix.needsUpdate = true;

  group.add(framesMesh);
  group.add(blueChairsMesh);
  group.add(greenChairsMesh);

  // ==========================================
  // 3. STAGE PODIUM / LECTERN WITH EMBLEM (Photo 5)
  // ==========================================
  const podiumGroup = new THREE.Group();
  podiumGroup.position.set(-3.5, 0.45 + 0.60, -12.2); // On left stage area

  const podiumBaseGeo = new THREE.BoxGeometry(0.7, 1.2, 0.6);
  const podiumMat = new THREE.MeshStandardMaterial({
    color: 0x2e1810,
    roughness: 0.3,
    metalness: 0.1,
  });
  const podiumBase = new THREE.Mesh(podiumBaseGeo, podiumMat);
  podiumBase.castShadow = true;
  podiumBase.name = 'Stage Presentation Podium';
  podiumBase.userData = { category: 'Stage Furniture', polyCount: podiumBaseGeo.attributes.position.count };
  podiumGroup.add(podiumBase);
  interactiveFurniture.push(podiumBase);

  // Slanted Podium Top
  const podiumTopGeo = new THREE.BoxGeometry(0.75, 0.1, 0.65);
  const podiumTop = new THREE.Mesh(podiumTopGeo, podiumMat);
  podiumTop.position.set(0, 0.62, 0);
  podiumTop.rotation.x = 0.2;
  podiumGroup.add(podiumTop);

  // Podium Front Emblem Seal (Photo 5)
  const emblemTex = createPodiumEmblemTexture();
  const emblemGeo = new THREE.CircleGeometry(0.18, 32);
  const emblemMat = new THREE.MeshStandardMaterial({
    map: emblemTex,
    roughness: 0.2,
    metalness: 0.3,
  });
  const emblemMesh = new THREE.Mesh(emblemGeo, emblemMat);
  emblemMesh.position.set(0, 0.2, 0.305);
  podiumGroup.add(emblemMesh);

  // Goose-neck Microphone
  const micBaseGeo = new THREE.CylinderGeometry(0.04, 0.05, 0.02, 16);
  const micMat = new THREE.MeshStandardMaterial({ color: 0x111111, metalness: 0.8, roughness: 0.2 });
  const micBase = new THREE.Mesh(micBaseGeo, micMat);
  micBase.position.set(0, 0.68, 0.1);
  podiumGroup.add(micBase);

  const micStemGeo = new THREE.CylinderGeometry(0.006, 0.006, 0.3, 8);
  const micStem = new THREE.Mesh(micStemGeo, micMat);
  micStem.position.set(0, 0.82, 0.12);
  micStem.rotation.x = -0.4;
  podiumGroup.add(micStem);

  group.add(podiumGroup);

  // ==========================================
  // 4. CEILING FANS (8 Fans spaced along the hall length in front of soffit walls)
  // ==========================================
  const fanPositions: [number, number, number][] = [
    [-3.2, 3.85, -6.0],
    [3.2, 3.85, -6.0],
    [-3.2, 3.85, -1.15],
    [3.2, 3.85, -1.15],
    [-3.2, 3.85, 3.85],
    [3.2, 3.85, 3.85],
    [-3.2, 3.85, 8.85],
    [3.2, 3.85, 8.85],
  ];

  fanPositions.forEach(([fx, fy, fz]) => {
    const fanUnit = new THREE.Group();
    fanUnit.position.set(fx, fy, fz);

    // Downrod
    const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeo, fanMat);
    rod.position.y = -0.175;
    fanUnit.add(rod);

    // Fan Motor Housing
    const motorGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.12, 24);
    const motor = new THREE.Mesh(motorGeo, fanMat);
    motor.position.y = -0.38;
    fanUnit.add(motor);

    // Rotating Blades Group
    const bladesGroup = new THREE.Group();
    bladesGroup.position.y = -0.42;

    const bladeGeo = new THREE.BoxGeometry(0.65, 0.01, 0.1);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

    // 3 White Fan Blades
    for (let b = 0; b < 3; b++) {
      const blade = new THREE.Mesh(bladeGeo, bladeMat);
      blade.position.x = 0.35;
      const pivot = new THREE.Group();
      pivot.rotation.y = (b * Math.PI * 2) / 3;
      pivot.add(blade);
      bladesGroup.add(pivot);
    }

    fanUnit.add(bladesGroup);
    fanBladeGroups.push(bladesGroup);
    group.add(fanUnit);
  });

  // ==========================================
  // 5. AUXILIARY TV MONITORS (Mounted flat on the audience side of the soffit walls facing +Z)
  // ==========================================
  const soffitTvConfigs = [
    { x: -3.20, y: 3.55, z: -0.35, name: 'Soffit Wall TV 1 (Front-Left Audience Side)' },
    { x: 3.20, y: 3.55, z: -0.35, name: 'Soffit Wall TV 2 (Front-Right Audience Side)' },
    { x: -3.20, y: 3.55, z: 4.65, name: 'Soffit Wall TV 3 (Mid-Left Audience Side)' },
    { x: 3.20, y: 3.55, z: 4.65, name: 'Soffit Wall TV 4 (Mid-Right Audience Side)' },
  ];

  soffitTvConfigs.forEach((cfg) => {
    const tvGroup = new THREE.Group();
    tvGroup.position.set(cfg.x, cfg.y, cfg.z);

    // Wall Mounting Plate behind TV chassis (stuck flat to the wall face)
    const wallPlateGeo = new THREE.BoxGeometry(0.8, 0.5, 0.02);
    const wallPlateMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const wallPlateMesh = new THREE.Mesh(wallPlateGeo, wallPlateMat);
    wallPlateMesh.position.set(0, 0, -0.02);
    tvGroup.add(wallPlateMesh);

    // Flat-Panel TV Chassis / Frame (16:9 ratio, ~1.3m wide x 0.75m high)
    const chassisGeo = new THREE.BoxGeometry(1.32, 0.76, 0.05);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    chassisMesh.name = cfg.name;
    chassisMesh.userData = { category: 'AV Equipment', polyCount: chassisGeo.attributes.position.count };
    tvGroup.add(chassisMesh);
    interactiveFurniture.push(chassisMesh);

    // Black Reflective TV Display Screen Facing +Z (turned off screen facing audience)
    const tvScreenGeo = new THREE.PlaneGeometry(1.26, 0.70);
    const tvScreenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      roughness: 0.08,
      metalness: 0.9,
    });
    const tvScreenMesh = new THREE.Mesh(tvScreenGeo, tvScreenMat);
    tvScreenMesh.position.set(0, 0, 0.026); // Screen facing into room (+Z)
    tvGroup.add(tvScreenMesh);

    group.add(tvGroup);
  });

  // ==========================================
  // 6. VIP EXECUTIVE FURNITURE (REMOVED as requested)
  // ==========================================

  // Material update handler
  const updateMaterials = (newConfig: MaterialConfig) => {
    blueMat.color.setStyle(newConfig.chairBlueColor);
    greenMat.color.setStyle(newConfig.chairGreenColor);

    if (newConfig.showPlasticCovers) {
      blueMat.roughness = 0.15;
      blueMat.bumpMap = plasticTex;
      greenMat.roughness = 0.15;
      greenMat.bumpMap = plasticTex;
    } else {
      blueMat.roughness = 0.65;
      blueMat.bumpMap = null;
      greenMat.roughness = 0.65;
      greenMat.bumpMap = null;
    }

    blueMat.needsUpdate = true;
    greenMat.needsUpdate = true;
  };

  return {
    group,
    fanBladeGroups,
    interactiveFurniture,
    framesMesh,
    blueChairsMesh,
    greenChairsMesh,
    updateMaterials,
  };
}
