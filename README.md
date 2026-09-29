# Plot

`plot` is a Ziran package that depends on the separate Kryon package. It
owns `PlotWidget`, a retained Kryon widget that draws lines, bars, markers,
and axes over caller-owned values, and its candle chart draws OHLC bodies and
wicks, volume, SMA 20, SMA 50, and EMA 20 over that surface. `ChartMarker` and `CandleMarkers` add dated,
clickable markers while leaving each marker's meaning to the caller. It also
has a simple line chart. Both accept
caller-owned values and colors; market data, networking, price formatting,
and time labels stay in the application.

Install the Ziran launcher once with `make install-user` in Ziran, then run
`ziran fetch` and `make build` here. `make run` opens a small demo on the Cairo
backend; `make check` checks the source and runs the nonvisual indicator test.
The checked-in `ziran.lock` pins both Ziran and Kryon to exact commits. Plot
exports `src/module.zi` for other packages. That module re-exports Plot's
charts and Kryon's public UI surface; app code can use
`using Charts :: #import "Plot";`.

To add Plot to another Ziran project, run:

```sh
ziran add https://github.com/kryonlabs/plot.git
```

Then import its public module, or only the chart surface:

```zi
using Charts :: #import "plot/Plot";
using Surface :: #import "plot/PlotWidget";
```

The package exports `PriceBar`, `CandleChartProps`, `CandleChart`,
`CandleRangeFor`, `ChartMarker`, `CandleMarkers`, `SMAAt`, `EMAAt`, and
the line chart API. Ziran locks Plot and Kryon to exact commits. No source
links or copied chart files are needed in a consuming package. Run
`ziran update` to refresh every dependency in a project, or
`ziran update kryon` in this package to refresh only Kryon.

ATR currently uses source links while its older project layout is migrated
to a Ziran package manifest. Other packages can use the dependency directly.
Public module names use `UpperCamelCase` (`Kryon`, `PlotWidget`, `Plot`).
Lowercase names such as `plot_widget` are implementation modules; the
lowercase `plot` export remains available for existing consumers.
