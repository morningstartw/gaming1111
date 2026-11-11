// 佛光大學 應用科技與設計學院 — 3D 大學生冒險角色控制器 (WASD + 滑鼠尋路 + 鏡頭自動跟隨 + 寶箱互動)

class PlayerController {
  constructor(playerMesh, world, onChestInteract) {
    this.mesh = playerMesh;
    this.world = world;
    this.onChestInteract = onChestInteract;

    this.keys = {
      forward: false,
      backward: false,
      left: false,
      right: false,
      jump: false
    };

    this.targetPos = null; // 滑鼠尋路目標
    this.velocity = new THREE.Vector3();
    this.moveSpeed = 0.16;
    this.isFollowCamera = true; // 預設開啟鏡頭自動跟隨

    // 鄰近寶箱提示
    this.nearbyChest = null;

    this.initEvents();
  }

  initEvents() {
    window.addEventListener('keydown', (e) => {
      const code = e.code;
      const isMoveKey = (
        code === 'KeyW' || code === 'ArrowUp' ||
        code === 'KeyS' || code === 'ArrowDown' ||
        code === 'KeyA' || code === 'ArrowLeft' ||
        code === 'KeyD' || code === 'ArrowRight'
      );

      if (isMoveKey) {
        // 玩家進行操控時自動啟動鏡頭跟隨
        this.enableFollowCamera();
      }

      if (code === 'KeyW' || code === 'ArrowUp') this.keys.forward = true;
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.backward = true;
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = true;
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = true;
      if (code === 'Space') this.keys.jump = true;

      // 按 E 鍵與鄰近寶箱互動
      if (code === 'KeyE') {
        if (this.nearbyChest && this.onChestInteract) {
          this.onChestInteract(this.nearbyChest);
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      const code = e.code;
      if (code === 'KeyW' || code === 'ArrowUp') this.keys.forward = false;
      if (code === 'KeyS' || code === 'ArrowDown') this.keys.backward = false;
      if (code === 'KeyA' || code === 'ArrowLeft') this.keys.left = false;
      if (code === 'KeyD' || code === 'ArrowRight') this.keys.right = false;
      if (code === 'Space') this.keys.jump = false;
    });
  }

  // 開啟鏡頭跟隨並同步介面按鈕狀態
  enableFollowCamera() {
    this.isFollowCamera = true;
    if (window.app && typeof window.app.updateFollowButtonUI === 'function') {
      window.app.updateFollowButtonUI(true);
    }
  }

  // 設定滑鼠點擊尋路目標點
  moveTo(point) {
    this.enableFollowCamera();
    this.targetPos = new THREE.Vector3(point.x, this.mesh.position.y, point.z);
  }

  // 跨島傳送
  teleportToIsland(islandId) {
    const island = window.ISLANDS_DATA.find(i => i.id === islandId);
    if (!island) return;
    const [ix, iy, iz] = island.coords;
    this.mesh.position.set(ix, iy + 0.7, iz + 2.5);
    this.targetPos = null;
    this.velocity.set(0, 0, 0);
    this.enableFollowCamera();
  }

  // 開關視角跟隨
  toggleFollowCamera(enable) {
    this.isFollowCamera = enable !== undefined ? enable : !this.isFollowCamera;
    return this.isFollowCamera;
  }

  // 逐格更新位置與動畫
  update(time, chestList = []) {
    let moveX = 0;
    let moveZ = 0;

    // 鍵盤移動輸入
    if (this.keys.forward) moveZ -= 1;
    if (this.keys.backward) moveZ += 1;
    if (this.keys.left) moveX -= 1;
    if (this.keys.right) moveX += 1;

    let isMoving = false;

    if (moveX !== 0 || moveZ !== 0) {
      // 鍵盤移動優先
      this.targetPos = null;
      const moveVec = new THREE.Vector3(moveX, 0, moveZ).normalize().multiplyScalar(this.moveSpeed);
      this.mesh.position.add(moveVec);
      this.mesh.rotation.y = Math.atan2(moveX, moveZ);
      isMoving = true;
    } else if (this.targetPos) {
      // 滑鼠點選尋路移動
      const dist = this.mesh.position.distanceTo(this.targetPos);
      if (dist > 0.2) {
        const dir = new THREE.Vector3().subVectors(this.targetPos, this.mesh.position).normalize();
        this.mesh.position.add(dir.multiplyScalar(Math.min(dist, this.moveSpeed)));
        this.mesh.rotation.y = Math.atan2(dir.x, dir.z);
        isMoving = true;
      } else {
        this.targetPos = null;
      }
    }

    // 走路腿部前後擺動動畫
    const ud = this.mesh.userData;
    if (isMoving) {
      ud.walkTime = (ud.walkTime || 0) + 0.22;
      if (ud.legLeft) ud.legLeft.rotation.x = Math.sin(ud.walkTime) * 0.65;
      if (ud.legRight) ud.legRight.rotation.x = -Math.sin(ud.walkTime) * 0.65;
      this.mesh.position.y = 0.7 + Math.abs(Math.sin(ud.walkTime * 2)) * 0.08;
    } else {
      if (ud.legLeft) ud.legLeft.rotation.x = 0;
      if (ud.legRight) ud.legRight.rotation.x = 0;
      this.mesh.position.y = 0.7;
    }

    // 鏡頭自動平滑跟隨玩家移動
    if (this.isFollowCamera && this.world) {
      // 當場景正在進行跨島切換過渡時暫緩跟隨，等過渡完成後立即同步跟隨
      if (!this.world.isTransitioning) {
        // 計算鏡頭與控制點目前的相對偏移量
        const currentDiff = new THREE.Vector3().subVectors(
          this.world.camera.position,
          this.world.controls.target
        );

        // 若距離太遠（例如剛從全景俯瞰切換過來），重設為舒適的冒險俯瞰視角
        if (currentDiff.length() > 28 || currentDiff.length() < 5) {
          currentDiff.set(0, 9, 13);
        } else {
          // 維持適當仰角，避免鏡頭穿入地面
          currentDiff.y = Math.max(5.5, Math.min(currentDiff.y, 16));
        }

        const targetCamPos = new THREE.Vector3().addVectors(this.mesh.position, currentDiff);
        const targetLookPos = new THREE.Vector3(
          this.mesh.position.x,
          this.mesh.position.y + 0.85,
          this.mesh.position.z
        );

        // 使用 lerp 實現絲滑柔順的鏡頭跟隨
        this.world.camera.position.lerp(targetCamPos, 0.1);
        this.world.controls.target.lerp(targetLookPos, 0.1);
      }
    }

    // 檢測鄰近寶箱
    this.checkChestsProximity(chestList);
  }

  checkChestsProximity(chestList) {
    let nearest = null;
    let minDist = 2.2;

    chestList.forEach(chestMesh => {
      const dist = this.mesh.position.distanceTo(chestMesh.position);
      if (dist < minDist) {
        nearest = chestMesh;
      }
    });

    if (this.nearbyChest !== nearest) {
      this.nearbyChest = nearest;
      const hintEl = document.getElementById('chest-prompt-hud');
      if (hintEl) {
        if (nearest && !nearest.userData.isOpen) {
          hintEl.textContent = `✨ 發現【${nearest.userData.chestData.name}】！按 E 鍵或點擊開啟`;
          hintEl.style.display = 'block';
        } else {
          hintEl.style.display = 'none';
        }
      }
    }
  }
}

window.PlayerController = PlayerController;
