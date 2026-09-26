# Plot

Plot is a reusable Ziran chart project for Kryon applications. Its candle
chart draws OHLC bodies and wicks, volume, SMA 20, SMA 50, and EMA 20 over
Kryon's generic `Plot` surface. `ChartMarker` and `CandleMarkers` add dated,
clickable markers while leaving each marker's meaning to the caller. It also
has a simple line chart. Both accept
caller-owned values and colors; market data, networking, price formatting,
and time labels stay in the application.

`make run` opens a small demo on the Cairo backend; `make check` checks the
Ziran source without opening a window. Use `src/candle_chart.zi` or
`src/line_chart.zi` from a project that already includes Kryon's UI modules.
Atr links these sources from its `src/` directory so its existing build rules
notice changes to Plot.
