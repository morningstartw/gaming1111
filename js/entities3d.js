// 佛光大學 應用科技與設計學院 — 3D 島長、混合動物精靈、學習便利貼、大學生角色與金色寶箱實體生成器

// 建立文字懸浮 Sprite (名牌或提示氣泡)
function createTextSprite(text, bgColor = 'rgba(255, 255, 255, 0.95)', textColor = '#1E293B', borderColor = '#F59E0B') {
  const canvas = document.createElement('canvas');
  canvas.width = 384;
  canvas.height = 96;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = bgColor;
  ctx.strokeStyle = borderColor;
  ctx.lineWidth = 6;
  const r = 24;
  const x = 12, y = 12, w = canvas.width - 24, h = canvas.height - 24;

  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = bgColor;
  ctx.beginPath();
  ctx.moveTo(canvas.width / 2 - 14, y + h);
  ctx.lineTo(canvas.width / 2, y + h + 10);
  ctx.lineTo(canvas.width / 2 + 14, y + h);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = textColor;
  ctx.font = 'bold 36px "Noto Sans TC", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  const spriteMat = new THREE.SpriteMaterial({ map: texture, transparent: true, depthWrite: false });
  const sprite = new THREE.Sprite(spriteMat);
  sprite.scale.set(3.2, 0.8, 1);
  return sprite;
}

// 建立 3D 大學生冒險偶人角色
function createStudentPlayer3D(world) {
  const group = new THREE.Group();
  group.position.set(0, 0.7, 3.2); // 初始生成在中央島廣場

  const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFEDB8, roughness: 0.6 });
  const shirtMat = new THREE.MeshStandardMaterial({ color: 0x38BDF8, roughness: 0.7 }); // 蔚藍色系T恤
  const pantsMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.8 }); // 深灰牛仔褲
  const capMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.5 });   // 暖黃棒球帽
  const packMat = new THREE.MeshStandardMaterial({ color: 0xFB7185, roughness: 0.7 });  // 珊瑚紅小後背包
  const eyeMat = new THREE.MeshBasicMaterial({ color: 0x0F172A });

  // 1. 身體
  const body = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.55, 0.35), shirtMat);
  body.position.y = 0.55;
  body.castShadow = true;
  group.add(body);

  // 2. 頭部
  const head = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.42, 0.42), skinMat);
  head.position.y = 1.05;
  head.castShadow = true;
  group.add(head);

  // 3. 雙眼
  for (let s = -1; s <= 1; s += 2) {
    const eye = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.08, 0.02), eyeMat);
    eye.position.set(s * 0.12, 1.08, 0.22);
    group.add(eye);
  }

  // 4. 棒球帽
  const cap = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.14, 0.46), capMat);
  cap.position.y = 1.28;
  group.add(cap);

  const brim = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.04, 0.25), capMat);
  brim.position.set(0, 1.22, 0.32);
  group.add(brim);

  // 5. 小後背包
  const backpack = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.42, 0.2), packMat);
  backpack.position.set(0, 0.56, -0.24);
  backpack.castShadow = true;
  group.add(backpack);

  // 6. 雙腿（可作走路前後擺動動畫）
  const legLeft = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.2), pantsMat);
  legLeft.position.set(-0.14, 0.19, 0);
  legLeft.castShadow = true;
  group.add(legLeft);

  const legRight = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.38, 0.2), pantsMat);
  legRight.position.set(0.14, 0.19, 0);
  legRight.castShadow = true;
  group.add(legRight);

  // 7. 專注番茄鐘學習光環（Halo，平時隱藏）
  const haloGeo = new THREE.TorusGeometry(0.35, 0.04, 8, 24);
  const haloMat = new THREE.MeshBasicMaterial({ color: 0xFDE047, transparent: true, opacity: 0.9 });
  const halo = new THREE.Mesh(haloGeo, haloMat);
  halo.rotation.x = Math.PI / 2;
  halo.position.set(0, 1.55, 0);
  halo.visible = false;
  group.add(halo);

  // 8. 玩家頭頂標籤
  const nameSprite = createTextSprite('🎒 登島同學 (你)', 'rgba(255, 255, 255, 0.92)', '#0369A1', '#38BDF8');
  nameSprite.position.set(0, 1.9, 0);
  nameSprite.scale.set(2.4, 0.6, 1);
  group.add(nameSprite);

  group.userData = {
    type: 'player',
    legLeft: legLeft,
    legRight: legRight,
    halo: halo,
    speed: 0.16,
    isWalking: false,
    walkTime: 0
  };

  return group;
}

