# Changelog

## [1.0.3] - 2025-01-02
### Fixed
- **Import Path Generation**: Improved the logic for handling multiple dependencies and generating correct import paths.
- **Circular Dependency Handling**: Fixed issues with circular dependencies by improving the import order and ensuring compatibility.

### Added
- **Documentation**: Updated README to reflect the latest changes and added usage examples.

### Changed
- **Import Statements**: Now each dependency gets its own import statement, and the path is calculated relative to the source file.

---

## [1.0.2] - 2025-01-01
### Added
- **Support for Circular Dependencies**: Enhanced the handling of circular dependencies in type generation.
- **Enhanced Import Generation**: Updated import statements to better handle multiple files and dependencies.

### Changed
- **Code Refactoring**: Optimized the import path calculation logic for better flexibility and maintainability.

---

## [1.0.1] - 2025-01-01
### Fixed
- **Minor Bug Fixes**: Fixed small issues related to type extraction and migration logic.

### Added
- **Support for Overwriting Files**: Added the `--overwrite` flag to allow overwriting of existing files during migration.

---

## [1.0.0] - 2024-12-31
### Initial Release
- **Basic Type Extraction**: Automatically extracts types from TypeScript files.
- **Type Migration**: Supports migrating extracted types into separate files.
- **Basic CLI Interface**: The tool can be run from the command line using `typecreator create <filename> --migrate <directory>`.
