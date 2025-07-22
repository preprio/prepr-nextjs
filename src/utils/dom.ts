import { handleDOMError } from './errors';

export class DOMService {
  /**
   * Creates an HTML element with specified tag and class name
   */
  static createElement(tag: string, className: string): HTMLElement {
    try {
      const element = document.createElement(tag);
      element.className = className;
      return element;
    } catch (error) {
      handleDOMError(error as Error, 'createElement');
      throw error;
    }
  }

  /**
   * Appends an element to the document body
   */
  static appendToBody(element: HTMLElement): void {
    try {
      document.body.appendChild(element);
    } catch (error) {
      handleDOMError(error as Error, 'appendToBody');
      throw error;
    }
  }

  /**
   * Removes an element from the document body
   */
  static removeFromBody(element: HTMLElement): void {
    try {
      if (element.parentNode) {
        element.parentNode.removeChild(element);
      }
    } catch (error) {
      handleDOMError(error as Error, 'removeFromBody');
      throw error;
    }
  }

  /**
   * Sets multiple CSS properties on an element
   */
  static setElementStyles(
    element: HTMLElement,
    styles: Record<string, string>
  ): void {
    try {
      Object.entries(styles).forEach(([property, value]) => {
        element.style.setProperty(property, value);
      });
    } catch (error) {
      handleDOMError(error as Error, 'setElementStyles');
      throw error;
    }
  }

  /**
   * Gets the bounding rectangle of an element
   */
  static getElementRect(element: HTMLElement): DOMRect {
    try {
      return element.getBoundingClientRect();
    } catch (error) {
      handleDOMError(error as Error, 'getElementRect');
      throw error;
    }
  }

  /**
   * Checks if an element is in the viewport
   */
  static isElementInViewport(element: HTMLElement): boolean {
    try {
      const rect = this.getElementRect(element);
      return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <=
          (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <=
          (window.innerWidth || document.documentElement.clientWidth)
      );
    } catch (error) {
      handleDOMError(error as Error, 'isElementInViewport');
      return false;
    }
  }

  /**
   * Calculates distance between two points
   */
  static calculateDistance(
    x1: number,
    y1: number,
    x2: number,
    y2: number
  ): number {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
  }

  /**
   * Finds the closest element to a point from a list of elements
   */
  static findClosestElement(
    pointX: number,
    pointY: number,
    elements: NodeListOf<Element>
  ): HTMLElement | null {
    try {
      let closestElement: HTMLElement | null = null;
      let minDistance = Infinity;

      elements.forEach(element => {
        const rect = this.getElementRect(element as HTMLElement);
        const distance = this.calculateDistance(
          pointX,
          pointY,
          rect.left + rect.width / 2,
          rect.top + rect.height / 2
        );

        if (distance < minDistance) {
          minDistance = distance;
          closestElement = element as HTMLElement;
        }
      });

      return closestElement;
    } catch (error) {
      handleDOMError(error as Error, 'findClosestElement');
      return null;
    }
  }

  /**
   * Safely adds event listeners
   */
  static addEventListener(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: AddEventListenerOptions
  ): void {
    try {
      element.addEventListener(event, handler, options);
    } catch (error) {
      handleDOMError(error as Error, 'addEventListener');
      throw error;
    }
  }

  /**
   * Safely removes event listeners
   */
  static removeEventListener(
    element: EventTarget,
    event: string,
    handler: EventListener,
    options?: EventListenerOptions
  ): void {
    try {
      element.removeEventListener(event, handler, options);
    } catch (error) {
      handleDOMError(error as Error, 'removeEventListener');
      throw error;
    }
  }
}
