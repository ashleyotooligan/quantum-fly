# Publish Quantum Fly on your GitHub

**Owner:** `ashleyotooligan`  
**Repository name:** `quantum-fly`  
**Description:** `A fly-inspired neural laboratory with a phase-sensitive two-qubit decision loop, reproducible experiments, and an offline observation viewer.`  
**First commit:** `Launch Quantum Fly: neural loop, quantum decision simulator, and observation gallery`

## Upload from your browser

1. Create a repository named `quantum-fly` at [github.com/new](https://github.com/new). Choose Public if you want everyone to view it. Leave GitHub's generated README, license, and gitignore options off; the archive includes them.
2. Extract `Quantum-Fly-GitHub.zip` on your computer. Open the **inner `quantum-fly` folder**. You should see `README.md`, `Quantum-Fly.html`, `src`, `docs`, `assets`, `data`, `experiments`, `examples`, `tests`, and `scripts` together.
3. On GitHub, choose **Add file → Upload files**. Drag **all contents from inside `quantum-fly`** into the upload area. Drag the folders themselves along with the root files, preserving their structure. Do not use the file picker to select only the visible root files.
4. Before committing, check the pending upload list. It must include paths such as `assets/brand/pixel-fly.png`, `assets/screenshots/01-observatory.png`, and `src/core/simulation.mjs`. If those paths are absent, the folders were skipped. Cancel and drag them in.
5. Enter the commit message above, and commit to `main`. If your browser omits `.github`, add that folder separately or use Git below. It contains the validation workflow and issue templates.
6. Return to the repository. The folders must appear at root. The pixel fly, observation image, and all gallery images should render in the README.

Do not upload the ZIP file as the source repository. Do not upload an extra enclosing `quantum-fly` folder: `README.md` belongs at the repository root, and `assets/` belongs beside it. Filenames are case sensitive on GitHub.

## Reliable alternative: Git

Open a terminal inside the extracted `quantum-fly` folder. After creating an empty repository on your account:

```sh
git init
git branch -M main
git add .
git commit -m "Launch Quantum Fly: neural loop, quantum decision simulator, and observation gallery"
git remote add origin https://github.com/ashleyotooligan/quantum-fly.git
git push -u origin main
```

Authenticate using your normal GitHub method. Do not place passwords or tokens in project files. If the remote already has commits, clone it first and copy this folder's contents into the clone rather than force pushing.

## Check the finished upload

- Root: `README.md`, `Quantum-Fly.html`, and source folders are visible.
- Image link: `assets/brand/pixel-fly.png` opens successfully.
- Screenshot: `assets/screenshots/01-observatory.png` opens successfully.
- README: logo and fourteen captures render without broken links.
- Code: `src/quantum/circuit.mjs` is present.
- Actions: the Node validation workflow runs after the source upload.

Suggested topics: `simulation`, `neuroscience`, `quantum-computing`, `drosophila`, `canvas`, `reproducible-research`, `javascript`.

Optional social preview: repository Settings → General → Social preview → upload the separately supplied `Quantum-Fly-Preview.png`. The logo is already at the top of the README. A repository does not have an independent avatar field; social preview is the separate card image.

The repository is a downloadable local application. Uploading the source does not automatically host a website. To run it, clone or download the files and open `Quantum-Fly.html`. GitHub Pages is optional and not required.

GitHub's [official upload instructions](https://docs.github.com/en/repositories/working-with-files/managing-files/adding-a-file-to-a-repository) explain drag-and-drop folder uploads. This release stays within the browser guide's 100-file budget and below 25 MiB per file.
