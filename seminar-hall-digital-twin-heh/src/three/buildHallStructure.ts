import * as THREE from 'three';
import { MaterialConfig } from '../types';
import {
  createCeilingAcousticTexture,
  createControlRoomDoorTexture,
  createFloorTileTexture,
  createRearAcousticTexture,
  createWoodPanelTexture,
} from '../utils/proceduralTextures';

export interface HallStructureObjects {
  group: THREE.Group;
  screenMesh: THREE.Mesh;
  screenMaterial: THREE.MeshStandardMaterial;
  interactiveObjects: THREE.Mesh[];
  woodWallMaterial: THREE.MeshStandardMaterial;
  floorMaterial: THREE.MeshStandardMaterial;
}

export function buildHallStructure(config: MaterialConfig): HallStructureObjects {
  const group = new THREE.Group();
  group.name = 'HallStructureGroup';
  const interactiveObjects: THREE.Mesh[] = [];

  // Dimensions (in Meters)
  const hallLength = 28.0; // Z axis (-14.0 to +14.0)
  const hallWidth = 13.0; // X axis (-6.5 to +6.5)
  const hallHeight = 4.2; // Y axis (0 to 4.2)

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

  // 1b. Stepped Floor Tiers for 23 rows (1 step for each 3 rows of chairs)
  // Top face is white ceramic tile floor; front riser & border edge strip are black (matching uploaded photo)
  const stepBlackMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.35 });

  const stepTiers: { name: string; height: number; depth: number; zPos: number; frontZ: number; tierIndex: number }[] = [];
  const startZ = -8.5;
  const rowSpacing = 0.82;
  const numSteps = Math.ceil(23 / 3); // 8 tiers (0 to 7)

  // Step 0 is main floor level (0.0m). Steps 1 to 7 are raised floor steps:
  // Step front edges are offset by 0.5 * rowSpacing (0.41m) so they fall cleanly in the walkway gap between chair rows
  for (let s = 1; s < numSteps; s++) {
    const frontZ = startZ + (s * 3 - 0.5) * rowSpacing;
    const backZ = (s === numSteps - 1) ? (hallLength / 2 - 0.1) : (startZ + ((s + 1) * 3 - 0.5) * rowSpacing);
    const depth = backZ - frontZ;
    const zPos = frontZ + depth / 2;
    const height = s * 0.16;
    stepTiers.push({
      name: `Stepped Floor Tier ${s}`,
      height,
      depth,
      zPos,
      frontZ,
      tierIndex: s,
    });
  }

  stepTiers.forEach((tier) => {
    // Step Platform Structure: Top face uses white floorMaterial; sides and front riser use black step material
    const tierGeo = new THREE.BoxGeometry(hallWidth - 0.1, tier.height, tier.depth);
    const tierMesh = new THREE.Mesh(tierGeo, [
      stepBlackMat,  // +X (Right side)
      stepBlackMat,  // -X (Left side)
      floorMaterial, // +Y (Top surface - White Tile)
      stepBlackMat,  // -Y (Bottom)
      stepBlackMat,  // +Z (Rear)
      stepBlackMat,  // -Z (Front Riser Face)
    ]);
    tierMesh.position.set(0, tier.height / 2, tier.zPos);
    tierMesh.receiveShadow = true;
    tierMesh.castShadow = true;
    tierMesh.name = tier.name;
    tierMesh.userData = { category: 'Flooring Tier', polyCount: tierGeo.attributes.position.count };
    group.add(tierMesh);

    // Black Border Strip / Nosing along Front Edge of Step:
    // Remove the first 4 black strips from stage side towards the hall (tierIndex 1, 2, 3, 4 removed; s >= 5 retained)
    if (tier.tierIndex >= 5) {
      const stripGeo = new THREE.BoxGeometry(hallWidth - 0.1, 0.02, 0.12);
      const stripMesh = new THREE.Mesh(stripGeo, stepBlackMat);
      stripMesh.position.set(0, tier.height + 0.01, tier.frontZ + 0.06);
      stripMesh.receiveShadow = true;
      group.add(stripMesh);
    }
  });

  // 2. Stage Platform (Front Stage: Z = -8.5m to -11.0m)
  const stageWidth = 12.6;
  const stageDepth = 3.2;
  const stageHeight = 0.45;
  const stageGeo = new THREE.BoxGeometry(stageWidth, stageHeight, stageDepth);
  const stageMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.25,
    metalness: 0.05,
  });
  const stageMesh = new THREE.Mesh(stageGeo, stageMat);
  stageMesh.position.set(0, stageHeight / 2, -hallLength / 2 + stageDepth / 2 + 0.1);
  stageMesh.receiveShadow = true;
  stageMesh.castShadow = true;
  stageMesh.name = 'Main Stage Platform';
  stageMesh.userData = { category: 'Stage', polyCount: stageGeo.attributes.position.count };
  group.add(stageMesh);

  // Stage front edge dark granite border trim
  const trimGeo = new THREE.BoxGeometry(stageWidth, 0.05, 0.1);
  const trimMat = new THREE.MeshStandardMaterial({ color: 0x111115, roughness: 0.2 });
  const trimMesh = new THREE.Mesh(trimGeo, trimMat);
  trimMesh.position.set(0, stageHeight - 0.025, -hallLength / 2 + stageDepth + 0.05);
  group.add(trimMesh);

  // 2b. Stage Climbing Steps (3 steps at both Left & Right ends of the stage)
  const stepWidth = 1.25;
  const stepTreadDepth = 0.32;
  const numStageSteps = 3;
  const stageFrontZ = -hallLength / 2 + stageDepth + 0.1;
  const stepXPositions = [-stageWidth / 2 + stepWidth / 2 + 0.15, stageWidth / 2 - stepWidth / 2 - 0.15];

  stepXPositions.forEach((xPos, idx) => {
    const sideName = idx === 0 ? 'Left' : 'Right';
    for (let st = 1; st <= numStageSteps; st++) {
      const h = (st / numStageSteps) * stageHeight;
      const zOffset = (numStageSteps - st + 0.5) * stepTreadDepth;
      const stepZ = stageFrontZ + zOffset;

      const stGeo = new THREE.BoxGeometry(stepWidth, h, stepTreadDepth);
      const stMesh = new THREE.Mesh(stGeo, stageMat);
      stMesh.position.set(xPos, h / 2, stepZ);
      stMesh.receiveShadow = true;
      stMesh.castShadow = true;
      stMesh.name = `Stage Step ${st} (${sideName} End)`;
      stMesh.userData = { category: 'Stage Steps', polyCount: stGeo.attributes.position.count };
      group.add(stMesh);
      interactiveObjects.push(stMesh);

      // Black Nosing Strip along Front Edge of each Stage Step
      const nosingGeo = new THREE.BoxGeometry(stepWidth, 0.02, 0.08);
      const nosingMesh = new THREE.Mesh(nosingGeo, trimMat);
      nosingMesh.position.set(xPos, h + 0.01, stepZ + stepTreadDepth / 2 - 0.04);
      nosingMesh.receiveShadow = true;
      group.add(nosingMesh);
    }
  });

  // 3. Stage Back Wall (Wood Paneling - Photo 5)
  const woodTex = createWoodPanelTexture();
  const woodWallMaterial = new THREE.MeshStandardMaterial({
    map: woodTex,
    roughness: 0.35,
    metalness: 0.1,
    color: new THREE.Color(1 - config.woodWallDarkness * 0.3, 1 - config.woodWallDarkness * 0.3, 1 - config.woodWallDarkness * 0.3),
  });

  const frontWallGeo = new THREE.PlaneGeometry(hallWidth, hallHeight);
  const frontWallMesh = new THREE.Mesh(frontWallGeo, woodWallMaterial);
  frontWallMesh.position.set(0, hallHeight / 2, -hallLength / 2);
  frontWallMesh.receiveShadow = true;
  frontWallMesh.name = 'Front Stage Wood Paneled Wall';
  frontWallMesh.userData = { category: 'Wall', polyCount: frontWallGeo.attributes.position.count };
  group.add(frontWallMesh);
  interactiveObjects.push(frontWallMesh);

  // 4. Main Stage Presentation Screen (Center of Front Wall)
  const screenW = 4.8;
  const screenH = 2.7;
  const screenFrameGeo = new THREE.BoxGeometry(screenW + 0.15, screenH + 0.15, 0.08);
  const screenFrameMat = new THREE.MeshStandardMaterial({ color: 0x18181b, roughness: 0.2 });
  const screenFrameMesh = new THREE.Mesh(screenFrameGeo, screenFrameMat);
  screenFrameMesh.position.set(0, 2.2, -hallLength / 2 + 0.04);
  group.add(screenFrameMesh);

  const screenGeo = new THREE.PlaneGeometry(screenW, screenH);
  const screenMaterial = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    roughness: 0.2,
    emissive: 0xffffff,
    emissiveIntensity: 0.6,
  });
  const screenMesh = new THREE.Mesh(screenGeo, screenMaterial);
  screenMesh.position.set(0, 2.2, -hallLength / 2 + 0.085);
  screenMesh.name = 'AV Presentation Screen';
  screenMesh.userData = { category: 'AV Equipment', polyCount: screenGeo.attributes.position.count };
  group.add(screenMesh);
  interactiveObjects.push(screenMesh);

  // 5. Rear Back Wall with Geometric Acoustic Triangles (Photo 2 & 4)
  const rearTex = createRearAcousticTexture();
  const rearWallMat = new THREE.MeshStandardMaterial({
    map: rearTex,
    roughness: 0.8,
    metalness: 0.05,
  });

  const rearWallGeo = new THREE.PlaneGeometry(hallWidth, hallHeight);
  const rearWallMesh = new THREE.Mesh(rearWallGeo, rearWallMat);
  rearWallMesh.position.set(0, hallHeight / 2, hallLength / 2);
  rearWallMesh.rotation.y = Math.PI;
  rearWallMesh.receiveShadow = true;
  rearWallMesh.name = 'Rear Acoustic Triangle Wall';
  rearWallMesh.userData = { category: 'Acoustic Wall', polyCount: rearWallGeo.attributes.position.count };
  group.add(rearWallMesh);

  // Raised Rear Step Platform in back of hall (Photo 2 & 3)
  const rearStepWidth = hallWidth - 0.2;
  const rearStepDepth = 4.5;
  const rearStepHeight = 0.22;
  const rearStepGeo = new THREE.BoxGeometry(rearStepWidth, rearStepHeight, rearStepDepth);
  const rearStepMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.5 });
  const rearStepMesh = new THREE.Mesh(rearStepGeo, rearStepMat);
  rearStepMesh.position.set(0, rearStepHeight / 2, hallLength / 2 - rearStepDepth / 2 - 0.1);
  rearStepMesh.receiveShadow = true;
  group.add(rearStepMesh);

  // Step nosing trim
  const stepTrimGeo = new THREE.BoxGeometry(rearStepWidth, 0.03, 0.06);
  const stepTrimMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.3 });
  const stepTrimMesh = new THREE.Mesh(stepTrimGeo, stepTrimMat);
  stepTrimMesh.position.set(0, rearStepHeight, hallLength / 2 - rearStepDepth - 0.03);
  group.add(stepTrimMesh);

  // ==========================================
  // 5b. CONTROL ROOM ENCLOSURE (Matching uploaded Control Room photo - Right Wall Rear Corner)
  // ==========================================
  const ctrlRoomGroup = new THREE.Group();

  const ctrlWidth = 2.6; // X extent along rear wall
  const ctrlDepth = 3.2; // Z extent into hall
  const ctrlHeight = hallHeight; // 4.2m up to ceiling
  const ctrlEndX = hallWidth / 2; // Right wall boundary (+6.25)
  const ctrlStartX = ctrlEndX - ctrlWidth; // (+3.65)
  const ctrlEndZ = hallLength / 2 - ctrlDepth; // Front wall of control room at Z = 10.8m
  const ctrlMaxZ = hallLength / 2; // 14.0m

  const greyWallMat = new THREE.MeshStandardMaterial({
    color: 0x94a3b8, // Light grey painted drywall
    roughness: 0.5,
  });

  const whiteFrameMat = new THREE.MeshStandardMaterial({
    color: 0xffffff, // White door/window aluminum profile
    roughness: 0.25,
  });

  // 1. FRONT OBSERVATION WALL (Facing stage/audience, Z = 10.8m)
  // Lower Wall Panel (Y = 0 to 1.1m)
  const fLowerGeo = new THREE.BoxGeometry(ctrlWidth, 1.10, 0.12);
  const fLowerMesh = new THREE.Mesh(fLowerGeo, greyWallMat);
  fLowerMesh.position.set((ctrlStartX + ctrlEndX) / 2, 0.55, ctrlEndZ);
  fLowerMesh.castShadow = true;
  fLowerMesh.receiveShadow = true;
  ctrlRoomGroup.add(fLowerMesh);

  // Upper Wall Panel (Y = 2.4m to 4.2m)
  const fUpperGeo = new THREE.BoxGeometry(ctrlWidth, ctrlHeight - 2.40, 0.12);
  const fUpperMesh = new THREE.Mesh(fUpperGeo, greyWallMat);
  fUpperMesh.position.set((ctrlStartX + ctrlEndX) / 2, 2.40 + (ctrlHeight - 2.40) / 2, ctrlEndZ);
  ctrlRoomGroup.add(fUpperMesh);

  // Left & Right Wall Pillars for Observation Window
  const fPillarGeo = new THREE.BoxGeometry(0.35, 1.30, 0.12);
  const fPillarLeft = new THREE.Mesh(fPillarGeo, greyWallMat);
  fPillarLeft.position.set(ctrlStartX + 0.175, 1.75, ctrlEndZ);
  ctrlRoomGroup.add(fPillarLeft);

  const fPillarRight = new THREE.Mesh(fPillarGeo, greyWallMat);
  fPillarRight.position.set(ctrlEndX - 0.175, 1.75, ctrlEndZ);
  ctrlRoomGroup.add(fPillarRight);

  // OBSERVATION GLASS WINDOW FRAME & PANE (Center window)
  const windowW = ctrlWidth - 0.70; // 1.9m wide window
  const windowH = 1.30;
  const windowCenterY = 1.75;

  const obsFrameGeo = new THREE.BoxGeometry(windowW + 0.10, windowH + 0.10, 0.14);
  const obsFrameMesh = new THREE.Mesh(obsFrameGeo, whiteFrameMat);
  obsFrameMesh.position.set((ctrlStartX + ctrlEndX) / 2, windowCenterY, ctrlEndZ);
  ctrlRoomGroup.add(obsFrameMesh);

  // Transparent Observation Glass Pane
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

  // 2. INNER SIDE WALL (Facing central aisle, X = +3.65m)
  // Wall panel from Z = 10.8m to 12.0m (in front of door)
  const sWallFrontGeo = new THREE.BoxGeometry(0.12, ctrlHeight, 1.20);
  const sWallFrontMesh = new THREE.Mesh(sWallFrontGeo, greyWallMat);
  sWallFrontMesh.position.set(ctrlStartX, ctrlHeight / 2, ctrlEndZ + 0.60);
  sWallFrontMesh.castShadow = true;
  ctrlRoomGroup.add(sWallFrontMesh);

  // Wall panel above Door (Y = 2.30m to 4.2m)
  const sWallAboveGeo = new THREE.BoxGeometry(0.12, ctrlHeight - 2.30, 1.10);
  const sWallAboveMesh = new THREE.Mesh(sWallAboveGeo, greyWallMat);
  sWallAboveMesh.position.set(ctrlStartX, 2.30 + (ctrlHeight - 2.30) / 2, ctrlMaxZ - 0.55);
  ctrlRoomGroup.add(sWallAboveMesh);

  // CONTROL ROOM DOOR WITH WHITE FRAME & VERTICAL "CONTROL ROOM" GLASS TEXT (Matching uploaded photo)
  const crDoorW = 1.05;
  const crDoorH = 2.25;
  const crDoorZ = ctrlMaxZ - 0.55;

  // White Outer Door Frame
  const crFrameGeo = new THREE.BoxGeometry(0.16, crDoorH + 0.08, crDoorW + 0.08);
  const crFrameMesh = new THREE.Mesh(crFrameGeo, whiteFrameMat);
  crFrameMesh.position.set(ctrlStartX, crDoorH / 2 + 0.01, crDoorZ);
  ctrlRoomGroup.add(crFrameMesh);

  // Glass Door Leaf with "CONTROL ROOM" Vertical Text Texture
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

  // Chrome Door Handle & Keyhole
  const crHandleGeo = new THREE.BoxGeometry(0.08, 0.22, 0.04);
  const crHandleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.9, roughness: 0.1 });
  const crHandleMesh = new THREE.Mesh(crHandleGeo, crHandleMat);
  crHandleMesh.position.set(ctrlStartX - 0.04, 1.05, crDoorZ - crDoorW / 2 + 0.12);
  ctrlRoomGroup.add(crHandleMesh);

  // 3. EQUIPMENT INSIDE CONTROL ROOM (Visible through observation glass & door glass)
  const insideGroup = new THREE.Group();

  // Operator Console Desk
  const deskGeo = new THREE.BoxGeometry(1.80, 0.75, 0.70);
  const deskMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.3 });
  const deskMesh = new THREE.Mesh(deskGeo, deskMat);
  deskMesh.position.set((ctrlStartX + ctrlEndX) / 2, 0.375, ctrlEndZ + 0.80);
  insideGroup.add(deskMesh);

  // Dual Flat Screen Monitors on desk
  [-0.45, 0.45].forEach((monX) => {
    const monGeo = new THREE.BoxGeometry(0.55, 0.35, 0.04);
    const monMat = new THREE.MeshStandardMaterial({ color: 0x09090b, emissive: 0x1e293b, emissiveIntensity: 0.4 });
    const monMesh = new THREE.Mesh(monGeo, monMat);
    monMesh.position.set((ctrlStartX + ctrlEndX) / 2 + monX, 0.75 + 0.20, ctrlEndZ + 0.80);
    monMesh.rotation.y = monX < 0 ? 0.15 : -0.15;
    insideGroup.add(monMesh);
  });

  // Server Rack / UPS Equipment Cabinet (Matching "UPS" text & racks in photo)
  const rackGeo = new THREE.BoxGeometry(0.65, 1.80, 0.60);
  const rackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.4 });
  const rackMesh = new THREE.Mesh(rackGeo, rackMat);
  rackMesh.position.set(ctrlEndX - 0.55, 0.90, ctrlMaxZ - 0.80);
  insideGroup.add(rackMesh);

  // UPS Status LEDs and Red/White Label Plate
  const upsLabelGeo = new THREE.BoxGeometry(0.66, 0.25, 0.20);
  const upsLabelMat = new THREE.MeshStandardMaterial({ color: 0xef4444, emissive: 0xb91c1c, emissiveIntensity: 0.5 });
  const upsLabelMesh = new THREE.Mesh(upsLabelGeo, upsLabelMat);
  upsLabelMesh.position.set(ctrlEndX - 0.55, 1.30, ctrlMaxZ - 0.80);
  insideGroup.add(upsLabelMesh);

  ctrlRoomGroup.add(insideGroup);
  group.add(ctrlRoomGroup);

  // 6. Ceiling (Acoustic Grid with Triangles & Beams)
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

  // Ceiling Beams / Bulkheads (Soffit Wall Drops hanging from ceiling behind fans)
  const beamPositionsZ = [-0.5, 4.5, 9.5];
  beamPositionsZ.forEach((z) => {
    const beamGeo = new THREE.BoxGeometry(hallWidth - 0.05, 0.70, 0.25);
    const beamMat = new THREE.MeshStandardMaterial({ color: 0xd4d4d8, roughness: 0.4 });
    const beamMesh = new THREE.Mesh(beamGeo, beamMat);
    beamMesh.position.set(0, hallHeight - 0.35, z); // Hangs from Y=4.2 down to Y=3.5
    beamMesh.castShadow = true;
    beamMesh.receiveShadow = true;
    beamMesh.name = 'Ceiling Soffit Bulkhead Wall';
    group.add(beamMesh);
  });

  // 7. Left Side Wall - Louvered White Storage Cupboards & Multi-pane Windows (Photos 1, 2, 3, 4)
  const leftWallGroup = new THREE.Group();

  // Plain wall backing
  const sideWallGeo = new THREE.PlaneGeometry(hallLength, hallHeight);
  const sideWallMat = new THREE.MeshStandardMaterial({ color: 0xdedede, roughness: 0.6 });
  const leftWallMesh = new THREE.Mesh(sideWallGeo, sideWallMat);
  leftWallMesh.position.set(-hallWidth / 2, hallHeight / 2, 0);
  leftWallMesh.rotation.y = Math.PI / 2;
  leftWallGroup.add(leftWallMesh);

  // Helper function to create exact Louvered White Storage Cupboard (Photo 1 & 3)
  const createLouveredCupboard = (xPos: number, zPos: number, isRightWall: boolean) => {
    const cabGroup = new THREE.Group();
    const cabDepth = 0.38; // Extends into room
    const cabWidth = 1.35; // Width along Z axis
    const cabHeight = 3.35; // Full height up to soffit beam drop
    const wallSign = isRightWall ? -1 : 1;

    // 1. Main Cabinet Enclosure / Casing Box (White Satin Finish)
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

    // 2. Double Wardrobe Doors (Bottom Section Y = 0 to 2.40m)
    const doorH = 2.40;
    const doorW = cabWidth / 2 - 0.015;
    const doorGeo = new THREE.BoxGeometry(0.02, doorH - 0.02, doorW);
    const doorMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

    // Left Door
    const dLeft = new THREE.Mesh(doorGeo, doorMat);
    dLeft.position.set(xPos + wallSign * (cabDepth + 0.011), doorH / 2, zPos - doorW / 2 - 0.005);
    cabGroup.add(dLeft);

    // Right Door
    const dRight = new THREE.Mesh(doorGeo, doorMat);
    dRight.position.set(xPos + wallSign * (cabDepth + 0.011), doorH / 2, zPos + doorW / 2 + 0.005);
    cabGroup.add(dRight);

    // Center Vertical Split Line & Lock Core Detail
    const lockGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.015, 12);
    const lockMat = new THREE.MeshStandardMaterial({ color: 0x333333, metalness: 0.9, roughness: 0.1 });
    const lockMesh = new THREE.Mesh(lockGeo, lockMat);
    lockMesh.rotation.z = Math.PI / 2;
    lockMesh.position.set(xPos + wallSign * (cabDepth + 0.022), 1.05, zPos);
    cabGroup.add(lockMesh);

    // Long Vertical Stainless Steel Handles on Main Doors
    const handleGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.36, 12);
    const handleMat = new THREE.MeshStandardMaterial({ color: 0x27272a, metalness: 0.8, roughness: 0.2 });

    const hLeft = new THREE.Mesh(handleGeo, handleMat);
    hLeft.position.set(xPos + wallSign * (cabDepth + 0.025), 1.25, zPos - 0.04);
    cabGroup.add(hLeft);

    const hRight = new THREE.Mesh(handleGeo, handleMat);
    hRight.position.set(xPos + wallSign * (cabDepth + 0.025), 1.25, zPos + 0.04);
    cabGroup.add(hRight);

    // Handle Mounting Posts
    [-0.16, 0.16].forEach((yOff) => {
      const postGeo = new THREE.BoxGeometry(0.02, 0.01, 0.01);
      const p1 = new THREE.Mesh(postGeo, handleMat);
      p1.position.set(xPos + wallSign * (cabDepth + 0.018), 1.25 + yOff, zPos - 0.04);
      cabGroup.add(p1);

      const p2 = new THREE.Mesh(postGeo, handleMat);
      p2.position.set(xPos + wallSign * (cabDepth + 0.018), 1.25 + yOff, zPos + 0.04);
      cabGroup.add(p2);
    });

    // 3. Top Louvered Loft Cabinet Unit (Y = 2.42m to 3.32m) - Photo 1 Matching
    const loftH = 0.90;
    const loftCenterY = 2.42 + loftH / 2;
    const loftBoxGeo = new THREE.BoxGeometry(0.02, loftH - 0.02, cabWidth - 0.04);
    const loftBoxMat = new THREE.MeshStandardMaterial({ color: 0xf1f5f9, roughness: 0.3 });
    const loftBoxMesh = new THREE.Mesh(loftBoxGeo, loftBoxMat);
    loftBoxMesh.position.set(xPos + wallSign * (cabDepth + 0.011), loftCenterY, zPos);
    cabGroup.add(loftBoxMesh);

    // Horizontal Slatted Ventilation Louvers / Grille Slats (10 slats)
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

    // Top Loft Door Horizontal Pull Handle
    const topHandleGeo = new THREE.CylinderGeometry(0.007, 0.007, 0.28, 12);
    topHandleGeo.rotateX(Math.PI / 2);
    const topHandle = new THREE.Mesh(topHandleGeo, handleMat);
    topHandle.position.set(xPos + wallSign * (cabDepth + 0.025), 2.48, zPos);
    cabGroup.add(topHandle);

    return cabGroup;
  };

  // Helper function to create realistic side wall windows matching Photos 1, 2, 3, 4
  const createSideWindow = (xPos: number, yPos: number, zPos: number, isRightWall: boolean) => {
    const winGroup = new THREE.Group();
    const winW = 2.3; // Width along Z axis
    const winH = 2.1; // Height along Y axis
    const wallSign = isRightWall ? -1 : 1;

    // 1. Outer White Aluminum Window Frame Box
    const frameMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.25 });
    const outerFrameGeo = new THREE.BoxGeometry(0.12, winH, winW);
    const outerFrame = new THREE.Mesh(outerFrameGeo, frameMat);
    outerFrame.position.set(xPos + wallSign * 0.06, yPos, zPos);
    winGroup.add(outerFrame);

    // Window Bottom Sill Plate Protruding into Room
    const sillGeo = new THREE.BoxGeometry(0.20, 0.04, winW + 0.12);
    const sillMesh = new THREE.Mesh(sillGeo, frameMat);
    sillMesh.position.set(xPos + wallSign * 0.10, yPos - winH / 2 - 0.02, zPos);
    sillMesh.receiveShadow = true;
    winGroup.add(sillMesh);

    // 2. Translucent Glass
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

    // 3. Grid Mullions (Upper Transom Section + Lower Vertical Panels - Photos 1 & 2)
    const mullionMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3 });

    // Transom Horizontal Divider Bar (separates top grid from lower tall panes at 70% height)
    const transomY = yPos + winH * 0.22;
    const transomBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.04, winW - 0.08), mullionMat);
    transomBar.position.set(xPos + wallSign * 0.06, transomY, zPos);
    winGroup.add(transomBar);

    // Top Transom Section: 4 Vertical Mullions & 1 Mid Horizontal Bar
    const topGridBar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, winW - 0.08), mullionMat);
    topGridBar.position.set(xPos + wallSign * 0.06, yPos + winH * 0.38, zPos);
    winGroup.add(topGridBar);

    // 3 Vertical Mullion Bars dividing window into 4 vertical columns across entire height
    [-0.28, 0.0, 0.28].forEach((zRatio) => {
      const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, winH - 0.08, 0.035), mullionMat);
      vMullion.position.set(xPos + wallSign * 0.06, yPos, zPos + zRatio * winW);
      winGroup.add(vMullion);
    });

    // 4. Roll-down White Venetian / Fabric Roller Blinds (Semi-translucent white as in Photos 1-4)
    const blindH = winH * 0.82; // Pulled down 82%
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

    // Blind Bottom Weight Rail
    const railGeo = new THREE.BoxGeometry(0.04, 0.03, winW - 0.08);
    const railMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.3 });
    const railMesh = new THREE.Mesh(railGeo, railMat);
    railMesh.position.set(xPos + wallSign * 0.085, yPos - blindH / 2 + (winH - blindH) / 2 - 0.04, zPos);
    winGroup.add(railMesh);

    return winGroup;
  };

  // LEFT WALL LAYOUT:
  // Windows along left wall around the Double Exit Door and Stage Exit Door
  const leftWindowZ = [-6.5, -2.5, 6.5, 11.0];
  leftWindowZ.forEach((z) => {
    leftWallGroup.add(createSideWindow(-hallWidth / 2, 2.1, z, false));
  });

  // Double Exit Door on Left Side Wall (Photo 4) - High-Polish Executive Architectural Finish
  const doorZ = 2.14;
  const doorH = 2.45;
  const doorW = 1.65;
  const doorY = doorH / 2;

  const doorGroup = new THREE.Group();

  // Materials for Polished Door
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

  // STAGE EXIT DOOR ON LEFT WALL NEAR PODIUM (Matching uploaded photo)
  const stageDoorZ = -10.6;
  const stageDoorH = 2.25;
  const stageDoorW = 1.05;
  const stageDoorY = stageDoorH / 2;

  const stageDoorGroup = new THREE.Group();

  // Outer Architrave Frame
  const sFrameGeo = new THREE.BoxGeometry(0.20, stageDoorH + 0.10, stageDoorW + 0.14);
  const sFrameMesh = new THREE.Mesh(sFrameGeo, darkFrameMat);
  sFrameMesh.position.set(-hallWidth / 2 + 0.08, stageDoorY, stageDoorZ);
  stageDoorGroup.add(sFrameMesh);

  // Door Leaf
  const sLeafGeo = new THREE.BoxGeometry(0.06, stageDoorH - 0.04, stageDoorW - 0.04);
  const sLeafMesh = new THREE.Mesh(sLeafGeo, polishedWoodMat);
  sLeafMesh.position.set(-hallWidth / 2 + 0.10, stageDoorY, stageDoorZ);
  sLeafMesh.castShadow = true;
  sLeafMesh.receiveShadow = true;
  sLeafMesh.name = 'Stage Exit Door (Near Podium)';
  sLeafMesh.userData = { category: 'Door', polyCount: 120 };
  stageDoorGroup.add(sLeafMesh);
  interactiveObjects.push(sLeafMesh);

  // Recessed Inset Panel
  const sPanelGeo = new THREE.BoxGeometry(0.07, stageDoorH - 0.40, stageDoorW - 0.20);
  const sPanelMesh = new THREE.Mesh(sPanelGeo, darkFrameMat);
  sPanelMesh.position.set(-hallWidth / 2 + 0.10, stageDoorY, stageDoorZ);
  stageDoorGroup.add(sPanelMesh);

  // Door Handle / Lock lever
  const sHandleGeo = new THREE.BoxGeometry(0.08, 0.04, 0.16);
  const sHandleMesh = new THREE.Mesh(sHandleGeo, chromeMat);
  sHandleMesh.position.set(-hallWidth / 2 + 0.14, 1.05, stageDoorZ + stageDoorW / 2 - 0.15);
  stageDoorGroup.add(sHandleMesh);

  // Overhead EXIT Sign for Stage Exit Door
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

  // Outer Architectural Casing & Architrave Frame
  const frameThick = 0.22;
  const outerFrameGeo = new THREE.BoxGeometry(frameThick, doorH + 0.12, doorW + 0.16);
  const outerFrameMesh = new THREE.Mesh(outerFrameGeo, darkFrameMat);
  outerFrameMesh.position.set(-hallWidth / 2 + frameThick / 2 - 0.02, doorY, doorZ);
  doorGroup.add(outerFrameMesh);

  // Door Threshold Plate (Floor stainless steel transition bar)
  const thresholdGeo = new THREE.BoxGeometry(0.28, 0.012, doorW + 0.1);
  const thresholdMesh = new THREE.Mesh(thresholdGeo, chromeMat);
  thresholdMesh.position.set(-hallWidth / 2 + 0.12, 0.006, doorZ);
  doorGroup.add(thresholdMesh);

  // Helper to build a polished door leaf with recessed panels, kickplate, hinges, and handles
  const leafW = doorW / 2 - 0.02;
  const leafThick = 0.065;

  const createPolishedDoorLeaf = (isOpen: boolean, angle: number) => {
    const leafGroup = new THREE.Group();

    // Base Leaf Box
    const leafGeo = new THREE.BoxGeometry(leafThick, doorH - 0.04, leafW);
    const leafMesh = new THREE.Mesh(leafGeo, polishedWoodMat);
    leafMesh.castShadow = true;
    leafMesh.receiveShadow = true;
    leafGroup.add(leafMesh);

    // Recessed Inset Panels (Upper & Lower bevel panels for classic high-end look)
    [0.45, -0.42].forEach((offsetY) => {
      const panelH = offsetY > 0 ? 0.90 : 0.65;
      const panelGeo = new THREE.BoxGeometry(leafThick + 0.012, panelH, leafW - 0.18);
      const panelMesh = new THREE.Mesh(panelGeo, polishedWoodMat);
      panelMesh.position.set(0, offsetY, 0);
      leafGroup.add(panelMesh);

      // Panel Molded Inset Border Trim
      const borderGeo = new THREE.BoxGeometry(leafThick + 0.018, panelH + 0.04, leafW - 0.14);
      const borderMesh = new THREE.Mesh(borderGeo, darkFrameMat);
      borderMesh.position.set(0, offsetY, 0);
      leafGroup.add(borderMesh);
    });

    // Satin Chrome Kickplate at bottom of door
    const kickplateGeo = new THREE.BoxGeometry(leafThick + 0.006, 0.28, leafW - 0.02);
    const kickplateMesh = new THREE.Mesh(kickplateGeo, chromeMat);
    kickplateMesh.position.set(0, -doorH / 2 + 0.18, 0);
    leafGroup.add(kickplateMesh);

    // Vertical Tubular Stainless Steel Pull Bar Handle
    const pullBarGeo = new THREE.CylinderGeometry(0.016, 0.016, 0.72, 16);
    const pullBarMesh = new THREE.Mesh(pullBarGeo, chromeMat);
    pullBarMesh.position.set(leafThick / 2 + 0.04, 0.05, leafW / 2 - 0.12);
    leafGroup.add(pullBarMesh);

    // Handle Mount Stubs
    [-0.28, 0.28].forEach((stubY) => {
      const stubGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.04, 12);
      const stubMesh = new THREE.Mesh(stubGeo, chromeMat);
      stubMesh.rotation.z = Math.PI / 2;
      stubMesh.position.set(leafThick / 2 + 0.02, 0.05 + stubY, leafW / 2 - 0.12);
      leafGroup.add(stubMesh);
    });

    // Brass Hinges (3 hinges along frame pivot edge)
    [-0.9, 0.0, 0.9].forEach((hingeY) => {
      const hingeGeo = new THREE.CylinderGeometry(0.01, 0.01, 0.12, 12);
      const hingeMesh = new THREE.Mesh(hingeGeo, brassMat);
      hingeMesh.position.set(0, hingeY, -leafW / 2 + 0.01);
      leafGroup.add(hingeMesh);
    });

    return { group: leafGroup, mesh: leafMesh };
  };

  // Left Door Leaf (Closed)
  const leftLeaf = createPolishedDoorLeaf(false, 0);
  leftLeaf.group.position.set(-hallWidth / 2 + 0.1, doorY, doorZ - leafW / 2 - 0.01);
  doorGroup.add(leftLeaf.group);

  // Right Door Leaf (Slightly Open facing into hall)
  const rightLeaf = createPolishedDoorLeaf(true, 0.35);
  rightLeaf.group.position.set(-hallWidth / 2 + 0.22, doorY, doorZ + leafW / 2 + 0.01);
  rightLeaf.group.rotation.y = 0.35;
  rightLeaf.mesh.name = 'Polished Double Exit Door';
  rightLeaf.mesh.userData = { category: 'Door', polyCount: 200 };
  doorGroup.add(rightLeaf.group);
  interactiveObjects.push(rightLeaf.mesh);

  // Overhead Hydraulic Door Closer Mechanism Box & Jointed Arm
  const closerBoxGeo = new THREE.BoxGeometry(0.12, 0.08, 0.32);
  const closerBoxMesh = new THREE.Mesh(closerBoxGeo, chromeMat);
  closerBoxMesh.position.set(-hallWidth / 2 + 0.12, doorH - 0.02, doorZ);
  doorGroup.add(closerBoxMesh);

  // Overhead Edge-Lit Illuminated EXIT Sign
  const exitSignGroup = new THREE.Group();
  exitSignGroup.position.set(-hallWidth / 2 + 0.12, doorH + 0.22, doorZ);

  // Housing Box
  const exitFrameGeo = new THREE.BoxGeometry(0.12, 0.22, 0.52);
  const exitFrameMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 });
  const exitFrameMesh = new THREE.Mesh(exitFrameGeo, exitFrameMat);
  exitSignGroup.add(exitFrameMesh);

  // Green Illuminated Panel Face
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

  // 8. Right Side Wall - Louvered Storage Cupboards & Windows
  const rightWallGroup = new THREE.Group();

  const rightWallMesh = new THREE.Mesh(sideWallGeo, sideWallMat);
  rightWallMesh.position.set(hallWidth / 2, hallHeight / 2, 0);
  rightWallMesh.rotation.y = -Math.PI / 2;
  rightWallGroup.add(rightWallMesh);

  // RIGHT WALL LAYOUT:
  // 1. Front Window near stage (Z = -10.5m)
  rightWallGroup.add(createSideWindow(hallWidth / 2, 2.1, -10.5, true));

  // 2. FIRST PAIR OF LOUVERED STORAGE CUPBOARDS (Cupboard 1 & Cupboard 2)
  rightWallGroup.add(createLouveredCupboard(hallWidth / 2, -5.1, true));
  rightWallGroup.add(createLouveredCupboard(hallWidth / 2, -3.7, true));

  // 3. Mid Window 1 (Z = -0.8m)
  rightWallGroup.add(createSideWindow(hallWidth / 2, 2.1, -0.8, true));

  // 4. Mid Window 2 (Z = 2.8m)
  rightWallGroup.add(createSideWindow(hallWidth / 2, 2.1, 2.8, true));

  // 5. SECOND PAIR OF LOUVERED STORAGE CUPBOARDS (Cupboard 3 & Cupboard 4)
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
