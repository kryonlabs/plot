.DEFAULT_GOAL := run

.PHONY: run build check

run build:
	@$(MAKE) --silent --no-print-directory -C ../kryon build/bin/kryon
	@../kryon/build/bin/kryon $@

check:
	@$(MAKE) --silent --no-print-directory -C ../kryon build/bin/kryon
	@../kryon/build/bin/kryon check
	@mkdir -p build/indicator-test-c
	@../ziran/build/bin/ziran build --target=c --entry indicator_test:main \
		--root tests --module-path src --module-path ../kryon/src/plot \
		--module-path ../kryon/src/ui -o build/indicator-test-c \
		tests/indicator_test.zi
	@$(CC) -std=c99 -pedantic-errors -I../ziran/include \
		-Ibuild/indicator-test-c build/indicator-test-c/*.c -lm \
		-o build/indicator-test
	@build/indicator-test
