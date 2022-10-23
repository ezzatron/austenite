export NODE_OPTIONS := --experimental-vm-modules --redirect-warnings=artifacts/node-warnings

-include .makefiles/Makefile
-include .makefiles/pkg/js/v1/Makefile
-include .makefiles/pkg/js/v1/with-yarn.mk
-include .makefiles/pkg/js/v1/with-tsc.mk

.makefiles/%:
	@curl -sfL https://makefiles.dev/v1 | bash /dev/stdin "$@"

################################################################################

artifacts/dist: tsconfig.build.json tsconfig.json artifacts/link-dependencies.touch $(JS_SOURCE_FILES)
	@rm -rf "$@"
	$(JS_EXEC) tsc -p "$<"
	@touch "$@"
