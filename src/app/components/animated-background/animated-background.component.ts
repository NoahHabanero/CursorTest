import { Component, OnInit, OnDestroy, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
}

/**
 * AnimatedBackgroundComponent - Canvas-based Particle Animation
 * 
 * Creates a mesmerizing particle network background effect.
 */
@Component({
  selector: 'app-animated-background',
  standalone: true,
  imports: [CommonModule],
  template: `
    <canvas #canvas class="background-canvas"></canvas>
    <div class="gradient-overlay"></div>
    <div class="grid-overlay"></div>
  `,
  styles: [`
    :host {
      position: fixed;
      inset: 0;
      z-index: -1;
      pointer-events: none;
    }

    .background-canvas {
      position: absolute;
      inset: 0;
      width: 100%;
      height: 100%;
    }

    .gradient-overlay {
      position: absolute;
      inset: 0;
      background: 
        radial-gradient(ellipse 100% 60% at 10% -10%, rgba(99, 102, 241, 0.12) 0%, transparent 50%),
        radial-gradient(ellipse 80% 50% at 90% 110%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
        radial-gradient(ellipse 60% 40% at 50% 50%, rgba(0, 245, 255, 0.03) 0%, transparent 50%);
    }

    .grid-overlay {
      position: absolute;
      inset: 0;
      background-image: 
        linear-gradient(rgba(255, 255, 255, 0.015) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.015) 1px, transparent 1px);
      background-size: 80px 80px;
      opacity: 0.6;
    }
  `]
})
export class AnimatedBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('canvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  
  private ctx!: CanvasRenderingContext2D;
  private particles: Particle[] = [];
  private animationId!: number;
  private width = 0;
  private height = 0;
  private mouseX = -1000;
  private mouseY = -1000;

  private colors = [
    'rgba(99, 102, 241, 0.6)',   // indigo
    'rgba(139, 92, 246, 0.6)',   // violet
    'rgba(0, 245, 255, 0.5)',    // cyan
    'rgba(236, 72, 153, 0.4)',   // pink
  ];

  ngOnInit() {
    window.addEventListener('resize', this.handleResize);
    window.addEventListener('mousemove', this.handleMouseMove);
  }

  ngAfterViewInit() {
    this.initCanvas();
    this.createParticles();
    this.animate();
  }

  ngOnDestroy() {
    window.removeEventListener('resize', this.handleResize);
    window.removeEventListener('mousemove', this.handleMouseMove);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }
  }

  private handleResize = () => {
    this.initCanvas();
    this.particles = [];
    this.createParticles();
  }

  private handleMouseMove = (e: MouseEvent) => {
    this.mouseX = e.clientX;
    this.mouseY = e.clientY;
  }

  private initCanvas() {
    const canvas = this.canvasRef.nativeElement;
    const dpr = window.devicePixelRatio || 1;
    
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    
    canvas.width = this.width * dpr;
    canvas.height = this.height * dpr;
    canvas.style.width = `${this.width}px`;
    canvas.style.height = `${this.height}px`;
    
    this.ctx = canvas.getContext('2d')!;
    this.ctx.scale(dpr, dpr);
  }

  private createParticles() {
    const particleCount = Math.floor((this.width * this.height) / 15000);
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        vx: (Math.random() - 0.5) * 0.3,
        vy: (Math.random() - 0.5) * 0.3,
        radius: Math.random() * 2 + 1,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: Math.random() * 0.5 + 0.2
      });
    }
  }

  private animate = () => {
    this.ctx.fillStyle = 'rgba(3, 3, 8, 0.1)';
    this.ctx.fillRect(0, 0, this.width, this.height);

    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;

      // Mouse interaction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const force = (150 - dist) / 150;
        particle.vx -= (dx / dist) * force * 0.02;
        particle.vy -= (dy / dist) * force * 0.02;
      }

      // Boundaries
      if (particle.x < 0 || particle.x > this.width) particle.vx *= -1;
      if (particle.y < 0 || particle.y > this.height) particle.vy *= -1;

      // Keep in bounds
      particle.x = Math.max(0, Math.min(this.width, particle.x));
      particle.y = Math.max(0, Math.min(this.height, particle.y));

      // Damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;

      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = particle.color;
      this.ctx.fill();

      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          const alpha = (1 - distance / 120) * 0.15;
          this.ctx.strokeStyle = `rgba(99, 102, 241, ${alpha})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });

    this.animationId = requestAnimationFrame(this.animate);
  }
}

