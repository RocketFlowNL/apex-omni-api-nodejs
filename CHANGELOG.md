# Changelog

All notable changes to apex-omni-api will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [1.2.0] - 2025-01-06

### Added
- Built-in `testSetup` function that can be used in any project
- Allows users to verify their setup after installing the package
- Works with or without credentials
- Exported as part of the main package API

### Changed
- Test functionality is now part of the package itself, not just development scripts

## [1.1.1] - 2025-01-06

### Added
- npm scripts for testing and running examples
  - `test:credentials` - Test API credentials
  - `example:public` - Run public API examples
  - `example:private` - Run private API examples
  - `example:bot` - Run trading bot example
- test-credentials.js utility for verifying setup

### Fixed
- Handle undefined values in test output
- Improved error messages for credential testing

## [1.1.0] - 2025-01-06

### Added
- ApexEasy simplified wrapper class for easier API usage
- Convenient methods for common operations (getAllPrices, watchPrice, getAccountSummary)
- Built-in retry logic with exponential backoff
- Formatted responses for better developer experience
- Example scripts for public, private, and trading bot usage
- Comprehensive documentation (CONTRIBUTING.md, TESTING.md, USAGE.md, EASY.md)
- GitHub issue and PR templates
- Credits and Buy Me a Coffee links

### Changed
- Restructured package for NPM publishing
- Updated README with ApexEasy examples
- Removed unused dependencies (crypto, apexpro-connector-node)
- Updated package.json with proper metadata

### Fixed
- Package name changed to 'apex-omni-api' for NPM availability

## [1.0.0] - 2025-01-06

### Added
- Initial release of apex-omni-api
- Full support for Apex Omni Exchange API v3
- Authentication system with HMAC-SHA256 signatures
- Public endpoints support:
  - Server time
  - Trading symbols
  - Ticker data
  - Order book
- Private endpoints support:
  - User information
  - Account details and balance
  - Order management (create, cancel, list)
  - Trade history
- Examples for common use cases
- Environment configuration support
- MIT License

### Security
- Secure credential handling via environment variables
- Base64 encoded secret for v3 API compliance

## [0.1.0] - 2024-12-01 (Pre-release)

### Added
- Basic API client implementation
- Registration script for new accounts
- Example scripts for account info and price monitoring

---

## Version Guidelines

- **Major version (X.0.0)**: Breaking changes to the API
- **Minor version (0.X.0)**: New features, backwards compatible
- **Patch version (0.0.X)**: Bug fixes and minor improvements

## Upgrade Guide

### From 0.x to 1.0.0

1. Change package import:
   ```javascript
   // Before
   const ApexOmniClient = require('./apex-client');
   
   // After
   const ApexOmniClient = require('apex-omni-api');
   ```

2. Remove local dependencies on crypto (now using built-in module)

3. Update any references to the old package name 'apex-omni' to 'apex-omni-api'