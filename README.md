
# WP DevBench

A powerful developer sandbox plugin for WordPress that lets you run custom PHP functions, test code snippets, and debug outputs directly in the WordPress admin dashboard.

<img width="2274" height="1326" alt="image" src="https://github.com/user-attachments/assets/f3f5544e-9e2e-4052-b5ac-4d3d2509a285" />

#### Dark Mode Theme Support

<img width="2270" height="1324" alt="Screenshot 2025-12-28 222835" src="https://github.com/user-attachments/assets/ff81ce41-6eee-4157-8d08-732cbe35bc5c" />

## Requirements

- **WordPress:** 6.1 or higher
- **PHP:** 8.3 or higher

## Installation

1. **Download** the plugin ZIP file
2. **Extract** the ZIP file (optional - WordPress can do this automatically)
3. **Upload** the `wp-devbench` folder to `/wp-content/plugins/` directory on your web server
4. **Activate** the plugin from your WordPress admin dashboard:
	- Go to **Plugins** → **Installed Plugins**
	- Find **WP DevBench**
	- Click **Activate**

### Via Composer (Upcoming)

```bash
composer require colinmitchell/wp-devbench
```

## Usage

### Accessing the Plugin

Once activated, you'll see a new **WP DevBench** menu item in the WordPress admin sidebar.

### Features

**WP DevBench** provides a safe sandbox environment where you can:

- **Run PHP Code** - Execute custom PHP functions and snippets from within the dashboard.
- **Test Code** - Test WordPress functions and hooks before deploying to production.
- **Debug** - View detailed output, errors, and debugging information/stack tracing.
- **Inspect Data** - Return var_dump, print_r, and other debugging functions to inspect data.

## Usage

### Basic Function Registration

The simplest way to register a function:

```php
devbench_add_function(
    source: 'my-plugin',
    function_name: 'get_user_count',
    callback: function() {
        return count_users()['total_users'];
    },
    description: 'Get total number of users'
);
```

### With Parameters

Add dynamic parameters that appear as form fields in the dashboard:

```php
devbench_add_function(
    source: 'my-plugin',
    function_name: 'get_user_data',
    callback: function(int $user_id) {
        $user = get_userdata($user_id);
        return $user ? $user->to_array() : null;
    },
    params: [
        [
            'id'    => 'user_id',
            'type'  => 'integer',
            'title' => 'User ID',
        ],
    ],
    description: 'Fetch user information by ID'
);
```

### With Dropdown Choices

Create select dropdowns for predefined options:

```php
devbench_add_function(
    source: 'my-plugin',
    function_name: 'query_posts',
    callback: function(string $status, int $count) {
        return get_posts([
            'post_status'    => $status,
            'posts_per_page' => $count,
        ]);
    },
    params: [
        [
            'id'      => 'status',
            'type'    => 'string',
            'title'   => 'Post Status',
            'choices' => ['draft', 'publish', 'pending', 'trash'],
            'default' => 'publish',
        ],
        [
            'id'      => 'count',
            'type'    => 'integer',
            'title'   => 'Number of Posts',
            'default' => 10,
        ],
    ],
    description: 'Query posts by status and count'
);
```

### With File Uploads

Accept file uploads (CSV, XML, JSON, etc.):

```php
devbench_add_function(
    source: 'my-plugin',
    function_name: 'import_csv',
    callback: function(string $csv_file) {
        // File arrives as base64 data URI
        // Example: "data:text/csv;name=users.csv;base64,ABC123..."
        
        // Parse the data URI
        preg_match('/^data:([^;]+);name=([^;]+);base64,(.+)$/', $csv_file, $matches);
        $mime_type = $matches[1];
        $filename  = $matches[2];
        $base64    = $matches[3];
        $content   = base64_decode($base64);
        
        // Process CSV
        $rows = array_map('str_getcsv', explode("\n", $content));
        
        return [
            'filename' => $filename,
            'rows'     => count($rows),
            'preview'  => array_slice($rows, 0, 5),
        ];
    },
    params: [
        [
            'id'     => 'csv_file',
            'type'   => 'file',
            'title'  => 'Upload CSV File',
            'accept' => '.csv',
        ],
    ],
    description: 'Import and preview CSV data'
);
```

## Registration Methods

### Method 1: Global Function (Recommended for Most Cases)

Use the global `devbench_add_function()` helper. Works everywhere without dependencies:

```php
devbench_add_function(
    source: 'my-plugin',
    function_name: 'my_function',
    callback: 'my_callback_function',
    params: [],
    description: 'My custom function'
);
```

### Method 2: OOP with Composer

For plugin developers using Composer and autoloading:

```php
use WP_DevBench\Inc\Services\DevBench;

final class MyPlugin {
    public function __construct() {
        add_action('init', [$this, 'register_devbench']);
    }

    public function register_devbench(): void {
        DevBench::add_function(
            source: get_class($this),
            function_name: 'get_stats',
            callback: [$this, 'get_stats'],
            params: [],
            description: 'Get plugin statistics'
        );
    }

    public function get_stats(): array {
        return [
            'version' => $this->version,
            'active'  => true,
        ];
    }
}
```

### Method 3: WordPress Action Hook

Most declarative approach, great for mu-plugins:

```php
add_action('wp_devbench_register_functions', function() {
    devbench_add_function(
        source: 'my-mu-plugin',
        function_name: 'maintenance_mode',
        callback: function(bool $enable) {
            update_option('maintenance_mode', $enable);
            return ['maintenance_mode' => $enable];
        },
        params: [
            [
                'id'      => 'enable',
                'type'    => 'boolean',
                'title'   => 'Enable Maintenance Mode',
                'default' => false,
            ],
        ]
    );
});
```

### Error Debug Results

<img width="1381" height="757" alt="error-debug-results" src="https://github.com/user-attachments/assets/433c77fe-bd00-468d-9018-989ccede4ccb" />


### Getting Started

1. Navigate to **WP DevBench** in your admin dashboard
2. Enter your PHP code in the editor
3. Click **Run** or **Execute**
4. View the results and debug output below

### Setup Development Environment

```bash
# Clone repository
git clone https://github.com/ColinMitchell/wp-devbench.git
cd wp-devbench

# Install dependencies
composer install
npm install

# Start development server
npm start

# Start local WordPress (Docker)
npm run env start
```

### Available NPM Scripts

- **`npm run build`** - Build JavaScript and CSS assets
- **`npm start`** - Start development server with hot reload
- **`npm run format`** - Format all code (JS, CSS, PHP)
- **`npm run lint`** - Run linters without fixing
- **`npm env start`** - Start local WordPress environment via Docker

### Composer Scripts

- **`composer test`** - Run all tests (PHPStan, PHPCS, Pest)
- **`composer phpstan`** - Run PHPStan static analysis
- **`composer phpcs`** - Run PHP CodeSniffer
- **`composer pest`** - Run Pest PHP tests
- **`composer phpcbf`** - Auto-fix PHP code style issues

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

## Roadmap

- [ ] Localization Support
- [ ] Multisite Toggle Support (Spoof which site the function is running on)
- [ ] CLI Support - Run functions from WP CLI

## License

This plugin is released under the **GPL-2.0-or-later** license.

---

**Author:** Colin Mitchell
**Version:** 1.0.0
