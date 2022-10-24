# Environment Variables

This document describes the environment variables used by `<app>`.

Please note that **undefined** variables and **empty strings** are considered
equivalent.

The application may consume other undocumented environment variables; this
document only shows those variables defined using [Austenite].

[austenite]: https://github.com/eloquent/austenite

## Index

- [`CDN_URL`](#CDN_URL) — CDN to use when serving static assets

## Specification

### `CDN_URL`

> CDN to use when serving static assets

This variable **MAY** be set to a non-empty **URL** or left undefined.

```sh
export CDN_URL=https://host.example.org/path/to/resource # URL (absolute)
```
