export NODE_OPTIONS := --experimental-vm-modules --redirect-warnings=artifacts/node-warnings

GENERATED_FILES += ENVIRONMENT.md

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-yarn.mk
-include .makefiles/pkg/js/v1/with-tsc.mk

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

.PHONY: run-example
run-example:
	npx --yes --package=ts-node ts-node-esm test/fixture/example/run.ts

################################################################################

artifacts/dist: artifacts/dist/cjs artifacts/dist/esm
	@touch "$@"

artifacts/dist/cjs: tsconfig.build.cjs.json tsconfig.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	echo '{"type":"commonjs"}' > "$@/package.json"
	@touch "$@"

artifacts/dist/esm: tsconfig.build.esm.json tsconfig.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	echo '{"type":"module"}' > "$@/package.json"
	@touch "$@"

ENVIRONMENT.md: artifacts/link-dependencies.touch $(JS_SOURCE_FILES) $(JS_TEST_FILES)
	AUSTENITE_SPEC=true node --loader ts-node/esm test/fixture/example/run.ts > "$@"