// 建立 3D 金色探索寶箱
function createTreasureChest3D(chestData, world) {
  const group = new THREE.Group();
  const [cx, cy, cz] = chestData.coords;
  group.position.set(cx, cy, cz);

  const goldMat = new THREE.MeshStandardMaterial({
    color: 0xF59E0B,
    metalness: 0.6,
    roughness: 0.25
  });
  const darkWoodMat = new THREE.MeshStandardMaterial({ color: 0x78350F, roughness: 0.8 });
  const glowMat = new THREE.MeshBasicMaterial({ color: 0xFEF08A, wireframe: true });

  // 1. 箱體本體
  const chestBase = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.5, 0.6), darkWoodMat);
  chestBase.position.y = 0.25;
  chestBase.castShadow = true;
  group.add(chestBase);

  // 金色包邊
  const rim = new THREE.Mesh(new THREE.BoxGeometry(0.94, 0.1, 0.64), goldMat);
  rim.position.y = 0.46;
  group.add(rim);

  // 2. 箱蓋（鉸鏈旋轉軸點）
  const lidGroup = new THREE.Group();
  lidGroup.position.set(0, 0.5, -0.3); // 後緣旋轉點

  const lidMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.9, 8, 1, false, 0, Math.PI), goldMat);
  lidMesh.rotation.z = Math.PI / 2;
  lidMesh.position.set(0, 0, 0.3);
  lidGroup.add(lidMesh);

  group.add(lidGroup);

  // 3. 旋轉懸浮光芒微晶
  const beacon = new THREE.Mesh(new THREE.OctahedronGeometry(0.2, 0), glowMat);
  beacon.position.y = 1.1;
  group.add(beacon);

  // 4. 懸浮提示標籤
  const sprite = createTextSprite('✨ 探索寶箱', 'rgba(254, 243, 199, 0.95)', '#92400E', '#F59E0B');
  sprite.position.set(0, 1.6, 0);
  sprite.scale.set(2.2, 0.55, 1);
  group.add(sprite);

  group.userData = {
    type: 'treasure_chest',
    chestId: chestData.id,
    chestData: chestData,
    lidGroup: lidGroup,
    beacon: beacon,
    sprite: sprite,
    isOpen: false,
    baseY: cy
  };

  world.registerInteractive(group);
  return group;
}

// 建立島嶼之間的微縮木質連接橋樑 / 跳石
function createIslandBridges(world) {
  const bridgeGroup = new THREE.Group();
  const woodMat = new THREE.MeshStandardMaterial({ color: 0xD97706, roughness: 0.75 });
  const ropeMat = new THREE.MeshStandardMaterial({ color: 0x92400E, roughness: 0.9 });

  const connections = [
    { from: [0, 0, 0], to: [-16, 0, -9.5] },
    { from: [0, 0, 0], to: [16, 0, -9.5] },
    { from: [0, 0, 0], to: [-16, 0, 14] },
    { from: [0, 0, 0], to: [16, 0, 14] }
  ];

  connections.forEach(conn => {
    const vFrom = new THREE.Vector3(...conn.from);
    const vTo = new THREE.Vector3(...conn.to);
    const mid = new THREE.Vector3().addVectors(vFrom, vTo).multiplyScalar(0.5);
    const dist = vFrom.distanceTo(vTo);

    // 在兩島中途鋪設 5-6 塊微縮漂浮木棧跳板
    const steps = 6;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const pos = new THREE.Vector3().lerpVectors(vFrom, vTo, t);
      // 微下垂弧形
      pos.y = -0.3 + Math.sin(t * Math.PI) * 0.4;

      const plank = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.15, 0.9), woodMat);
      plank.position.copy(pos);
      plank.lookAt(vTo);
      plank.castShadow = true;
      bridgeGroup.add(plank);
    }
  });

  world.scene.add(bridgeGroup);
  return bridgeGroup;
}

