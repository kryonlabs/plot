#!/usr/bin/env python3
"""Generate src/band_chart_codec.zi with Kryon's widget codec generator.

A portable bundle submits a band chart's records to its host, which decodes
them with this codec on top of Kryon's own widget codec. Pass --check to
verify the file is current."""
from pathlib import Path
import subprocess
import sys

ROOT = Path(__file__).resolve().parent.parent
KRYON = Path(subprocess.run(['ziran', 'pkg', 'path', 'kryon'], cwd=ROOT, check=True,
                            capture_output=True, text=True).stdout.strip())
command = [sys.executable, str(KRYON / 'scripts/generate-widget-codecs.py'),
           '--output', str(ROOT / 'src/band_chart_codec.zi'),
           '--uses', str(KRYON / 'src/backend/widget_codec.zi'),
           '--source', str(KRYON / 'src/ui/geometry.zi'),
           '--source', str(KRYON / 'src/ui/drawing_props.zi'),
           '--source', str(ROOT / 'src/band_chart_props.zi'),
           '--generated-by', 'scripts/generate-codec.py']
for root in ('BandChartProps', 'BandChartPoint', 'BandChartBand', 'BandChartResult'):
    command += ['--root', root]
for line in ('"std/bundle_host"', '"std/byte_text_linux"', '"kryon/hosted_values"',
             '"kryon/widget_codec"', '"kryon/geometry"', '"kryon/drawing_props"',
             '"band_chart_props"'):
    command += ['--import', line]
command += sys.argv[1:]
sys.exit(subprocess.run(command).returncode)
