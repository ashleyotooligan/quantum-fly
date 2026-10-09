# Contributing

Keep model changes explicit. A new circuit gate needs mathematical tests. A new controller should declare its parameters and a meaningful classical comparison. A new visualization should read calculated records and avoid consuming simulation randomness.

Run `npm test`, `npm run experiments`, `npm run build`, and `npm run check`. If rendering changes, also regenerate captures with the documented optional native Canvas package and inspect them. Include raw outcomes when changing the encoder or world.

Do not introduce external branding, copied creature art, claims of live neurons, or hardware labels without the corresponding implemented data source. Document measured data separately from model choices. Preserve relative image paths in Markdown.

Useful issue reports include seed, mode, phase, gamma, lesion state, tick, environment, reproduction steps, and expected versus actual behavior. A checkpoint helps with simulation-state issues. Use the issue templates.
