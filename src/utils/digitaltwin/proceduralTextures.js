import * as THREE from 'three';

/**
 * Creates canvas-based procedural PBR textures to replicate photo details accurately.
 */

// 1. Rear Wall Geometric Acoustic Triangles
export function createRearAcousticTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const colors = [
    '#1e3a8a', // Dark Royal Blue
    '#0284c7', // Bright Blue
    '#0d9488', // Deep Teal
    '#10b981', // Emerald Teal
    '#475569', // Slate Grey
    '#0f172a', // Deep Slate
    '#38bdf8', // Light Cyan
  ];

  ctx.fillStyle = '#1e293b';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const cols = 16;
  const rows = 8;
  const cellW = canvas.width / cols;
  const cellH = canvas.height / rows;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * cellW;
      const y = r * cellH;
      const color1 = colors[(r * 3 + c * 7) % colors.length];
      const color2 = colors[(r * 5 + c * 2 + 1) % colors.length];

      ctx.fillStyle = color1;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.lineTo(x + cellW, y);
      ctx.lineTo(x, y + cellH);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = color2;
      ctx.beginPath();
      ctx.moveTo(x + cellW, y);
      ctx.lineTo(x + cellW, y + cellH);
      ctx.lineTo(x, y + cellH);
      ctx.closePath();
      ctx.fill();

      ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, cellW, cellH);
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  return texture;
}

// 2. Ceiling Acoustic Tile Grid with Geometric Triangles
export function createCeilingAcousticTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#cbd5e1';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const tileSize = 64;
  const cols = canvas.width / tileSize;
  const rows = canvas.height / tileSize;

  const greenShades = ['#22c55e', '#10b981', '#15803d', '#34d399', '#94a3b8', '#cbd5e1'];

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const x = c * tileSize;
      const y = r * tileSize;

      ctx.strokeStyle = '#64748b';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, tileSize, tileSize);

      if ((r + c) % 3 === 0 || (r * c) % 5 === 0) {
        const color = greenShades[(r * 4 + c * 9) % greenShades.length];
        ctx.fillStyle = color;
        ctx.beginPath();
        if ((r + c) % 2 === 0) {
          ctx.moveTo(x, y);
          ctx.lineTo(x + tileSize, y);
          ctx.lineTo(x, y + tileSize);
        } else {
          ctx.moveTo(x + tileSize, y);
          ctx.lineTo(x + tileSize, y + tileSize);
          ctx.lineTo(x, y + tileSize);
        }
        ctx.closePath();
        ctx.fill();
      }
    }
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(4, 8);
  return texture;
}

// 3. Stage Dark Wood Paneling Texture
export function createWoodPanelTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#2d1810';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const plankWidth = 128;
  const numPlanks = canvas.width / plankWidth;

  for (let i = 0; i < numPlanks; i++) {
    const x = i * plankWidth;
    
    const shadeShift = (Math.sin(i * 1.5) * 15) | 0;
    ctx.fillStyle = `rgb(${45 + shadeShift}, ${24 + shadeShift / 2}, ${16 + shadeShift / 3})`;
    ctx.fillRect(x, 0, plankWidth, canvas.height);

    ctx.strokeStyle = 'rgba(15, 8, 5, 0.3)';
    ctx.lineWidth = 1;
    for (let g = 0; g < plankWidth; g += 4) {
      ctx.beginPath();
      ctx.moveTo(x + g, 0);
      ctx.lineTo(x + g + (Math.random() * 2 - 1), canvas.height);
      ctx.stroke();
    }

    ctx.strokeStyle = '#120a06';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(3, 1);
  return texture;
}

// 4. Polished Cream Ceramic Floor Tile Texture
export function createFloorTileTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#f3e8d3';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = 0; i < 300; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    const r = Math.random() * 80 + 20;
    const grad = ctx.createRadialGradient(x, y, 0, x, y, r);
    grad.addColorStop(0, 'rgba(255, 250, 240, 0.65)');
    grad.addColorStop(1, 'rgba(243, 232, 211, 0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  const tileSize = 256;
  ctx.strokeStyle = '#d8cca8';
  ctx.lineWidth = 2.5;
  for (let x = 0; x <= canvas.width; x += tileSize) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, canvas.height);
    ctx.stroke();
  }
  for (let y = 0; y <= canvas.height; y += tileSize) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(canvas.width, y);
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(6, 10);
  return texture;
}

