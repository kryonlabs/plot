import * as App from "kryon/app";
import { StyleTokenColor } from "kryon/drawing_props";
import { ExampleBounds, InstallPlotStyles } from "kryon/examples/optional_scene_styles";
import { Rectangle } from "kryon/geometry";
import { Gap } from "kryon/layout";
import { Session } from "kryon/session";
import { ThemeMetricRole } from "kryon/theme";
import { Box } from "kryon/tsx/box";
import { Column } from "kryon/tsx/layout";
import { Text } from "kryon/tsx/text";
import { ChartRangeForBoth } from "plot/Plot";
import { LineChartCompare } from "plot/tsx/charts";

function DrawExample(session: Session, bounds: Rectangle, key: u64): void {
    const values: [float32, float32, float32, float32, float32, float32, float32, float32] = [3, 5, 4, 8, 6, 9, 8, 11];
    const previous: [float32, float32, float32, float32, float32, float32, float32, float32] = [2, 3, 4, 5, 4, 7, 6, 8];
    <LineChartCompare session={session} values={nativeSlice(values)} previous={nativeSlice(previous)} range={ChartRangeForBoth(nativeSlice(values), nativeSlice(previous))}
        props={{key: key, bounds: bounds,
        semantic_label: "Example line chart", line_color: {r: u8(23), g: u8(107), b: u8(131), a: u8(255)},
        grid_color: {r: u8(180), g: u8(200), b: u8(210), a: u8(150)}, compare_color: {r: u8(180), g: u8(125), b: u8(70), a: u8(255)}}}/>;
}

export function SetExampleOptions(_disabled: boolean, _reducedMotion: boolean): void {
}

export function Frame(frame: App.Frame): void {
    const session: Session = {slot: frame.slot, epoch: frame.epoch};
    const viewport = frame.viewport;
    <Box session={session} props={{bounds: viewport, fill: StyleTokenColor("canvas")}}/>;
    <Column session={session} props={{bounds: viewport, padding: Gap(ThemeMetricRole.ThemeMetricSpace6),
        gap: Gap(ThemeMetricRole.ThemeMetricSpace4), gap_override: true}}>
        <Text session={session} props={{bounds: {height: 36}, text: "LineChartCompare", size: s32(23)}}/>
        {DrawStandalone(session, viewport)}
    </Column>;
}

function DrawStandalone(session: Session, viewport: Rectangle): void {
    InstallPlotStyles(StyleTokenColor("canvas").r < u8(128));
    DrawExample(session, ExampleBounds(viewport), u64(0));
}

export function GalleryFrame(frame: App.Frame): void {
    const session: Session = {slot: frame.slot, epoch: frame.epoch};
    DrawExample(session, ExampleBounds(frame.viewport), u64(600));
}

export function main(): s32 {
    return App.Run({title: "linechartcompare"}, Frame);
}
