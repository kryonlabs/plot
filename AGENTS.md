# plot

A Ziran chart package for Kryon: line, price-bar and candle charts, animated
line charts, and dashboard charts (shared axes, grouped bars, heatmaps, step
and scatter marks, waterfalls, linked time panes). `src/Plot/module.zi` is the
public export, so `plot/Plot` resolves by file in consumers. README.md is the
chart reference and cookbook.

## Layout

| Path | Contents |
| --- | --- |
| `src/` | Chart modules; `src/Plot/module.zi` re-exports the public surface |
| `Makefile` | Build, check and cookbook targets |

## Commands

```sh
make build               # build the package
make run                 # open the chart cookbook on the native backend
make check               # source check plus chart and indicator tests
make check-animated-line # animated line chart regression, no window
make check-dashboard     # dashboard chart tests
make dashboard-zx        # ZX build of the dashboard cookbook
```

## Pins

- Ziran toolchain: `ba28d7c0a3f5583958a126a30006d92b506e96fb`
- Kryon: `ad43e92a582786c592c3c205a4141c901a385e8c`

Public module names use `UpperCamelCase`; lowercase names are implementation
modules. Commit as Waozi <waozi@proton.me>; ordinary changes stay in
CHANGELOG's `Unreleased` section.
