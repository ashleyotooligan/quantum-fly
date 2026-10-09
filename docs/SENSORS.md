# The twelve input channels

| Index | Channel | Definition |
|---:|---|---|
| 0 | Odor left | Field sampled 22 units from body at heading −0.62 rad |
| 1 | Odor right | Field sampled 22 units from body at heading +0.62 rad |
| 2 | Odor delta | Clamp of 0.5 + 20 × change at body since last tick |
| 3 | Light left | Clamp of 0.5 + 0.45 × sin(x/160 + t/180) at left probe |
| 4 | Light right | Same function at right probe |
| 5 | Wall left | Proximity from a probe 40 units at −0.6 rad |
| 6 | Wall right | Proximity from a probe 40 units at +0.6 rad |
| 7 | Speed | Body speed divided by 3.6 |
| 8 | Energy | Internal dimensionless energy |
| 9 | Heading sin | 0.5 + sin(heading)/2 |
| 10 | Heading cos | 0.5 + cos(heading)/2 |
| 11 | Clock | 0.5 + sin(t/20)/2 |

All channels are bounded from zero to one. A wall input uses the smallest distance to a boundary or obstacle surface, rescaled as `clamp(1-distance/65)`. It is a proximity signal, not ray-traced vision.

The probes sense a synthetic scalar odor field. Light, energy, and heading are engineered features; this list is not an inventory of a biological fly's senses.
