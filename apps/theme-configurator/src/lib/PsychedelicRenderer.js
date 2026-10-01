// @ts-check
/**
 * PsychedelicRenderer — Canvas-based psychedelic background pattern renderer.
 *
 * Supports 7 shape types, 7 mouse effects, 3 color modes, 4 region modes.
 * All parameters are live-configurable via the config object.
 *
 * Usage:
 *   const renderer = new PsychedelicRenderer(canvasElement, config);
 *   renderer.start();
 *   renderer.updateConfig({ shape: 'circles', ... });
 *   renderer.destroy();
 */

const TWO_PI = Math.PI * 2;

export class PsychedelicRenderer {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {Object} config
   */
  constructor(canvas, config = {}) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.config = this._defaults(config);
    this.mouse = { x: -9999, y: -9999 };
    this.smoothMouse = { x: -9999, y: -9999 };
    this.time = 0;
    this.running = false;
    this.rafId = null;
    this.dpr = window.devicePixelRatio || 1;

    // Clamp DPR to max 2 for performance
    if (this.dpr > 2) this.dpr = 2;

    this._onMouseMove = this._onMouseMove.bind(this);
    this._onMouseLeave = this._onMouseLeave.bind(this);
    this._onResize = this._onResize.bind(this);
    this._frame = this._frame.bind(this);