// 建立 3D 島長模型
function createMayor3D(island, world) {
  const group = new THREE.Group();
  const [ix, iy, iz] = island.coords;
  group.position.set(ix, iy + 0.8, iz + 1.2);

  const mayor = island.mayor;
  const mayorColor = new THREE.Color(mayor.color);
  const bodyMat = new THREE.MeshStandardMaterial({ color: mayorColor, roughness: 0.6 });
  const bellyMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.7 });
  const darkMat = new THREE.MeshStandardMaterial({ color: 0x1E293B, roughness: 0.5 });
  const goldMat = new THREE.MeshStandardMaterial({ color: 0xFBBF24, metalness: 0.4, roughness: 0.3 });

  if (island.id === 'central') {
    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.9, 1), bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 12, 12), bellyMat);
    belly.position.set(0, 0.7, 0.55);
    group.add(belly);

    const capBase = new THREE.Mesh(new THREE.CylinderGeometry(0.5, 0.5, 0.25, 8), darkMat);
    capBase.position.set(0, 1.8, 0);
    group.add(capBase);

    const capTop = new THREE.Mesh(new THREE.BoxGeometry(1.4, 0.08, 1.4), darkMat);
    capTop.position.set(0, 1.95, 0);
    capTop.rotation.y = Math.PI / 4;
    group.add(capTop);

    const tassel = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 0.5, 4), goldMat);
    tassel.position.set(0.6, 1.7, 0.4);
    group.add(tassel);

    for (let side = -1; side <= 1; side += 2) {
      const rim = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.03, 8, 16), goldMat);
      rim.position.set(side * 0.25, 1.1, 0.8);
      group.add(rim);
    }
  } else if (island.id === 'it') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(0.9, 1.1, 0.9), bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.9, 0.9), bodyMat);
    head.position.set(0, 1.7, 0.1);
    head.castShadow = true;
    group.add(head);

    for (let s = -1; s <= 1; s += 2) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.5, 4), bodyMat);
      ear.position.set(s * 0.35, 2.3, 0.1);
      ear.rotation.z = -s * 0.3;
      group.add(ear);
    }

    const pack = new THREE.Mesh(new THREE.BoxGeometry(0.7, 0.8, 0.4), new THREE.MeshStandardMaterial({ color: 0x0284C7 }));
    pack.position.set(0, 1.0, -0.6);
    group.add(pack);

    const antenna = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.6, 4), goldMat);
    antenna.position.set(0.2, 1.6, -0.6);
    group.add(antenna);
  } else if (island.id === 'design') {
    const body = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.6, 1.1, 8), bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.ConeGeometry(0.65, 0.9, 5), bodyMat);
    head.position.set(0, 1.65, 0.3);
    head.rotation.x = Math.PI / 2.3;
    group.add(head);

    const beret = new THREE.Mesh(new THREE.CylinderGeometry(0.6, 0.5, 0.2, 12), darkMat);
    beret.position.set(0.1, 2.05, 0.1);
    beret.rotation.z = -0.25;
    group.add(beret);

    const tail = new THREE.Mesh(new THREE.DodecahedronGeometry(0.5, 1), bodyMat);
    tail.position.set(0, 0.6, -0.7);
    group.add(tail);
  } else if (island.id === 'comm') {
    const body = new THREE.Mesh(new THREE.DodecahedronGeometry(0.85, 1), bodyMat);
    body.position.y = 0.9;
    body.castShadow = true;
    group.add(body);

    const crest = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), goldMat);
    crest.position.set(0, 1.9, -0.1);
    crest.rotation.x = -0.3;
    group.add(crest);

    const mic = new THREE.Mesh(new THREE.SphereGeometry(0.15, 8, 8), new THREE.MeshStandardMaterial({ color: 0x94A3B8, metalness: 0.8 }));
    mic.position.set(0, 0.9, 0.9);
    group.add(mic);
  } else if (island.id === 'arch') {
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.2, 1.0, 1.4), bodyMat);
    body.position.y = 0.8;
    body.castShadow = true;
    group.add(body);

    const head = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.8, 0.9), bodyMat);
    head.position.set(0, 1.4, 0.4);
    group.add(head);

    const orange = new THREE.Mesh(new THREE.SphereGeometry(0.24, 8, 8), new THREE.MeshStandardMaterial({ color: 0xF97316 }));
    orange.position.set(0, 1.95, 0.4);
    group.add(orange);

    const leaf = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.02, 0.15), new THREE.MeshStandardMaterial({ color: 0x22C55E }));
    leaf.position.set(0.05, 2.15, 0.4);
    group.add(leaf);
  }

  const bubbleSprite = createTextSprite(`💬 ${mayor.name}`, 'rgba(255, 255, 255, 0.92)', mayor.color, mayor.color);
  bubbleSprite.position.set(0, 2.9, 0);
  group.add(bubbleSprite);

  group.userData = {
    type: 'mayor',
    mayorId: mayor.id,
    mayorData: mayor,
    islandData: island,
    bubbleSprite: bubbleSprite,
    baseY: group.position.y
  };

  world.registerInteractive(group);
  return group;
}

