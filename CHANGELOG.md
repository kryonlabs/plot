# Changelog

## [Unreleased]

- Use published Ziran dc3ecf0a and Kryon e2b0fbd8 for typed TSX composition over the native chart implementations.

- Add TSX bindings for Plot and the chart widgets, and author the dashboard cookbook in TSX.

- Share the Kryon revision that fixes GPU seams in rounded fills.

- Recognize chart capabilities imported through the current `plot` package alias so bundled Habits opens offline.

- Pin Ziran ba28d7c0 and Kryon 6a41ba74 so applications share the fixed GPU skinning, native entry, web scene compilation and hosted package naming paths.

- Build with Ziran c041afb6 and Kryon 09664f07: the cookbook app declares `main` and runs `App.Run` like every Kryon program now that the program-export program entry is gone.
- Build with Ziran 8133bd41 and Kryon d97c19e8, the Kryon source Breeze, Apps, Entity, Plot, Game2D and CSS share.
- Add native dashboard charts for shared-scale comparisons, signed grouped bars,
  heatmaps, step and scatter marks, waterfalls, and linked time panes.
- Add a runnable dashboard cookbook for Kryon desktop and ZX.