    this._setupListeners();
    this._resize();
  }

  _defaults(cfg) {
    return {
      // Shape: lines | circles | squares | rectangles | dots | triangles | waves
      shape: cfg.shape || 'lines',

      // Mouse effect: none | lens | funnel | distort | repel | attract | ripple
      mouseEffect: cfg.mouseEffect || 'lens',

      // Color mode: mono | palette | gradient
      colorMode: cfg.colorMode || 'mono',

      // Region: full | horizontal | vertical | diagonal
      region: cfg.region || 'full',

      // Pattern params
      lineWidth: cfg.lineWidth ?? 1.5,
      frequency: cfg.frequency ?? 0.015,
      amplitude: cfg.amplitude ?? 30,
      speed: cfg.speed ?? 0.8,
      phase: cfg.phase ?? 0,
      density: cfg.density ?? 60,
      gap: cfg.gap ?? 8,
      scale: cfg.scale ?? 1,

      // Mouse params
      mouseRadius: cfg.mouseRadius ?? 150,
      mouseStrength: cfg.mouseStrength ?? 0.5,
      mouseSmoothing: cfg.mouseSmoothing ?? 0.1,

      // Color mono
      color: cfg.color || '#00a5a5',
      bgColor: cfg.bgColor || '#e63312',
      opacity: cfg.opacity ?? 1,

      // Color palette (array of hex colors)
      palette: cfg.palette || ['#e63312', '#00a5a5', '#ff6b35', '#1a1a2e', '#f7f7f7'],

      // Color gradient
      gradientStart: cfg.gradientStart || '#e63312',
      gradientEnd: cfg.gradientEnd || '#00a5a5',

      // Region coords (percentages 0-100)
      regionX1: cfg.regionX1 ?? 0,
      regionY1: cfg.regionY1 ?? 0,
      regionX2: cfg.regionX2 ?? 100,
      regionY2: cfg.regionY2 ?? 100,
    };
  }

  updateConfig(newConfig) {
    this.config = this._defaults({ ...this.config, ...newConfig });
  }

  start() {
    if (this.running) return;
    this.running = true;
    this._frame();
  }

  stop() {
    this.running = false;
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  destroy() {
    this.stop();
    this.canvas.removeEventListener('mousemove', this._onMouseMove);
    this.canvas.removeEventListener('mouseleave', this._onMouseLeave);
    if (this._resizeObserver) {
      this._resizeObserver.disconnect();
    }
  }

  // =========================================================================
  // Internal
  // =========================================================================

  _setupListeners() {
    this.canvas.addEventListener('mousemove', this._onMouseMove);
    this.canvas.addEventListener('mouseleave', this._onMouseLeave);

    this._resizeObserver = new ResizeObserver(this._onResize);
    this._resizeObserver.observe(this.canvas.parentElement || this.canvas);
  }

  _onMouseMove(e) {
    const rect = this.canvas.getBoundingClientRect();
    this.mouse.x = (e.clientX - rect.left) * this.dpr;
    this.mouse.y = (e.clientY - rect.top) * this.dpr;
  }

  _onMouseLeave() {
    this.mouse.x = -9999;
    this.mouse.y = -9999;
  }

  _onResize() {
    this._resize();
  }

  _resize() {
    const parent = this.canvas.parentElement || this.canvas;
    const w = parent.clientWidth;
    const h = parent.clientHeight;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.w = this.canvas.width;
    this.h = this.canvas.height;
  }

  _frame() {
    if (!this.running) return;

    const cfg = this.config;
    const dt = 1 / 60;
    this.time += dt * cfg.speed;

    // Smooth mouse
    const sm = cfg.mouseSmoothing;
    this.smoothMouse.x += (this.mouse.x - this.smoothMouse.x) * sm;
    this.smoothMouse.y += (this.mouse.y - this.smoothMouse.y) * sm;

    this._draw();
    this.rafId = requestAnimationFrame(this._frame);
  }

  _draw() {
    const ctx = this.ctx;
    const cfg = this.config;

    // Background
    ctx.fillStyle = cfg.colorMode === 'mono' ? cfg.bgColor : cfg.bgColor;
    ctx.fillRect(0, 0, this.w, this.h);

    // Region clipping
    ctx.save();
    this._applyRegionClip(ctx, cfg);

    // Global opacity
    ctx.globalAlpha = cfg.opacity;

    // Draw shape
    switch (cfg.shape) {
      case 'lines': this._drawLines(ctx, cfg); break;
      case 'circles': this._drawCircles(ctx, cfg); break;
      case 'squares': this._drawSquares(ctx, cfg); break;
      case 'rectangles': this._drawRectangles(ctx, cfg); break;
      case 'dots': this._drawDots(ctx, cfg); break;
      case 'triangles': this._drawTriangles(ctx, cfg); break;
      case 'waves': this._drawWaves(ctx, cfg); break;
    }

    ctx.globalAlpha = 1;
    ctx.restore();
  }

  // =========================================================================
  // Region Clipping
  // =========================================================================

  _applyRegionClip(ctx, cfg) {
    if (cfg.region === 'full') return;

    const x1 = (cfg.regionX1 / 100) * this.w;
    const y1 = (cfg.regionY1 / 100) * this.h;
    const x2 = (cfg.regionX2 / 100) * this.w;
    const y2 = (cfg.regionY2 / 100) * this.h;

    ctx.beginPath();
    if (cfg.region === 'horizontal') {
      ctx.rect(0, y1, this.w, y2 - y1);
    } else if (cfg.region === 'vertical') {
      ctx.rect(x1, 0, x2 - x1, this.h);
    } else if (cfg.region === 'diagonal') {
      // Diagonal band — parallelogram from (x1,y1) to (x2,y2) with width
      const dx = x2 - x1;
      const dy = y2 - y1;
      const len = Math.sqrt(dx * dx + dy * dy);
      const nx = -dy / len * (this.w * 0.15); // band width: 15% of canvas
      const ny = dx / len * (this.w * 0.15);
      ctx.moveTo(x1 + nx, y1 + ny);
      ctx.lineTo(x2 + nx, y2 + ny);
      ctx.lineTo(x2 - nx, y2 - ny);
      ctx.lineTo(x1 - nx, y1 - ny);
    }
    ctx.closePath();
    ctx.clip();
  }

  // =========================================================================
  // Mouse effect displacement
  // =========================================================================

  _mouseDisplace(px, py, cfg) {
    if (cfg.mouseEffect === 'none') return { x: px, y: py };

    const mx = this.smoothMouse.x;
    const my = this.smoothMouse.y;
    const dx = px - mx;
    const dy = py - my;
    const dist = Math.sqrt(dx * dx + dy * dy);
    const r = cfg.mouseRadius * this.dpr;
    const str = cfg.mouseStrength;

    if (dist > r) return { x: px, y: py };

    const t = 1 - dist / r; // 0 at edge, 1 at center
    const t2 = t * t; // ease-in-out

    switch (cfg.mouseEffect) {
      case 'lens': {
        // Magnify — push outward from center
        const factor = 1 + t2 * str * 2;
        return { x: mx + dx * factor, y: my + dy * factor };
      }
      case 'funnel': {
        // Spiral/vortex — rotate around cursor
        const angle = t2 * str * Math.PI;
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);
        return {
          x: mx + dx * cos - dy * sin,
          y: my + dx * sin + dy * cos,
        };
      }
      case 'distort': {
        // Wave distortion — sinusoidal displacement
        const wave = Math.sin(dist * 0.05 + this.time * 3) * t2 * str * 40 * this.dpr;
        return { x: px + wave, y: py + wave * 0.7 };
      }
      case 'repel': {
        // Push away from cursor
        if (dist < 1) return { x: px, y: py };
        const force = t2 * str * r * 0.5;
        return { x: px + (dx / dist) * force, y: py + (dy / dist) * force };
      }
      case 'attract': {
        // Pull toward cursor
        const pull = t2 * str * 0.6;
        return { x: px - dx * pull, y: py - dy * pull };
      }
      case 'ripple': {
        // Concentric wave rings
        const ripple = Math.sin(dist * 0.08 - this.time * 4) * t * str * 20 * this.dpr;
        if (dist < 1) return { x: px, y: py };
        return { x: px + (dx / dist) * ripple, y: py + (dy / dist) * ripple };
      }
      default:
        return { x: px, y: py };
    }
  }

  // =========================================================================
  // Color helpers
  // =========================================================================

  _getColor(cfg, index, total, px, py) {
    switch (cfg.colorMode) {
      case 'mono':
        return cfg.color;
      case 'palette': {
        const pal = cfg.palette;
        return pal[index % pal.length];
      }
      case 'gradient': {
        const t = total > 1 ? index / (total - 1) : 0;
        return this._lerpColor(cfg.gradientStart, cfg.gradientEnd, t);
      }
      default:
        return cfg.color;
    }
  }

  _lerpColor(c1, c2, t) {
    const r1 = parseInt(c1.slice(1, 3), 16);
    const g1 = parseInt(c1.slice(3, 5), 16);
    const b1 = parseInt(c1.slice(5, 7), 16);
    const r2 = parseInt(c2.slice(1, 3), 16);
    const g2 = parseInt(c2.slice(3, 5), 16);
    const b2 = parseInt(c2.slice(5, 7), 16);
    const r = Math.round(r1 + (r2 - r1) * t);
    const g = Math.round(g1 + (g2 - g1) * t);
    const b = Math.round(b1 + (b2 - b1) * t);
    return `rgb(${r},${g},${b})`;
  }

  // =========================================================================
  // Shape Renderers
  // =========================================================================

  _drawLines(ctx, cfg) {
    const gap = cfg.gap * this.dpr * cfg.scale;
    const count = Math.ceil(this.h / gap) + 4;
    const freq = cfg.frequency;
    const amp = cfg.amplitude * this.dpr;
    const lw = cfg.lineWidth * this.dpr;
    const step = Math.max(2, Math.round(4 / this.dpr));

    ctx.lineWidth = lw;

    for (let i = 0; i < count; i++) {
      const baseY = i * gap - gap * 2;
      ctx.beginPath();
      ctx.strokeStyle = this._getColor(cfg, i, count, 0, baseY);

      for (let x = 0; x <= this.w; x += step) {
        const wave = Math.sin(x * freq + this.time + cfg.phase + i * 0.15) * amp;
        const wave2 = Math.sin(x * freq * 0.7 + this.time * 0.5 + i * 0.3) * amp * 0.5;
        let py = baseY + wave + wave2;
        let px = x;

        const displaced = this._mouseDisplace(px, py, cfg);
        px = displaced.x;
        py = displaced.y;

        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }

  _drawCircles(ctx, cfg) {
    const cx = this.w / 2;
    const cy = this.h / 2;
    const maxR = Math.sqrt(cx * cx + cy * cy);
    const gap = cfg.gap * this.dpr * cfg.scale;
    const count = Math.ceil(maxR / gap);
    const freq = cfg.frequency * 10;
    const amp = cfg.amplitude * this.dpr * 0.3;
    const lw = cfg.lineWidth * this.dpr;
    const segments = 120;

    ctx.lineWidth = lw;

    for (let i = 1; i <= count; i++) {
      const baseR = i * gap;
      ctx.beginPath();
      ctx.strokeStyle = this._getColor(cfg, i, count, cx, cy);

      for (let s = 0; s <= segments; s++) {
        const angle = (s / segments) * TWO_PI;
        const wave = Math.sin(angle * freq + this.time + i * 0.2) * amp;
        const r = baseR + wave;
        let px = cx + Math.cos(angle) * r;
        let py = cy + Math.sin(angle) * r;

        const d = this._mouseDisplace(px, py, cfg);
        px = d.x; py = d.y;

        if (s === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.stroke();
    }
  }

  _drawSquares(ctx, cfg) {
    const gap = cfg.gap * this.dpr * cfg.scale;
    const size = gap * 0.7;
    const cols = Math.ceil(this.w / gap) + 2;
    const rows = Math.ceil(this.h / gap) + 2;
    const lw = cfg.lineWidth * this.dpr;

    ctx.lineWidth = lw;
    let idx = 0;
    const total = cols * rows;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        let px = col * gap + gap / 2;
        let py = row * gap + gap / 2;

        // Rotation based on position + time
        const angle = Math.sin(px * cfg.frequency + py * cfg.frequency + this.time) * 0.5;
        // Size modulation
        const smod = 0.5 + 0.5 * Math.sin(px * cfg.frequency * 0.5 + py * cfg.frequency * 0.3 + this.time * 0.7);
        const s = size * smod;

        const d = this._mouseDisplace(px, py, cfg);
        px = d.x; py = d.y;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.strokeStyle = this._getColor(cfg, idx++, total, px, py);
        ctx.strokeRect(-s / 2, -s / 2, s, s);
        ctx.restore();
      }
    }
  }

  _drawRectangles(ctx, cfg) {
    const gap = cfg.gap * this.dpr * cfg.scale;
    const cols = Math.ceil(this.w / gap) + 2;
    const rows = Math.ceil(this.h / gap) + 2;
    const lw = cfg.lineWidth * this.dpr;

    ctx.lineWidth = lw;
    let idx = 0;
    const total = cols * rows;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        let px = col * gap + gap / 2;
        let py = row * gap + gap / 2;

        const angle = Math.sin(px * cfg.frequency + this.time) * 0.3;
        const aspect = 1 + Math.sin(py * cfg.frequency + this.time * 0.5) * 0.8;
        const w = gap * 0.6 * aspect;
        const h = gap * 0.4;

        const d = this._mouseDisplace(px, py, cfg);
        px = d.x; py = d.y;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.strokeStyle = this._getColor(cfg, idx++, total, px, py);
        ctx.strokeRect(-w / 2, -h / 2, w, h);
        ctx.restore();
      }
    }
  }

  _drawDots(ctx, cfg) {
    const gap = cfg.gap * this.dpr * cfg.scale;
    const maxR = gap * 0.4;
    const cols = Math.ceil(this.w / gap) + 2;
    const rows = Math.ceil(this.h / gap) + 2;
    let idx = 0;
    const total = cols * rows;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        let px = col * gap + gap / 2;
        let py = row * gap + gap / 2;

        // Size modulation — halftone effect
        const smod = 0.2 + 0.8 * Math.abs(Math.sin(
          px * cfg.frequency * 0.5 + py * cfg.frequency * 0.3 + this.time * 0.5
        ));
        const r = maxR * smod;

        const d = this._mouseDisplace(px, py, cfg);
        px = d.x; py = d.y;

        ctx.beginPath();
        ctx.fillStyle = this._getColor(cfg, idx++, total, px, py);
        ctx.arc(px, py, r, 0, TWO_PI);
        ctx.fill();
      }
    }
  }

  _drawTriangles(ctx, cfg) {
    const gap = cfg.gap * this.dpr * cfg.scale;
    const cols = Math.ceil(this.w / gap) + 2;
    const rows = Math.ceil(this.h / (gap * 0.866)) + 2;
    const lw = cfg.lineWidth * this.dpr;
    const size = gap * 0.5;

    ctx.lineWidth = lw;
    let idx = 0;
    const total = cols * rows;

    for (let row = -1; row < rows; row++) {
      for (let col = -1; col < cols; col++) {
        const offset = (row % 2) * gap * 0.5;
        let px = col * gap + offset + gap / 2;
        let py = row * gap * 0.866 + gap / 2;

        const angle = Math.sin(px * cfg.frequency * 0.5 + py * cfg.frequency * 0.3 + this.time) * Math.PI * 0.3;
        const smod = 0.4 + 0.6 * Math.abs(Math.sin(px * cfg.frequency + this.time * 0.3));
        const s = size * smod;

        const d = this._mouseDisplace(px, py, cfg);
        px = d.x; py = d.y;

        const flip = (row + col) % 2 === 0 ? 1 : -1;

        ctx.save();
        ctx.translate(px, py);
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.strokeStyle = this._getColor(cfg, idx++, total, px, py);
        ctx.moveTo(0, -s * flip);
        ctx.lineTo(-s * 0.866, s * 0.5 * flip);
        ctx.lineTo(s * 0.866, s * 0.5 * flip);
        ctx.closePath();
        ctx.stroke();
        ctx.restore();
      }
    }
  }

  _drawWaves(ctx, cfg) {
    const count = cfg.density;
    const lw = cfg.lineWidth * this.dpr;
    const amp = cfg.amplitude * this.dpr;
    const freq = cfg.frequency;
    const step = Math.max(2, Math.round(4 / this.dpr));

    ctx.lineWidth = lw;

    for (let i = 0; i < count; i++) {
      const phase = (i / count) * TWO_PI + cfg.phase;
      const yBase = (i / count) * this.h;

      ctx.beginPath();
      ctx.strokeStyle = this._getColor(cfg, i, count, 0, yBase);

      for (let x = 0; x <= this.w; x += step) {
        // Lissajous-inspired compound waves
        const y1 = Math.sin(x * freq + this.time + phase) * amp;
        const y2 = Math.sin(x * freq * 1.5 + this.time * 0.7 + phase * 2) * amp * 0.4;
        const y3 = Math.cos(x * freq * 0.3 + this.time * 1.3 + phase * 0.5) * amp * 0.3;
        let py = yBase + y1 + y2 + y3;
        let px = x;

        const d = this._mouseDisplace(px, py, cfg);
        px = d.x; py = d.y;

        if (x === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.stroke();
    }
  }
}
