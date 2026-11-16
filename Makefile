.DEFAULT_GOAL := build

ZIRAN ?= ziran
CC ?= cc
ZIRAN_INCLUDE := $(shell $(ZIRAN) pkg path ziran)/include

.PHONY: run build check

run build:
	$(ZIRAN) tool kryon $@

HOST := plot_widget_host
# The widget test draws through Kryon's host capabilities; its host module
# provides them. Kryon's modules are named by their import paths.
BINDS := \
	--bind kryon/font_metrics:MeasureGlyphWidth=$(HOST):MeasureGlyphWidth \
	--bind kryon/font_metrics:MeasureGlyphLineHeight=$(HOST):MeasureGlyphLineHeight \
	--bind kryon/paint_queue:RasterImageMesh=$(HOST):RasterImageMesh \
	--bind kryon/raster_text:RasterTextRotated=$(HOST):RasterTextRotated \
	--bind kryon/raster_text:RasterText=$(HOST):RasterText \
	--bind kryon/raster_text:RasterTextClipped=$(HOST):RasterTextClipped \
	--bind kryon/raster_shape:RasterRoundedRectangle=$(HOST):RasterRoundedRectangle \
	--bind kryon/raster_shape:RasterRoundedRectangleOutline=$(HOST):RasterRoundedRectangleOutline \
	--bind kryon/raster:RasterLine=$(HOST):RasterLine \
	--bind kryon/paint_queue:RasterImage=$(HOST):RasterImage

# The band chart's host test runs natively, as a host does, and paints
# through its own counting provider.
HOSTED_HOST := band_chart_host_provider
HOSTED_BINDS := \
	--bind kryon/font_metrics:MeasureGlyphWidth=$(HOSTED_HOST):MeasureGlyphWidth \
	--bind kryon/font_metrics:MeasureGlyphLineHeight=$(HOSTED_HOST):MeasureGlyphLineHeight \
	--bind kryon/paint_queue:RasterImageMesh=$(HOSTED_HOST):RasterImageMesh \
	--bind kryon/raster_text:RasterTextRotated=$(HOSTED_HOST):RasterTextRotated \
	--bind kryon/raster_text:RasterText=$(HOSTED_HOST):RasterText \
	--bind kryon/raster_text:RasterTextClipped=$(HOSTED_HOST):RasterTextClipped \
	--bind kryon/raster_shape:RasterRoundedRectangle=$(HOSTED_HOST):RasterRoundedRectangle \
	--bind kryon/raster_shape:RasterRoundedRectangleOutline=$(HOSTED_HOST):RasterRoundedRectangleOutline \
	--bind kryon/raster:RasterLine=$(HOSTED_HOST):RasterLine \
	--bind kryon/paint_queue:RasterImage=$(HOSTED_HOST):RasterImage

check:
	$(ZIRAN) tool kryon check
	$(ZIRAN) bundle --project $(BINDS) --entry plot_widget_behavior:main \
		-o build/plot-widget.zx tests/plot_widget_behavior.zi
	test "$$($(ZIRAN) run --project build/plot-widget.zx)" = 0
	@if command -v go >/dev/null; then \
		rm -rf build/plot-widget-go && \
		$(ZIRAN) build --project --target=go --pkg main --exe $(BINDS) \
			--entry plot_widget_behavior:main -o build/plot-widget-go \
			tests/plot_widget_behavior.zi && \
		cd build/plot-widget-go && env -u DISPLAY -u WAYLAND_DISPLAY \
			GO111MODULE=off go run *.go ; \
	fi
	python3 scripts/generate-codec.py --check
	$(ZIRAN) bundle --project --define KRYON_HOSTED_UI \
		--bind band_chart:BandChartHostedHost=band_chart_hosted_provider:HostedBandChart \
		--entry band_chart_hosted:main -o build/band-chart-hosted.zx tests/band_chart_hosted.zi
	test "$$($(ZIRAN) run --project build/band-chart-hosted.zx)" = 0
	rm -rf build/band-chart-host-c
	mkdir -p build/band-chart-host-c
	$(ZIRAN) build --project --target=c $(HOSTED_BINDS) \
		--entry band_chart_host_behavior:main -o build/band-chart-host-c \
		tests/band_chart_host_behavior.zi
	$(CC) -std=c11 -I$(ZIRAN_INCLUDE) -Ibuild/band-chart-host-c \
		build/band-chart-host-c/*.c -lm -o build/band-chart-host
	build/band-chart-host
	mkdir -p build/indicator-test-c
	$(ZIRAN) build --project --target=c --entry indicator_test:main \
		-o build/indicator-test-c \
		tests/indicator_test.zi
	$(CC) -std=c99 -pedantic-errors -I$(ZIRAN_INCLUDE) \
		-Ibuild/indicator-test-c build/indicator-test-c/*.c -lm \
		-o build/indicator-test
	build/indicator-test
