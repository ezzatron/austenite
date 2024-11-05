CHANGELOG_TAG_URL_PREFIX := https://github.com/ezzatron/austenite/releases/tag/
GENERATED_FILES += ENVIRONMENT.md

JS_ARETHETYPESWRONG_REQ += artifacts/dist
JS_PUBLINT_REQ += artifacts/dist
JS_SKYPACK_PACKAGE_CHECK_REQ += artifacts/dist

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-npm.mk
-include .makefiles/pkg/js/v1/with-arethetypeswrong.mk
-include .makefiles/pkg/js/v1/with-publint.mk
-include .makefiles/pkg/js/v1/with-skypack-package-check.mk
-include .makefiles/pkg/js/v1/with-tsc.mk
-include .makefiles/pkg/changelog/v1/Makefile

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

.PHONY: run-example
run-example: artifacts/link-dependencies.touch
	source test/fixture/example/invalid-values.sh; node --loader ts-node/esm test/fixture/example/run.ts

.PHONY: copy-example
copy-example: artifacts/link-dependencies.touch
	$(MAKE) run-example 2>&1 | pbcopy

.PHONY: stryker
stryker: artifacts/link-dependencies.touch
	$(JS_EXEC) stryker run

.PHONY: stryker-open
stryker-open: artifacts/link-dependencies.touch
	$(JS_EXEC) stryker run
	$(MF_BROWSER) "artifacts/stryker/report.html"

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
	AUSTENITE_SPEC=true AUSTENITE_APP=example node --loader ts-node/esm test/fixture/example/run.ts > "$@"
