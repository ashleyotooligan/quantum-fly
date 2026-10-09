# Start the local laboratory

Open `Quantum-Fly.html` after extracting the archive. All images and JavaScript are embedded. Opening it from a file works; opening `index.html` from a file may block module loading, so serve the modular version instead.

Node.js 20+: run `npm start` and visit `http://127.0.0.1:4173`. Python 3.10+: run `python start_quantum_fly.py`. The server binds to loopback. Stop with Ctrl+C. Do not start both launchers on the same port. Set `QF_PORT` for a different Node port if needed.

The lab begins paused at seed 41, tick 640. Choose one of fourteen views. Play runs at at most 12.5 updates per wall-clock second, independent of the model tick's biological meaning. Step advances once. Reset uses the current seed, phase, dephasing, policy, and lesion setting. Changing those settings also resets the run.

Phase/dephasing plot views use fixed parameters, not the current moving fly. Baseline/fork views use fixed seed 41 at tick 640. Other views follow the current simulation. Their headings identify the fixed comparisons.

Export checkpoint saves JSON. Import accepts at most 2 MB and displays the first resumed frame. Save view as PNG exports the current Canvas. Space toggles play; right arrow steps while focus is outside form fields. The view selector is the keyboard-friendly alternative to clicking the sidebar.

No install is needed for the standalone demo. No wallet, RPC, API, external model, or quantum backend is contacted.
