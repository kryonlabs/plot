# Plot

`plot` is a Ziran package that depends on the separate Kryon package. It
owns `PlotWidget`, a retained Kryon widget that draws lines, bars, markers,
and axes over caller-owned values, and its candle chart draws OHLC bodies and
wicks, volume, SMA 20, SMA 50, and EMA 20 over that surface. `ChartMarker` and `CandleMarkers` add dated,
clickable markers while leaving each marker's meaning to the caller. It also
has a simple line chart. Both accept
caller-owned values and colors; market data, networking, price formatting,
and time labels stay in the application.

The shared plot surface, text, border and marks follow Kryon's current
`surface`, `text`, `border` and `accent` style tokens on each draw. Installed
style rules still override those defaults. Changing appearance updates an
existing chart without recreating it; callers retain their series colors.

Install the Ziran launcher once with `make install-user` in Ziran, then run
`ziran fetch` and `make build` here. `make run` opens a small demo on the Cairo
backend; `make check` checks the source and runs the nonvisual indicator test.
The checked-in `ziran.lock` pins both Ziran and Kryon to exact commits. Plot
exports `src/Plot/module.zi` for other packages, so `plot/Plot` resolves by
its file both in projects and in builds that name `--module-path plot=DIR`.
That module re-exports Plot's
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
`CandleRangeFor`, `ChartMarker`, `CandleMarkers`, `ChartPriceLevel`,
`CandlePriceLevels`, `SMAAt`, `EMAAt`, and
the line chart API. Ziran locks Plot and Kryon to exact commits. No source
links or copied chart files are needed in a consuming package. Run
`ziran update` to refresh every dependency in a project, or
`ziran update kryon` in this package to refresh only Kryon.

ATR currently uses source links while its older project layout is migrated
to a Ziran package manifest. Other packages can use the dependency directly.
Public module names use `UpperCamelCase` (`Kryon`, `PlotWidget`, `Plot`).
Lowercase names such as `plot_widget` are implementation modules; the
lowercase `plot` export remains available for existing consumers.

## Band charts in portable bundles

`BandChart(session, props, points, bands)` draws values over a row of slots
against the range that counts as good. A portable bundle built with
`KRYON_HOSTED_UI` sends the chart to its host as `BandChartHostedHost`. The
host answers it with `BandChartHostCall(session, module, function, arguments,
count, result)` from `band_chart_host`, beside Kryon's `WidgetHostCall`, and
allows it where `BandChartHostSupports(module, function)` says so. The
records are in `band_chart_props`, and `scripts/generate-codec.py` generates
their codec on top of Kryon's widget codec. A chart takes at most 366 points
and 366 bands.
