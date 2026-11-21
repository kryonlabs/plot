# Plot

`plot` is a Ziran package that depends on the separate Kryon package. It
owns `PlotWidget`, a retained Kryon widget that draws lines, bars, markers,
and axes over caller-owned values, and its candle chart draws OHLC bodies and
wicks, volume, SMA 20, SMA 50, and EMA 20 over that surface. `ChartMarker` and `CandleMarkers` add dated,
clickable markers while leaving each marker's meaning to the caller. The simple
line and candle charts accept caller-owned values and colors. The dashboard
charts below add shared axes, date labels, legends and value formatting to
caller-supplied datasets.

The shared plot surface, text, border and marks use Kryon's active palette
on each draw. The `surface`, `text`, `border` and `accent` style tokens can
supply custom colors, including within a scoped widget palette. Installed
style rules can also override the defaults. Existing charts pick up theme
changes on their next draw, and callers retain control of their series colors.

Install the Ziran launcher once with `make install-user` in Ziran, then run
`ziran fetch` and `make build` here. `make run` opens the chart cookbook on
the native Cairo backend. `make check` checks the source and runs the chart and indicator tests.
The checked-in `ziran.lock` pins both Ziran and Kryon to exact commits. Plot
exports `src/Plot/module.zi` for other packages, so `plot/Plot` resolves by
its file both in projects and in builds that name `--module-path plot=DIR`.
That module re-exports Plot's
charts and Kryon's public UI surface; app code can use
`using Charts :: #import "Plot";`.

To add Plot to another Ziran project, run:

```sh
ziran add https://git.waozi.xyz/kryonlabs/plot.git
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

ATR consumes Plot through its package manifest and canonical local overrides
during integration. Other packages can use the dependency directly.
Public module names use `UpperCamelCase` (`Kryon`, `PlotWidget`, `Plot`).
Lowercase names such as `plot_widget` are implementation modules; the
lowercase `plot` export remains available for existing consumers.

## Animated line charts

`AnimatedLineChart` uses the same props and drawing as `LineChart` and takes
one retained `AnimatedLineChartState` per chart. Give it a workspace of three
`float32` values per point of capacity. Keep that workspace alive and exclusive
to the state. Plot snapshots each target, so you can update or replace the input
slice between calls. Keep the `ChartRange` fixed during motion so the axes stay
in place. `ChartRangeForBoth` can set the scale for two known series.

Call it with monotonic seconds each frame. It returns `true` while the host
needs to schedule another frame. The first series appears immediately. A new
target starts at the values sampled at the current time, including when it
interrupts an animation. When the length changes, Plot samples the current line
at the new evenly spaced x positions. A single point uses the right edge.
Empty or over-capacity input draws directly and clears the transition. The
next in-capacity series appears immediately. A null state also draws directly.

The default duration is 0.25 seconds with ease-out, scaled by Kryon's theme
motion multiplier. Pass the optional `duration`, `reduced_motion`, and
`easing` arguments to control playback. A disabled theme, an explicit reduced
motion preference, or a nonpositive duration settles immediately. The widget
requires a Kryon revision that exports `kryon/motion`. `make check-animated-line`
runs its native regression test without opening a window.

```zi
App :: #import "kryon/app";
Button :: #import "kryon/button";
Desktop :: #import "kryon/desktop_runtime";
Charts :: #import "plot/Plot";
#import "kryon/drawing_props"
#import "kryon/frame_snapshot"
#import "kryon/geometry"
#import "kryon/session"

previous: [3]float32 = .{2.0, 4.0, 3.0};
current: [3]float32 = .{4.0, 3.0, 7.0};
workspace: [9]float32;
chart: Charts.AnimatedLineChartState;
show_current: bool;

Draw :: (frame: App.Frame) {
    session := Session.{.slot = frame.slot, .epoch = frame.epoch}
    if Button.Draw(session, Button.Props.{.key = 1, .label = "Switch week",
        .bounds = Rectangle.{24.0, 20.0, 120.0, 36.0}}) != 0 {
        show_current = !show_current
    }
    values := ifx show_current then current[:] else previous[:]
    scale := Charts.ChartRangeForBoth(current[:], previous[:])
    props := Charts.LineChartProps.{.key = 2,
        .bounds = Rectangle.{24.0, 80.0, 352.0, 144.0},
        .semantic_label = "Weekly visits", .line_color = ColorFromPacked(0x168265ff),
        .grid_color = ColorFromPacked(0xb4bdc9ff)}
    now := cast(float64)CaptureFrameInput(session).elapsed_ms / 1000.0
    if Charts.AnimatedLineChart(session, props, values, scale, *chart, now) {
        Desktop.DesktopRequestFrame()
    }
}

