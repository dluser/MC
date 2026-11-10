# Draught System Components: guided widgets v5 (BEV 1192)

There are seven widgets, one per handout topic, each running **Learn → Try it → Check → Summary**.
`index.html` is a hub for you (previews, embed codes, design rationale). It isn't meant for learners.

## Embed in Brightspace
```
<iframe src="https://YOUR-HOST/draught-widgets/topics/05-couplers.html" title="Couplers: interactive lesson"
  style="width:100%;height:900px;border:0;border-radius:16px" allow="fullscreen" allowfullscreen loading="lazy"></iframe>
```
- Keep `allowfullscreen`: the widget has its own Full screen button. Without it, the button opens the widget in a new tab instead.
- The design height is 900px. Pictures sit on top with text below, and learners can zoom and pan any lesson or question picture (+ / − buttons, drag, or Ctrl/⌘ + scroll). Widgets fit any frame without scrollbars (layouts flex, and dense screens scale down slightly).

## Logos
`shared/logos/` holds the CNM stacked logo (navy, `cnm-logo.svg`) and the IDEA Studio logo (navy, `idea-studio-logo.png`). They show in every footer. To swap either, replace the file and keep the name (either `.svg` or `.png` works).

## Learner controls
- **Arrow keys:** → goes to the next screen (when the button is active) and ← goes back. Arrow keys are left alone while a learner is using a knob, the draggable cylinder, or a text field.
- **Full screen:** pressing **Finish** on the Topic complete screen also leaves full screen.
- **Feedback:** every Try it shows its feedback in a caption strip inside the interaction frame. Hotspot details pop up next to the thing that was tapped.

## Files
- `shared/engine.js` / `engine.css`: flow, layout, fit-to-frame, drag-and-drop, checks, full screen
- `shared/iso.js`: illustration toolkit (3D-defined isometric parts, cel shading, camera pan/zoom, hotspots, callouts with hover labels, shared 2D cross-sections)
- `topics/NN-*.js`: all content, questions, feedback and scenes for each topic

## Data
Progress saves in the learner's browser (localStorage). Checks are practice only. When a learner finishes, the widget posts `{type:"guided-complete", id, score, total}` to the parent page.


## Fonts
The Inter typeface (SIL Open Font License, see shared/fonts/Inter-LICENSE.txt) is bundled in shared/fonts, so the widgets make no requests to outside font services.
