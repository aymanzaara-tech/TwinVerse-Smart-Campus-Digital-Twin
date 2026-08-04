export const sampleApiSnippet = `// Seminar Hall Digital Twin Web JS API Example
import { DigitalTwinClient } from '@hall-twin/sdk';

const hall = new DigitalTwinClient({ endpoint: window.location.origin + '/api' });

// 1. Configure Stage Spotlights for Keynote Presentation
await hall.setLighting({
  stageSpotlightsEnabled: true,
  spotlightIntensity: 3.5,
  spotlightColor: '#38bdf8', // Cool Cyan
  ceilingIntensity: 0.6
});

// 2. Switch Presentation Screen Slide
await hall.setSlide(2);

// 3. Pan Camera to Stage View
await hall.moveCamera('stage');

// 4. Query Real-Time IoT Telemetry
const telemetry = await hall.getTelemetry();
console.log('Current Hall Occupancy:', telemetry.occupancy);
console.log('Room Temperature:', telemetry.temperature, '°C');
`;