// 建立 3D 動物系混合生物精靈（島民）
function createChimeraSpirit3D(villager, islandCoords, world) {
  const group = new THREE.Group();
  const [vx, vy, vz] = villager.position;
  group.position.set(vx, vy, vz);

  const mainColor = new THREE.Color(villager.color);
  const skinMat = new THREE.MeshStandardMaterial({ color: mainColor, roughness: 0.65 });
  const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.7 });
  const eyeMat = new THREE.MeshStandardMaterial({ color: 0x0F172A, roughness: 0.3 });

  const body = new THREE.Mesh(new THREE.SphereGeometry(0.45, 12, 12), skinMat);
  body.position.y = 0.45;
  body.castShadow = true;
  group.add(body);

  const belly = new THREE.Mesh(new THREE.SphereGeometry(0.28, 8, 8), whiteMat);
  belly.position.set(0, 0.38, 0.28);
  group.add(belly);

  for (let side = -1; side <= 1; side += 2) {
    const eye = new THREE.Mesh(new THREE.SphereGeometry(0.06, 6, 6), eyeMat);
    eye.position.set(side * 0.16, 0.52, 0.4);
    group.add(eye);
  }

  if (villager.head === 'capybara') {
    const muzzle = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.2), whiteMat);
    muzzle.position.set(0, 0.42, 0.42);
    group.add(muzzle);
  } else if (villager.head === 'shiba' || villager.head === 'fox') {
    const snout = new THREE.Mesh(new THREE.ConeGeometry(0.16, 0.26, 4), whiteMat);
    snout.rotation.x = Math.PI / 2;
    snout.position.set(0, 0.44, 0.5);
    group.add(snout);
  } else if (villager.head === 'cat') {
    for (let s = -1; s <= 1; s += 2) {
      const whisker = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.02, 0.02), eyeMat);
      whisker.position.set(s * 0.24, 0.44, 0.4);
      group.add(whisker);
    }
  }

  const animParts = {};

  if (villager.feature === 'wings') {
    const wingMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, transparent: true, opacity: 0.85 });
    animParts.wings = [];
    for (let s = -1; s <= 1; s += 2) {
      const wing = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.03, 0.2), wingMat);
      wing.position.set(s * 0.36, 0.5, -0.2);
      wing.rotation.y = s * 0.4;
      group.add(wing);
      animParts.wings.push({ mesh: wing, side: s });
    }
  } else if (villager.feature === 'antlers') {
    const hornMat = new THREE.MeshStandardMaterial({ color: 0xF59E0B, roughness: 0.4 });
    for (let s = -1; s <= 1; s += 2) {
      const horn = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.06, 0.35, 4), hornMat);
      horn.position.set(s * 0.2, 0.95, 0);
      horn.rotation.z = -s * 0.4;
      group.add(horn);
    }
  } else if (villager.feature === 'cat_ears') {
    for (let s = -1; s <= 1; s += 2) {
      const ear = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.26, 4), skinMat);
      ear.position.set(s * 0.25, 0.92, 0);
      ear.rotation.z = -s * 0.3;
      group.add(ear);
    }
  } else if (villager.feature === 'dino_spikes') {
    const spikeMat = new THREE.MeshStandardMaterial({ color: 0xFB7185 });
    for (let i = 0; i < 3; i++) {
      const spike = new THREE.Mesh(new THREE.ConeGeometry(0.1, 0.2, 3), spikeMat);
      spike.position.set(0, 0.7 - i * 0.18, -0.38 - i * 0.06);
      spike.rotation.x = -Math.PI / 4;
      group.add(spike);
    }
  } else if (villager.feature === 'sprout' || villager.feature === 'lucky_pomelo') {
    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.03, 0.03, 0.25, 4), new THREE.MeshStandardMaterial({ color: 0x22C55E }));
    stem.position.set(0, 0.95, 0);
    group.add(stem);
    const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.12, 6, 6), new THREE.MeshStandardMaterial({ color: 0x4ADE80 }));
    leaf.scale.set(1.5, 0.5, 0.8);
    leaf.position.set(0.1, 1.05, 0);
    group.add(leaf);
  } else if (villager.feature === 'scholar_hat') {
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.45, 0.04, 0.45), new THREE.MeshStandardMaterial({ color: 0x1E293B }));
    cap.position.set(0, 0.96, 0);
    group.add(cap);
  } else if (villager.feature === 'cyber_headphone') {
    const hp = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.04, 6, 16), new THREE.MeshBasicMaterial({ color: 0x38BDF8 }));
    hp.rotation.x = Math.PI / 2;
    hp.position.set(0, 0.6, 0);
    group.add(hp);
  }

  const nameSprite = createTextSprite(`🐾 ${villager.name}`, 'rgba(255, 255, 255, 0.9)', '#1E293B', villager.color);
  nameSprite.position.set(0, 1.45, 0);
  nameSprite.scale.set(2.4, 0.6, 1);
  group.add(nameSprite);

  group.userData = {
    type: 'villager',
    villagerId: villager.id,
    villagerData: villager,
    basePos: [vx, vy, vz],
    animParts: animParts,
    walkAngle: Math.random() * Math.PI * 2,
    walkSpeed: 0.008 + Math.random() * 0.008
  };

  world.registerInteractive(group);
  return group;
}

