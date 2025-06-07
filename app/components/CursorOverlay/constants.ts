const svgCursor = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24">
  <circle cx="12" cy="12" r="6" fill="white" stroke="black" stroke-width="2"/>
</svg>`;
const base64Cursor = typeof window !== 'undefined' ? btoa(svgCursor) : '';

const eraserCursor = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32">
  <g transform="translate(-3, -3)">
    <rect x="6" y="6" width="20" height="20" rx="6" ry="6" fill="#fce96a" stroke="#000" stroke-width="2"/>
    <circle cx="12" cy="12" r="2" fill="#d4c144" />
    <circle cx="20" cy="16" r="2" fill="#d4c144" />
    <circle cx="16" cy="22" r="1.5" fill="#d4c144" />
  </g>
</svg>`;
const base64EraserCursor = typeof window !== 'undefined' ? btoa(eraserCursor) : '';

export const CURSOR_MAP = {
  draw: `url("data:image/svg+xml;base64,${base64Cursor}") 12 12, crosshair`,
  eraser: `url("data:image/svg+xml;base64,${base64EraserCursor}") 12 12, crosshair`,
  note: 'crosshair',
  emoji: 'crosshair',
};
