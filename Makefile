.DEFAULT_GOAL := build

ZIRAN ?= ziran
CC ?= cc
ZIRAN_INCLUDE := $(shell $(ZIRAN) pkg path ziran)/include

.PHONY: run build check

run build:
	$(ZIRAN) tool Kryon $@

check:
	$(ZIRAN) tool Kryon check
	mkdir -p build/indicator-test-c
	$(ZIRAN) build --project --target=c --entry indicator_test:main \
		-o build/indicator-test-c \
		tests/indicator_test.zi
	$(CC) -std=c99 -pedantic-errors -I$(ZIRAN_INCLUDE) \
		-Ibuild/indicator-test-c build/indicator-test-c/*.c -lm \
		-o build/indicator-test
	build/indicator-test
