<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc;

use WP_DevBench\Admin\Admin;

/**
 * Main Plugin class that handles all logic
 */
class Plugin {
	/**
	 * @var Admin
	 */
	protected Admin $admin;

	/**
	 * @var TestClass
	 */
	protected TestClass $test_class;

	/**
	 * @var Plugin|null
	 */
	private static ?Plugin $instance = null;

	public function __construct() {
		// Include helper functions
		require_once plugin_dir_path( __FILE__ ) . 'Helpers/functions.php';
	}

	/**
	 * Makes this class a singleton.
	 *
	 * @return Plugin
	 */
	public static function get_instance(): Plugin {
		if ( self::$instance === null ) {
			self::$instance = new Plugin();
		}

		return self::$instance;
	}

	public function init(): void {
		// Core Services
		$this->admin         = ! isset( $this->admin ) ? new Admin( $this ) : $this->admin;

		// Testing Class
		$this->test_class = ! isset( $this->test_class ) ? new TestClass() : $this->test_class;

		add_action( 'plugins_loaded', [ $this, 'plugin_loaded' ] );

		/**
		 * This allows any custom cache under 'wp-devbench' cache group to be global and accessible by all subsites.
		 * Better explanation here: https://wordpress.stackexchange.com/a/265433/125910
		 *
		 * Follow these rules:
		 * How to use global: wp_cache_add( 'my_cache', $cache, 'wp-devbench' );
		 * How to use per-site: wp_cache_add( sprintf( 'my_cache:%d', get_current_blog_id() ), $cache, 'wp-devbench' );
		 */
		if ( function_exists( 'wp_cache_add_global_groups' ) ) {
			wp_cache_add_global_groups( [ 'wp-devbench' ] );
		}
	}

	public function remove_hooks() {
		/*
		remove_action( 'plugins_loaded', [$this->plugin, 'pluginLoaded']);
		remove_action( 'admin_menu', [$this->settingsPage, 'addPage' ]);
		remove_action( 'rest_api_init', [$this->plugin->getRestApi(), 'registerRoutes']);
		remove_action( 'admin_enqueue_scripts', [$this->settingsPage, 'registerAssets'] );*/
	}

	public function plugin_loaded(): void {
		load_plugin_textdomain( 'wp-devbench-plugin' );
	}
}
