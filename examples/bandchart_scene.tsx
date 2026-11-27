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
import { BandChartBand, BandChartPoint } from "plot/Plot";
import { BandChart } from "plot/tsx/charts";

function DrawExample(session: Session, bounds: Rectangle, key: u64): void {
    const values: [float32, float32, float32, float32, float32, float32, float32, float32] = [3, 5, 4, 8, 6, 9, 8, 11];
    const bands: [BandChartBand] = [nativeInit<BandChartBand>({low: 4, high: 9, has_low: true, has_high: true})];
    let points: [BandChartPoint, BandChartPoint, BandChartPoint, BandChartPoint, BandChartPoint, BandChartPoint, BandChartPoint, BandChartPoint] = [nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({}), nativeInit<BandChartPoint>({})];
    for (let index = s32(0); index < s32(8); index += s32(1)) {
        const value = values[index];
        points[index] = {slot: index, value: value, good: value >= 4 && value <= 9 ? s32(1) : s32(0),
            label: "Hover or tap a point"};
    }
    <BandChart session={session} points={nativeSlice(points)} bands={nativeSlice(bands)} props={{key: key, bounds: bounds,
        semantic_label: "Values and a target band", slots: s32(8), min_value: 0, max_value: 12,
        top_label: "12", bottom_label: "0", font: s32(14), good_color: {r: u8(35), g: u8(115), b: u8(92), a: u8(255)},
        other_color: {r: u8(180), g: u8(125), b: u8(70), a: u8(255)}, band_color: {r: u8(131), g: u8(181), b: u8(160), a: u8(80)},
        grid_color: {r: u8(180), g: u8(200), b: u8(210), a: u8(150)}, text_color: StyleTokenColor("text"),
        label_fill: StyleTokenColor("surface")}}/>;
}

export function SetExampleOptions(_disabled: boolean, _reducedMotion: boolean): void {
}

export function Frame(frame: App.Frame): void {
    const session: Session = {slot: frame.slot, epoch: frame.epoch};
    const viewport = frame.viewport;
    <Box session={session} props={{bounds: viewport, fill: StyleTokenColor("canvas")}}/>;
    <Column session={session} props={{bounds: viewport, padding: Gap(ThemeMetricRole.ThemeMetricSpace6),
        gap: Gap(ThemeMetricRole.ThemeMetricSpace4), gap_override: true}}>
        <Text session={session} props={{bounds: {height: 36}, text: "BandChart", size: s32(23)}}/>
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
    return App.Run({title: "bandchart"}, Frame);
}
