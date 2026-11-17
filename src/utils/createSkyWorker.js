/**
 * createSkyWorker.js
 *
 * Builds the star-projection Web Worker.
 *
 * Vite's `?worker&inline` import compiles src/workers/skyWorker.js into a worker
 * constructor bundled inline (base64 blob). That avoids two problems we hit with
 * the hand-rolled approaches:
 *   - `new Worker(new URL('../workers/skyWorker.js', import.meta.url), ...)`
 *     fails to load as an ESM module worker in dev.
 *   - importing the source with `?raw` and building the Blob ourselves goes stale
 *     under HMR, because the raw module is cached separately from the component.
 *
 * `?worker&inline` keeps the worker file as the single source of truth and keeps
 * dev and production identical.
 */

import SkyWorker from '../workers/skyWorker.js?worker&inline';

export function createSkyWorker() {
  return new SkyWorker();
}