// 建立 3D 學習便利貼（信封/旗標）
function createStudyNote3D(note, world) {
  const group = new THREE.Group();
  const [nx, ny, nz] = note.coords;
  group.position.set(nx, ny + 0.3, nz);

  const envMat = new THREE.MeshStandardMaterial({ color: 0xFFFBEB, roughness: 0.5 });
  const sealMat = new THREE.MeshStandardMaterial({ color: 0xEF4444, roughness: 0.3 });

  const envelope = new THREE.Mesh(new THREE.BoxGeometry(0.65, 0.45, 0.08), envMat);
  envelope.castShadow = true;
  group.add(envelope);

  const seal = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.04, 8), sealMat);
  seal.rotation.x = Math.PI / 2;
  seal.position.z = 0.05;
  group.add(seal);

  const badgeSprite = createTextSprite(note.badge || '📌 便利貼', 'rgba(254, 243, 199, 0.95)', '#92400E', '#F59E0B');
  badgeSprite.position.set(0, 0.7, 0);
  badgeSprite.scale.set(2.0, 0.5, 1);
  group.add(badgeSprite);

  group.userData = {
    type: 'study_note',
    noteId: note.id,
    noteData: note,
    baseY: group.position.y
  };

  world.registerInteractive(group);
  return group;
}

window.createTextSprite = createTextSprite;
window.createStudentPlayer3D = createStudentPlayer3D;
window.createTreasureChest3D = createTreasureChest3D;
window.createIslandBridges = createIslandBridges;
window.createMayor3D = createMayor3D;
window.createChimeraSpirit3D = createChimeraSpirit3D;
window.createStudyNote3D = createStudyNote3D;
