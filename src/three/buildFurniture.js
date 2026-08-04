import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';
import { createPlasticWrapTexture, createPodiumEmblemTexture } from '../utils/digitaltwin/proceduralTextures.js';

function createExactChairFrameGeometry() {
  const geometries = [];

  const seatWidth = 0.50;
  const seatDepth = 0.46;
  const seatHeight = 0.44;
  const legRadius = 0.012;

  const legGeo = new THREE.CylinderGeometry(legRadius, legRadius, seatHeight, 12);

  const flLeg = legGeo.clone();
  flLeg.translate(-seatWidth / 2 + 0.03, seatHeight / 2, seatDepth / 2 - 0.03);
  geometries.push(flLeg);

  const frLeg = legGeo.clone();
  frLeg.translate(seatWidth / 2 - 0.03, seatHeight / 2, seatDepth / 2 - 0.03);
  geometries.push(frLeg);

  const blLeg = legGeo.clone();
  blLeg.translate(-seatWidth / 2 + 0.03, seatHeight / 2, -seatDepth / 2 + 0.03);
  geometries.push(blLeg);

  const brLeg = legGeo.clone();
  brLeg.translate(seatWidth / 2 - 0.03, seatHeight / 2, -seatDepth / 2 + 0.03);
  geometries.push(brLeg);

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

  const armHeight = 0.18;
  const armTubeGeo = new THREE.CylinderGeometry(legRadius, legRadius, armHeight, 10);

  const armLeftSup = armTubeGeo.clone();
  armLeftSup.translate(-seatWidth / 2 - 0.01, seatHeight + armHeight / 2, 0.05);
  geometries.push(armLeftSup);

  const armRightSup = armTubeGeo.clone();
  armRightSup.translate(seatWidth / 2 + 0.01, seatHeight + armHeight / 2, 0.05);
  geometries.push(armRightSup);

  const armHorizGeo = new THREE.CylinderGeometry(legRadius, legRadius, seatDepth - 0.02, 10);
  armHorizGeo.rotateX(Math.PI / 2);

  const armLeftTop = armHorizGeo.clone();
  armLeftTop.translate(-seatWidth / 2 - 0.01, seatHeight + armHeight, 0);
  geometries.push(armLeftTop);

  const armRightTop = armHorizGeo.clone();
  armRightTop.translate(seatWidth / 2 + 0.01, seatHeight + armHeight, 0);
  geometries.push(armRightTop);

  const padGeo = new THREE.BoxGeometry(0.045, 0.018, 0.28);
  const padLeft = padGeo.clone();
  padLeft.translate(-seatWidth / 2 - 0.01, seatHeight + armHeight + 0.012, 0);
  geometries.push(padLeft);

  const padRight = padGeo.clone();
  padRight.translate(seatWidth / 2 + 0.01, seatHeight + armHeight + 0.012, 0);
  geometries.push(padRight);

  const panGeo = new THREE.BoxGeometry(seatWidth - 0.02, 0.03, seatDepth - 0.02);
  panGeo.translate(0, seatHeight + 0.015, 0);
  geometries.push(panGeo);

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

function createExactChairCushionGeometry() {
  const geometries = [];

  const seatWidth = 0.50;
  const seatDepth = 0.46;
  const seatHeight = 0.44;

  const seatCushionGeo = new THREE.BoxGeometry(seatWidth - 0.01, 0.07, seatDepth - 0.01);
  seatCushionGeo.translate(0, seatHeight + 0.03 + 0.035, 0.005);
  geometries.push(seatCushionGeo);

  const backCushionGeo = new THREE.BoxGeometry(seatWidth - 0.02, 0.44, 0.065);
  backCushionGeo.rotateX(-0.12);
  backCushionGeo.translate(0, seatHeight + 0.03 + 0.22, -seatDepth / 2 + 0.035);
  geometries.push(backCushionGeo);

  const merged = BufferGeometryUtils.mergeGeometries(geometries);
  merged.computeVertexNormals();
  return merged;
}

export function buildFurniture(config) {
  const group = new THREE.Group();
  group.name = 'FurnitureGroup';

  const interactiveFurniture = [];
  const fanBladeGroups = [];

  const frameGeo = createExactChairFrameGeometry();
  const cushionGeo = createExactChairCushionGeometry();

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

  const rows = 23;
  const seatsPerRowPerSide = 6;

  const isDoorClearanceZone = (r, c) => {
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

  const framesMesh = new THREE.InstancedMesh(frameGeo, frameMat, totalSeats);
  framesMesh.name = 'Conference Chair Steel Frames';
  framesMesh.castShadow = true;
  framesMesh.receiveShadow = true;

  const blueChairsMesh = new THREE.InstancedMesh(cushionGeo, blueMat, blueCount);
  blueChairsMesh.name = 'Royal Blue Cushioned Chairs';
  blueChairsMesh.castShadow = true;
  blueChairsMesh.receiveShadow = true;

  const greenChairsMesh = new THREE.InstancedMesh(cushionGeo, greenMat, greenCount);
  greenChairsMesh.name = 'Emerald Green Cushioned Chairs';
  greenChairsMesh.castShadow = true;
  greenChairsMesh.receiveShadow = true;

  const dummy = new THREE.Object3D();
  let seatIdx = 0;
  let blueIdx = 0;
  let greenIdx = 0;

  const rowSpacing = 0.82;
  const seatSpacing = 0.72;
  const centerAisleWidth = 2.0;
  const startZ = -8.5;

  for (let r = 0; r < rows; r++) {
    const rowZ = startZ + r * rowSpacing;

    const stepTierIndex = Math.floor(r / 3);
    const stepY = stepTierIndex * 0.16;

    for (let c = 0; c < seatsPerRowPerSide * 2; c++) {
      if (isDoorClearanceZone(r, c)) continue;

      let xPos = 0;
      if (c < seatsPerRowPerSide) {
        xPos = -centerAisleWidth / 2 - (seatsPerRowPerSide - 1 - c) * seatSpacing - 0.25;
      } else {
        xPos = centerAisleWidth / 2 + (c - seatsPerRowPerSide) * seatSpacing + 0.25;
      }

      dummy.position.set(xPos, stepY, rowZ);
      dummy.rotation.y = Math.PI + (Math.random() * 0.02 - 0.01);
      dummy.updateMatrix();

      framesMesh.setMatrixAt(seatIdx, dummy.matrix);
      seatIdx++;

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

  // Stage Podium
  const podiumGroup = new THREE.Group();
  podiumGroup.position.set(-3.5, 0.45 + 0.60, -12.2);

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

  const podiumTopGeo = new THREE.BoxGeometry(0.75, 0.1, 0.65);
  const podiumTop = new THREE.Mesh(podiumTopGeo, podiumMat);
  podiumTop.position.set(0, 0.62, 0);
  podiumTop.rotation.x = 0.2;
  podiumGroup.add(podiumTop);

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

  // Ceiling Fans
  const fanPositions = [
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

    const rodGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.35, 12);
    const fanMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
    const rod = new THREE.Mesh(rodGeo, fanMat);
    rod.position.y = -0.175;
    fanUnit.add(rod);

    const motorGeo = new THREE.CylinderGeometry(0.12, 0.15, 0.12, 24);
    const motor = new THREE.Mesh(motorGeo, fanMat);
    motor.position.y = -0.38;
    fanUnit.add(motor);

    const bladesGroup = new THREE.Group();
    bladesGroup.position.y = -0.42;

    const bladeGeo = new THREE.BoxGeometry(0.65, 0.01, 0.1);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

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

  // Auxiliary TV Monitors
  const soffitTvConfigs = [
    { x: -3.20, y: 3.55, z: -0.35, name: 'Soffit Wall TV 1 (Front-Left Audience Side)' },
    { x: 3.20, y: 3.55, z: -0.35, name: 'Soffit Wall TV 2 (Front-Right Audience Side)' },
    { x: -3.20, y: 3.55, z: 4.65, name: 'Soffit Wall TV 3 (Mid-Left Audience Side)' },
    { x: 3.20, y: 3.55, z: 4.65, name: 'Soffit Wall TV 4 (Mid-Right Audience Side)' },
  ];

  soffitTvConfigs.forEach((cfg) => {
    const tvGroup = new THREE.Group();
    tvGroup.position.set(cfg.x, cfg.y, cfg.z);

    const wallPlateGeo = new THREE.BoxGeometry(0.8, 0.5, 0.02);
    const wallPlateMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.4 });
    const wallPlateMesh = new THREE.Mesh(wallPlateGeo, wallPlateMat);
    wallPlateMesh.position.set(0, 0, -0.02);
    tvGroup.add(wallPlateMesh);

    const chassisGeo = new THREE.BoxGeometry(1.32, 0.76, 0.05);
    const chassisMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
    const chassisMesh = new THREE.Mesh(chassisGeo, chassisMat);
    chassisMesh.castShadow = true;
    chassisMesh.name = cfg.name;
    chassisMesh.userData = { category: 'AV Equipment', polyCount: chassisGeo.attributes.position.count };
    tvGroup.add(chassisMesh);
    interactiveFurniture.push(chassisMesh);

    const tvScreenGeo = new THREE.PlaneGeometry(1.26, 0.70);
    const tvScreenMat = new THREE.MeshStandardMaterial({
      color: 0x050508,
      emissive: 0x000000,
      emissiveIntensity: 0.0,
      roughness: 0.08,
      metalness: 0.9,
    });
    const tvScreenMesh = new THREE.Mesh(tvScreenGeo, tvScreenMat);
    tvScreenMesh.position.set(0, 0, 0.026);
    tvGroup.add(tvScreenMesh);

    group.add(tvGroup);
  });

  const updateMaterials = (newConfig) => {
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
