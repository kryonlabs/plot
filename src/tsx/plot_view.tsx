import * as Native from "PlotWidget";
import { Session } from "kryon/session";

export interface PlotProps {
    session: Session;
    props: Native.PlotProps;
    values: float32[];
}

export function Plot(widget: PlotProps): s32 {
    return Native.Plot(widget.session, widget.props, widget.values);
}