// 5. Presentation Screen Slides Texture
export function createPresentationScreenTexture(slideIndex, title) {
  const canvas = document.createElement('canvas');
  canvas.width = 1920;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  const slides = [
    {
      bg: '#0f172a',
      accent: '#38bdf8',
      header: 'SEMINAR HALL DIGITAL TWIN',
      sub: '3D Real-Time Spatial Telemetry & Interactive Scene Control',
      points: [
        '• High-fidelity PBR Material Shading & Lighting',
        '• Optimized Mesh Instancing (~150 Seating Nodes @ 60 FPS)',
        '• Direct Unity / Unreal Engine GLB Asset Export API',
        '• Embedded IoT Telemetry (Occupancy, Acoustics, HVAC)',
      ],
    },
    {
      bg: '#1e1b4b',
      accent: '#818cf8',
      header: 'SPATIAL ANALYTICS & OCCUPANCY',
      sub: 'Auditorium Seating Matrix & Environmental Monitoring',
      points: [
        '• Total Capacity: 144 Ergonomic Cushioned Seats',
        '• Dual Color Zone: Royal Blue (72) & Emerald Green (72)',
        '• Air Quality (CO2): 450 PPM | Sound Level: 42 dB',
        '• Automated Stage Spotlight & Scene Lighting Schedules',
      ],
    },
    {
      bg: '#064e3b',
      accent: '#34d399',
      header: 'UNITY / UNREAL INTEGRATION API',
      sub: 'Cross-Engine Compatibility & Real-Time Sync',
      points: [
        '• Industry Standard glTF 2.0 / GLB Binary Specification',
        '• Includes Metallic-Roughness PBR Texture Maps',
        '• Ready-to-Use C# Controller Scripts Included',
        '• REST API & WebSockets Telemetry Binding',
      ],
    },
  ];

  const current = slides[slideIndex % slides.length];

  ctx.fillStyle = current.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = current.accent;
  ctx.globalAlpha = 0.15;
  ctx.beginPath();
  ctx.arc(1700, 200, 400, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1.0;

  ctx.fillStyle = current.accent;
  ctx.fillRect(100, 120, 16, 100);

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 56px system-ui, sans-serif';
  ctx.fillText(title || current.header, 140, 180);

  ctx.fillStyle = current.accent;
  ctx.font = '28px system-ui, sans-serif';
  ctx.fillText(current.sub, 140, 230);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(100, 280);
  ctx.lineTo(1820, 280);
  ctx.stroke();

  ctx.fillStyle = '#f8fafc';
  ctx.font = '32px system-ui, sans-serif';
  current.points.forEach((point, i) => {
    ctx.fillText(point, 140, 380 + i * 80);
  });

  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fillRect(0, 980, canvas.width, 100);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px monospace';
  ctx.fillText(`SEMINAR HALL DIGITAL TWIN v2.4 | SLIDE ${slideIndex + 1} OF ${slides.length} | 4K PRESENTATION ENGINE`, 100, 1040);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 6. Protective Plastic Wrap Sheen Normal / Roughness Map
export function createPlasticWrapTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#808080';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 1.5;
  for (let i = 0; i < 80; i++) {
    const x = Math.random() * canvas.width;
    const y = Math.random() * canvas.height;
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.bezierCurveTo(
      x + Math.random() * 60 - 30,
      y + Math.random() * 60 - 30,
      x + Math.random() * 80 - 40,
      y + Math.random() * 80 - 40,
      x + Math.random() * 100 - 50,
      y + Math.random() * 100 - 50
    );
    ctx.stroke();
  }

  const texture = new THREE.CanvasTexture(canvas);
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.repeat.set(2, 2);
  return texture;
}

// 7. Stage Lectern/Podium Institutional Emblem Seal
export function createPodiumEmblemTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const cx = 256;
  const cy = 256;

  ctx.fillStyle = '#450a0a';
  ctx.beginPath();
  ctx.arc(cx, cy, 220, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = '#eab308';
  ctx.lineWidth = 12;
  ctx.stroke();

  ctx.strokeStyle = '#ca8a04';
  ctx.lineWidth = 4;
  ctx.beginPath();
  ctx.arc(cx, cy, 180, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = '#ef4444';
  ctx.beginPath();
  ctx.moveTo(cx, cy - 80);
  ctx.quadraticCurveTo(cx + 40, cy - 20, cx, cy + 20);
  ctx.quadraticCurveTo(cx - 40, cy - 20, cx, cy - 80);
  ctx.fill();

  ctx.fillStyle = '#fef08a';
  ctx.beginPath();
  ctx.arc(cx, cy - 30, 18, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillRect(cx - 50, cy + 30, 45, 30);
  ctx.fillRect(cx + 5, cy + 30, 45, 30);

  ctx.fillStyle = '#eab308';
  ctx.font = 'bold 22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('INSTITUTE OF TECHNOLOGY', cx, 80);
  ctx.fillText('SEMINAR HALL', cx, 450);

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}

// 8. Control Room Door Glass with Vertical Text
export function createControlRoomDoorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = 'rgba(219, 234, 254, 0.25)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, 'rgba(255, 255, 255, 0.4)');
  grad.addColorStop(0.5, 'rgba(255, 255, 255, 0.05)');
  grad.addColorStop(1, 'rgba(255, 255, 255, 0.3)');
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.lineWidth = 8;
  ctx.strokeRect(20, 20, canvas.width - 40, canvas.height - 40);

  ctx.save();
  ctx.translate(canvas.width / 2 + 20, canvas.height / 2);
  ctx.rotate(Math.PI / 2);
  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 8;
  ctx.font = '900 54px "Arial Black", "Inter", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('CONTROL ROOM', 0, 0);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  return texture;
}
