import { Injectable, signal } from '@angular/core';

export interface FloatingElement {
  id: string;
  name: string;
  icon: string;
  isMinimized: boolean;
  position: { x: number; y: number };
  minimizedPosition: { x: number; y: number };
  defaultPosition: { x: number; y: number };
  size: { width: number; height: number };
}

/**
 * DraggableService - Manages floating element positions and states
 */
@Injectable({
  providedIn: 'root'
})
export class DraggableService {
  elements = signal<Map<string, FloatingElement>>(new Map());

  register(element: FloatingElement) {
    this.elements.update(map => {
      const newMap = new Map(map);
      newMap.set(element.id, element);
      return newMap;
    });
  }

  updatePosition(id: string, x: number, y: number) {
    this.elements.update(map => {
      const newMap = new Map(map);
      const element = newMap.get(id);
      if (element) {
        if (element.isMinimized) {
          element.minimizedPosition = { x, y };
        } else {
          element.position = { x, y };
        }
      }
      return newMap;
    });
  }

  toggleMinimize(id: string) {
    this.elements.update(map => {
      const newMap = new Map(map);
      const element = newMap.get(id);
      if (element) {
        element.isMinimized = !element.isMinimized;
      }
      return newMap;
    });
  }

  setMinimized(id: string, minimized: boolean) {
    this.elements.update(map => {
      const newMap = new Map(map);
      const element = newMap.get(id);
      if (element) {
        element.isMinimized = minimized;
      }
      return newMap;
    });
  }

  getElement(id: string): FloatingElement | undefined {
    return this.elements().get(id);
  }

  resetPosition(id: string) {
    this.elements.update(map => {
      const newMap = new Map(map);
      const element = newMap.get(id);
      if (element) {
        element.position = { ...element.defaultPosition };
      }
      return newMap;
    });
  }
}

