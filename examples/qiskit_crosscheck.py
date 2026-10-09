"""Optional independent coherent-gate check. Requires a separately installed Qiskit.

Run from any directory: python examples/qiskit_crosscheck.py
No quantum cloud account or hardware is involved. The default app does not use Qiskit.
"""
from pathlib import Path
import json
import math

try:
    from qiskit import QuantumCircuit
    from qiskit.quantum_info import Statevector
except ImportError as error:
    raise SystemExit('Optional check: install qiskit in your own virtual environment first.') from error

root = Path(__file__).resolve().parents[1]
payload = json.loads((root / 'data/phase-sweep.json').read_text())
params = payload['params']
maximum_error = 0.0
for point in payload['points']:
    circuit = QuantumCircuit(2)
    # Qiskit numbers its least-significant bit 0. Our q0 is the high bit.
    circuit.ry(params['theta0'], 1)
    circuit.ry(params['theta1'], 0)
    circuit.cx(1, 0)
    circuit.rz(point['phi'], 1)
    circuit.h(1)
    circuit.ry(params['readout'], 0)
    probabilities = Statevector.from_instruction(circuit).probabilities()
    for expected, actual in zip(point['p'], probabilities):
        maximum_error = max(maximum_error, abs(expected-float(actual)))
assert math.isfinite(maximum_error) and maximum_error < 1e-10, maximum_error
print(f'65 coherent phase points match Qiskit. Maximum absolute error: {maximum_error:.3g}')
