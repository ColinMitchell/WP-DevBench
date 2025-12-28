
# WP-DevBench

A powerful developer sandbox plugin for WordPress that lets you run custom PHP functions, test code snippets, and debug outputs directly in the WordPress admin dashboard.

## Requirements

- **WordPress:** 6.1 or higher
- **PHP:** 8.0 or higher

## Installation

1. **Download** the plugin ZIP file
2. **Extract** the ZIP file (optional - WordPress can do this automatically)
3. **Upload** the `wp-devbench` folder to `/wp-content/plugins/` directory on your web server
4. **Activate** the plugin from your WordPress admin dashboard:
	- Go to **Plugins** → **Installed Plugins**
	- Find **WP-DevBench**
	- Click **Activate**

## Usage

### Accessing the Plugin

Once activated, you'll see a new **WP-DevBench** menu item in the WordPress admin sidebar.

### Features

**WP-DevBench** provides a safe sandbox environment where you can:

- **Run PHP Code** - Execute custom PHP functions and snippets without affecting your live site
- **Test Code** - Test WordPress functions and hooks before deploying to production
- **Debug** - View detailed output, errors, and debugging information
- **Inspect Data** - Use var_dump, print_r, and other debugging functions to inspect data

### Getting Started

1. Navigate to **WP-DevBench** in your admin dashboard
2. Enter your PHP code in the editor
3. Click **Run** or **Execute**
4. View the results and debug output below

### Available NPM Scripts

- **`npm run build`** - Build JavaScript and CSS assets
- **`npm start`** - Start development server with hot reload
- **`npm run format`** - Format all code (JS, CSS, PHP)
- **`npm run lint`** - Run linters without fixing
- **`npm run dist`** - Create production build with optimized dependencies
- **`npm run plugin-zip`** - Generate distributable plugin ZIP file
- **`npm env start`** - Start local WordPress environment via Docker

### Composer Scripts

- **`composer test`** - Run all tests (PHPStan, PHPCS, Pest)
- **`composer phpstan`** - Run PHPStan static analysis
- **`composer phpcs`** - Run PHP CodeSniffer
- **`composer pest`** - Run Pest PHP tests
- **`composer format`** - Auto-fix PHP code style issues

### Code Quality

The plugin uses industry-standard tools for code quality:

- **PHPStan** - Static analysis for PHP code
- **PHPCS** - Code style validation (WordPress Coding Standards + VIP standards)
- **Pest** - Modern PHP testing framework
- **ESLint** - JavaScript linting
- **Prettier** - Code formatting
- **Husky** - Git hooks for pre-commit checks

## Support

For issues, questions, or feature requests, visit:
- **GitHub:** https://github.com/ColinMitchell/wp-devbench/issues
- **Documentation:** https://github.com/ColinMitchell/wp-devbench

## License

This plugin is released under the **GPL-2.0-or-later** license.

---

**Author:** Colin Mitchell
**Version:** 1.0.0
