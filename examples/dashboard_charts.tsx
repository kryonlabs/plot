import { Rectangle } from "kryon/geometry";
import { Session } from "kryon/session";
import * as Plot from "Plot";
import { BarChart, HeatmapChart, TimeCandleChart64, WaterfallChart, XYChart } from "plot/tsx/dashboard";

function Beside(bounds: Rectangle): Rectangle {
    return {x: bounds.x + bounds.width + 12, y: bounds.y, width: bounds.width, height: bounds.height};
}

// The second panel uses the original strategy values with its own observed range.
function Equity(session: Session, bounds: Rectangle): void {
    const selected: [Plot.XYPointValue, Plot.XYPointValue, Plot.XYPointValue, Plot.XYPointValue] = [
        {x: 1640995200, y: 100}, {x: 1648771200, y: 102.9},
        {x: 1664582400, missing: true}, {x: 1672444800, y: 110.37},
    ];
    const benchmark: [Plot.XYPointValue, Plot.XYPointValue, Plot.XYPointValue] = [
        {x: 1640995200, y: 100}, {x: 1648771200, y: 163.7}, {x: 1672444800, y: 293.58},
    ];
    const series: [Plot.XYSeries, Plot.XYSeries] = [
        {name: "Selected", points: nativeSlice(selected)}, {name: "Buy and hold", points: nativeSlice(benchmark)},
    ];
    <XYChart session={session} series={nativeSlice(series)} props={{key: u64(11), bounds: bounds,
        label: "Equity comparison", date_x: true, y_unit: "index", x_min: 1640995200, x_max: 1672444800}}/>;
    <XYChart session={session} series={nativeSlice(series, s32(0), s32(1))} props={{key: u64(12), bounds: Beside(bounds),
        label: "Selected under stress", date_x: true, y_unit: "index", x_min: 1640995200, x_max: 1672444800}}/>;
}

function Returns(session: Session, bounds: Rectangle): void {
    const years: [string, string, string] = ["2020", "2022", "2025"];
    const strategy: [Plot.ChartValue, Plot.ChartValue, Plot.ChartValue] = [{value: 4}, {value: 10.37}, {value: -6.43}];
    const hold: [Plot.ChartValue, Plot.ChartValue, Plot.ChartValue] = [{value: -14.8}, {value: -64.2}, {value: -18.5}];
    const returns: [Plot.BarSeries, Plot.BarSeries] = [
        {name: "Selected", values: nativeSlice(strategy)}, {name: "Buy and hold", values: nativeSlice(hold)},
    ];
    <BarChart session={session} categories={nativeSlice(years)} series={nativeSlice(returns)} props={{key: u64(13), bounds: bounds,
        label: "Returns in down years", y_unit: "%"}}/>;
    let differences: [Plot.ChartValue, Plot.ChartValue, Plot.ChartValue] = [{}, {}, {}];
    for (let index = s32(0); index < s32(3); index += s32(1)) {
        differences[index] = {value: strategy[index].value - hold[index].value};
    }
    const delta: [Plot.BarSeries] = [{name: "Return difference", values: nativeSlice(differences)}];
    <BarChart session={session} categories={nativeSlice(years)} series={nativeSlice(delta)} props={{key: u64(14), bounds: Beside(bounds),
        label: "Outperformance", y_unit: "pp", horizontal: true, hide_legend: true}}/>;
}

function Contributions(session: Session, bounds: Rectangle): void {
    const columns: [string, string, string] = ["2020", "2022", "2025"];
    const rows: [string, string] = ["Momentum", "Carry"];
    const cells: [Plot.ChartValue, Plot.ChartValue, Plot.ChartValue, Plot.ChartValue, Plot.ChartValue, Plot.ChartValue] = [
        {value: 6}, {value: -12}, {missing: true}, {}, {value: 5}, {value: -4.2},
    ];
    <HeatmapChart session={session} columns={nativeSlice(columns)} rows={nativeSlice(rows)} cells={nativeSlice(cells)} props={{key: u64(15),
        bounds: bounds, label: "Trait returns", y_unit: "%"}}/>;
    const steps: [Plot.WaterfallStep, Plot.WaterfallStep, Plot.WaterfallStep, Plot.WaterfallStep] = [
        {label: "Start", value: 18.5, total: true}, {label: "Signals", value: 7.25},
        {label: "Costs", value: -4.38}, {label: "End", value: 21.37, total: true},
    ];
    <WaterfallChart session={session} steps={nativeSlice(steps)} props={{key: u64(16), bounds: Beside(bounds),
        label: "Return contributions", y_unit: "pp"}}/>;
}

function Diagnostics(session: Session, bounds: Rectangle): void {
    const bars: [Plot.PriceBar64, Plot.PriceBar64, Plot.PriceBar64] = [
        {timestamp: s64(1640995200), open: 100, high: 118, low: 98, close: 111},
        {timestamp: s64(1641081600), open: 110, high: 115, low: 104, close: 106},
        {timestamp: s64(1641340800), open: 106, high: 125, low: 105, close: 121},
    ];
    const allocation: [Plot.XYPointValue, Plot.XYPointValue, Plot.XYPointValue, Plot.XYPointValue] = [
        {x: 1640995200, y: 25}, {x: 1641081600, y: 60}, {x: 1641254400, y: 15}, {x: 1641340800, y: 15},
    ];
    const trades: [Plot.XYPointValue, Plot.XYPointValue] = [{x: 1641081600, y: 60}, {x: 1641254400, y: 15}];
    const marks: [Plot.XYSeries, Plot.XYSeries] = [
        {name: "Allocation", mark: Plot.XYMark.XYStep, points: nativeSlice(allocation)},
        {name: "Trade", mark: Plot.XYMark.XYPoint, points: nativeSlice(trades)},
    ];
    const hit = <TimeCandleChart64 session={session} bars={nativeSlice(bars)} props={{key: u64(17), label: "Price",
        bounds: bounds, x_min: 1640995200, x_max: 1641340800, y_unit: "USD"}}/>;
    <XYChart session={session} series={nativeSlice(marks)} props={{key: u64(18), label: "Allocation and trades",
        bounds: Beside(bounds), x_min: 1640995200, x_max: 1641340800, y_unit: "%", date_x: true,
        link_hover: hit.active, hover_x: hit.x}}/>;
}

export function Draw(session: Session, viewport: Rectangle): void {
    const width = (viewport.width - 36) / 2;
    const height = (viewport.height - 54) / 4;
    let bounds: Rectangle = {x: 12, y: 9, width: width, height: height};
    Equity(session, bounds);
    bounds.y = bounds.y + height + 12;
    Returns(session, bounds);
    bounds.y = bounds.y + height + 12;
    Contributions(session, bounds);
    bounds.y = bounds.y + height + 12;
    Diagnostics(session, bounds);
}
