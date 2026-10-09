# Source architecture

`core` is the world and controller boundary. It provides seeded streams, normalization, world motion, sensing, neural updates, reference logits, and simulation state. `quantum` provides complex arithmetic, lifted gates, density evolution, dephasing, and interval sampling. `lab` composes reproducible demonstrations and scalar analysis. `view` draws records without changing them.

The browser app owns controls, play timing, checkpoints, and image downloads. Source modules are served by a tiny loopback server. A deliberately explicit bundler places the same modules and base64 PNGs into `Quantum-Fly.html`. No network fetch is needed by that output.

`scripts/capture.mjs` calls the exact renderer using optional native Canvas. `scripts/experiments.mjs` calls the same model and writes JSON/Markdown. `scripts/check.mjs` validates links and syntax. Node's built-in test runner checks independent mathematical and behavioral invariants.

Rendering never consumes the model's random stream. Illustrative anatomy is kept separate from the procedural movement glyph. A frame is calculated once, then shared between the raster, probability display, telemetry, and ledger.

Adding a hardware quantum backend would require a new explicit interface: parameter submission, shot count, observed frequencies, delays, error handling, and a reproducibility record. It is not silently supplied by the current simulator.
