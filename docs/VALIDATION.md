# Release validation

Release 0.1.0 was checked on 2026-10-09 using Node.js 24.19.0, Python 3, and optional native Canvas 0.1.100. Node 20+ is the supported source/test environment. The GitHub workflow uses Node 22.

## Executed checks

- Node built-in suite: 27 tests covering quantum gate inverses, Bell probabilities and basis ordering, density evolution, dephasing, phase periodicity, sampling boundaries, neural resets/lesions, normalized sensors, configuration errors, matched draws, bounded body motion, replay continuation, and loopback HTTP serving.
- Independent NumPy matrix calculation: all 65 phase points and 21 dephasing points matched the bundled probabilities, with maximum absolute error below 4 × 10^-16. Density eigenvalues were nonnegative within numerical tolerance. This check constructed the channel with projector matrices, independently of the JavaScript element-wise implementation.
- Thirty matched simulations generated the raw ten-seed policy batch and result table. No outcomes were edited for presentation.
- The standalone HTML compiled as a JavaScript script. A native Canvas/DOM harness loaded embedded art and exercised boot, all fourteen views, step, settings, reset, checkpoint export/import, sidebar selection, and invalid seed handling.
- The Node launcher served HTML, modules with JavaScript MIME, and PNGs. Missing paths, directory paths, traversal attempts, and POST requests were rejected.
- All fourteen views were rendered with the shared drawing functions. Text bounds were checked against the viewport. Rendering was verified not to mutate the latest model frame.
- PNG dimensions and Markdown/HTML relative file paths were checked. Release archive checksums were verified after packaging.

## Practical limits

This environment did not provide a Chromium executable, so the UI harness is not a full browser-engine integration test. Native Canvas captures use the same drawing code but can differ from browser font rasterization. Keyboard/screen-reader behavior has not had a separate assistive-technology audit.

The optional Qiskit cross-check example is supplied but was not run for this release. It requires a separate Qiskit installation. The independent numerical matrix check above and executed unit tests provide this release's mathematical verification.

No biological data, quantum hardware, training, remote AI, exchange, or wallet integration was tested because those are not components of this project. The numerical results describe the declared synthetic system only.
