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
		// Core Admin Services
		$this->admin = ! isset( $this->admin ) ? new Admin( $this ) : $this->admin;

		// Testing Class
		// $this->test_class = ! isset( $this->test_class ) ? new TestClass() : $this->test_class;

		add_action( 'plugins_loaded', array( $this, 'plugin_loaded' ) );
	}

	/**
	 * When plugin is loaded, load our textdomain for localization support.
	 *
	 * @return void
	 */
	public function plugin_loaded(): void {
		load_plugin_textdomain( 'wp-devbench-plugin' );
	}
}
