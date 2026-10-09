# Two-qubit mathematics

The implementation is a classical simulation of a small quantum circuit. It does not claim quantum advantage, biological quantum computation, or execution on a quantum device.

## Representation

A complex number is `[real, imaginary]`. Basis order is `[00,01,10,11]`. The vector has four entries. Qubit 0 is the high bit; qubit 1 is the low bit. A single-qubit gate is lifted by preserving the other bit. CNOT flips the low bit only when the high bit is one.

For a pure vector psi, `rho[i][j] = psi[i]*conj(psi[j])`. Unitary density evolution is `U*rho*U†`. The diagonal gives standard-basis outcome probabilities. Purity is `Tr(rho²)`, implemented as the sum of squared complex magnitudes for a Hermitian matrix.

## Gates

`RY(a)` has rows `[cos(a/2), -sin(a/2)]` and `[sin(a/2), cos(a/2)]`. `RZ(a)` is diagonal with `exp(-ia/2)` and `exp(+ia/2)`. `H` has rows `[1,1]` and `[1,-1]`, divided by sqrt(2). The circuit prepares both RY rotations, applies CNOT, changes q0 phase, applies the optional channel, and finally H on q0 plus RY on q1.

The final two gates are important: changing phase alone preserves immediate populations, while changing the measurement basis can expose interference. Fully dephasing before those gates removes the phase dependence in this circuit.

## Encoder

Let `contrast=clamp(7*(odorRight-odorLeft),-1,1)` and `wall=wallLeft-wallRight`. Group means are `g1` for recurrent and `g2` for motor.

```text
theta0  = pi * (0.32 + 0.30*odorLeft  + 0.12*g1)
theta1  = pi * (0.18 + 0.32*odorRight + 0.20*g2)
phi     = phaseOffset + 2.4*contrast + 0.7*wall
readout = pi * (0.10 + 0.18*g2)
```

These are hand-chosen parameters, not trained gates. They demonstrate a phase-sensitive controller rather than an optimized navigator.

## Measurement and diagnostics

One uniform draw selects the first cumulative probability interval containing it. The sampler is a seeded classical PRNG. Calling this Born sampling describes the distribution being sampled, not a source of physical quantum randomness.

Reduced Bloch vectors come from partial tracing over the other qubit. A shortened vector can reflect correlations or mixedness; no entanglement estimate is asserted in the UI. The state before noise is a pure vector. After nonzero dephasing, use the density matrix; no single pure vector is advertised for the mixed output.

See [IBM Quantum's measurement introduction](https://quantum.cloud.ibm.com/learning/courses/basics-of-quantum-information/single-systems/quantum-information) and [gate introduction](https://quantum.cloud.ibm.com/learning/courses/utility-scale-quantum-computing/bits-gates-and-circuits) for the underlying formalism. The equations above document this project's original implementation choices.
