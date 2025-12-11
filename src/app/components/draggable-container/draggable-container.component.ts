import { 
  Component, 
  Input, 
  Output, 
  EventEmitter, 
  signal, 
  ElementRef, 
  ViewChild,
  OnInit,
  OnDestroy,
  AfterViewInit,
  HostListener,
  inject
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { DraggableService } from '../../services/draggable.service';

/**
 * DraggableContainerComponent - Makes any content draggable with minimize support
 * 
 * Like floating lillies on a pond - can be dragged around and minimized to icons.
 */
@Component({
  selector: 'app-draggable-container',
  standalone: true,
  imports: [CommonModule],
  template: `
    <!-- Minimized Icon State -->
    @if (isMinimized()) {
      <div 
        #minimizedIcon
        class="minimized-icon"
        [class.dragging]="isDragging()"
        [style.left.px]="minimizedX()"
        [style.top.px]="minimizedY()"
        (mousedown)="startDrag($event)"
        (touchstart)="startDragTouch($event)"
        (dblclick)="restore()"
      >
        <div class="icon-content">
          <span class="icon-emoji">{{ icon }}</span>
        </div>
        <div class="icon-tooltip">
          <span class="tooltip-name">{{ name }}</span>
          <span class="tooltip-hint">Double-click to restore</span>
        </div>
        <div class="icon-ripple"></div>
      </div>
    }

    <!-- Expanded State -->
    <div 
      #container
      class="draggable-container"
      [class.minimized]="isMinimized()"
      [class.dragging]="isDragging()"
      [style.left.px]="posX()"
      [style.top.px]="posY()"
      [style.width]="width"
      [style.height]="height"
    >
      <!-- Drag Handle -->
      <div 
        class="drag-handle"
        (mousedown)="startDrag($event)"
        (touchstart)="startDragTouch($event)"
      >
        <div class="handle-dots">
          <span></span><span></span><span></span>
          <span></span><span></span><span></span>
        </div>
      </div>

      <!-- Window Controls -->
      <div class="window-controls">
        <button class="control-btn minimize" (click)="minimize()" title="Minimize">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
        <button class="control-btn reset" (click)="resetPosition()" title="Reset Position">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"></path>
            <path d="M3 3v5h5"></path>
          </svg>
        </button>
      </div>

      <!-- Protected Badge -->
      <div class="protected-badge">
        <span>🔒</span>
        <span class="badge-text">{{ name }}</span>
      </div>

      <!-- Content -->
      <div class="content-wrapper">
        <ng-content></ng-content>
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: contents;
    }

    /* Minimized Icon */
    .minimized-icon {
      position: fixed;
      width: 56px;
      height: 56px;
      z-index: 1001;
      cursor: grab;
      transition: transform 0.2s ease, box-shadow 0.2s ease;
    }

    .minimized-icon:active {
      cursor: grabbing;
    }

    .minimized-icon.dragging {
      cursor: grabbing;
      transform: scale(1.1);
    }

    .icon-content {
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(10, 10, 18, 0.95);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 16px;
      box-shadow: 
        0 8px 32px rgba(0, 0, 0, 0.4),
        0 0 40px rgba(99, 102, 241, 0.15);
      transition: all 0.2s ease;
    }

    .minimized-icon:hover .icon-content {
      border-color: rgba(99, 102, 241, 0.6);
      box-shadow: 
        0 12px 40px rgba(0, 0, 0, 0.5),
        0 0 60px rgba(99, 102, 241, 0.25);
      transform: translateY(-2px);
    }

    .icon-emoji {
      font-size: 1.5rem;
    }

    .icon-ripple {
      position: absolute;
      inset: -4px;
      border: 2px solid rgba(99, 102, 241, 0.3);
      border-radius: 20px;
      animation: ripple 2s ease-out infinite;
      pointer-events: none;
    }

    @keyframes ripple {
      0% { transform: scale(1); opacity: 1; }
      100% { transform: scale(1.3); opacity: 0; }
    }

    /* Tooltip */
    .icon-tooltip {
      position: absolute;
      left: 50%;
      bottom: calc(100% + 12px);
      transform: translateX(-50%) translateY(10px);
      background: rgba(10, 10, 18, 0.98);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 12px;
      padding: 10px 14px;
      white-space: nowrap;
      opacity: 0;
      visibility: hidden;
      transition: all 0.2s ease;
      pointer-events: none;
      box-shadow: 0 8px 24px rgba(0, 0, 0, 0.4);
      z-index: 1002;
    }

    .icon-tooltip::after {
      content: '';
      position: absolute;
      top: 100%;
      left: 50%;
      transform: translateX(-50%);
      border: 6px solid transparent;
      border-top-color: rgba(99, 102, 241, 0.3);
    }

    .minimized-icon:hover .icon-tooltip {
      opacity: 1;
      visibility: visible;
      transform: translateX(-50%) translateY(0);
    }

    .tooltip-name {
      display: block;
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-primary);
      margin-bottom: 4px;
    }

    .tooltip-hint {
      display: block;
      font-size: 0.7rem;
      color: var(--text-muted);
    }

    /* Draggable Container */
    .draggable-container {
      position: fixed;
      z-index: 1000;
      transition: opacity 0.3s ease, transform 0.3s ease;
    }

    .draggable-container.minimized {
      opacity: 0;
      transform: scale(0.8);
      pointer-events: none;
    }

    .draggable-container.dragging {
      transition: none;
      z-index: 1005;
    }

    /* Drag Handle */
    .drag-handle {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 60px;
      height: 20px;
      cursor: grab;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      border-radius: 0 0 8px 8px;
      background: rgba(99, 102, 241, 0.1);
      transition: background 0.2s ease;
    }

    .drag-handle:hover {
      background: rgba(99, 102, 241, 0.2);
    }

    .drag-handle:active {
      cursor: grabbing;
    }

    .handle-dots {
      display: grid;
      grid-template-columns: repeat(3, 4px);
      grid-template-rows: repeat(2, 4px);
      gap: 3px;
    }

    .handle-dots span {
      width: 4px;
      height: 4px;
      background: rgba(99, 102, 241, 0.5);
      border-radius: 50%;
    }

    /* Window Controls */
    .window-controls {
      position: absolute;
      top: -12px;
      right: 12px;
      display: flex;
      gap: 6px;
      z-index: 10;
    }

    .control-btn {
      width: 28px;
      height: 28px;
      display: flex;
      align-items: center;
      justify-content: center;
      background: rgba(10, 10, 18, 0.95);
      border: 1px solid rgba(99, 102, 241, 0.3);
      border-radius: 8px;
      cursor: pointer;
      color: var(--text-muted);
      transition: all 0.2s ease;
    }

    .control-btn svg {
      width: 14px;
      height: 14px;
    }

    .control-btn:hover {
      background: rgba(99, 102, 241, 0.2);
      border-color: rgba(99, 102, 241, 0.5);
      color: var(--text-primary);
    }

    .control-btn.minimize:hover {
      background: rgba(245, 158, 11, 0.2);
      border-color: rgba(245, 158, 11, 0.5);
      color: #f59e0b;
    }

    /* Protected Badge */
    .protected-badge {
      position: absolute;
      top: -12px;
      left: 16px;
      display: flex;
      align-items: center;
      gap: 6px;
      background: var(--bg-tertiary);
      border: 1px solid rgba(99, 102, 241, 0.3);
      padding: 4px 10px;
      border-radius: 8px;
      font-size: 0.65rem;
      color: var(--accent-purple);
      z-index: 10;
    }

    .badge-text {
      font-weight: 600;
    }

    /* Content Wrapper */
    .content-wrapper {
      width: 100%;
      height: 100%;
    }

    /* Responsive */
    @media (max-width: 768px) {
      .minimized-icon {
        width: 48px;
        height: 48px;
      }

      .icon-emoji {
        font-size: 1.25rem;
      }

      .window-controls {
        right: 8px;
      }

      .control-btn {
        width: 24px;
        height: 24px;
      }

      .control-btn svg {
        width: 12px;
        height: 12px;
      }
    }
  `]
})
export class DraggableContainerComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('container') containerRef!: ElementRef<HTMLDivElement>;
  @ViewChild('minimizedIcon') iconRef!: ElementRef<HTMLDivElement>;

  @Input() id!: string;
  @Input() name = 'Element';
  @Input() icon = '📦';
  @Input() width = 'auto';
  @Input() height = 'auto';
  @Input() initialX = 0;
  @Input() initialY = 0;
  @Input() minimizedInitialX = 20;
  @Input() minimizedInitialY = 100;

  @Output() minimizedChange = new EventEmitter<boolean>();

  private draggableService = inject(DraggableService);

  isMinimized = signal(false);
  isDragging = signal(false);
  posX = signal(0);
  posY = signal(0);
  minimizedX = signal(20);
  minimizedY = signal(100);

  private dragStartX = 0;
  private dragStartY = 0;
  private elementStartX = 0;
  private elementStartY = 0;
  private boundMouseMove: (e: MouseEvent) => void;
  private boundMouseUp: () => void;
  private boundTouchMove: (e: TouchEvent) => void;
  private boundTouchEnd: () => void;

  constructor() {
    this.boundMouseMove = this.onMouseMove.bind(this);
    this.boundMouseUp = this.stopDrag.bind(this);
    this.boundTouchMove = this.onTouchMove.bind(this);
    this.boundTouchEnd = this.stopDrag.bind(this);
  }

  ngOnInit() {
    this.posX.set(this.initialX);
    this.posY.set(this.initialY);
    this.minimizedX.set(this.minimizedInitialX);
    this.minimizedY.set(this.minimizedInitialY);
  }

  ngAfterViewInit() {
    // Register with service
    this.draggableService.register({
      id: this.id,
      name: this.name,
      icon: this.icon,
      isMinimized: false,
      position: { x: this.initialX, y: this.initialY },
      minimizedPosition: { x: this.minimizedInitialX, y: this.minimizedInitialY },
      defaultPosition: { x: this.initialX, y: this.initialY },
      size: { width: 0, height: 0 }
    });
  }

  ngOnDestroy() {
    this.removeListeners();
  }

  startDrag(event: MouseEvent) {
    event.preventDefault();
    this.isDragging.set(true);
    this.dragStartX = event.clientX;
    this.dragStartY = event.clientY;
    
    if (this.isMinimized()) {
      this.elementStartX = this.minimizedX();
      this.elementStartY = this.minimizedY();
    } else {
      this.elementStartX = this.posX();
      this.elementStartY = this.posY();
    }

    document.addEventListener('mousemove', this.boundMouseMove);
    document.addEventListener('mouseup', this.boundMouseUp);
  }

  startDragTouch(event: TouchEvent) {
    if (event.touches.length !== 1) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    this.isDragging.set(true);
    this.dragStartX = touch.clientX;
    this.dragStartY = touch.clientY;
    
    if (this.isMinimized()) {
      this.elementStartX = this.minimizedX();
      this.elementStartY = this.minimizedY();
    } else {
      this.elementStartX = this.posX();
      this.elementStartY = this.posY();
    }

    document.addEventListener('touchmove', this.boundTouchMove, { passive: false });
    document.addEventListener('touchend', this.boundTouchEnd);
  }

  private onMouseMove(event: MouseEvent) {
    if (!this.isDragging()) return;
    
    const deltaX = event.clientX - this.dragStartX;
    const deltaY = event.clientY - this.dragStartY;
    
    this.updatePosition(deltaX, deltaY);
  }

  private onTouchMove(event: TouchEvent) {
    if (!this.isDragging() || event.touches.length !== 1) return;
    event.preventDefault();
    
    const touch = event.touches[0];
    const deltaX = touch.clientX - this.dragStartX;
    const deltaY = touch.clientY - this.dragStartY;
    
    this.updatePosition(deltaX, deltaY);
  }

  private updatePosition(deltaX: number, deltaY: number) {
    let newX = this.elementStartX + deltaX;
    let newY = this.elementStartY + deltaY;

    // Get viewport bounds
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    if (this.isMinimized()) {
      // Bounds for minimized icon (56x56)
      const iconSize = 56;
      newX = Math.max(8, Math.min(viewportWidth - iconSize - 8, newX));
      newY = Math.max(8, Math.min(viewportHeight - iconSize - 8, newY));
      this.minimizedX.set(newX);
      this.minimizedY.set(newY);
    } else {
      // Get element dimensions
      const element = this.containerRef?.nativeElement;
      const width = element?.offsetWidth || 200;
      const height = element?.offsetHeight || 100;
      
      // Keep within viewport
      newX = Math.max(8, Math.min(viewportWidth - width - 8, newX));
      newY = Math.max(8, Math.min(viewportHeight - height - 8, newY));
      this.posX.set(newX);
      this.posY.set(newY);
    }
  }

  private stopDrag() {
    this.isDragging.set(false);
    this.removeListeners();
  }

  private removeListeners() {
    document.removeEventListener('mousemove', this.boundMouseMove);
    document.removeEventListener('mouseup', this.boundMouseUp);
    document.removeEventListener('touchmove', this.boundTouchMove);
    document.removeEventListener('touchend', this.boundTouchEnd);
  }

  minimize() {
    this.isMinimized.set(true);
    this.minimizedChange.emit(true);
    this.draggableService.setMinimized(this.id, true);
  }

  restore() {
    this.isMinimized.set(false);
    this.minimizedChange.emit(false);
    this.draggableService.setMinimized(this.id, false);
  }

  resetPosition() {
    this.posX.set(this.initialX);
    this.posY.set(this.initialY);
    this.draggableService.resetPosition(this.id);
  }

  @HostListener('window:resize')
  onWindowResize() {
    // Ensure elements stay within bounds after resize
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    // Adjust minimized icon position
    const iconSize = 56;
    if (this.minimizedX() > viewportWidth - iconSize - 8) {
      this.minimizedX.set(viewportWidth - iconSize - 8);
    }
    if (this.minimizedY() > viewportHeight - iconSize - 8) {
      this.minimizedY.set(viewportHeight - iconSize - 8);
    }

    // Adjust expanded position
    const element = this.containerRef?.nativeElement;
    if (element) {
      const width = element.offsetWidth;
      const height = element.offsetHeight;
      if (this.posX() > viewportWidth - width - 8) {
        this.posX.set(Math.max(8, viewportWidth - width - 8));
      }
      if (this.posY() > viewportHeight - height - 8) {
        this.posY.set(Math.max(8, viewportHeight - height - 8));
      }
    }
  }
}

