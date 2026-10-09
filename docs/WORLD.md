# World and body rules

The arena is 720 × 440 arbitrary world units. The odor source is (558,214), with a visit radius of 28. Obstacles are circles centered at (325,133), radius 32, and (343,319), radius 41. Source visits count transitions from outside to inside, not every tick spent inside.

Odor is an anisotropic Gaussian with widths 235 and 88, modulated by `0.91 + 0.09*cos(y/35+t/80)`. It is bounded from zero to one. Neither concentration nor distance is calibrated to a laboratory measurement.

Advance moves 3.6 units. Turning actions rotate heading by ±0.27 radians and move 1.55 units. Pause has zero translation. Screen y points down, so a negative rotation is a visual left turn. The body has a 14-unit boundary margin and a 10-unit obstacle clearance. Collision increments a counter and rotates heading by +0.71 radians.

Energy decreases by `0.00036*speed` and increases by 0.008 while inside the source radius. It is clamped from zero to one. Energy is an observation feature, not a mortality or fitness mechanism. The same rules apply to all policies.

The rendered arena preserves the world's aspect ratio. Coordinates, path length, and final distance are shown in world units. Fly wings in the arena are a body glyph, not a simulated aerodynamic model.
