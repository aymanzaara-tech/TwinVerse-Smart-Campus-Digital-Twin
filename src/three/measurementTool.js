import * as THREE from 'three';

export class MeasurementManager {
  constructor(scene) {
    this.scene = scene;
    this.state = {
      pointA: null,
      pointB: null,
      distanceMeters: null,
      lineMesh: null,
      markerA: null,
      markerB: null,
    };
    this.markerGeo = new THREE.SphereGeometry(0.08, 16, 16);
    this.markerMat = new THREE.MeshBasicMaterial({ color: 0xef4444 });
  }

  addPoint(pos) {
    const point = { x: pos.x, y: pos.y, z: pos.z };

    if (!this.state.pointA || (this.state.pointA && this.state.pointB)) {
      this.clear();
      this.state.pointA = point;

      const marker = new THREE.Mesh(this.markerGeo, this.markerMat);
      marker.position.set(pos.x, pos.y, pos.z);
      this.scene.add(marker);
      this.state.markerA = marker;
    } else {
      this.state.pointB = point;

      const marker = new THREE.Mesh(this.markerGeo, this.markerMat);
      marker.position.set(pos.x, pos.y, pos.z);
      this.scene.add(marker);
      this.state.markerB = marker;

      const vecA = new THREE.Vector3(this.state.pointA.x, this.state.pointA.y, this.state.pointA.z);
      const vecB = new THREE.Vector3(this.state.pointB.x, this.state.pointB.y, this.state.pointB.z);

      const lineGeo = new THREE.BufferGeometry().setFromPoints([vecA, vecB]);
      const lineMat = new THREE.LineDashedMaterial({
        color: 0xf59e0b,
        dashSize: 0.1,
        gapSize: 0.05,
        linewidth: 3,
      });

      const line = new THREE.Line(lineGeo, lineMat);
      line.computeLineDistances();
      this.scene.add(line);
      this.state.lineMesh = line;

      this.state.distanceMeters = vecA.distanceTo(vecB);
    }

    return this.getState();
  }

  clear() {
    if (this.state.markerA) this.scene.remove(this.state.markerA);
    if (this.state.markerB) this.scene.remove(this.state.markerB);
    if (this.state.lineMesh) this.scene.remove(this.state.lineMesh);

    this.state = {
      pointA: null,
      pointB: null,
      distanceMeters: null,
      lineMesh: null,
      markerA: null,
      markerB: null,
    };
  }

  getState() {
    return { ...this.state };
  }
}
