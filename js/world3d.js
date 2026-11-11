// 佛光大學 應用科技與設計學院 — 3D 溫暖微縮模型城市世界引擎
// 支援：晝夜黃昏切換、星空、落櫻蒲公英微粒、巡航小船、夜間透光

class World3D {
  constructor(container, callbacks = {}) {
    this.container = container;
    this.callbacks = callbacks; // onSelectIsland, onSelectMayor, onSelectVillager, onSelectNote, onSelectChest, onHoverChange

    this.scene = null;
    this.camera = null;
    this.renderer = null;
    this.controls = null;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();

    // 互動實體清單
    this.interactiveObjects = [];
    this.hoveredObject = null;

    // 光源參照
    this.ambientLight = null;
    this.sunLight = null;
    this.rimLight = null;
    this.nightLights = [];
    this.timeOfDay = 'day'; // day, sunset, night

    // 特效物體
    this.starPoints = null;
    this.blossomPoints = null;
    this.origamiBoat = null;
    this.floatingClouds = [];
    this.animatedWater = null;

    // 動畫補間控制
    this.cameraTargetPos = null;
    this.controlsTargetPos = null;
    this.isTransitioning = false;
    this.animTime = 0;

    this.init();
  }

  init() {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;

    // 1. 場景
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0xF0F9FF);
    this.scene.fog = new THREE.FogExp2(0xF0F9FF, 0.012);

    // 2. 攝影機
    this.camera = new THREE.PerspectiveCamera(42, width / height, 0.5, 350);
    this.camera.position.set(0, 36, 44);

    // 3. 渲染器
    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    this.renderer.setSize(width, height);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.05;
    this.container.appendChild(this.renderer.domElement);

    // 4. 鏡頭軌道控制
    const ControlsClass = THREE.OrbitControls || window.OrbitControls;
    this.controls = new ControlsClass(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.06;
    this.controls.maxPolarAngle = Math.PI / 2 - 0.05;
    this.controls.minDistance = 8;
    this.controls.maxDistance = 95;
    this.controls.target.set(0, 1.5, 0);

    // 5. 溫暖光影系統
    this.setupLighting();

    // 6. 水面
    this.createWaterPlane();

    // 7. 建造五大六角群島
    this.buildIslands();

    // 8. 微縮環境特效：星空、蒲公英粒子、巡航小船
    this.createStarField();
    this.createBlossomParticles();
    this.createOrigamiBoat();
    this.createClouds();

    // 9. 事件監聽
    this.setupEvents();

    // 10. 開始循環
    this.animate();
  }

  setupLighting() {
    this.ambientLight = new THREE.AmbientLight(0xFFFBEB, 0.7);
    this.scene.add(this.ambientLight);

    this.sunLight = new THREE.DirectionalLight(0xFEF3C7, 1.2);
    this.sunLight.position.set(30, 48, 25);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 2048;
    this.sunLight.shadow.mapSize.height = 2048;
    this.sunLight.shadow.camera.near = 10;
    this.sunLight.shadow.camera.far = 120;
    this.sunLight.shadow.camera.left = -45;
    this.sunLight.shadow.camera.right = 45;
    this.sunLight.shadow.camera.top = 45;
    this.sunLight.shadow.camera.bottom = -45;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);

