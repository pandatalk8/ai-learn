---
title: "Three.js Topographic Map Built With Claude Code And Fable"
author: "Zsolt Kacso (@kaolti)"
source_url: https://x.com/kaolti/status/2074283600103571575
mirror_url: https://www.threads.com/@kaolti/post/DaeI7XGgqSQ
source_platform: X
mirror_platform: Threads
tweet_id: "2074283600103571575"
published: 2026-07-06
captured: 2026-07-08
type: clip
lang: en
tags: [three-js, claude-code, fable, ai-coding, generative-ui, terrain-visualization, topographic-map, creative-coding]
cover_image: imgs/2026-07-08-zsolt-kacso-threejs-topographic-map-cover.jpg
capture_status: full-post-with-public-mirror-and-repo
---

# Three.js Topographic Map Built With Claude Code And Fable

**By Zsolt Kacso (@kaolti)**  
**Published on X / Threads: 2026-07-06**

![Cover](imgs/2026-07-08-zsolt-kacso-threejs-topographic-map-cover.jpg)

Original X post: <https://x.com/kaolti/status/2074283600103571575>  
Threads mirror: <https://www.threads.com/@kaolti/post/DaeI7XGgqSQ>

## Captured Post

> Always loved these topographic maps and wanted to create something similar with Three.js.
>
> 3 hours in Claude Code with Fable.

The post included a short video demo. The video binary is not stored in the vault; the local image above is the captured cover frame from the public Threads mirror.

## Follow-Up From Author

In a public follow-up reply on the same Threads discussion, the author wrote that feedback led to:

- real topography data;
- a point A to point B flyover;
- performance parameters.

The follow-up links to:

- Live demo: <https://kaolti.github.io/monolith-terrain/>
- GitHub repository: <https://github.com/kaolti/monolith-terrain>

The repository description is: "Interactive 3D topographic map — real-world elevation data rendered as a vintage USGS topo sheet with a sci-fi HUD. Three.js."

## Repository Notes

Repository: `kaolti/monolith-terrain`  
License: MIT  
Primary language: JavaScript  
Created: 2026-07-07  

The README describes MONOLITH as an interactive real-time 3D terrain map styled like a vintage USGS topographic sheet combined with a sci-fi FUI overlay. It can load real-world elevation data for locations on Earth or generate procedural mountain ranges.

Key features listed in the README:

- real-world DEM mode using terrain tiles;
- procedural noise mode with seeded multi-octave terrain;
- contour lines, hypsometric tinting, survey grid, spot elevations, and peak markers;
- cinematic flyovers between points;
- radar scan effect that sweeps and displaces the surface;
- live parameter controls for map overlay, material, camera, look, HUD, motion, performance, and lighting.

Tech stack listed in the README:

- Three.js for rendering;
- `postprocessing` for depth of field, tone mapping, grain, vignette, and SMAA;
- `lil-gui` for parameter controls;
- Vite and plain JavaScript;
- custom seeded simplex noise / FBM / ridged multifractal terrain;
- Catmull-Rom path sampling and a damped-gimbal rotation controller for tours.

Real-world mode uses Terrain Tiles in Terrarium encoding, publicly hosted through AWS Open Data, with underlying sources including SRTM, USGS 3DEP/NED, ETOPO1, and others.

## Knowledge Base Notes

This is a compact example of AI-assisted creative coding where the artifact matters more than the prompt. The noteworthy part is not merely that a terrain visualization was produced quickly, but that the later repo turned the visual demo into a parameterized, inspectable, reusable web artifact.

Potential reuse:

- Examples for writing about Claude Code / Fable as creative-coding accelerators.
- Examples for "AI-generated UI as a living system" rather than a static mockup.
- Case material for Three.js terrain visualization, procedural terrain, and real DEM data.
- A concrete artifact for comparing prototype speed claims with the more durable evidence of a public repo and demo.

## Caveats

- The "3 hours" claim is the author's statement and is not independently verifiable from the public post.
- The original post names "Fable"; it does not explicitly say "Fable 5" in the captured public text.
- The first post appears to have used noise-based terrain; the author later clarified in a separate public reply that the surface was based on noise, not real data. The later repository added real topography support.
