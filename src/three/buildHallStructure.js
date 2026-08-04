import * as THREE from 'three';
import {
  createCeilingAcousticTexture,
  createControlRoomDoorTexture,
  createFloorTileTexture,
  createRearAcousticTexture,
  createWoodPanelTexture,
} from '../utils/digitaltwin/proceduralTextures.js';

export function buildHallStructure(config) {
  const group = new THREE.Group();
  group.name = 'HallStructureGroup';
  const interactiveObjects = [];

  const hallLength = 28.0;
  const hallWidth = 13.0;
  const hallHeight = 4.2;

  // 1. Floor
  const floorGeo = new THREE.PlaneGeometry(hallWidth, hallLength);
  const floorTex = createFloorTileTexture();
  const floorMaterial = new THREE.MeshStandardMaterial({
    map: floorTex,
    roughness: config.floorRoughness,
    metalness: 0.1,
  });

  const floorMesh = new THREE.Mesh(floorGeo, floorMaterial);
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  floorMesh.name = 'Ceramic Tile Floor';
  floorMesh.userData = { category: 'Flooring', polyCount: floorGeo.attributes.position.count };
  group.add(floorMesh);
  interactiveObjects.push(floorMesh);

  // 1b. Stepped Floor Tiers
  const stepBlackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35 });

  const stepTiers = [];
  const startZ = -8.5;
  const rowSpacing = 0.82;
  const numSteps = Math.ceil(23 / 3);

  for (let s = 1; s < numSteps; s++) {
    const frontZ = startZ + (s * 3 - 0.5) * rowSpacing;
    const backZ = (s === numSteps - 1) ? (hallLength / 2 - 0.1) : (startZ + ((s + 1) * 3 - 0.5) * rowSpacing);
    const depth = backZ - frontZ;
    const zPos = frontZ + depth / 2;
    const height = s * 0.16;
    stepTiers.push({
      x: 0,
      y: height / 2,
      z: zPos,
      w: hallWidth - 0.1,
      h: height,
      d: depth,
    });
  }

  stepTiers.forEach((tier, idx) => {
    const tierGeo = new THREE.BoxGeometry(tier.w, tier.h, tier.d);
    const tierMesh = new THREE.Mesh(tierGeo, floorMaterial);
    tierMesh.position.set(tier.x, tier.y, tier.z);
    tierMesh.receiveShadow = true;
    tierMesh.castShadow = true;
    tierMesh.name = `Tier Riser #${idx + 1}`;
    tierMesh.userData = { category: 'Architecture', polyCount: 12 };
    group.add(tierMesh);

    const lipGeo = new THREE.BoxGeometry(tier.w + 0.02, 0.03, 0.04);
    const lipMesh = new THREE.Mesh(lipGeo, stepBlackMat);
    lipMesh.position.set(tier.x, tier.h, tier.z - tier.d / 2);
    group.add(lipMesh);
  });

  // 2. Stage Platform
  const stageWidth = 10.5;
  const stageDepth = 4.2;
  const stageHeight = 0.65;
  const stageGeo = new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth);

  const woodTex = createWoodPanelTexture();
  const woodWallMaterial = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.4,
    metalness: 0.1,
  });

  const stageMat = new THREE.MeshStandardMaterial({
    color: 0xede0d4,
    roughness: 0.25,
    metalness: 0.05,
  });

  const stageMesh = new THREE.Mesh(stageGeo, stageMat);
  stageMesh.position.set(0, stageHeight / 2, -11.5);
  stageMesh.receiveShadow = true;
  stageMesh.castShadow = true;
  stageMesh.name = 'Polished Stage Platform';
  stageMesh.userData = { category: 'Stage', polyCount: 12 };
  group.add(stageMesh);
  interactiveObjects.push(stageMesh);

  // Stage Wooden Back Backdrop Wall
  const stageBackWallGeo = new THREE.BoxGeometry(stageWidth + 1.5, hallHeight, 0.25);
  const stageBackWallMesh = new THREE.Mesh(stageBackWallGeo, woodWallMaterial);
  stageBackWallMesh.position.set(0, hallHeight / 2, -13.8);
  stageBackWallMesh.receiveShadow = true;
  stageBackWallMesh.name = 'Wooden Backdrop Wall';
  stageBackWallMesh.userData = { category: 'Stage', polyCount: 12 };
  group.add(stageBackWallMesh);
  interactiveObjects.push(stageBackWallMesh);

  // Stage Steps (Left & Right)
  [-stageWidth / 2 - 0.4, stageWidth / 2 + 0.4].forEach((xPos, sideIdx) => {
    for (let st = 0; st < 3; st++) {
      const stepW = 0.9;
      const stepD = 0.35;
      const stepH = (stageHeight / 3);
      const sGeo = new THREE.BoxGeometry(stepW, stepH * (st + 1), stepD);
      const sMesh = new THREE.Mesh(sGeo, stageMat);
      sMesh.position.set(xPos, (stepH * (st + 1)) / 2, -9.8 - st * stepD);
      sMesh.receiveShadow = true;
      group.add(sMesh);
    }
  });

  // 3. Presentation Screen
  const screenWidth = 7.2;
  const screenHeight = 3.6;
  const screenGeo = new THREE.PlaneGeometry(screenWidth, screenHeight);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0x0f172a,
    emissive: 0x000000,
    emissiveIntensity: 0.0,
    roughness: 0.3,
    metalness: 0.1,
    side: THREE.DoubleSide,
  });

  const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
  screenMesh.position.set(0, 2.3, -13.62);
  screenMesh.name = 'Main Presentation Screen';
  screenMesh.userData = { category: 'AV Technology', polyCount: 4 };
  group.add(screenMesh);
  interactiveObjects.push(screenMesh);

  const frameGeo = new THREE.BoxGeometry(screenWidth + 0.2, screenHeight + 0.2, 0.06);
  const frameMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.2, metalness: 0.8 });
  const frameMesh = new THREE.Mesh(frameGeo, frameMat);
  frameMesh.position.set(0, 2.3, -13.65);
  group.add(frameMesh);

  // 4. Rear Wall Acoustic Triangles
  const rearWallGeo = new THREE.PlaneGeometry(hallWidth, hallHeight);
  const rearAcousticTex = createRearAcousticTexture();
  const rearAcousticMat = new THREE.MeshStandardMaterial({
    map: rearAcousticTex,
    roughness: 0.5,
    metalness: 0.15,
  });

  const rearWallMesh = new THREE.Mesh(rearWallGeo, rearAcousticMat);
  rearWallMesh.position.set(0, hallHeight / 2, hallLength / 2);
  rearWallMesh.rotation.y = Math.PI;
  rearWallMesh.receiveShadow = true;
  rearWallMesh.name = 'Rear Wall Acoustic Triangles';
  rearWallMesh.userData = { category: 'Acoustics', polyCount: rearWallGeo.attributes.position.count };
  group.add(rearWallMesh);
  interactiveObjects.push(rearWallMesh);

  // 5. Rear Raised Step
  const rearStepWidth = hallWidth - 0.2;
  const rearStepDepth = 4.5;
  const rearStepHeight = 0.22;
  const rearStepGeo = new THREE.BoxGeometry(rearStepWidth, rearStepHeight, rearStepDepth);
  const rearStepMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
  const rearStepMesh = new THREE.Mesh(rearStepGeo, rearStepMat);
  rearStepMesh.position.set(0, rearStepHeight / 2, hallLength / 2 - rearStepDepth / 2 - 0.1);
  rearStepMesh.receiveShadow = true;
  group.add(rearStepMesh);

  const stepTrimGeo = new THREE.BoxGeometry(rearStepWidth, 0.03, 0.06);
  const stepTrimMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
  const stepTrimMesh = new THREE.Mesh(stepTrimGeo, stepTrimMat);
  stepTrimMesh.position.set(0, rearStepHeight, hallLength / 2 - rearStepDepth - 0.03);
  group.add(stepTrimMesh);

  // 5b. CONTROL ROOM ENCLOSURE
  const ctrlRoomGroup = new THREE.Group();

  const ctrlWidth = 2.6;
  const ctrlDepth = 3.2;
  const ctrlHeight = hallHeight;
  const ctrlEndX = hallWidth / 2;
  const ctrlStartX = ctrlEndX - ctrlWidth;
  const ctrlEndZ = hallLength / 2 - ctrlDepth;
  const ctrlMaxZ = hallLength / 2;

  const greyWallMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8,
    roughness: 0.5,
  });

  const whiteFrameMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25,
  });

  const fLowerGeo = new THREE.BoxGeometry(ctrlWidth, 1.10, 0.12);
  const fLowerMesh = new THREE.Mesh(fLowerGeo, greyWallMat);
  fLowerMesh.position.set((ctrlStartX + ctrlEndX) / 2, 0.55, ctrlEndZ);
  fLowerMesh.castShadow = true;
  fLowerMesh.receiveShadow = true;
  ctrlRoomGroup.add(fLowerMesh);

  const fUpperGeo = new THREE.BoxGeometry(ctrlWidth, ctrlHeight - 2.40, 0.12);
  const fUpperMesh = new THREE.Mesh(fUpperGeo, greyWallMat);
  fUpperMesh.position.set((ctrlStartX + ctrlEndX) / 2, 2.40 + (ctrlHeight - 2.40) / 2, ctrlEndZ);
  ctrlRoomGroup.add(fUpperMesh);

  const fPillarGeo = new THREE.BoxGeometry(0.35, 1.30, 0.12);
  const fPillarLeft = new THREE.Mesh(fPillarGeo, greyWallMat);
  fPillarLeft.position.set(ctrlStartX + 0.175, 1.75, ctrlEndZ);
  ctrlRoomGroup.add(fPillarLeft);

  const fPillarRight = new THREE.Mesh(fPillarGeo, greyWallMat);
  fPillarRight.position.set(ctrlEndX - 0.175, 1.75, ctrlEndZ);
  ctrlRoomGroup.add(fPillarRight);

  const windowW = ctrlWidth - 0.70;
  const windowH = 1.30;
  const windowCenterY = 1.75;

  const obsFrameGeo = new THREE.BoxGeometry(windowW + 0.10, windowH + 0.10, 0.14);
  const obsFrameMesh = new THREE.Mesh(obsFrameGeo, whiteFrameMat);
  obsFrameMesh.position.set((ctrlStartX + ctrlEndX) / 2, windowCenterY, ctrlEndZ);
  ctrlRoomGroup.add(obsFrameMesh);

  const obsGlassGeo = new THREE.PlaneGeometry(windowW, windowH);
  const obsGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0x93c5fd,
    transparent: true,
    opacity: 0.35,
    roughness: 0.05,
    metalness: 0.9,
    clearcoat: 1.0,
    ior: 1.5,
  });
  const obsGlassMesh = new THREE.Mesh(obsGlassGeo, obsGlassMat);
  obsGlassMesh.position.set((ctrlStartX + ctrlEndX) / 2, windowCenterY, ctrlEndZ + 0.075);
  obsGlassMesh.name = 'Control Room Observation Window';
  ctrlRoomGroup.add(obsGlassMesh);
  interactiveObjects.push(obsGlassMesh);

  const sWallFrontGeo = new THREE.BoxGeometry(0.12, ctrlHeight, 1.20);
  const sWallFrontMesh = new THREE.Mesh(sWallFrontGeo, greyWallMat);
  sWallFrontMesh.position.set(ctrlStartX, ctrlHeight / 2, ctrlEndZ + 0.60);
  sWallFrontMesh.castShadow = true;
  ctrlRoomGroup.add(sWallFrontMesh);

  const sWallAboveGeo = new THREE.BoxGeometry(0.12, ctrlHeight - 2.30, 1.10);
  const sWallAboveMesh = new THREE.Mesh(sWallAboveGeo, greyWallMat);
  sWallAboveMesh.position.set(ctrlStartX, 2.30 + (ctrlHeight - 2.30) / 2, ctrlMaxZ - 0.55);
  ctrlRoomGroup.add(sWallAboveMesh);

  const crDoorW = 1.05;
  const crDoorH = 2.25;
  const crDoorZ = ctrlMaxZ - 0.55;

  const crFrameGeo = new THREE.BoxGeometry(0.16, crDoorH + 0.08, crDoorW + 0.08);
  const crFrameMesh = new THREE.Mesh(crFrameGeo, whiteFrameMat);
  crFrameMesh.position.set(ctrlStartX, crDoorH / 2 + 0.01, crDoorZ);
  ctrlRoomGroup.add(crFrameMesh);

  const crDoorTex = createControlRoomDoorTexture();
  const crDoorGlassMat = new THREE.MeshStandardMaterial({
    map: crDoorTex,
    transparent: true,
    opacity: 0.9,
    roughness: 0.15,
    metalness: 0.1,
  });
  const crDoorGlassGeo = new THREE.BoxGeometry(0.05, crDoorH, crDoorW);
  const crDoorGlassMesh = new THREE.Mesh(crDoorGlassGeo, crDoorGlassMat);
  crDoorGlassMesh.position.set(ctrlStartX, crDoorH / 2 + 0.01, crDoorZ);
  crDoorGlassMesh.name = 'Control Room Glass Door';
  crDoorGlassMesh.userData = { category: 'Control Room', polyCount: 120 };
  ctrlRoomGroup.add(crDoorGlassMesh);
  interactiveObjects.push(crDoorGlassMesh);

  const crHandleGeo = new THREE.BoxGeometry(0.08, 0.22, 0.04);
  const crHandleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
  const crHandleMesh = new THREE.Mesh(crHandleGeo, crHandleMat);
  crHandleMesh.position.set(ctrlStartX - 0.04, 1.05, crDoorZ - crDoorW / 2 + 0.12);
  ctrlRoomGroup.add(crHandleMesh);

  const insideGroup = new THREE.Group();

  const deskGeo = new THREE.BoxGeometry(1.80, 0.75, 0.70);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
  const deskMesh = new THREE.Mesh(deskGeo, deskMat);
  deskMesh.position.set((ctrlStartX + ctrlEndX) / 2, 0.375, ctrlEndZ + 0.80);
  insideGroup.add(deskMesh);

  [-0.45, 0.45].forEach((monX) => {
    const monGeo = new THREE.BoxGeometry(0.55, 0.35, 0.04);
    const monMat = new THREE.MeshStandardMaterial({ color: 0x09090b, emissive: 0x1e293b, emissiveIntensity: 0.4 });
    const monMesh = new THREE.Mesh(monGeo, monMat);
    monMesh.position.set((ctrlStartX + ctrlEndX) / 2 + monX, 0.75 + 0.20, ctrlEndZ + 0.80);
    monMesh.rotation.y = monX < 0 ? 0.15 : -0.15;
    insideGroup.add(monMesh);
  });

  const rackGeo = new THREE.BoxGeometry(0.65, 1.80, 0.60);
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
  const rackMesh = new THREE.Mesh(rackGeo, rackMat);
  rackMesh.position.set(ctrlEndX - 0.55, 0.90, ctrlMaxZ - 0.80);
  insideGroup.add(rackMesh);

  const upsLabelGeo = new THREE.BoxGeometry(0.66, 0.25, 0.20);
  const upsLabelMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.5 });
  const upsLabelMesh = new THREE.Mesh(upsLabelGeo, upsLabelMat);
  upsLabelMesh.position.set(ctrlEndX - 0.55, 1.30, ctrlMaxZ - 0.80);
  insideGroup.add(upsLabelMesh);

  ctrlRoomGroup.add(insideGroup);
  group.add(ctrlRoomGroup);

  // 6. Ceiling
  const ceilingTex = createCeilingAcousticTexture();
  const ceilingMat = new THREE.MeshStandardMaterial({
    map: ceilingTex,
    roughness: 0.9,
    metalness: 0.0,
  });
  const ceilingGeo = new THREE.PlaneGeometry(hallWidth, hallLength);
  const ceilingMesh = new THREE.Mesh(ceilingGeo, ceilingMat);
  ceilingMesh.position.set(0, hallHeight, 0);
  ceilingMesh.rotation.x = Math.PI / 2;
  ceilingMesh.name = 'Ceiling Acoustic Grid';
  ceilingMesh.userData = { category: 'Ceiling', polyCount: ceilingGeo.attributes.position.count };
  group.add(ceilingMesh);

  const beamPositionsZ = [-0.5, 4.5, 9.5];
  beamPositionsZ.forEach((z) => {
    const beamGeo = new THREE.BoxGeometry(hallWidth - 0.05, 0.70, 0.25);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.4 });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, hallHeight - 0.35, z);
    beamMesh.castShadow = true;
    beamMesh.receiveShadow = true;
    beamMesh.name = 'Ceiling Soffit Bulkhead Wall';
    group.add(beamMesh);
  });

  // 7. Left Side Wall
  const leftWallGroup = new THREE.Group();

  const sideWallGeo = new THREE.PlaneGeometry(hallLength, hallHeight);
  const sideWallMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.6 });
  const leftWallMesh = new THREE.Mesh(sideWallGeo, sideWallMat);
  leftWallMesh.position.set(-hallWidth / 2, hallHeight / 2, 0);
  leftWallMesh.rotation.y = Math.PI / 2;
  leftWallGroup.add(leftWallMesh);

  const createLouveredCupboard = (xPos, zPos, isRightWall) => {
    const cabGroup = new THREE.Group();
    const cabDepth = 0.38;
    const cabWidth = 1.35;
    const cabHeight = 3.35;
    const wallSign = isRightWall ? -1 : 1;

    const cabGeo = new THREE.BoxGeometry(cabDepth, cabHeight, cabWidth);
    const cabMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
    const cabMesh = new THREE.Mesh(cabGeo, cabMat);
    cabMesh.position.set(xPos + wallSign * (cabDepth / 2 + 0.01), cabHeight / 2, zPos);
    cabMesh.castShadow = true;
    cabMesh.receiveShadow = true;
    cabMesh.name = 'White Storage Wardrobe Cupboard';
    cabMesh.userData = { category: 'Cabinet Storage', polyCount: cabGeo.attributes.position.count };
    cabGroup.add(cabMesh);
    interactiveObjects.push(cabMesh);

    const doorH = 2.40;
    const doorW = cabWidth / 2 - 0.015;
    const doorGeo = new THREE.BoxGeometry(0.02, doorH - 0.02, doorW);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    const dLeft = new THREE.Mesh(doorGeo, doorMat);
    dLeft.position.set(xPos + wallSign * (cabDepth + 0.011), doorH / 2, zPos - doorW / 2 - 0.005);
    cabGroup.add(dLeft);

    const dRight = new THREE.Mesh(doorGeo, doorMat);
    dRight.position.set(xPos + wallSign * (cabDepth + 0.011), doorH / 2, zPos + doorW / 2 + 0.005);
    cabGroup.add(dRight);

    const lockGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.015, 12);
    const lockMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });
    const lockMesh = new THREE.Mesh(lockGeo, lockMat);
    lockMesh.rotation.z = Math.PI / 2;
    lockMesh.position.set(xPos + wallSign * (cabDepth + 0.022), 1.05, zPos);
    cabGroup.add(lockMesh);

    const handleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.36, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.2 });

    const hLeft = new THREE.Mesh(handleGeo, handleMat);
    hLeft.position.set(xPos + wallSign * (cabDepth + 0.025), 1.25, zPos - 0.04);
    cabGroup.add(hLeft);

    const hRight = new THREE.Mesh(handleGeo, handleMat);
    hRight.position.set(xPos + wallSign * (cabDepth + 0.025), 1.25, zPos + 0.04);
    cabGroup.add(hRight);

    [-0.16, 0.16].forEach((yOff) => {
      const postGeo = new THREE.BoxGeometry(0.02, 0.01, 0.01);
      const p1 = new THREE.Mesh(postGeo, handleMat);
      p1.position.set(xPos + wallSign * (cabDepth + 0.018), 1.25 + yOff, zPos - 0.04);
      cabGroup.add(p1);

      const p2 = new THREE.Mesh(postGeo, handleMat);
      p2.position.set(xPos + wallSign * (cabDepth + 0.018), 1.25 + yOff, zPos + 0.04);
      cabGroup.add(p2);
    });

    const loftH = 0.90;
    const loftCenterY = 2.42 + loftH / 2;
    const loftBoxGeo = new THREE.BoxGeometry(0.02, loftH - 0.02, cabWidth - 0.04);
    const loftBoxMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const loftBoxMesh = new THREE.Mesh(loftBoxGeo, loftBoxMat);
    loftBoxMesh.position.set(xPos + wallSign * (cabDepth + 0.011), loftCenterY, zPos);
    cabGroup.add(loftBoxMesh);

    const slatMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const numSlats = 9;
    const slatSpacing = (loftH - 0.15) / numSlats;
    for (let i = 0; i < numSlats; i++) {
      const slatY = loftCenterY - (loftH - 0.2) / 2 + i * slatSpacing;
      const slatGeo = new THREE.BoxGeometry(0.015, 0.018, cabWidth - 0.12);
      const slatMesh = new THREE.Mesh(slatGeo, slatMat);
      slatMesh.position.set(xPos + wallSign * (cabDepth + 0.022), slatY, zPos);
      cabGroup.add(slatMesh);
    }

    const topHandleGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.28, 12);
    topHandleGeo.rotateX(Math.PI / 2);
    const topHandle = new THREE.Mesh(topHandleGeo, handleMat);
    topHandle.position.set(xPos + wallSign * (cabDepth + 0.025), 2.48, zPos);
    cabGroup.add(topHandle);

    return cabGroup;
  };

  const createSideWindow = (xPos, yPos, zPos, isRightWall) => {
    const winGroup = new THREE.Group();
    const winW = 2.3;
    const winH = 2.1;
    const wallSign = isRightWall ? -1 : 1;

    const frameMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
    const outerFrameGeo = new THREE.BoxGeometry(0.12, winH, winW);
    const outerFrame = new THREE.Mesh(outerFrameGeo, frameMat);
    outerFrame.position.set(xPos + wallSign * 0.06, yPos, zPos);
    winGroup.add(outerFrame);

    const sillGeo = new THREE.BoxGeometry(0.20, 0.04, winW + 0.12);
    const sillMesh = new THREE.Mesh(sillGeo, frameMat);
    sillMesh.position.set(xPos + wallSign * 0.10, yPos - winH / 2 - 0.02, zPos);
    sillMesh.receiveShadow = true;
    winGroup.add(sillMesh);

    const glassGeo = new THREE.BoxGeometry(0.02, winH - 0.1, winW - 0.1);
    const glassMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.22,
      roughness: 0.1,
    });
    const glassMesh = new THREE.Mesh(glassGeo, glassMat);
    glassMesh.position.set(xPos + wallSign * 0.05, yPos, zPos);
    winGroup.add(glassMesh);

    const mullionMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });

    const transomY = yPos + winH * 0.22;
    const transomBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, winW - 0.08), mullionMat);
    transomBar.position.set(xPos + wallSign * 0.06, transomY, zPos);
    winGroup.add(transomBar);

    const topGridBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, winW - 0.08), mullionMat);
    topGridBar.position.set(xPos + wallSign * 0.06, yPos + winH * 0.38, zPos);
    winGroup.add(topGridBar);

    [-0.28, 0.0, 0.28].forEach((zRatio) => {
      const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH - 0.08, 0.035), mullionMat);
      vMullion.position.set(xPos + wallSign * 0.06, yPos, zPos + zRatio * winW);
      winGroup.add(vMullion);
    });

    const blindH = winH * 0.82;
    const blindGeo = new THREE.BoxGeometry(0.03, blindH, winW - 0.10);
    const blindMat = new THREE.MeshStandardMaterial({
      color: 0xfdfdfd,
      roughness: 0.7,
      transparent: true,
      opacity: 0.90,
    });
    const blindMesh = new THREE.Mesh(blindGeo, blindMat);
    blindMesh.position.set(xPos + wallSign * 0.08, yPos + (winH - blindH) / 2 - 0.04, zPos);
    blindMesh.name = 'Window White Venetian Roller Blind';
    winGroup.add(blindMesh);

    const railGeo = new THREE.BoxGeometry(0.04, 0.03, winW - 0.08);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3 });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(xPos + wallSign * 0.085, yPos - blindH / 2 + (winH - blindH) / 2 - 0.04, zPos);
    winGroup.add(railMesh);

    return winGroup;
  };

  const leftWindowZ = [-6.5, -2.5, 6.5, 11.0];
  leftWindowZ.forEach((z) => {
    leftWallGroup.add(createSideWindow(-hallWidth / 2, 2.1, z, false));
  });

  const doorZ = 2.14;
  const doorH = 2.45;
  const doorW = 1.65;
  const doorY = doorH / 2;

  const doorGroup = new THREE.Group();

  const polishedWoodMat = new THREE.MeshStandardMaterial({
    color: 0x2b1308,
    roughness: 0.15,
    metalness: 0.05,
  });
  const darkFrameMat = new THREE.MeshStandardMaterial({
    color: 0x18100a,
    roughness: 0.2,
  });
  const chromeMat = new THREE.MeshStandardMaterial({
    color: 0xf1f5f9,
    metalness: 0.95,
    roughness: 0.1,
  });
  const brassMat = new THREE.MeshStandardMaterial({
    color: 0xd97706,
    metalness: 0.85,
    roughness: 0.2,
  });

  const stageDoorZ = -10.6;
  const stageDoorH = 2.25;
  const stageDoorW = 1.05;
  const stageDoorY = stageDoorH / 2;

  const stageDoorGroup = new THREE.Group();

  const sFrameGeo = new THREE.BoxGeometry(0.20, stageDoorH + 0.10, stageDoorW + 0.14);
  const sFrameMesh = new THREE.Mesh(sFrameGeo, darkFrameMat);
  sFrameMesh.position.set(-hallWidth / 2 + 0.08, stageDoorY, stageDoorZ);
  stageDoorGroup.add(sFrameMesh);

  const sLeafGeo = new THREE.BoxGeometry(0.06, stageDoorH - 0.04, stageDoorW - 0.04);
  const sLeafMesh = new THREE.Mesh(sLeafGeo, polishedWoodMat);
  sLeafMesh.position.set(-hallWidth / 2 + 0.10, stageDoorY, stageDoorZ);
  sLeafMesh.castShadow = true;
  sLeafMesh.receiveShadow = true;
  sLeafMesh.name = 'Stage Exit Door (Near Podium)';
  sLeafMesh.userData = { category: 'Door', polyCount: 120 };
  stageDoorGroup.add(sLeafMesh);
  interactiveObjects.push(sLeafMesh);

  const sPanelGeo = new THREE.BoxGeometry(0.07, stageDoorH - 0.40, stageDoorW - 0.20);
  const sPanelMesh = new THREE.Mesh(sPanelGeo, darkFrameMat);
  sPanelMesh.position.set(-hallWidth / 2 + 0.10, stageDoorY, stageDoorZ);
  stageDoorGroup.add(sPanelMesh);

  const sHandleGeo = new THREE.BoxGeometry(0.08, 0.04, 0.16);
  const sHandleMesh = new THREE.Mesh(sHandleGeo, chromeMat);
  sHandleMesh.position.set(-hallWidth / 2 + 0.14, 1.05, stageDoorZ + stageDoorW / 2 - 0.15);
  stageDoorGroup.add(sHandleMesh);

  const sExitSign = new THREE.Group();
  sExitSign.position.set(-hallWidth / 2 + 0.10, stageDoorH + 0.20, stageDoorZ);

  const sExitFrameGeo = new THREE.BoxGeometry(0.10, 0.20, 0.46);
  const sExitFrameMesh = new THREE.Mesh(sExitFrameGeo, darkFrameMat);
  sExitSign.add(sExitFrameMesh);

  const sExitPanelGeo = new THREE.BoxGeometry(0.106, 0.14, 0.40);
  const sExitPanelMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const sExitPanelMesh = new THREE.Mesh(sExitPanelGeo, sExitPanelMat);
  sExitPanelMesh.name = 'Stage EXIT Sign';
  sExitSign.add(sExitPanelMesh);

  stageDoorGroup.add(sExitSign);
  leftWallGroup.add(stageDoorGroup);

  const frameThick = 0.22;
  const outerFrameGeo = new THREE.BoxGeometry(frameThick, doorH + 0.12, doorW + 0.16);
  const outerFrameMesh = new THREE.Mesh(outerFrameGeo, darkFrameMat);
  outerFrameMesh.position.set(-hallWidth / 2 + frameThick / 2 - 0.02, doorY, doorZ);
  doorGroup.add(outerFrameMesh);

  const thresholdGeo = new THREE.BoxGeometry(0.28, 0.012, doorW + 0.1);
  const thresholdMesh = new THREE.Mesh(thresholdGeo, chromeMat);
  thresholdMesh.position.set(-hallWidth / 2 + 0.12, 0.006, doorZ);
  doorGroup.add(thresholdMesh);

  const leafW = doorW / 2 - 0.02;
  const leafThick = 0.065;

  const createPolishedDoorLeaf = (isOpen, angle) => {
    const leafGroup = new THREE.Group();

    const leafGeo = new THREE.BoxGeometry(leafThick, doorH - 0.04, leafW);
    const leafMesh = new THREE.Mesh(leafGeo, polishedWoodMat);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    leafGroup.add(leafMesh);

    [0.45, -0.42].forEach((offsetY) => {
      const panelH = offsetY > 0 ? 0.90 : 0.65;
      const panelGeo = new THREE.BoxGeometry(leafThick + 0.012, panelH, leafW - 0.18);
      const panelMesh = new THREE.Mesh(panelGeo, polishedWoodMat);
      panelMesh.position.set(0, offsetY, 0);
      leafGroup.add(panelMesh);

      const borderGeo = new THREE.BoxGeometry(leafThick + 0.018, panelH + 0.04, leafW - 0.14);
      const borderMesh = new THREE.Mesh(borderGeo, darkFrameMat);
      borderMesh.position.set(0, offsetY, 0);
      leafGroup.add(borderMesh);
    });

    const kickplateGeo = new THREE.BoxGeometry(leafThick + 0.006, 0.28, leafW - 0.02);
    const kickplateMesh = new THREE.Mesh(kickplateGeo, chromeMat);
    kickplateMesh.position.set(0, -doorH / 2 + 0.18, 0);
    leafGroup.add(kickplateMesh);

    const pullBarGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.72, 16);
    const pullBarMesh = new THREE.Mesh(pullBarGeo, chromeMat);
    pullBarMesh.position.set(leafThick / 2 + 0.04, 0.05, leafW / 2 - 0.12);
    leafGroup.add(pullBarMesh);

    [-0.28, 0.28].forEach((stubY) => {
      const stubGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.04, 12);
      const stubMesh = new THREE.Mesh(stubGeo, chromeMat);
      stubMesh.rotation.z = Math.PI / 2;
      stubMesh.position.set(leafThick / 2 + 0.02, 0.05 + stubY, leafW / 2 - 0.12);
      leafGroup.add(stubMesh);
    });

    [-0.9, 0.0, 0.9].forEach((hingeY) => {
      const hingeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 12);
      const hingeMesh = new THREE.Mesh(hingeGeo, brassMat);
      hingeMesh.position.set(0, hingeY, -leafW / 2 + 0.01);
      leafGroup.add(hingeMesh);
    });

    return { group: leafGroup, mesh: leafMesh };
  };

  const leftLeaf = createPolishedDoorLeaf(false, 0);
  leftLeaf.group.position.set(-hallWidth / 2 + 0.1, doorY, doorZ - leafW / 2 - 0.01);
  doorGroup.add(leftLeaf.group);

  const rightLeaf = createPolishedDoorLeaf(true, 0.35);
  rightLeaf.group.position.set(-hallWidth / 2 + 0.22, doorY, doorZ + leafW / 2 + 0.01);
  rightLeaf.group.rotation.y = 0.35;
  rightLeaf.mesh.name = 'Polished Double Exit Door';
  rightLeaf.mesh.userData = { category: 'Door', polyCount: 200 };
  doorGroup.add(rightLeaf.group);
  interactiveObjects.push(rightLeaf.mesh);

  const closerBoxGeo = new THREE.BoxGeometry(0.12, 0.08, 0.32);
  const closerBoxMesh = new THREE.Mesh(closerBoxGeo, chromeMat);
  closerBoxMesh.position.set(-hallWidth / 2 + 0.12, doorH - 0.02, doorZ);
  doorGroup.add(closerBoxMesh);

  const exitSignGroup = new THREE.Group();
  exitSignGroup.position.set(-hallWidth / 2 + 0.12, doorH + 0.22, doorZ);

  const exitFrameGeo = new THREE.BoxGeometry(0.12, 0.22, 0.52);
  const exitFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  const exitFrameMesh = new THREE.Mesh(exitFrameGeo, exitFrameMat);
  exitSignGroup.add(exitFrameMesh);

  const exitPanelGeo = new THREE.BoxGeometry(0.126, 0.16, 0.46);
  const exitPanelMat = new THREE.MeshStandardMaterial({
    color: 0x10b981,
    emissive: 0x059669,
    emissiveIntensity: 0.9,
    roughness: 0.1,
  });
  const exitPanelMesh = new THREE.Mesh(exitPanelGeo, exitPanelMat);
  exitPanelMesh.name = 'Illuminated EXIT Sign';
  exitSignGroup.add(exitPanelMesh);

  leftWallGroup.add(doorGroup);
  leftWallGroup.add(exitSignGroup);

  group.add(leftWallGroup);

  // 8. Right Side Wall
  const rightWallGroup = new THREE.Group();

  const rightWallMesh = new THREE.Mesh(sideWallGeo, sideWallMat);
  rightWallMesh.position.set(hallWidth / 2, hallHeight / 2, 0);
  rightWallMesh.rotation.y = -Math.PI / 2;
  rightWallGroup.add(rightWallMesh);

  rightWallGroup.add(createSideWindow(hallWidth / 2, 2.1, -10.5, true));

  rightWallGroup.add(createLouveredCupboard(hallWidth / 2, -5.1, true));
  rightWallGroup.add(createLouveredCupboard(hallWidth / 2, -3.7, true));

  rightWallGroup.add(createSideWindow(hallWidth / 2, 2.1, -0.8, true));

  rightWallGroup.add(createSideWindow(hallWidth / 2, 2.1, 2.8, true));

  rightWallGroup.add(createLouveredCupboard(hallWidth / 2, 7.3, true));
  rightWallGroup.add(createLouveredCupboard(hallWidth / 2, 8.7, true));

  group.add(rightWallGroup);

  return {
    group,
    screenMesh,
    screenMaterial,
    interactiveObjects,
    woodWallMaterial,
    floorMaterial,
  };
}
