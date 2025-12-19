<?php
/**
 * Plugin Name:       WP-DevBench
 * Description:       A developer sandbox for WordPress that lets you run custom PHP functions, test code snippets, and debug outputs directly in the admin dashboard.
 * Requires at least: 6.1
 * Requires PHP:      8.0
 * Version:           0.1.0
 * Author:            ColinMitchell
 * Author URI:        https://github.com/ColinMitchell
 * Plugin URI:        https://github.com/ColinMitchell
 * License:           GPL-2.0-or-later
 * License URI:       https://www.gnu.org/licenses/gpl-2.0.html
 * Text Domain:       wp-devbench
 *
 * @package WPDevBench
 */

declare( strict_types=1 );

use WP_DevBench\Inc\Plugin;

/**
 * Shortcut constant to the path of this file.
 */
define( 'WP_DEVBENCH_DIR', plugin_dir_path( __FILE__ ) );

/**
 * Version of the plugin.
 */
const WP_DEVBENCH_VERSION = '1.0.0';

/**
 * Main file of plugin
 */
const WP_DEVBENCH_MAIN_FILE = __FILE__;

// include autoloader from composer
require_once __DIR__ . '/vendor/autoload.php';

// Setup plugin
add_action( 'wp_devbench_init', function () {
	$plugin = Plugin::get_instance();
	$plugin->init();
} );

/**
 * Start Plugin
 *
 * @param Plugin $plugin
 *
 * @since 1.0.0
 */
do_action( 'wp_devbench_init', new Plugin() );
