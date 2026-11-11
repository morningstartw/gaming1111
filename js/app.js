// 佛光大學 應用科技與設計學院 3D 微縮學習島 — 主應用程式控制器 (旗艦升級版)

class App {
  constructor() {
    this.currentIslandId = 'central';
    this.villagers = this.loadStorage('fgu_island_villagers', window.DEFAULT_VILLAGERS);
    this.studyNotes = this.loadStorage('fgu_island_notes', window.DEFAULT_STUDY_NOTES);
    this.openedChests = this.loadStorage('fgu_opened_chests', []);

    this.world = null;
    this.playerController = null;
    this.playerMesh = null;

    this.activeMayor = null;
    this.activeIsland = null;

    // 精靈工坊暫存狀態
    this.workshopState = {
      head: 'capybara',
      feature: 'wings',
      color: '#38BDF8',
      islandId: 'it',
      name: '',
      studyGoal: ''
    };

    // 實體 Mesh 對應儲存
    this.villagerMeshList = [];
    this.noteMeshList = [];
    this.mayorMeshList = [];
    this.chestMeshList = [];

    // 番茄鐘計時狀態
    this.pomoState = {
      secondsLeft: 25 * 60,
      totalSeconds: 25 * 60,
      isRunning: false,
      mode: 'focus', // focus | break
      timerId: null
    };

    window.app = this;
    this.init();
  }

