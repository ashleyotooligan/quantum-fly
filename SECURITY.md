# Security and local operation

The supplied application runs offline. It does not request accounts, credentials, wallet signatures, RPC access, or remote AI calls. The Node and Python servers bind to loopback and are development launchers, not public deployment servers.

Checkpoints are parsed as JSON and validated before restoration. They are never executed. The app also limits import size. Do not place secrets in checkpoint files, issues, or screenshots.

To report a vulnerability, use GitHub's private vulnerability reporting if enabled for the repository. For ordinary visual or scientific-method issues, use a public issue with a reproducible example. Dependency installation is required only for optional native screenshot tooling; review the dependency's own release information when upgrading.
