/**
 * True on iPhone, iPad and iPod. iPadOS 13+ reports itself as a Mac, so it is
 * told apart from a real Mac by the touch screen a laptop does not have.
 * Browser-only: call it from an effect, never during render on the server.
 */
export function isIOSDevice(): boolean {
  if (typeof navigator === "undefined") return false;
  if (/iPad|iPhone|iPod/.test(navigator.userAgent)) return true;
  return navigator.platform === "MacIntel" && navigator.maxTouchPoints > 1;
}