main :: () -> s32 {
    chart.workspace = workspace[:]
    return App.Run(App.Window.{.title = "Weekly visits", .width = 400, .height = 248}, Draw)
}
```

## High-precision candlesticks

For OHLCV data stored as `float64`, pass the visible `[]PriceBar64` and a
caller-owned `[]PriceBar` of the same length or longer to `CandleProject`.
The function offsets and scales prices in `float64` before storing them in
the `[1, 2]` domain used by the renderer. It also normalizes volume. Pass
the projected bars and `projection.range` to `CandleChart`. Input must have
finite, ordered OHLC values and finite, nonnegative volumes. A zero `span`
indicates empty input, insufficient output space, or an unrepresentable
domain. Flat input receives a small centered display span.

Use `CandleProjectedPrice(projection, tick)` to recover a `float64` price
for an axis label. For example, `CandleProjectedPrice(projection, 1.5)` gives
the midpoint price and `CandleY(1.5, price_bounds, projection.range)` gives
its position. Use the original bars for detailed captions.

`CandleViewportFor(bars, right_edge, selected, visible)` resolves ascending
timestamps into the half-open window `[first, end)`. A zero `right_edge`
follows the latest bar. `selected` is a timestamp on input and an absolute
bar index on output. The window retains the selected bar when visible and
otherwise selects the rightmost visible bar. An empty window has selection
`-1`. Use `CandlePanEnd` to move the window and `CandleCenterX` and
`CandleIndexAtX` to map between visible slots and plot coordinates.

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

`CandleRangeFor(bars, visible_count, logarithmic = false)` supports a positive
logarithmic price domain while keeping linear callers compatible. Range fields
remain actual prices. `CandlePadRange` recomputes padding after caller-owned
level expansion. `CandleY` and `CandlePriceAtY` are matching forward/inverse
transforms for candle bodies, wicks, averages, levels, price ticks and tooltips.
Invalid/nonpositive prices are not painted on a logarithmic chart.
`CandleWindowEnd(bars, timestamp)` resolves a stable retained right edge (zero
follows latest); `CandlePanStepsFor` and `CandlePanEnd` support caller-owned drag
windows. Chart libraries do not fetch markets or change application selection.

## Native dashboard charts

Import `plot/Plot` and call any chart from a Kryon frame with the widget's
layout rectangle and a stable key. Chart data is borrowed for that call.
`ChartProps.label` names the card in the UI and the retained tree. The palette
supplies surface, text, grid and sign colors. A series can use a packed
`0xRRGGBBAA` color or leave `color` at zero to use the chart palette.

[The dashboard cookbook](examples/dashboard_charts.zi) implements these calls
with illustrative data in a runnable Kryon frame. `make run` runs it natively.
`make dashboard-zx` compiles it to `build/plot-portable.zx`. `ziran tool kryon run --profile portable`
opens the bundle in the native Kryon player.

| Dashboard chart | Plot API and data |
| --- | --- |
| Strategy and buy-and-hold equity, drawdown, rolling metrics | `XYChart` with named `XYSeries` sharing one x and y scale. Each `XYPointValue` holds full-precision `float64` x and y. Dates use Unix seconds in UTC with `date_x = true`. |
| Focused strategy equity | `XYChart` with the strategy slice alone, its original values and unit, a new key, and a descriptive label. It uses its own observed y scale. |
| Bad-year returns and sensitivity | `BarChart` with `[]string` labels and one `BarSeries` per comparison. Each group's bars share zero as a baseline. Set `horizontal = true` for long labels or sensitivity rankings. |
| Outperformance in bad years | Filter the years using the application's benchmark criteria. Compute strategy return minus buy-and-hold return from their original values and label the result `pp` (percentage points). |
| Trait or calendar return matrix | `HeatmapChart` takes column labels, row labels, and a row-major `[]ChartValue`. It colors both signs symmetrically around zero and hatches unavailable cells. |
| Trade marks and allocation history | Set `XYSeries.mark` to `.XYPoint` for scatter and `.XYStep` for previous-value hold until the next timestamp. The default `.XYLine` connects consecutive valid points in input order. |
| Contribution bridge | `WaterfallChart` draws each delta from its running value. A `total = true` bar starts at zero and sets the new running value. A missing step leaves that value available and breaks the connector. |
| Linked OHLC, equity, Sharpe and volatility | `TimeCandleChart64` consumes timestamped `PriceBar64` data. `TimeCandleChart` accepts existing `PriceBar` slices. Pair it with `XYChart` panes using equal widths and x origins, and the same finite `x_min` and `x_max`. All panes use the active date via `link_hover` and `hover_x`. |

A line or step gap is a sample with `missing = true` or a nonfinite coordinate.
Put a gap sample between adjacent observations when they must remain visually
separate. Unequal sample dates always use actual coordinate spacing. A
nonfinite or missing bar leaves its group slot empty, as does a series shorter
than the category slice. Missing or omitted heatmap cells stay distinct from
zero. Explicit finite ascending ranges crop the visible geometry. An
all-identical numeric domain expands around its sole value. `ChartHit` carries
source indices and raw values. An inactive hit has `index = -1` and `series = -1`.
For heatmaps, `index` is the column, `series` is the row, and `missing` distinguishes
a cell without a value. For linked panes, `hide_x_axis` keeps the plot aligned
while suppressing duplicate axis labels. `hide_tooltip` lets the application
lay out its own shared hover text from the selected date and each pane's inputs.

`ChartFormat(value, unit) -> Text` uses Ziran's decimal formatter, trims trailing
zeros, and displays at most two decimal places. It compacts large amounts and
appends the caller's unit. For example, `ChartFormat(10.37, "%")` displays
`10.37%`, and `ChartFormat(74.57, "pp")` displays `74.57 pp`. Pass already-scaled
percentage values. Store calculations and chart inputs at their original
precision.

When porting an HTML dashboard, place its cards with Kryon layout and pass
those rectangles to Plot. Map SVG paths, circles, and rectangles to Plot
marks fed by your dataset. Kryon style tokens and per-series colors cover
native palette choices. Rebuild tooltip behavior from `ChartHit` where the
default tooltip is insufficient. HTML, JavaScript chart options, SVG markup,
and browser CSS layout are inputs to the porting process. The cookbook's
`.zi` sources compile into a native host program or a `.zx` bundle.

Run `make check-dashboard` for the native C and ZX data tests.
`make check-dashboard-ui` runs the Cairo and ZX rendering and input fixture
at 550 and 1200 pixels. It uses `xvfb-run`, xdotool, ImageMagick, and Python
with Pillow.
