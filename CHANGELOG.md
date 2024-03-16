# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog], and this project adheres to
[Semantic Versioning].

[keep a changelog]: https://keepachangelog.com/en/1.0.0/
[semantic versioning]: https://semver.org/spec/v2.0.0.html

## Unreleased

### Added

- Declarations can now be marked as sensitive, which will cause their default
  values and actual values to be redacted in validation summaries and
  generated specifications.
- The generated specification output has been improved to be easier to read.

## [v0.7.0] - 2024-03-15

[v0.7.0]: https://github.com/ezzatron/austenite/releases/tag/v0.7.0

### Added

- Added `binary` variable declarations.

## [v0.6.2] - 2023-10-15

[v0.6.2]: https://github.com/ezzatron/austenite/releases/tag/v0.6.2

### Fixed

- Fixed badge images and links in the README.

## [v0.6.1] - 2023-10-15

[v0.6.1]: https://github.com/ezzatron/austenite/releases/tag/v0.6.1

### Fixed

- Fixed CJS TypeScript build.

## [v0.6.0] - 2023-10-15

[v0.6.0]: https://github.com/ezzatron/austenite/releases/tag/v0.6.0

### Changed

- Renamed the NPM package from `@eloquent/austenite` to `austenite`.

## [v0.5.0] - 2022-12-30

[v0.5.0]: https://github.com/ezzatron/austenite/releases/tag/v0.5.0

### Added

- Added `networkPortNumber` declarations.

## [v0.4.0] - 2022-10-29

[v0.4.0]: https://github.com/ezzatron/austenite/releases/tag/v0.4.0

### Changed

- Declarations made after `initalize()` is called will no longer cause an
  exception to be thrown. It is up to the end user to ensure all declarations
  are made before `initalize()` is called.
- Declaration values can now be accessed before `initialize()` is called without
  an exception being thrown.

These changes are designed to facilitate cases where declarations are made
multiple times in different execution contexts (e.g. both outside and inside
"bundled" code).

## [v0.3.0] - 2022-10-26

[v0.3.0]: https://github.com/ezzatron/austenite/releases/tag/v0.3.0

### Added

- The app name can now be set explicitly with the `AUSTENITE_APP` environment
  variable.

## [v0.2.5] - 2022-10-26

[v0.2.5]: https://github.com/ezzatron/austenite/releases/tag/v0.2.5

### Fixed

- Fixed pre-publish `package.json` script.

## [v0.2.4] - 2022-10-26

[v0.2.4]: https://github.com/ezzatron/austenite/releases/tag/v0.2.4

### Changed

- The package should now actually support CommonJS.
- Removed dependency on all `mdast` packages.
- Removed dependency on `ip-regex` package, as it is ESM-only.
- Added dependency on `ipaddr.js` package, as it supports CJS.

## [v0.2.3] - 2022-10-25

[v0.2.3]: https://github.com/ezzatron/austenite/releases/tag/v0.2.3

### Fixed

- Removed dependency on renamed `mdast` package.

## [v0.2.2] - 2022-10-25

[v0.2.2]: https://github.com/ezzatron/austenite/releases/tag/v0.2.2

### Fixed

- Made CommonJS module actually load as CommonJS. It's unlikely to help, because
  some dependencies are ESM-only.

## [v0.2.1] - 2022-10-24

[v0.2.1]: https://github.com/ezzatron/austenite/releases/tag/v0.2.1

### Fixed

- Fixed pre-publish `package.json` script.

## [v0.2.0] - 2022-10-24

[v0.2.0]: https://github.com/ezzatron/austenite/releases/tag/v0.2.0

### Added

- Added CommonJS compatibility.

## [v0.1.0] - 2022-10-24

[v0.1.0]: https://github.com/ezzatron/austenite/releases/tag/v0.1.0

### Added

- This is the first release.
