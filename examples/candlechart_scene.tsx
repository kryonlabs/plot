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
import { CandleRangeFor, PriceBar } from "plot/Plot";
import { CandleChart } from "plot/tsx/charts";


function DrawExample(session: Session, bounds: Rectangle, key: u64): void {
    const bars: [PriceBar, PriceBar, PriceBar, PriceBar, PriceBar, PriceBar, PriceBar, PriceBar] = [
        nativeInit<PriceBar>({open: 2, close: 3, high: 4, low: 1, volume: 20}),
        nativeInit<PriceBar>({open: 3, close: 5, high: 6, low: 2, volume: 40}),
        nativeInit<PriceBar>({open: 4, close: 4, high: 5, low: 3, volume: 60}),
        nativeInit<PriceBar>({open: 5, close: 8, high: 9, low: 4, volume: 80}),
        nativeInit<PriceBar>({open: 4, close: 6, high: 7, low: 3, volume: 100}),
        nativeInit<PriceBar>({open: 7, close: 9, high: 10, low: 6, volume: 120}),
        nativeInit<PriceBar>({open: 6, close: 8, high: 9, low: 5, volume: 140}),
        nativeInit<PriceBar>({open: 8, close: 11, high: 12, low: 7, volume: 160}),
    ];
    <CandleChart session={session} bars={nativeSlice(bars)} range={CandleRangeFor(nativeSlice(bars), s32(8))} props={{key: key,
        bounds: bounds, visible_count: s32(8), semantic_label: "Example candles and volume",
        up_color: {r: u8(35), g: u8(115), b: u8(92), a: u8(255)}, down_color: {r: u8(185), g: u8(65), b: u8(67), a: u8(255)},
        grid_color: {r: u8(180), g: u8(200), b: u8(210), a: u8(150)}}}/>;
}

export function SetExampleOptions(_disabled: boolean, _reducedMotion: boolean): void {
}

export function Frame(frame: App.Frame): void {
    const session: Session = {slot: frame.slot, epoch: frame.epoch};
    const viewport = frame.viewport;
    <Box session={session} props={{bounds: viewport, fill: StyleTokenColor("canvas")}}/>;
    <Column session={session} props={{bounds: viewport, padding: Gap(ThemeMetricRole.ThemeMetricSpace6),
        gap: Gap(ThemeMetricRole.ThemeMetricSpace4), gap_override: true}}>
        <Text session={session} props={{bounds: {height: 36}, text: "CandleChart", size: s32(23)}}/>
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
    return App.Run({title: "candlechart"}, Frame);
}