  loadStorage(key, fallback) {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [...fallback];
    } catch (e) {
      return [...fallback];
    }
  }

  saveStorage(key, data) {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (e) {}
  }

  init() {
    const container = document.getElementById('canvas-container');

    // 1. 初始化 3D 世界
    this.world = new window.World3D(container, {
      onSelectIsland: (islandId) => this.switchIsland(islandId),
      onSelectMayor: (mayorData, islandData) => this.openMayorModal(mayorData, islandData),
      onSelectVillager: (villagerData) => this.openVillagerModal(villagerData),
      onSelectNote: (noteData) => this.openStudyBoardModal(noteData.id),
      onSelectChest: (chestData, chestMesh) => this.openTreasureChest(chestMesh),
      onIslandGroundClick: (hitPoint, islandId) => {
        if (this.playerController) {
          this.playerController.moveTo(hitPoint);
        }
      }
    });

    // 2. 實體化所有地圖物件（島長、島民、便利貼、寶箱、玩家小人、跨島橋樑）
    this.spawnAllEntities();

    // 3. 初始化玩家控制器
    this.playerController = new window.PlayerController(
      this.playerMesh,
      this.world,
      (chestMesh) => this.openTreasureChest(chestMesh)
    );

    // 4. 動畫逐格更新掛載
    this.world.onFrameUpdate = (time) => this.on3DFrameUpdate(time);

    // 5. 綁定 UI 事件
    this.bindUIEvents();

    // 6. 渲染精靈工坊選項
    this.renderWorkshopOptions();

    // 7. 初始更新島嶼資訊卡
    this.updateIslandHUD(this.currentIslandId);
  }

  spawnAllEntities() {
    // 跨島木棧橋
    window.createIslandBridges(this.world);

    // 5 位島長
    window.ISLANDS_DATA.forEach(island => {
      const mayorMesh = window.createMayor3D(island, this.world);
      this.world.scene.add(mayorMesh);
      this.mayorMeshList.push(mayorMesh);
    });

    // 5 個金色探索寶箱
    window.TREASURES_DATA.forEach(chestData => {
      const chestMesh = window.createTreasureChest3D(chestData, this.world);
      if (this.openedChests.includes(chestData.id)) {
        chestMesh.userData.isOpen = true;
        chestMesh.userData.lidGroup.rotation.x = -Math.PI / 2.2;
        chestMesh.userData.beacon.visible = false;
        chestMesh.userData.sprite.visible = false;
      }
      this.world.scene.add(chestMesh);
      this.chestMeshList.push(chestMesh);
    });

    // 3D 大學生冒險角色
    this.playerMesh = window.createStudentPlayer3D(this.world);
    this.world.scene.add(this.playerMesh);

    // 島民精靈
    this.villagers.forEach(v => {
      this.spawnVillagerMesh(v);
    });

    // 學習便利貼
    this.studyNotes.forEach(n => {
      this.spawnNoteMesh(n);
    });
  }

  spawnVillagerMesh(villager) {
    const island = window.ISLANDS_DATA.find(i => i.id === villager.islandId) || window.ISLANDS_DATA[0];
    const mesh = window.createChimeraSpirit3D(villager, island.coords, this.world);
    this.world.scene.add(mesh);
    this.villagerMeshList.push(mesh);
    return mesh;
  }

  spawnNoteMesh(note) {
    const mesh = window.createStudyNote3D(note, this.world);
    this.world.scene.add(mesh);
    this.noteMeshList.push(mesh);
    return mesh;
  }

  on3DFrameUpdate(time) {
    // 更新玩家運動與尋路
    if (this.playerController) {
      this.playerController.update(time, this.chestMeshList);
    }

    // 島長呼吸上下起伏
    this.mayorMeshList.forEach((mesh, idx) => {
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 2.2 + idx) * 0.06;
      mesh.rotation.y = Math.sin(time * 0.8 + idx) * 0.1;
    });

    // 寶箱微晶懸浮旋轉
    this.chestMeshList.forEach((mesh, idx) => {
      if (mesh.userData.beacon && !mesh.userData.isOpen) {
        mesh.userData.beacon.rotation.y = time * 2;
        mesh.userData.beacon.position.y = 1.05 + Math.sin(time * 3 + idx) * 0.08;
      }
    });

    // 島民在六角島上的漫步與翅膀拍動
    this.villagerMeshList.forEach((mesh, idx) => {
      const ud = mesh.userData;
      mesh.position.y = ud.basePos[1] + Math.abs(Math.sin(time * 3 + idx)) * 0.12;
      if (ud.animParts && ud.animParts.wings) {
        ud.animParts.wings.forEach(w => {
          w.mesh.rotation.z = Math.sin(time * 18) * 0.5 * w.side;
        });
      }
    });

    // 學習信封上下漂浮
    this.noteMeshList.forEach((mesh, idx) => {
      mesh.position.y = mesh.userData.baseY + Math.sin(time * 2.5 + idx * 1.5) * 0.08;
      mesh.rotation.y = time * 0.5 + idx;
    });
  }

  // 開啟寶箱邏輯
  openTreasureChest(chestMesh) {
    if (!chestMesh || chestMesh.userData.isOpen) return;

    chestMesh.userData.isOpen = true;
    const chestData = chestMesh.userData.chestData;

    // 開箱掀蓋動畫
    const lid = chestMesh.userData.lidGroup;
    let angle = 0;
    const openTimer = setInterval(() => {
      angle -= 0.12;
      lid.rotation.x = angle;
      if (angle <= -Math.PI / 2.2) {
        clearInterval(openTimer);
      }
    }, 20);

    chestMesh.userData.beacon.visible = false;
    chestMesh.userData.sprite.visible = false;

    // 播放開箱慶祝音效與紙花
    if (window.sound) window.sound.playChestOpen();
    if (window.confetti) {
      window.confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
    }

    // 解鎖精靈工坊隱藏配件
    const feature = window.CHIMERA_TRAITS.specialFeatures.find(f => f.id === chestData.unlockedFeature);
    if (feature) {
      feature.locked = false;
      this.renderWorkshopOptions();
    }

    // 記錄已開啟寶箱
    if (!this.openedChests.includes(chestData.id)) {
      this.openedChests.push(chestData.id);
      this.saveStorage('fgu_opened_chests', this.openedChests);
    }

    // 彈出獎勵勳章提示彈窗
    document.getElementById('chest-reward-emoji').textContent = feature ? feature.emoji : '🏆';
    document.getElementById('chest-reward-title').textContent = chestData.name;
    document.getElementById('chest-reward-desc').textContent = `${chestData.desc} 榮譽勳章【${chestData.badge}】已點亮！`;
    document.getElementById('chest-reward-modal').classList.add('active');

    // 隱藏走近提示
    document.getElementById('chest-prompt-hud').style.display = 'none';
  }

  // 番茄鐘專注計時控制
  togglePomodoro() {
    if (this.pomoState.isRunning) {
      // 暫停
      clearInterval(this.pomoState.timerId);
      this.pomoState.isRunning = false;
      document.getElementById('btn-pomo-toggle').textContent = '繼續';
      if (this.playerMesh) this.playerMesh.userData.halo.visible = false;
    } else {
      // 啟動
      this.pomoState.isRunning = true;
      document.getElementById('btn-pomo-toggle').textContent = '暫停';
      if (window.sound) window.sound.playZenBell();

      // 玩家頭頂亮起專注光環
      if (this.playerMesh) this.playerMesh.userData.halo.visible = true;

      this.pomoState.timerId = setInterval(() => {
        if (this.pomoState.secondsLeft > 0) {
          this.pomoState.secondsLeft--;
          this.updatePomoDisplay();
        } else {
          // 倒數完成
          clearInterval(this.pomoState.timerId);
          this.pomoState.isRunning = false;
          if (window.sound) window.sound.playZenBell();
          if (window.confetti) window.confetti({ particleCount: 50 });

          if (this.pomoState.mode === 'focus') {
            alert('🎉 恭喜完成 25 分鐘專注自習！現在進入 5 分鐘休息放鬆時間～');
            this.pomoState.mode = 'break';
            this.pomoState.secondsLeft = 5 * 60;
            document.getElementById('pomo-mode-label').textContent = '☕ 休息放鬆中';
          } else {
            alert('🔔 休息結束，準備好進入下一段學習旅程了嗎？');
            this.pomoState.mode = 'focus';
            this.pomoState.secondsLeft = 25 * 60;
            document.getElementById('pomo-mode-label').textContent = '🍅 專注自習中';
          }
          if (this.playerMesh) this.playerMesh.userData.halo.visible = false;
          document.getElementById('btn-pomo-toggle').textContent = '開始';
          this.updatePomoDisplay();
        }
      }, 1000);
    }
  }

  resetPomodoro() {
    clearInterval(this.pomoState.timerId);
    this.pomoState.isRunning = false;
    this.pomoState.secondsLeft = 25 * 60;
    this.pomoState.mode = 'focus';
    document.getElementById('pomo-mode-label').textContent = '🍅 專注自習中';
    document.getElementById('btn-pomo-toggle').textContent = '開始';
    if (this.playerMesh) this.playerMesh.userData.halo.visible = false;
    this.updatePomoDisplay();
  }

  updatePomoDisplay() {
    const mins = Math.floor(this.pomoState.secondsLeft / 60);
    const secs = this.pomoState.secondsLeft % 60;
    const str = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    document.getElementById('pomo-display').textContent = str;
  }

  // 渲染修課技能樹
  renderSkillTree(deptId = 'it') {
    const treeData = window.SKILL_TREES_DATA[deptId];
    if (!treeData) return;

    // 頁籤高亮
    document.querySelectorAll('.skill-dept-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.dept === deptId);
    });

    const container = document.getElementById('skill-tree-content');
    container.innerHTML = `
      <div style="margin-bottom: 14px; padding: 12px; background: ${treeData.color}15; border-radius: 12px; border-left: 4px solid ${treeData.color};">
        <div style="font-weight: 800; font-size: 15px; color: #0F172A;">${treeData.deptName}</div>
        <div style="font-size: 12.5px; color: #475569;">${treeData.tagline}</div>
      </div>
      <div>
        ${treeData.years.map(y => `
          <div class="year-block">
            <div class="year-title">
              <span>🌟</span> ${y.year}
            </div>
            <div class="courses-grid">
              ${y.courses.map(c => `
                <div class="course-card">
                  <div class="course-name">${c.name}</div>
                  <div class="course-meta">
                    <span>${c.type} ‧ ${c.credits} 學分</span>
                    <span class="course-stat">${c.stat}</span>
                  </div>
                  <div style="font-size: 11.5px; color: #64748B; line-height: 1.4;">${c.desc}</div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  switchIsland(islandId) {
    if (window.sound) window.sound.playChime();
    this.currentIslandId = islandId;

    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.island === islandId);
    });

    if (islandId === 'all') {
      this.world.resetOverview();
      this.updateIslandHUD(null);
      if (this.playerController) {
        this.playerController.isFollowCamera = false;
        this.updateFollowButtonUI(false);
      }
    } else {
      this.world.focusIsland(islandId);
      this.updateIslandHUD(islandId);
      // 同步傳送玩家到該島
      if (this.playerController) {
        this.playerController.teleportToIsland(islandId);
        this.updateFollowButtonUI(true);
      }
    }
  }

  updateFollowButtonUI(isFollowing) {
    const followBtn = document.getElementById('btn-toggle-follow');
    if (!followBtn) return;
    followBtn.style.background = isFollowing ? '#38BDF8' : 'white';
    followBtn.style.color = isFollowing ? 'white' : '#1E293B';
    followBtn.title = isFollowing ? '鏡頭跟隨中（點擊切回自由視角）' : '切換鏡頭跟隨角色';
  }

  updateIslandHUD(islandId) {
    const card = document.getElementById('island-info-hud');
    if (!card) return;

    if (!islandId || islandId === 'all') {
      card.innerHTML = `
        <div class="island-title-row">
          <div class="island-name">${window.COLLEGE_INFO.name}</div>
          <span class="island-tag" style="background: #F59E0B">全院總覽</span>
        </div>
        <div class="island-desc">${window.COLLEGE_INFO.motto} ‧ 用 WASD 操縱小人探索群島與寶箱！</div>
        <div class="island-shortcuts">
          <button class="shortcut-btn" id="hud-btn-workshop">✨ 精靈工坊</button>
          <button class="shortcut-btn" id="hud-btn-tree">🎓 修課技能樹</button>
          <button class="shortcut-btn" id="hud-btn-board">📋 學習看板</button>
        </div>
      `;
    } else {
      const island = window.ISLANDS_DATA.find(i => i.id === islandId);
      if (!island) return;
      card.innerHTML = `
        <div class="island-title-row">
          <div class="island-name">${island.name}</div>
          <span class="island-tag" style="background: ${island.color}">${island.tag}</span>
        </div>
        <div class="island-desc">${island.subtitle}</div>
        <div class="island-shortcuts">
          <button class="shortcut-btn" id="hud-btn-mayor">💬 拜訪 ${island.mayor.name}</button>
          <button class="shortcut-btn" id="hud-btn-tree">🎓 查看本系技能樹</button>
          <button class="shortcut-btn" id="hud-btn-board">📰 最新動態</button>
        </div>
      `;

      const btnMayor = document.getElementById('hud-btn-mayor');
      if (btnMayor) {
        btnMayor.addEventListener('click', () => this.openMayorModal(island.mayor, island));
      }
    }

    const btnTree = document.getElementById('hud-btn-tree');
    if (btnTree) {
      btnTree.addEventListener('click', () => {
        this.renderSkillTree(islandId === 'all' || !islandId ? 'it' : islandId);
        document.getElementById('skill-tree-modal').classList.add('active');
      });
    }
    const btnWorkshop = document.getElementById('hud-btn-workshop');
    if (btnWorkshop) {
      btnWorkshop.addEventListener('click', () => this.openWorkshopModal());
    }
    const btnBoard = document.getElementById('hud-btn-board');
    if (btnBoard) {
      btnBoard.addEventListener('click', () => this.openStudyBoardModal());
    }
  }

  openMayorModal(mayor, island) {
    if (window.sound) window.sound.playChime();
    this.activeMayor = mayor;
    this.activeIsland = island;

    const modal = document.getElementById('mayor-modal');
    document.getElementById('mayor-modal-avatar').textContent = mayor.avatarEmoji;
    document.getElementById('mayor-modal-avatar').style.background = mayor.color + '22';
    document.getElementById('mayor-modal-title').textContent = mayor.name;
    document.getElementById('mayor-modal-subtitle').textContent = mayor.role + ' ‧ ' + mayor.species;
    
    const dialogueBox = document.getElementById('mayor-dialogue-text');
    this.typeDialogue(dialogueBox, mayor.dialogues.intro);

    modal.classList.add('active');
  }

  typeDialogue(el, text) {
    el.innerHTML = '';
    let i = 0;
    if (this.typeTimer) clearInterval(this.typeTimer);
    this.typeTimer = setInterval(() => {
      el.textContent = text.slice(0, i + 1);
      i++;
      if (i >= text.length) {
        clearInterval(this.typeTimer);
      }
    }, 18);
  }

  openVillagerModal(villager) {
    if (window.sound) window.sound.playPop();
    const modal = document.getElementById('villager-modal');
    document.getElementById('villager-modal-avatar').textContent = '🐾';
    document.getElementById('villager-modal-title').textContent = villager.name;
    document.getElementById('villager-modal-subtitle').textContent = `由 ${villager.author} 創造的小島民`;
    document.getElementById('villager-modal-content').innerHTML = `
      <div class="dialogue-bubble">
        「${villager.studyGoal}」
      </div>
      <div style="font-size: 13px; color: #64748B; margin-top: 10px;">
        居住島嶼：<strong>${window.ISLANDS_DATA.find(i => i.id === villager.islandId)?.name || '學習小島'}</strong>
      </div>
    `;
    modal.classList.add('active');
  }

  openWorkshopModal() {
    if (window.sound) window.sound.playPop();
    document.getElementById('workshop-modal').classList.add('active');
  }

  openStudyBoardModal(highlightNoteId = null) {
    if (window.sound) window.sound.playPop();
    const modal = document.getElementById('study-board-modal');
    this.renderStudyBoard(highlightNoteId);
    modal.classList.add('active');
  }

  renderStudyBoard(highlightId = null) {
    const list = document.getElementById('study-notes-list');
    list.innerHTML = this.studyNotes.map(n => `
      <div class="note-card ${highlightId === n.id ? 'highlight' : ''}">
        <div class="note-header">
          <span class="note-badge">${n.badge}</span>
          <span class="note-author">${n.authorName} ‧ ${n.timestamp}</span>
        </div>
        <div class="note-title">${n.title}</div>
        <div class="note-content">${n.content}</div>
        <div class="note-footer">
          <span>所在小島：${window.ISLANDS_DATA.find(i => i.id === n.islandId)?.name || '全院'}</span>
          <button class="like-btn" data-id="${n.id}">❤️ <span>${n.likes}</span></button>
        </div>
      </div>
    `).join('');

    list.querySelectorAll('.like-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (window.sound) window.sound.playPop();
        const id = btn.dataset.id;
        const note = this.studyNotes.find(item => item.id === id);
        if (note) {
          note.likes += 1;
          this.saveStorage('fgu_island_notes', this.studyNotes);
          btn.querySelector('span').textContent = note.likes;
        }
      });
    });

    const announceList = document.getElementById('official-news-list');
    const allAnnouncements = window.ISLANDS_DATA.flatMap(i => i.announcements.map(a => ({ ...a, islandName: i.name, color: i.color })));
    announceList.innerHTML = allAnnouncements.map(a => `
      <div style="padding: 10px 12px; border-bottom: 1px solid #F1F5F9; display: flex; justify-content: space-between; align-items: center; gap: 8px;">
        <div>
          <span style="font-size: 11px; padding: 2px 6px; border-radius: 6px; background: ${a.color}22; color: ${a.color}; font-weight: 700; margin-right: 6px;">${a.islandName}</span>
          <span style="font-size: 13px; font-weight: 700; color: #1E293B;">${a.title}</span>
        </div>
        <span style="font-size: 11.5px; color: #94A3B8; white-space: nowrap;">${a.date}</span>
      </div>
    `).join('');
  }

  renderWorkshopOptions() {
    const headContainer = document.getElementById('workshop-heads');
    headContainer.innerHTML = window.CHIMERA_TRAITS.heads.map(h => `
      <div class="workshop-option-card ${this.workshopState.head === h.id ? 'selected' : ''}" data-type="head" data-val="${h.id}">
        <div class="option-emoji">${h.emoji}</div>
        <div class="option-name">${h.name}</div>
      </div>
    `).join('');

    const featContainer = document.getElementById('workshop-features');
    featContainer.innerHTML = window.CHIMERA_TRAITS.specialFeatures.map(f => `
      <div class="workshop-option-card ${this.workshopState.feature === f.id ? 'selected' : ''} ${f.locked ? 'is-locked' : ''}" data-type="feature" data-val="${f.id}" title="${f.desc}">
        <div class="option-emoji">${f.locked ? '🔒' : f.emoji}</div>
        <div class="option-name">${f.name}</div>
      </div>
    `).join('');

    const colorContainer = document.getElementById('workshop-colors');
    colorContainer.innerHTML = window.CHIMERA_TRAITS.colorThemes.map(c => `
      <div class="workshop-option-card ${this.workshopState.color === c.hex ? 'selected' : ''}" data-type="color" data-val="${c.hex}" style="background: ${c.hex}18; border-color: ${this.workshopState.color === c.hex ? c.hex : '#E2E8F0'}">
        <div style="width: 22px; height: 22px; border-radius: 50%; background: ${c.hex}; margin: 3px auto 6px;"></div>
        <div class="option-name">${c.name}</div>
      </div>
    `).join('');

    const islandSelect = document.getElementById('workshop-island-select');
    islandSelect.innerHTML = window.ISLANDS_DATA.map(i => `
      <option value="${i.id}">${i.name}</option>
    `).join('');
    islandSelect.value = this.workshopState.islandId;

    document.querySelectorAll('.workshop-option-card').forEach(card => {
      card.addEventListener('click', () => {
        if (card.classList.contains('is-locked')) {
          alert('這個隱藏飾品需要探索小島開啟金色寶箱才能解鎖唷！快去各個島上冒險尋寶吧！');
          return;
        }
        if (window.sound) window.sound.playPop();
        const type = card.dataset.type;
        const val = card.dataset.val;
        this.workshopState[type] = val;
        this.renderWorkshopOptions();
      });
    });
  }

  bindUIEvents() {
    // 頂部導航按鈕
    document.querySelectorAll('.tab-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        this.switchIsland(btn.dataset.island);
      });
    });

    // 晝夜黃昏切換
    document.querySelectorAll('.time-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        if (window.sound) window.sound.playPop();
        document.querySelectorAll('.time-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.world.setTimeOfDay(btn.dataset.time);
      });
    });

    // 視角跟隨切換
    const followBtn = document.getElementById('btn-toggle-follow');
    if (followBtn) {
      this.updateFollowButtonUI(this.playerController ? this.playerController.isFollowCamera : true);
      followBtn.addEventListener('click', () => {
        if (window.sound) window.sound.playPop();
        if (this.playerController) {
          const isFollowing = this.playerController.toggleFollowCamera();
          this.updateFollowButtonUI(isFollowing);
        }
      });
    }

    // 番茄鐘按鈕
    document.getElementById('btn-pomo-toggle').addEventListener('click', () => this.togglePomodoro());
    document.getElementById('btn-pomo-reset').addEventListener('click', () => this.resetPomodoro());

    // 技能樹按鈕
    document.getElementById('btn-open-skilltree').addEventListener('click', () => {
      if (window.sound) window.sound.playPop();
      this.renderSkillTree('it');
      document.getElementById('skill-tree-modal').classList.add('active');
    });

    // 技能樹科系頁籤切換
    document.getElementById('skill-dept-tabs').addEventListener('click', (e) => {
      const btn = e.target.closest('.skill-dept-btn');
      if (btn) {
        if (window.sound) window.sound.playPop();
        this.renderSkillTree(btn.dataset.dept);
      }
    });

    // 音效開關
    const audioBtn = document.getElementById('btn-toggle-audio');
    audioBtn.addEventListener('click', () => {
      const isMuted = window.sound.toggleMute();
      audioBtn.textContent = isMuted ? '🔇' : '🎵';
      audioBtn.title = isMuted ? '已靜音' : '微縮環境音樂播放中';
    });

    // 精靈工坊開啟
    document.getElementById('btn-open-workshop').addEventListener('click', () => {
      this.openWorkshopModal();
    });

    // 學習看板開啟
    document.getElementById('btn-open-board').addEventListener('click', () => {
      this.openStudyBoardModal();
    });

    // 寶箱走近提示 HUD 點擊開箱
    const chestHud = document.getElementById('chest-prompt-hud');
    chestHud.addEventListener('click', () => {
      if (this.playerController && this.playerController.nearbyChest) {
        this.openTreasureChest(this.playerController.nearbyChest);
      }
    });

    // 關閉彈窗
    document.querySelectorAll('.close-modal-btn, .modal-overlay').forEach(el => {
      el.addEventListener('click', (e) => {
        if (e.target === el || el.classList.contains('close-btn') || el.classList.contains('close-modal-btn')) {
          if (window.sound) window.sound.playPop();
          document.querySelectorAll('.modal-overlay').forEach(m => m.classList.remove('active'));
        }
      });
    });

    document.querySelectorAll('.modal-box').forEach(box => {
      box.addEventListener('click', (e) => e.stopPropagation());
    });

    // 島長話題快捷按鈕
    document.querySelectorAll('.topic-pill').forEach(pill => {
      pill.addEventListener('click', () => {
        if (window.sound) window.sound.playPop();
        if (!this.activeMayor) return;
        const topic = pill.dataset.topic;
        const text = this.activeMayor.dialogues[topic] || this.activeMayor.dialogues.intro;
        this.typeDialogue(document.getElementById('mayor-dialogue-text'), text);
      });
    });

    // 島長自由聊天
    const chatInput = document.getElementById('mayor-chat-input');
    const sendBtn = document.getElementById('mayor-chat-send');
    const handleChat = () => {
      const query = chatInput.value.trim();
      if (!query || !this.activeMayor) return;
      if (window.sound) window.sound.playPop();
      chatInput.value = '';
      const reply = this.generateMayorReply(query, this.activeMayor, this.activeIsland);
      this.typeDialogue(document.getElementById('mayor-dialogue-text'), reply);
    };
    sendBtn.addEventListener('click', handleChat);
    chatInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') handleChat();
    });

    // 召喚島民
    document.getElementById('btn-spawn-spirit').addEventListener('click', () => {
      const nameInput = document.getElementById('workshop-spirit-name');
      const goalInput = document.getElementById('workshop-spirit-goal');
      const islandSelect = document.getElementById('workshop-island-select');

      const name = nameInput.value.trim() || '奇幻小島民';
      const goal = goalInput.value.trim() || '享受佛光應用科技島的學習生活！';
      const islandId = islandSelect.value;

      const island = window.ISLANDS_DATA.find(i => i.id === islandId) || window.ISLANDS_DATA[0];
      const randomOffset = () => (Math.random() - 0.5) * (island.hexRadius * 0.7);

      const newVillager = {
        id: 'v_' + Date.now(),
        name: name,
        head: this.workshopState.head,
        feature: this.workshopState.feature,
        color: this.workshopState.color,
        islandId: islandId,
        position: [island.coords[0] + randomOffset(), 0.7, island.coords[2] + randomOffset()],
        studyGoal: goal,
        author: '登島同學'
      };

      this.villagers.push(newVillager);
      this.saveStorage('fgu_island_villagers', this.villagers);
      this.spawnVillagerMesh(newVillager);

      if (window.sound) window.sound.playMagic();
      document.getElementById('workshop-modal').classList.remove('active');
      this.switchIsland(islandId);

      if (window.confetti) {
        window.confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
      }
    });

    // 釘選便利貼
    document.getElementById('btn-submit-note').addEventListener('click', () => {
      const author = document.getElementById('note-author-input').value.trim() || '匿名島民';
      const title = document.getElementById('note-title-input').value.trim();
      const content = document.getElementById('note-content-input').value.trim();
      const category = document.getElementById('note-cat-select').value;
      const islandId = document.getElementById('note-island-select').value;

      if (!title || !content) {
        alert('請填寫便利貼的標題與想跟大家說的內容唷！');
        return;
      }

      const island = window.ISLANDS_DATA.find(i => i.id === islandId) || window.ISLANDS_DATA[0];
      const randomOffset = () => (Math.random() - 0.5) * (island.hexRadius * 0.6);

      const newNote = {
        id: 'note_' + Date.now(),
        islandId: islandId,
        authorName: author,
        category: category,
        badge: '📌 ' + category,
        title: title,
        content: content,
        likes: 1,
        timestamp: '剛剛',
        coords: [island.coords[0] + randomOffset(), 0.65, island.coords[2] + randomOffset()]
      };

      this.studyNotes.unshift(newNote);
      this.saveStorage('fgu_island_notes', this.studyNotes);
      this.spawnNoteMesh(newNote);

      if (window.sound) window.sound.playWoodTap();
      document.getElementById('note-title-input').value = '';
      document.getElementById('note-content-input').value = '';
      this.renderStudyBoard();
    });
  }

  generateMayorReply(query, mayor, island) {
    const q = query.toLowerCase();
    if (q.includes('作業') || q.includes('成績') || q.includes('考試') || q.includes('過')) {
      return `【${mayor.name} 溫馨叮嚀】學習不用太焦慮！在我們${island.name}，注重的是動手實作的探索過程。遇到卡關就到中央廣場或是便利貼看板找同學一起討論吧！`;
    }
    if (q.includes('學什麼') || q.includes('課程') || q.includes('系') || q.includes('專業') || q.includes('修課')) {
      return `【${mayor.name} 專業指引】點擊頂部的「🎓 技能樹」按鈕，可以看到我們系大一到大四的完整專業通關地圖唷！${mayor.dialogues.curriculum}`;
    }
    if (q.includes('寶箱') || q.includes('彩蛋') || q.includes('飾品') || q.includes('開箱')) {
      return `【${mayor.name} 尋寶秘訣】五座島上都藏有微縮金色寶箱，只要用鍵盤 WASD 走近寶箱按下 E 鍵，就能解鎖專屬飾品注入精靈工坊！`;
    }
    if (q.includes('專注') || q.includes('番茄') || q.includes('自習') || q.includes('時間')) {
      return `【${mayor.name} 專注心法】右上角的「微型番茄鐘」是專屬自習神器，啟動後你的小人頭頂會點亮專注微光光環，陪伴你專心學習 25 分鐘！`;
    }
    if (q.includes('比賽') || q.includes('競賽') || q.includes('得獎') || q.includes('活動')) {
      return `【${mayor.name} 盛事情報】${mayor.dialogues.news}`;
    }
    return `【${mayor.name} 認真傾聽】「${query}」這個問題很有意思！在我們佛光應用科技與設計學院，每一個探索的念頭都可能成為偉大專案的起點。你有想過結合${island.tag}來實現它嗎？`;
  }
}

window.addEventListener('DOMContentLoaded', () => {
  window.islandApp = new App();
});
