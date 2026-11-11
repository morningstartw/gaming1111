// 沉浸式 Web Audio 聲音引擎：純原生瀏覽器音訊合成，免外部音檔
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = false;
    this.isBgmPlaying = false;
    this.bgmTimer = null;
    this.gainNode = null;
    this.bgmGain = null;
    this.chordIndex = 0;

    // 溫暖放鬆的 Lo-Fi / 學院自習和弦進行 (Cmaj7 -> Am7 -> Dm7 -> G7)
    this.chords = [
      [261.63, 329.63, 392.00, 493.88], // Cmaj7 (C4, E4, G4, B4)
      [220.00, 261.63, 329.63, 392.00], // Am7   (A3, C4, E4, G4)
      [293.66, 349.23, 440.00, 523.25], // Dm7   (D4, F4, A4, C5)
      [196.00, 246.94, 293.66, 392.00]  // G7    (G3, B3, D4, G4)
    ];
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.gainNode = this.ctx.createGain();
        this.gainNode.gain.value = 0.35;
        this.gainNode.connect(this.ctx.destination);

        this.bgmGain = this.ctx.createGain();
        this.bgmGain.gain.value = 0.12;
        this.bgmGain.connect(this.gainNode);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.gainNode && this.ctx) {
      this.gainNode.gain.setValueAtTime(this.isMuted ? 0 : 0.35, this.ctx.currentTime);
    }
    if (this.isMuted) {
      this.stopBgm();
    } else {
      this.startBgm();
    }
    return this.isMuted;
  }

  // 按鈕點擊萌萌氣泡音 (Bubble Pop)
  playPop(freq = 440) {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);
      osc.frequency.exponentialRampToValueAtTime(freq * 1.6, now + 0.08);

      gain.gain.setValueAtTime(0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

      osc.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.1);
    } catch (e) {
      console.warn("Audio error:", e);
    }
  }

  // 島長打招呼 / 視角切換的清脆風鈴雙音 (Chime)
  playChime() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
    notes.forEach((pitch, i) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, now);

        gain.gain.setValueAtTime(0.15, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

        osc.connect(gain);
        gain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 0.45);
      }, i * 70);
    });
  }

  // 精靈工坊合成成功時的奇幻音效 (Magic Synthesizer)
  playMagic() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const arpeggio = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
    arpeggio.forEach((f, index) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = index % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(f, now);

        gain.gain.setValueAtTime(0.18, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

        osc.connect(gain);
        gain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 0.35);
      }, index * 60);
    });
  }

  // 寶箱開箱勝利慶祝音 (Treasure Fanfare)
  playChestOpen() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51, 1567.98]; // C E G C E G
    melody.forEach((pitch, i) => {
      setTimeout(() => {
        if (!this.ctx || this.isMuted) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(pitch, now);

        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

        osc.connect(gain);
        gain.connect(this.gainNode);

        osc.start(now);
        osc.stop(now + 0.6);
      }, i * 80);
    });
  }

  // 番茄鐘專注啟動與完成鐘聲 (Zen Bell)
  playZenBell() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    const freqs = [440, 880, 1320];
    const now = this.ctx.currentTime;
    freqs.forEach((f, idx) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(f, now);

      gain.gain.setValueAtTime(0.12 / (idx + 1), now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

      osc.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 2.5);
    });
  }

  // 釘選學習便利貼的木質敲擊聲 (Wood Tap)
  playWoodTap() {
    if (this.isMuted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(140, now + 0.06);

      gain.gain.setValueAtTime(0.25, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08);

      osc.connect(gain);
      gain.connect(this.gainNode);

      osc.start(now);
      osc.stop(now + 0.08);
    } catch (e) {}
  }

  // 背景 Lo-Fi 暖心學習氛圍和弦循環
  startBgm() {
    if (this.isBgmPlaying || this.isMuted) return;
    this.init();
    this.isBgmPlaying = true;
    this.playNextChord();
  }

  stopBgm() {
    this.isBgmPlaying = false;
    if (this.bgmTimer) {
      clearTimeout(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  playNextChord() {
    if (!this.isBgmPlaying || this.isMuted || !this.ctx) return;

    const chord = this.chords[this.chordIndex];
    this.chordIndex = (this.chordIndex + 1) % this.chords.length;

    const now = this.ctx.currentTime;
    const chordDuration = 4.2;

    chord.forEach((freq) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.03, now + 1.2);
      gain.gain.exponentialRampToValueAtTime(0.001, now + chordDuration);

      osc.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(now);
      osc.stop(now + chordDuration + 0.1);
    });

    this.bgmTimer = setTimeout(() => {
      if (this.isBgmPlaying) {
        this.playNextChord();
      }
    }, (chordDuration - 0.4) * 1000);
  }
}

window.sound = new SoundEngine();
