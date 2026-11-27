import * as Native from "Plot";
import { Session } from "kryon/session";

export interface XYChartProps {
    session: Session;
    props: Native.ChartProps;
    series: Native.XYSeries[];
}

export interface BarChartProps {
    session: Session;
    props: Native.ChartProps;
    categories: string[];
    series: Native.BarSeries[];
}

export interface HeatmapChartProps {
    session: Session;
    props: Native.ChartProps;
    columns: string[];
    rows: string[];
    cells: Native.ChartValue[];
}

export interface WaterfallChartProps {
    session: Session;
    props: Native.ChartProps;
    steps: Native.WaterfallStep[];
}

export interface TimeCandleChartProps<Bar> {
    session: Session;
    props: Native.ChartProps;
    bars: Bar[];
}

export function XYChart(widget: XYChartProps): Native.ChartHit {
    return Native.XYChart(widget.session, widget.props, widget.series);
}

export function BarChart(widget: BarChartProps): Native.ChartHit {
    return Native.BarChart(widget.session, widget.props, widget.categories, widget.series);
}

export function HeatmapChart(widget: HeatmapChartProps): Native.ChartHit {
    return Native.HeatmapChart(widget.session, widget.props, widget.columns, widget.rows, widget.cells);
}

export function WaterfallChart(widget: WaterfallChartProps): Native.ChartHit {
    return Native.WaterfallChart(widget.session, widget.props, widget.steps);
}

export function TimeCandleChart(widget: TimeCandleChartProps<Native.PriceBar>): Native.ChartHit {
    return Native.TimeCandleChart(widget.session, widget.props, widget.bars);
}

export function TimeCandleChart64(widget: TimeCandleChartProps<Native.PriceBar64>): Native.ChartHit {
    return Native.TimeCandleChart64(widget.session, widget.props, widget.bars);
}
