// workers/drawingWorkerSingleton.ts
let worker: Worker | null = null;
let hasTransferred = false;

export function getDrawingWorker(canvas?: OffscreenCanvas): Worker {
  if (!worker && canvas) {
    worker = new Worker(new URL('./drawingWorker.ts', import.meta.url));
    worker.postMessage({ canvas }, [canvas]);
    hasTransferred = true;
  }

  return worker!;
}

export function cleanupWorker() {
  worker?.terminate();
  worker = null;
  hasTransferred = false;
}

export function isTransferred() {
  return hasTransferred;
}
