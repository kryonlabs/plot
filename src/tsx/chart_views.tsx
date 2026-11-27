import * as Native from "Plot";
import { Easing } from "kryon/motion";
import { Session } from "kryon/session";

export interface LineChartProps {
    session: Session;
    props: Native.LineChartProps;
    values: float32[];
    range: Native.ChartRange;
}

export interface LineChartCompareProps {
    session: Session;
    props: Native.LineChartProps;
    values: float32[];
    previous: float32[];
    range: Native.ChartRange;
}

export interface AnimatedLineChartProps {
    session: Session;
    props: Native.LineChartProps;
    values: float32[];
    range: Native.ChartRange;
    state: NativeRef<Native.AnimatedLineChartState>;
    now: float64;
    duration: float64;
    reduced_motion: boolean;
    easing: Easing;
}

export interface CandleChartProps {
    session: Session;
    props: Native.CandleChartProps;
    bars: Native.PriceBar[];
    range: Native.CandleRange;
}

export interface BandChartProps {
    session: Session;
    props: Native.BandChartProps;
    points: Native.BandChartPoint[];
    bands: Native.BandChartBand[];
}

export function LineChart(widget: LineChartProps): void {
    Native.LineChart(widget.session, widget.props, widget.values, widget.range);
}

export function LineChartCompare(widget: LineChartCompareProps): void {
    Native.LineChartCompare(widget.session, widget.props, widget.values, widget.previous, widget.range);
}

export function AnimatedLineChart(widget: AnimatedLineChartProps): boolean {
    return Native.AnimatedLineChart(widget.session, widget.props, widget.values, widget.range,
        widget.state, widget.now, widget.duration, widget.reduced_motion, widget.easing);
}

export function CandleChart(widget: CandleChartProps): void {
    Native.CandleChart(widget.session, widget.props, widget.bars, widget.range);
}

export function BandChart(widget: BandChartProps): Native.BandChartResult {
    return Native.BandChart(widget.session, widget.props, widget.points, widget.bands);
}
