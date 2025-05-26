let ctx: OffscreenCanvasRenderingContext2D | null = null;
let width = 0;
let height = 0;

self.onmessage = (event) => {
  if (event.data.canvas) {
    const offscreen = event.data.canvas as OffscreenCanvas;
    width = offscreen.width;
    height = offscreen.height;
    ctx = offscreen.getContext('2d');
    if (!ctx) return;

    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.imageSmoothingEnabled = true;
    ctx.clearRect(0, 0, width, height);
  }

  if (event.data.drawCommands && ctx) {
    const { points, strokeColor, lineWidth, tool } = event.data.drawCommands;

    ctx.lineWidth = tool === 'eraser' ? lineWidth * 4 : lineWidth;
    ctx.strokeStyle = strokeColor;
    ctx.fillStyle = strokeColor;
    ctx.globalCompositeOperation = tool === 'eraser' ? 'destination-out' : 'source-over';

    ctx.beginPath();

    if (points.length === 1) {
      const p = points[0];
      ctx.arc(p.x, p.y, lineWidth / 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      for (let i = 1; i < points.length; i++) {
        const prev = points[i - 1];
        const curr = points[i];
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(curr.x, curr.y);
      }
      ctx.stroke();
    }
  }

  if (event.data.clear) {
    ctx?.clearRect(0, 0, width, height);
  }
};
