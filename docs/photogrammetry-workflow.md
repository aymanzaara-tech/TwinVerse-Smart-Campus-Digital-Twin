# Photogrammetry Workflow

## Objective
The objective of photogrammetry is to create an accurate 3D model of the college seminar hall that can be used in the TwinVerse Smart Campus Digital Twin project.

---

## What is Photogrammetry?

Photogrammetry is the process of creating a realistic 3D model from multiple overlapping photographs of a real-world object or environment.

---

## Workflow

### Step 1: Image Capture
Capture 100–200 high-quality photographs of the seminar hall.

**Guidelines:**
- Ensure 60–80% overlap between consecutive images.
- Capture images from multiple angles.
- Maintain consistent lighting.
- Avoid blurry or low-resolution photos.
- Cover all walls, furniture, doors, windows, and equipment.

---

### Step 2: Import Images
Import the captured images into photogrammetry software.

**Recommended Software:**
- Meshroom (Free & Open Source)
- RealityCapture
- Agisoft Metashape
- Polycam

---

### Step 3: Image Processing
The software analyzes the images to identify common feature points and estimate camera positions.

This process generates:
- Sparse Point Cloud
- Dense Point Cloud

---

### Step 4: 3D Reconstruction
Using the point cloud, the software creates:
- 3D Mesh
- Surface Geometry
- Textured 3D Model

---

### Step 5: Export Model
Export the completed model in one of the following formats:

- `.glb` (Recommended)
- `.gltf`
- `.fbx`
- `.obj`

---

### Step 6: Organize Assets
Store the generated files in the project structure.

```
frontend/
└── assets/
    ├── models/
    ├── textures/
    ├── materials/
    ├── hdr/
    ├── images/
    └── references/
```

---

### Step 7: Future Integration
The exported 3D model will be integrated into the TwinVerse frontend using **Three.js** and **React Three Fiber** for interactive visualization.

---

## Advantages of Photogrammetry

- Produces realistic and accurate 3D models.
- Reduces manual modeling effort.
- Preserves real-world dimensions and textures.
- Enables immersive Digital Twin visualization.
- Supports future simulations and virtual campus navigation.

---

## Best Practices

- Capture images in daylight or under uniform lighting.
- Avoid reflective and transparent surfaces where possible.
- Use a high-resolution camera.
- Keep camera movement smooth.
- Verify image quality before processing.

---

## Expected Output

- High-quality 3D model of the seminar hall.
- Optimized `.glb` model for web rendering.
- Organized textures and supporting assets.
- Ready for integration with the TwinVerse Digital Twin dashboard.