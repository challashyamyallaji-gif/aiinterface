/**
 * Render Particle Engine Canvas
 */
class ParticleEngine {
    constructor() {
        this.canvas = document.getElementById("particles-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.particles = [];
        this.resize();
        this.init();
        window.addEventListener("resize", () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        const count = Math.floor((this.canvas.width * this.canvas.height) / 18000);
        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.6 + 0.4,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                alpha: Math.random() * 0.5 + 0.2
            });
        }
    }

    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        const accent = getComputedStyle(document.documentElement).getPropertyValue('--accent').trim() || '#00f3ff';

        this.particles.forEach((p) => {
            p.x += p.vx;
            p.y += p.vy;

            if (p.x < 0 || p.x > this.canvas.width) p.vx *= -1;
            if (p.y < 0 || p.y > this.canvas.height) p.vy *= -1;

            this.ctx.beginPath();
            this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = accent;
            this.ctx.globalAlpha = p.alpha;
            this.ctx.fill();
        });

        requestAnimationFrame(() => this.render());
    }
}