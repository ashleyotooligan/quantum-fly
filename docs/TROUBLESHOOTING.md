# Troubleshooting

**README pictures show 404:** check that `assets/brand/`, `assets/art/`, and `assets/screenshots/` were uploaded at the repository root. Filenames and letter case must match. Upload the inner `quantum-fly` folder's contents, not another outer folder and not just the root files. See [upload guide](../GITHUB-UPLOAD.md).

**Blank page opening index.html:** the modular viewer needs a local HTTP server. Run `npm start`, or open the fully embedded `Quantum-Fly.html` instead.

**Port already in use:** stop the other server or set `QF_PORT=4174` in your shell before running the Node server. The standalone file does not need a port.

**Screenshot command lacks Canvas:** only PNG recapture requires the optional `@napi-rs/canvas` package. Demo, tests, build, and experiments use no runtime packages. Install the documented pinned version.

**Different text appearance:** the renderer requests DejaVu Sans and DejaVu Sans Mono, with system fallbacks. Captures register these fonts on the release environment. Browser rendering may use another system fallback. The values and layout remain shared code.

**A checkpoint fails import:** inspect its schema and shape, or export a fresh checkpoint. The importer validates plain data and refuses files above 2 MB. It does not import arbitrary scripts.

**A capture differs from the bundled example:** restore seed 41, phase 0, coherent policy, gamma 0, lesion off, then Reset. That places the interactive loop at tick 640. Fixed views always show their declared parameters.
