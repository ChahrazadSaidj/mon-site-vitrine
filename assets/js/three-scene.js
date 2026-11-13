/**
 * THREE.JS 3D BACKGROUND SCENE
 * Interactive Particle Constellation, Floating Geometric Crystals & Parallax Terrain
 * Site Vitrine Liza SAÏDJ
 */

(function () {
  'use strict';

  const container = document.getElementById('webgl-canvas-container');
  if (!container || typeof THREE === 'undefined') return;

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x060d16, 0.0018);

  const camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    1500
  );
  camera.position.set(0, 0, 100);

  const renderer = new THREE.WebGLRenderer({
    alpha: true,
    antialias: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.domElement.id = 'threejs-canvas';
  container.appendChild(renderer.domElement);

  // --- Particle Constellation ---
  const particleCount = window.innerWidth < 768 ? 450 : 900;
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(particleCount * 3);
  const colors = new Float32Array(particleCount * 3);
  const sizes = new Float32Array(particleCount);

  const colorPalette = [
    new THREE.Color(0x10b981), // Emerald
    new THREE.Color(0x34d399), // Light emerald
    new THREE.Color(0xf59e0b), // Gold
    new THREE.Color(0x059669), // Deep green
    new THREE.Color(0x38bdf8), // Soft sky blue
  ];

  for (let i = 0; i < particleCount; i++) {
    // Spread in a large volume
    positions[i * 3] = (Math.random() - 0.5) * 800;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 600;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 600;

    const chosenColor = colorPalette[Math.floor(Math.random() * colorPalette.length)];
    colors[i * 3] = chosenColor.r;
    colors[i * 3 + 1] = chosenColor.g;
    colors[i * 3 + 2] = chosenColor.b;

    sizes[i] = Math.random() * 4 + 1.5;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  // Custom circular particle texture via canvas
  function createParticleTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext('2d');
    const grad = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.3, 'rgba(52, 211, 153, 0.8)');
    grad.addColorStop(0.7, 'rgba(16, 185, 129, 0.2)');
    grad.addColorStop(1, 'rgba(0, 0, 0, 0)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 64, 64);
    return new THREE.CanvasTexture(canvas);
  }

  const pMaterial = new THREE.PointsMaterial({
    size: 5,
    vertexColors: true,
    map: createParticleTexture(),
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const particleSystem = new THREE.Points(geometry, pMaterial);
  scene.add(particleSystem);

  // --- Floating 3D Polyhedra (Crystals of Hope & Youth) ---
  const crystals = [];
  const crystalCount = 8;
  const polyGeometries = [
    new THREE.IcosahedronGeometry(6, 0),
    new THREE.OctahedronGeometry(5, 0),
    new THREE.TetrahedronGeometry(7, 0)
  ];

  for (let i = 0; i < crystalCount; i++) {
    const geom = polyGeometries[i % polyGeometries.length];
    const wireMat = new THREE.MeshBasicMaterial({
      color: i % 2 === 0 ? 0x10b981 : 0xfbbf24,
      wireframe: true,
      transparent: true,
      opacity: 0.35
    });

    const mesh = new THREE.Mesh(geom, wireMat);
    mesh.position.set(
      (Math.random() - 0.5) * 350,
      (Math.random() - 0.5) * 250,
      (Math.random() - 0.5) * 200
    );
    mesh.rotationSpeed = {
      x: (Math.random() - 0.5) * 0.015,
      y: (Math.random() - 0.5) * 0.015
    };
    mesh.floatSpeed = 0.001 + Math.random() * 0.0015;
    mesh.initialY = mesh.position.y;
    crystals.push(mesh);
    scene.add(mesh);
  }

  // --- Djurdjura Mountains Wireframe Wave Grid ---
  const terrainGeo = new THREE.PlaneGeometry(800, 500, 40, 30);
  const posAttr = terrainGeo.attributes.position;
  for (let i = 0; i < posAttr.count; i++) {
    const x = posAttr.getX(i);
    const y = posAttr.getY(i);
    // Mountain waves
    const z = Math.sin(x * 0.015) * Math.cos(y * 0.015) * 35 +
              Math.sin(x * 0.03 + 1) * 15;
    posAttr.setZ(i, z);
  }
  terrainGeo.computeVertexNormals();

  const terrainMat = new THREE.MeshBasicMaterial({
    color: 0x065f46,
    wireframe: true,
    transparent: true,
    opacity: 0.16
  });
  const terrain = new THREE.Mesh(terrainGeo, terrainMat);
  terrain.rotation.x = -Math.PI / 2.3;
  terrain.position.set(0, -180, -150);
  scene.add(terrain);

  // --- Mouse & Scroll Tracking ---
  let targetMouseX = 0;
  let targetMouseY = 0;
  let currentMouseX = 0;
  let currentMouseY = 0;

  window.addEventListener('mousemove', function (e) {
    targetMouseX = (e.clientX - window.innerWidth / 2) * 0.05;
    targetMouseY = (e.clientY - window.innerHeight / 2) * 0.05;
  });

  let scrollY = 0;
  window.addEventListener('scroll', function () {
    scrollY = window.scrollY;
  });

  // --- Animation Loop ---
  let clock = new THREE.Clock();

  function animate() {
    requestAnimationFrame(animate);

    const elapsedTime = clock.getElapsedTime();

    // Smooth mouse interpolation
    currentMouseX += (targetMouseX - currentMouseX) * 0.05;
    currentMouseY += (targetMouseY - currentMouseY) * 0.05;

    // Slowly rotate constellation
    particleSystem.rotation.y = elapsedTime * 0.03 + currentMouseX * 0.002;
    particleSystem.rotation.x = Math.sin(elapsedTime * 0.02) * 0.05 + currentMouseY * 0.002;

    // Rotate crystals
    crystals.forEach((crystal, idx) => {
      crystal.rotation.x += crystal.rotationSpeed.x;
      crystal.rotation.y += crystal.rotationSpeed.y;
      crystal.position.y = crystal.initialY + Math.sin(elapsedTime * 1.5 + idx) * 8;
    });

    // Wave terrain
    terrain.position.z = -150 + Math.sin(elapsedTime * 0.3) * 10;

    // Camera responds to scroll and mouse
    camera.position.x = currentMouseX * 0.5;
    camera.position.y = -scrollY * 0.06 - currentMouseY * 0.3;

    renderer.render(scene, camera);
  }

  animate();

  // Resize handler
  window.addEventListener('resize', function () {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  });
})();
