import * as App from "kryon/app";
import { Session } from "kryon/session";
import { Draw } from "dashboard_charts";

export function Frame(frame: App.Frame): void {
    const session: Session = {slot: frame.slot, epoch: frame.epoch};
    Draw(session, frame.viewport);
}

export function main(): s32 {
    return App.Run({title: "plot"}, Frame);
}
