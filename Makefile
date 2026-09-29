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
	--bind kryon/raster_text:RasterText=$(HOST):RasterText \
	--bind kryon/raster_text:RasterTextClipped=$(HOST):RasterTextClipped \
	--bind kryon/raster_shape:RasterRoundedRectangle=$(HOST):RasterRoundedRectangle \
	--bind kryon/raster_shape:RasterRoundedRectangleOutline=$(HOST):RasterRoundedRectangleOutline \
	--bind kryon/raster:RasterLine=$(HOST):RasterLine \
	--bind kryon/paint_queue:RasterImage=$(HOST):RasterImage

check:
	$(ZIRAN) tool kryon check
	$(ZIRAN) bundle --project $(BINDS) --entry plot_widget_behavior:main \
		-o build/plot-widget.zib tests/plot_widget_behavior.zi
	test "$$($(ZIRAN) run build/plot-widget.zib)" = 0
	@if command -v go >/dev/null; then \
		rm -rf build/plot-widget-go && \
		$(ZIRAN) build --project --target=go --pkg main --exe $(BINDS) \
			--entry plot_widget_behavior:main -o build/plot-widget-go \
			tests/plot_widget_behavior.zi && \
		cd build/plot-widget-go && env -u DISPLAY -u WAYLAND_DISPLAY \
			GO111MODULE=off go run *.go ; \
	fi
	mkdir -p build/indicator-test-c
	$(ZIRAN) build --project --target=c --entry indicator_test:main \
		-o build/indicator-test-c \
		tests/indicator_test.zi
	$(CC) -std=c99 -pedantic-errors -I$(ZIRAN_INCLUDE) \
		-Ibuild/indicator-test-c build/indicator-test-c/*.c -lm \
		-o build/indicator-test
	build/indicator-test
