const svgCursor = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <circle cx="12" cy="12" r="6" fill="white" stroke="black" stroke-width="2"/>
</svg>`;
const base64Cursor = typeof window !== 'undefined' ? btoa(svgCursor) : '';

export const CURSOR_MAP = {
  note: 'crosshair',
  draw: `url("data:image/svg+xml;base64,${base64Cursor}") 12 12, crosshair`,
  eraser: `url("data:image/svg+xml;base64,${base64Cursor}") 12 12, crosshair`,
};