    this.rimLight = new THREE.DirectionalLight(0xBAE6FD, 0.45);
    this.rimLight.position.set(-25, 20, -30);
    this.scene.add(this.rimLight);
  }

  // 晝夜黃昏光影平滑切換
  setTimeOfDay(mode) {
    this.timeOfDay = mode;
    let targetBg, targetFog, targetSunColor, targetSunIntensity, targetSunPos, isNight;

    if (mode === 'day') {
      targetBg = new THREE.Color(0xF0F9FF);
      targetFog = 0.012;
      targetSunColor = new THREE.Color(0xFEF3C7);
      targetSunIntensity = 1.2;
      targetSunPos = new THREE.Vector3(30, 48, 25);
      isNight = false;
    } else if (mode === 'sunset') {
      targetBg = new THREE.Color(0xFDE68A); // 暖橙黃昏
      targetFog = 0.014;
      targetSunColor = new THREE.Color(0xFB923C); // 晚霞暖橘
      targetSunIntensity = 1.35;
      targetSunPos = new THREE.Vector3(45, 22, 15);
      isNight = false;
    } else if (mode === 'night') {
      targetBg = new THREE.Color(0x090D1A); // 深邃星夜
      targetFog = 0.015;
      targetSunColor = new THREE.Color(0x38BDF8); // 清冷月光
      targetSunIntensity = 0.4;
      targetSunPos = new THREE.Vector3(-20, 35, -20);
      isNight = true;
    }

    // 漸層過渡
    this.scene.background.copy(targetBg);
    this.scene.fog.color.copy(targetBg);
    this.scene.fog.density = targetFog;
    this.sunLight.color.copy(targetSunColor);
    this.sunLight.intensity = targetSunIntensity;
    this.sunLight.position.copy(targetSunPos);

    if (this.starPoints) {
      this.starPoints.visible = isNight;
    }

    // 切換夜間發光路燈與窗光
    this.nightLights.forEach(item => {
      if (item.material) {
        item.material.emissiveIntensity = isNight ? 1.0 : (mode === 'sunset' ? 0.35 : 0.0);
      }
    });
  }

  createStarField() {
    const starCount = 350;
    const starGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(starCount * 3);

    for (let i = 0; i < starCount; i++) {
      const radius = 90 + Math.random() * 40;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.random() * Math.PI * 0.45; // 僅在上半球

      positions[i * 3] = radius * Math.sin(phi) * Math.cos(theta);
      positions[i * 3 + 1] = radius * Math.cos(phi) + 10;
      positions[i * 3 + 2] = radius * Math.sin(phi) * Math.sin(theta);
    }

    starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xFEF08A,
      size: 1.2,
      transparent: true,
      opacity: 0.9
    });

    this.starPoints = new THREE.Points(starGeo, starMat);
    this.starPoints.visible = false;
    this.scene.add(this.starPoints);
  }

  createBlossomParticles() {
    const pCount = 120;
    const pGeo = new THREE.BufferGeometry();
    const positions = new Float32Array(pCount * 3);
    const velocities = [];

    for (let i = 0; i < pCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 60;
      positions[i * 3 + 1] = 2 + Math.random() * 18;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
      velocities.push({
        x: (Math.random() - 0.5) * 0.04 + 0.02,
        y: -0.015 - Math.random() * 0.02,
        z: (Math.random() - 0.5) * 0.03,
        seed: Math.random() * 10
      });
    }

    pGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const pMat = new THREE.PointsMaterial({
      color: 0xFECDD3, // 柔粉花瓣色
      size: 0.8,
      transparent: true,
      opacity: 0.85
    });

    this.blossomPoints = new THREE.Points(pGeo, pMat);
    this.blossomPoints.userData = { velocities: velocities, count: pCount };
    this.scene.add(this.blossomPoints);
  }

  createOrigamiBoat() {
    const boatGroup = new THREE.Group();
    const paperMat = new THREE.MeshStandardMaterial({
      color: 0xFFFBEB,
      roughness: 0.4,
      flatShading: true
    });
    const flagMat = new THREE.MeshStandardMaterial({ color: 0xFB7185 });

    // 折紙船體
    const hullGeo = new THREE.ConeGeometry(0.8, 2.2, 4);
    const hull = new THREE.Mesh(hullGeo, paperMat);
    hull.rotation.z = Math.PI / 2;
    hull.rotation.y = Math.PI / 4;
    hull.scale.set(0.6, 1.2, 0.4);
    hull.castShadow = true;
    boatGroup.add(hull);

    // 桅杆與小旗幟
    const mast = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 1.2, 4), paperMat);
    mast.position.y = 0.6;
    boatGroup.add(mast);

    const flag = new THREE.Mesh(new THREE.BufferGeometry(), flagMat);
    const vertices = new Float32Array([0, 0.9, 0,  0.5, 0.75, 0,  0, 0.6, 0]);
    flag.geometry.setAttribute('position', new THREE.BufferAttribute(vertices, 3));
    boatGroup.add(flag);

    boatGroup.position.set(0, -0.9, 28);
    this.scene.add(boatGroup);
    this.origamiBoat = boatGroup;
  }

  createWaterPlane() {
    const waterGeo = new THREE.CircleGeometry(95, 64);
    const waterMat = new THREE.MeshStandardMaterial({
      color: 0xBAE6FD,
      roughness: 0.15,
      metalness: 0.1,
      transparent: true,
      opacity: 0.88
    });
    const water = new THREE.Mesh(waterGeo, waterMat);
    water.rotation.x = -Math.PI / 2;
    water.position.y = -1.2;
    water.receiveShadow = true;
    this.scene.add(water);
    this.animatedWater = water;
  }

  createClouds() {
    const cloudMat = new THREE.MeshStandardMaterial({
      color: 0xFFFFFF,
      roughness: 0.9,
      metalness: 0.0,
      flatShading: true
    });

    const cloudPositions = [
      [-28, 14, -20],
      [26, 12, -22],
      [-24, 15, 22],
      [28, 13, 20],
      [0, 16, -30]
    ];

    cloudPositions.forEach((pos, idx) => {
      const cloudGroup = new THREE.Group();
      const count = 3 + (idx % 2);
      for (let i = 0; i < count; i++) {
        const r = 1.2 + Math.random() * 0.8;
        const sphere = new THREE.Mesh(new THREE.DodecahedronGeometry(r, 1), cloudMat);
        sphere.position.set((i - 1) * 1.3, (Math.random() - 0.5) * 0.5, (Math.random() - 0.5) * 0.8);
        cloudGroup.add(sphere);
      }
      cloudGroup.position.set(...pos);
      this.scene.add(cloudGroup);
      this.floatingClouds.push({
        group: cloudGroup,
        initialY: pos[1],
        speed: 0.2 + idx * 0.05,
        offset: idx * 1.5
      });
    });
  }

  buildIslands() {
    window.ISLANDS_DATA.forEach(island => {
      const islandGroup = new THREE.Group();
      islandGroup.position.set(...island.coords);
      islandGroup.userData = { type: 'island', islandId: island.id, islandData: island };

      this.createHexBase(islandGroup, island);
      this.createIslandTerrain(islandGroup, island);
      this.createIslandLandmarks(islandGroup, island);
      this.createIslandDecorations(islandGroup, island);

      this.scene.add(islandGroup);
    });
  }

  createHexBase(group, island) {
    const radius = island.hexRadius;
    const height = 2.4;

    const baseGeo = new THREE.CylinderGeometry(radius * 0.95, radius * 0.8, height, 6);
    const baseMat = new THREE.MeshStandardMaterial({ color: 0xCBD5E1, roughness: 0.85, flatShading: true });
    const baseMesh = new THREE.Mesh(baseGeo, baseMat);
    baseMesh.position.y = -height / 2;
    baseMesh.castShadow = true;
    baseMesh.receiveShadow = true;
    group.add(baseMesh);

    const topGeo = new THREE.CylinderGeometry(radius, radius * 0.96, 0.6, 6);
    const topMat = new THREE.MeshStandardMaterial({ color: island.color, roughness: 0.6, metalness: 0.05 });
    const topMesh = new THREE.Mesh(topGeo, topMat);
    topMesh.position.y = 0.3;
    topMesh.castShadow = true;
    topMesh.receiveShadow = true;
    topMesh.userData = { type: 'island_clickable', islandId: island.id, islandCoords: island.coords };
    this.interactiveObjects.push(topMesh);
    group.add(topMesh);

    const innerGeo = new THREE.CylinderGeometry(radius * 0.88, radius * 0.88, 0.15, 6);
    const innerMat = new THREE.MeshStandardMaterial({ color: 0xFEFCE8, roughness: 0.75 });
    const innerMesh = new THREE.Mesh(innerGeo, innerMat);
    innerMesh.position.y = 0.65;
    innerMesh.receiveShadow = true;
    group.add(innerMesh);
  }

  createIslandTerrain(group, island) {
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xF1F5F9, roughness: 0.9 });
    for (let i = 0; i < 3; i++) {
      const pathGeo = new THREE.BoxGeometry(0.8, 0.04, island.hexRadius * 1.5);
      const path = new THREE.Mesh(pathGeo, pathMat);
      path.rotation.y = (i * Math.PI) / 3;
      path.position.y = 0.73;
      path.receiveShadow = true;
      group.add(path);
    }
  }

  createIslandLandmarks(group, island) {
    const matWood = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.8 });
    const matWhite = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.5 });
    const matRoof = new THREE.MeshStandardMaterial({ color: island.color, roughness: 0.5 });
    const matGold = new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.3, roughness: 0.3 });
    const matGlass = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.1, transparent: true, opacity: 0.75 });

    // 夜間窗戶發光材質
    const glowWindowMat = new THREE.MeshStandardMaterial({
      color: 0xFEF08A,
      emissive: 0xF59E0B,
      emissiveIntensity: 0.0
    });
    this.nightLights.push(glowWindowMat);

    if (island.id === 'central') {
      const towerBase = new THREE.Mesh(new THREE.BoxGeometry(2.4, 4.5, 2.4), matWhite);
      towerBase.position.set(0, 3, -1.5);
      towerBase.castShadow = true;
      group.add(towerBase);

      // 鐘樓四面窗格
      for (let w = 0; w < 4; w++) {
        const win = new THREE.Mesh(new THREE.PlaneGeometry(0.7, 0.7), glowWindowMat);
        win.rotation.y = w * Math.PI / 2;
        win.position.set(Math.sin(w * Math.PI / 2) * 1.22, 3.8, -1.5 + Math.cos(w * Math.PI / 2) * 1.22);
        group.add(win);
      }

      const roofCone = new THREE.Mesh(new THREE.ConeGeometry(2, 2.2, 4), matRoof);
      roofCone.position.set(0, 6.2, -1.5);
      roofCone.rotation.y = Math.PI / 4;
      roofCone.castShadow = true;
      group.add(roofCone);

      const spire = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.15, 1.4, 8), matGold);
      spire.position.set(0, 7.8, -1.5);
      group.add(spire);

      const fountainRim = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.7, 0.4, 16), matWhite);
      fountainRim.position.set(0, 0.9, 2.2);
      group.add(fountainRim);

      const fountainWater = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.4, 0.3, 16), matGlass);
      fountainWater.position.set(0, 1.0, 2.2);
      group.add(fountainWater);

    } else if (island.id === 'it') {
      const server1 = new THREE.Mesh(new THREE.BoxGeometry(1.8, 4.2, 1.8), matWhite);
      server1.position.set(-1.8, 2.8, -1.5);
      server1.castShadow = true;
      group.add(server1);

      const glowCube = new THREE.Mesh(new THREE.BoxGeometry(2, 0.3, 2), glowWindowMat);
      glowCube.position.set(-1.8, 3.2, -1.5);
      group.add(glowCube);

      const server2 = new THREE.Mesh(new THREE.BoxGeometry(1.5, 3.0, 1.5), matRoof);
      server2.position.set(0.6, 2.2, -2.2);
      server2.castShadow = true;
      group.add(server2);

      const botHouse = new THREE.Mesh(new THREE.BoxGeometry(2, 1.8, 2), matWhite);
      botHouse.position.set(1.5, 1.6, 1.2);
      botHouse.castShadow = true;
      group.add(botHouse);

      const botAntenna = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 1, 8), matGold);
      botAntenna.position.set(1.5, 2.8, 1.2);
      group.add(botAntenna);

    } else if (island.id === 'design') {
      const studio = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 2.2), matWhite);
      studio.position.set(-1.2, 1.8, -1.6);
      studio.castShadow = true;
      group.add(studio);

      const studioRoof = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.4, 2.4), matRoof);
      studioRoof.position.set(-1.2, 3.0, -1.6);
      group.add(studioRoof);

      const pencilBody = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.4, 3.6, 6), matGold);
      pencilBody.position.set(1.8, 2.4, 0.8);
      pencilBody.rotation.z = -0.3;
      pencilBody.rotation.x = 0.2;
      pencilBody.castShadow = true;
      group.add(pencilBody);

      const pencilTip = new THREE.Mesh(new THREE.ConeGeometry(0.4, 0.8, 6), matWood);
      pencilTip.position.set(1.3, 4.2, 0.6);
      pencilTip.rotation.z = -0.3;
      group.add(pencilTip);

      const gem = new THREE.Mesh(new THREE.IcosahedronGeometry(0.8, 0), matRoof);
      gem.position.set(1.4, 1.3, -1.8);
      gem.castShadow = true;
      group.add(gem);

    } else if (island.id === 'comm') {
      const towerLegs = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.9, 4.8, 4), matRoof);
      towerLegs.position.set(-1.6, 3.1, -1.5);
      towerLegs.castShadow = true;
      group.add(towerLegs);

      const redBeacon = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: 0xEF4444 }));
      redBeacon.position.set(-1.6, 5.7, -1.5);
      group.add(redBeacon);

      const screenFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 2.2, 0.3), matWhite);
      screenFrame.position.set(1.5, 2.0, 1.2);
      screenFrame.rotation.y = -0.4;
      screenFrame.castShadow = true;
      group.add(screenFrame);

      const screenFace = new THREE.Mesh(new THREE.PlaneGeometry(2.8, 1.8), new THREE.MeshBasicMaterial({ color: 0x0284C7 }));
      screenFace.position.set(1.44, 2.0, 1.05);
      screenFace.rotation.y = -0.4;
      group.add(screenFace);

    } else if (island.id === 'arch') {
      const columnMat = new THREE.MeshStandardMaterial({ color: 0xB45309, roughness: 0.7 });
      for (let x = -1; x <= 1; x += 2) {
        for (let z = -1; z <= 1; z += 2) {
          const col = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 2.6, 6), columnMat);
          col.position.set(x * 1.4, 2.0, -1.5 + z * 1.2);
          col.castShadow = true;
          group.add(col);
        }
      }

      const roofBeams = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.2, 2.8), columnMat);
      roofBeams.position.set(0, 3.4, -1.5);
      roofBeams.castShadow = true;
      group.add(roofBeams);

      for (let s = 0; s < 3; s++) {
        const step = new THREE.Mesh(new THREE.BoxGeometry(1.8 - s * 0.4, 0.3, 1.2), matRoof);
        step.position.set(1.6, 0.85 + s * 0.25, 1.5 - s * 0.2);
        step.castShadow = true;
        group.add(step);
      }
    }
  }

  createIslandDecorations(group, island) {
    const treeMat = new THREE.MeshStandardMaterial({ color: 0x4ADE80, roughness: 0.9, flatShading: true });
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.9 });

    const treeCoords = [
      [-3.2, 0.7, 1.8],
      [3.0, 0.7, -2.5],
      [-2.8, 0.7, -2.8],
      [2.5, 0.7, 3.2]
    ];

    treeCoords.forEach(([tx, ty, tz], index) => {
      const treeGroup = new THREE.Group();
      treeGroup.position.set(tx, ty, tz);

      const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.16, 0.8, 6), trunkMat);
      trunk.position.y = 0.4;
      trunk.castShadow = true;
      treeGroup.add(trunk);

      if (index % 2 === 0) {
        const foliage = new THREE.Mesh(new THREE.DodecahedronGeometry(0.7 + (index * 0.08), 1), treeMat);
        foliage.position.y = 1.1;
        foliage.castShadow = true;
        treeGroup.add(foliage);
      } else {
        const cone = new THREE.Mesh(new THREE.ConeGeometry(0.7, 1.4, 6), treeMat);
        cone.position.y = 1.2;
        cone.castShadow = true;
        treeGroup.add(cone);
      }

      group.add(treeGroup);
    });

    // 路燈（帶夜間自發光）
    const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
    const lampGlow = new THREE.MeshStandardMaterial({
      color: 0xFEF08A,
      emissive: 0xFEF08A,
      emissiveIntensity: 0.4
    });
    this.nightLights.push(lampGlow);

    const lamp = new THREE.Group();
    lamp.position.set(-0.8, 0.7, 3.0);
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 1.6, 6), lampMat);
    post.position.y = 0.8;
    post.castShadow = true;
    lamp.add(post);

    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lampGlow);
    bulb.position.y = 1.6;
    lamp.add(bulb);
    group.add(lamp);
  }

  registerInteractive(mesh) {
    this.interactiveObjects.push(mesh);
  }

  unregisterInteractive(mesh) {
    const idx = this.interactiveObjects.indexOf(mesh);
    if (idx !== -1) {
      this.interactiveObjects.splice(idx, 1);
    }
  }

  setupEvents() {
    const canvas = this.renderer.domElement;

    canvas.addEventListener('pointermove', (e) => {
      const rect = canvas.getBoundingClientRect();
      this.mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
      this.mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      let found = null;
      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData?.type && obj.parent) {
          obj = obj.parent;
        }
        if (obj && obj.userData?.type) {
          found = obj;
        }
      }

      if (this.hoveredObject !== found) {
        this.hoveredObject = found;
        canvas.style.cursor = found ? 'pointer' : 'default';
        if (this.callbacks.onHoverChange) {
          this.callbacks.onHoverChange(found ? found.userData : null);
        }
      }
    });

    canvas.addEventListener('click', (e) => {
      this.raycaster.setFromCamera(this.mouse, this.camera);
      const intersects = this.raycaster.intersectObjects(this.interactiveObjects, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj && !obj.userData?.type && obj.parent) {
          obj = obj.parent;
        }

        if (obj && obj.userData) {
          const data = obj.userData;
          if (data.type === 'mayor' && this.callbacks.onSelectMayor) {
            this.callbacks.onSelectMayor(data.mayorData, data.islandData);
          } else if (data.type === 'villager' && this.callbacks.onSelectVillager) {
            this.callbacks.onSelectVillager(data.villagerData);
          } else if (data.type === 'study_note' && this.callbacks.onSelectNote) {
            this.callbacks.onSelectNote(data.noteData);
          } else if (data.type === 'treasure_chest' && this.callbacks.onSelectChest) {
            this.callbacks.onSelectChest(data.chestData, obj);
          } else if (data.type === 'island_clickable') {
            if (this.callbacks.onSelectIsland) {
              this.callbacks.onSelectIsland(data.islandId);
            }
            if (this.callbacks.onIslandGroundClick) {
              const hitPoint = intersects[0].point;
              this.callbacks.onIslandGroundClick(hitPoint, data.islandId);
            }
          }
        }
      }
    });

    window.addEventListener('resize', () => {
      if (!this.container) return;
      const w = this.container.clientWidth;
      const h = this.container.clientHeight;
      this.camera.aspect = w / h;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(w, h);
    });
  }

  focusIsland(islandId) {
    const island = window.ISLANDS_DATA.find(i => i.id === islandId);
    if (!island) return;

    const [ix, iy, iz] = island.coords;
    this.cameraTargetPos = new THREE.Vector3(ix, iy + 16, iz + 18);
    this.controlsTargetPos = new THREE.Vector3(ix, iy + 1.2, iz);
    this.isTransitioning = true;
  }

  resetOverview() {
    this.cameraTargetPos = new THREE.Vector3(0, 36, 44);
    this.controlsTargetPos = new THREE.Vector3(0, 1.5, 0);
    this.isTransitioning = true;
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    this.animTime += 0.016;

    if (this.isTransitioning && this.cameraTargetPos && this.controlsTargetPos) {
      this.camera.position.lerp(this.cameraTargetPos, 0.06);
      this.controls.target.lerp(this.controlsTargetPos, 0.06);

      if (this.camera.position.distanceTo(this.cameraTargetPos) < 0.2 &&
          this.controls.target.distanceTo(this.controlsTargetPos) < 0.2) {
        this.camera.position.copy(this.cameraTargetPos);
        this.controls.target.copy(this.controlsTargetPos);
        this.isTransitioning = false;
      }
    }

    this.controls.update();

    // 雲朵慢速漂浮
    this.floatingClouds.forEach(cloud => {
      cloud.group.position.x += Math.sin(this.animTime * cloud.speed + cloud.offset) * 0.015;
      cloud.group.position.y = cloud.initialY + Math.sin(this.animTime * 0.8 + cloud.offset) * 0.3;
    });

    // 水面微幅呼吸
    if (this.animatedWater) {
      this.animatedWater.position.y = -1.2 + Math.sin(this.animTime * 1.2) * 0.06;
    }

    // 蒲公英/落花粒子飄舞
    if (this.blossomPoints) {
      const posAttr = this.blossomPoints.geometry.attributes.position;
      const vels = this.blossomPoints.userData.velocities;
      const count = this.blossomPoints.userData.count;
      for (let i = 0; i < count; i++) {
        let px = posAttr.getX(i);
        let py = posAttr.getY(i);
        let pz = posAttr.getZ(i);

        px += Math.sin(this.animTime + vels[i].seed) * 0.03 + vels[i].x;
        py += vels[i].y;
        pz += Math.cos(this.animTime + vels[i].seed) * 0.03 + vels[i].z;

        if (py < -0.5) {
          py = 18;
          px = (Math.random() - 0.5) * 60;
          pz = (Math.random() - 0.5) * 60;
        }

        posAttr.setXYZ(i, px, py, pz);
      }
      posAttr.needsUpdate = true;
    }

    // 折紙小船巡航環遊群島
    if (this.origamiBoat) {
      const radius = 32;
      const boatSpeed = this.animTime * 0.15;
      this.origamiBoat.position.x = Math.cos(boatSpeed) * radius;
      this.origamiBoat.position.z = Math.sin(boatSpeed) * radius;
      this.origamiBoat.rotation.y = -boatSpeed + Math.PI / 2;
      this.origamiBoat.position.y = -0.9 + Math.sin(this.animTime * 2.5) * 0.05;
      this.origamiBoat.rotation.z = Math.sin(this.animTime * 2.5) * 0.06;
    }

    if (this.onFrameUpdate) {
      this.onFrameUpdate(this.animTime);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

window.World3D = World3D;
