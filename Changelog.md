# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

- **Added** for new features.
- **Changed** for changes in existing functionality.
- **Deprecated** for soon-to-be removed features.
- **Removed** for now removed features.
- **Fixed** for any bug fixes.
- **Security** in case of vulnerabilities.

## [Unreleased]

### Added

- String helpers (filenamify, capitalize, slugify, camelCase, and pascalCase) for Handlebars templates

### Changed

- **Breaking** Moved templating from handlebars to javascript. This change requires updating existing snippets to the new format, as handlebars template are no longer supported.
- **Breaking** Moved config file format from JSON to JavaScript object to make configuration more straightforward. This change requires updating the config files of existing snippets to new format.

## [0.1.0] - 2023-03-20

- First release
