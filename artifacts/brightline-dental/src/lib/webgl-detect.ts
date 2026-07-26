/**
 * Detect WebGL support before attempting to mount a THREE.js canvas.
 * Returns true only when the browser can create a WebGL2 or WebGL1 context.
 * Falls back to false in headless/server environments and old browsers.
 */
export function isWebGLAvailable(): boolean {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGL2RenderingContext &&
      canvas.getContext("webgl2")
    ) || !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
    );
  } catch {
    return false;
  }
}
