"""Drive the cookbook's native and ZX windows on a private X display."""

import os
from pathlib import Path
import signal
import subprocess
import sys
import time

from PIL import Image, ImageChops


OUTPUT = Path("build/dashboard-render").resolve()
HEIGHT = 840


def render(command, profile):
    with (OUTPUT / f"{profile}.log").open("wb") as log:
        app = subprocess.Popen(command, stdout=log, stderr=subprocess.STDOUT, start_new_session=True)
        try:
            deadline = time.monotonic() + 120
            while time.monotonic() < deadline and app.poll() is None:
                window = subprocess.run(
                    ["xdotool", "search", "--onlyvisible", "--name", "^plot$"],
                    capture_output=True, text=True, timeout=3,
                ).stdout.splitlines()
                if window:
                    break
                time.sleep(0.2)
            else:
                raise AssertionError(f"{profile} window did not open; see {log.name}")
            window = window[0]
            subprocess.run(["xdotool", "windowmove", window, "0", "0"], check=True, timeout=5)

            def move(x, y):
                subprocess.run(["xdotool", "mousemove", "--window", window, str(x), str(y)],
                               check=True, timeout=5)

            def capture(name):
                path = OUTPUT / f"{profile}-{name}.png"
                subprocess.run(["import", "-window", window, "PNG32:" + str(path)], check=True, timeout=5)
                with Image.open(path) as image:
                    return image.convert("RGB")

            for width in (550, 1200):
                subprocess.run(["xdotool", "windowsize", "--sync", window, str(width), str(HEIGHT)],
                               check=True, timeout=5)
                move(3, 3)
                time.sleep(0.6)
                before = capture(str(width))
                assert before.size == (width, HEIGHT), (profile, before.size)
                card_width = (width - 36) / 2
                card_height = (HEIGHT - 54) / 4
                # The second series uses the fallback amber color. Its down-year
                # bars are solid, so this counts painted pixels, not antialiasing.
                returns = before.crop((90, 270, int(card_width), 375))
                colors = {color: count for count, color in returns.getcolors(returns.width * returns.height)}
                assert colors.get((227, 154, 67), 0) > 100, profile
                # The actual strategy/benchmark hover must change the card raster.
                move(125, 130)
                time.sleep(0.5)
                hovered = capture(f"{width}-hover")
                changed = ImageChops.difference(before, hovered).getbbox()
                assert changed and changed[0] >= 12 and changed[2] <= card_width + 13, (profile, changed)
                # Moving into OHLC changes the peer pane as well via linked x.
                move(125, int(9 + 3 * (card_height + 12) + 86))
                time.sleep(0.5)
                linked = capture(f"{width}-linked")
                peer = (int(card_width) + 25, 668, width - 12, 825)
                assert ImageChops.difference(before.crop(peer), linked.crop(peer)).getbbox(), (profile, width)
                print(f"{profile}: {width}px native raster, grouped bars, shared hover and linked hover")
        finally:
            if app.poll() is None:
                os.killpg(app.pid, signal.SIGTERM)
                try:
                    app.wait(timeout=8)
                except subprocess.TimeoutExpired:
                    os.killpg(app.pid, signal.SIGKILL)
                    app.wait(timeout=8)


def main():
    if len(sys.argv) == 2:
        OUTPUT.mkdir(parents=True, exist_ok=True)
        env = os.environ.copy()
        for key in ("DISPLAY", "WAYLAND_DISPLAY", "XAUTHORITY", "ICEAUTHORITY",
                    "DBUS_SESSION_BUS_ADDRESS", "SESSION_MANAGER", "DESKTOP_SESSION",
                    "XDG_SESSION_ID", "XDG_SESSION_TYPE", "KRYON_TEST_DRIVER"):
            env.pop(key, None)
        env.update(HARMONY_DESKTOP_RECOVERY="0", YUE_DESKTOP_RECOVERY="0", SDL_VIDEODRIVER="x11")
        return subprocess.run(
            ["xvfb-run", "-a", "-s", "-screen 0 1280x1024x24", sys.executable,
             __file__, sys.argv[1], "--private"], env=env, timeout=310,
        ).returncode
    assert sys.argv[2:] == ["--private"] and os.environ["HARMONY_DESKTOP_RECOVERY"] == "0"
    render([str(Path("build/plot-cairo").resolve())], "cairo")
    render([sys.argv[1], "tool", "kryon", "run", "--profile", "portable"], "zx")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
