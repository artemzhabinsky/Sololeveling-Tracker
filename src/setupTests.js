import '@testing-library/jest-dom/vitest'

// jsdom ships no 2D canvas implementation and no ResizeObserver, so Chart.js
// (RadarChart / XpLineChart / CategoryDonutChart) cannot instantiate and throws
// while any page that renders a chart is being mounted. These stubs let those
// components mount inertly; nothing asserts on pixels, only on the surrounding DOM.
if (typeof HTMLCanvasElement !== 'undefined') {
  HTMLCanvasElement.prototype.getContext = function getContext() {
    const canvas = this
    const gradient = { addColorStop() {} }
    return new Proxy(
      {},
      {
        get(target, prop) {
          if (prop === 'canvas') return canvas
          if (prop === 'measureText') {
            return () => ({ width: 0, actualBoundingBoxAscent: 0, actualBoundingBoxDescent: 0 })
          }
          if (prop === 'createLinearGradient' || prop === 'createRadialGradient') return () => gradient
          if (prop === 'createPattern') return () => null
          if (prop === 'getLineDash') return () => []
          if (prop === 'getImageData') return () => ({ data: new Uint8ClampedArray(4) })
          if (prop in target) return target[prop]
          return () => {}
        },
        set() {
          return true
        },
      },
    )
  }
}

if (typeof globalThis.ResizeObserver === 'undefined') {
  globalThis.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  }
}
