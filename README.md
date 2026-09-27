# Plot

Plot is a Ziran app package that depends on the separate Kryon package. Its candle
chart draws OHLC bodies and wicks, volume, SMA 20, SMA 50, and EMA 20 over
Kryon's generic `Plot` surface. `ChartMarker` and `CandleMarkers` add dated,
clickable markers while leaving each marker's meaning to the caller. It also
has a simple line chart. Both accept
caller-owned values and colors; market data, networking, price formatting,
and time labels stay in the application.

Install the Ziran launcher once with `make install-user` in Ziran, then run
`ziran fetch` and `make build` here. `make run` opens a small demo on the Cairo
backend; `make check` checks the source and runs the nonvisual indicator test.
The checked-in `ziran.lock` pins both Ziran and Kryon to exact commits. Plot
exports `Plot/module.zi` for other packages. That module re-exports Plot's
charts and Kryon's public UI surface; app code can use
`using Charts :: #import "Plot";`.

Other applications can still use `src/candle_chart.zi` and
`src/line_chart.zi` while packaging of reusable chart modules is being
finished. Atr currently links those sources from its `src/` directory.
