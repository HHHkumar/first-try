# Electrical MCQs Lab

`index.html` is a complete, self-contained page (no build step, no dependencies besides Google Fonts).
`body.html` is the same page without the outer document tags; it is the source used for the Claude artifact preview. Edit `body.html`, then rebuild `index.html` from it, or simply edit `index.html` directly.

## Add it to electricalmcqs.in

1. Copy the `lab` folder (only `index.html` is needed) into the folder your Netlify build publishes
   (for a plain static site that is the site root; for Vite or Create React App it is `public/`; for Next.js it is `public/`; for Astro it is `public/`).
2. Build and push as usual. The page is then at `https://electricalmcqs.in/lab/`.
3. Link to it from your menu, e.g. `<a href="/lab/">Lab</a>`.

Each experiment has its own address: `/lab/#wire`, `#charge`, `#capacitor`, `#magnet`, `#inductor`, `#light`, `#generator`, `#ac`, `#rlc`.
Put the matching link in each YouTube description so viewers land on the right experiment.
