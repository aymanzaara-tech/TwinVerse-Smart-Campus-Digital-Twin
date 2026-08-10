export type CameraPreset = 'overview' | 'stage' | 'back' | 'podium' | 'entrance' | 'chair_view' | 'top_down';

export type CameraMode = 'orbit' | 'first_person';

export interface LightConfig {
  ceilingWarmth: number; // 2700K to 6500K equivalent
  ceilingIntensity: number; // 0 to 2
  stageSpotlightsEnabled: boolean;
  spotlightIntensity: number;
  spotlightColor: string;
  ambientIntensity: number;
  sunlightIntensity: number;
  timeOfDay: number; // 0 to 24 (hours)
}

export interface MaterialConfig {
  showPlasticCovers: boolean;
  chairBlueColor: string;
  chairGreenColor: string;
  floorRoughness: number;
  floorReflectivity: number;
  woodWallDarkness: number;
  acousticPatternStyle: 'photo_matching' | 'high_contrast' | 'vibrant';
  enableShadows: boolean;
}

export interface ScreenContent {
  type: 'presentation' | 'custom_image' | 'video_feed' | 'off';
  title: string;
  slideIndex: number;
  customImageUrl?: string;
}

export interface IoTSensorData {
  occupancy: number;
  maxCapacity: number;
  temperature: number; // C
  humidity: number; // %
  co2Level: number; // ppm
  noiseLevel: number; // dB
  powerUsage: number; // kW
  airQualityScore: number; // 0-100
}

export interface SelectedObjectInfo {
  name: string;
  category: string;
  position: [number, number, number];
  materials: string[];
  polyCount: number;
  instanceCount?: number;
  status?: string;
}

export interface MeasurePoint {
  x: number;
  y: number;
  z: number;
}
