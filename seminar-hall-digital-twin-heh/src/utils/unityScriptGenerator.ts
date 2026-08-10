/**
 * Generates ready-to-use Unity C# scripts for seamless scene integration.
 */

export function generateUnityControllerScript(): string {
  return `using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

namespace SeminarHallDigitalTwin
{
    [ExecuteInEditMode]
    public class SeminarHallController : MonoBehaviour
    {
        [Header("Stage Screen Settings")]
        public Renderer stageScreenRenderer;
        public Texture2D[] presentationSlides;
        public int currentSlideIndex = 0;
        public float slideAutoRotateInterval = 8.0f;

        [Header("Stage Spotlight Control")]
        public Light[] stageSpotlights;
        public Color spotlightColor = Color.white;
        [Range(0f, 5000f)] public float spotlightIntensity = 2500f;
        public bool enableSpotlights = true;

        [Header("Ceiling Downlights")]
        public Light[] ceilingDownlights;
        [Range(0f, 2000f)] public float ceilingIntensity = 1200f;
        public Color ceilingWarmth = new Color(1f, 0.92f, 0.8f);

        [Header("Ceiling Fans Animation")]
        public Transform[] fanBladeTransforms;
        public float fanRotationSpeed = 180f; // degrees / sec
        public bool fansSpinning = true;

        [Header("IoT Telemetry Data")]
        public int currentOccupancy = 42;
        public float temperatureCelsius = 22.5f;
        public float co2LevelPPM = 480f;

        private void Update()
        {
            UpdateLighting();
            AnimateFans();
        }

        public void UpdateLighting()
        {
            if (stageSpotlights != null)
            {
                foreach (var spot in stageSpotlights)
                {
                    if (spot != null)
                    {
                        spot.enabled = enableSpotlights;
                        spot.color = spotlightColor;
                        spot.intensity = spotlightIntensity;
                    }
                }
            }

            if (ceilingDownlights != null)
            {
                foreach (var downlight in ceilingDownlights)
                {
                    if (downlight != null)
                    {
                        downlight.color = ceilingWarmth;
                        downlight.intensity = ceilingIntensity;
                    }
                }
            }
        }

        private void AnimateFans()
        {
            if (fansSpinning && fanBladeTransforms != null)
            {
                float deltaRot = fanRotationSpeed * Time.deltaTime;
                foreach (var fan in fanBladeTransforms)
                {
                    if (fan != null)
                    {
                        fan.Rotate(Vector3.up, deltaRot, Space.Self);
                    }
                }
            }
        }

        public void NextSlide()
        {
            if (presentationSlides == null || presentationSlides.Length == 0) return;
            currentSlideIndex = (currentSlideIndex + 1) % presentationSlides.Length;
            ApplySlideTexture();
        }

        public void ApplySlideTexture()
        {
            if (stageScreenRenderer != null && presentationSlides.Length > currentSlideIndex)
            {
                stageScreenRenderer.sharedMaterial.mainTexture = presentationSlides[currentSlideIndex];
            }
        }
    }
}
`;
}

export function generateUnityImportGuide(): string {
  return `# Unity Scene Import Guide - Seminar Hall Digital Twin

## Step 1: Download Asset Package
1. Click **"Download 3D Model (.GLB)"** in the top bar to export the binary glTF file.
2. Ensure you have the **glTFast** package or **Unity GLTFast / UniGLTF** installed via Unity Package Manager:
   - Window > Package Manager > Add package from git URL: \`https://github.com/atteneder/glTFast.git\`

## Step 2: Import into Unity Project
1. Drag \`SeminarHall_DigitalTwin.glb\` into your Unity \`Assets/Models/\` folder.
2. Unity will automatically parse all PBR Materials:
   - **Metallic-Roughness Workflow** (Standard Shader or URP Lit Shader)
   - **Wood Paneling Normal & Roughness Maps**
   - **Ceramic Tile Floor PBR Reflections**
   - **Geometric Acoustic Triangle Wall Textures**

## Step 3: Attach the Controller Script
1. Drag \`SeminarHallController.cs\` onto the imported \`SeminarHall_DigitalTwin\` GameObject.
2. Assign the stage screen mesh renderer and stage lights in the Inspector panel.
3. Call \`SeminarHallController.NextSlide()\` or update lighting parameters dynamically at runtime!
`;
}
