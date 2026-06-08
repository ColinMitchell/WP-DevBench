<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin;

use WP_DevBench\Inc\Api\DevBenchApi;
use WP_DevBench\Inc\Plugin;

/**
 * Class DevBenchPage
 *
 * Handles the creation and management of the WP DevBench admin page, including asset registration,
 * menu page management, and rendering of the WP DevBench interface.
 */
class DevBenchPage {

	const string SCREEN = 'wp-devbench';

	const string REST_ENDPOINT = 'wp-devbench/v1';

	/**
	 * @var DevBenchApi
	 */
	private DevBenchApi $devbench_api;

	public function __construct( protected Plugin $plugin ) {
		if ( ! isset( $this->devbench_api ) ) {
			$this->devbench_api = new DevBenchApi( $this->plugin );
		}

		add_action( 'admin_menu', array( $this, 'add_page' ) );

		add_action( 'admin_enqueue_scripts', array( $this, 'register_assets' ) );
	}

	/**
	 * Register assets
	 *
	 * @param string $hook
	 *
	 * @return void
	 */
	public function register_assets( string $hook ): void {

		if ( $hook !== 'toplevel_page_wp-devbench' ) {
			return;
		}

		$dependencies = array();
		$version      = WP_DEVBENCH_VERSION;

		if ( ! isset( $_GET['page'] ) || ! str_starts_with( sanitize_text_field( wp_unslash( $_GET['page'] ) ), 'wp-devbench' ) ) {
			return;
		}

		// Use asset file if it exists
		if ( file_exists( WP_DEVBENCH_DIR . 'build/globals.asset.php' ) ) {
			$asset_file   = include WP_DEVBENCH_DIR . 'build/globals.asset.php';
			$dependencies = $asset_file['dependencies'];
			$version      = $asset_file['version'];
		}

		wp_register_style( 'wp-devbench-globals-css', plugins_url( 'build/globals.css', WP_DEVBENCH_MAIN_FILE ), $dependencies, $version );
		wp_enqueue_style( 'wp-devbench-globals-css' );

		// Use asset file if it exists
		if ( file_exists( WP_DEVBENCH_DIR . 'build/devbench.asset.php' ) ) {
			$asset_file   = include WP_DEVBENCH_DIR . 'build/devbench.asset.php';
			$dependencies = $asset_file['dependencies'];
			$version      = $asset_file['version'];
		}

		wp_register_script( self::SCREEN, plugins_url( 'build/devbench.js', WP_DEVBENCH_MAIN_FILE ), $dependencies, $version );

		if ( file_exists( WP_DEVBENCH_DIR . 'build/dark-mode-wp-sync.asset.php' ) ) {
			$asset_file   = include WP_DEVBENCH_DIR . 'build/dark-mode-wp-sync.asset.php';
			$dependencies = $asset_file['dependencies'];
			$version      = $asset_file['version'];
		}

		wp_register_script( self::SCREEN . 'dark-mode-wp-sync', plugins_url( 'build/dark-mode-wp-sync.js', WP_DEVBENCH_MAIN_FILE ), $dependencies, $version );
	}

	/**
	 * Adds the devbench page to the Settings menu.
	 *
	 * @return void
	 */
	public function add_page(): void {
		add_menu_page(
			page_title: __( 'WP DevBench', 'wp-devbench-plugin' ),
			menu_title: __( 'WP DevBench', 'wp-devbench-plugin' ),
			capability: 'manage_options',
			menu_slug: self::SCREEN,
			callback: array( $this, 'render_page' ),
			icon_url: 'dashicons-superhero',
			position: 100
		);
	}

	/**
	 * Adds a link to the setting page to the plugin's entry in the plugins list table.
	 *
	 * @param array $links List of plugin action links HTML.
	 *
	 * @return array
	 */
	public function add_menu_page( array $links ): array {
		// Add link as the first plugin action link.
		$devbench_link = sprintf(
			'<a href="%s">%s</a>',
			esc_url( add_query_arg( 'page', self::SCREEN, admin_url( 'options-general.php' ) ) ),
			esc_html__( 'Settings', 'wp-devbench-plugin' )
		);

		array_unshift( $links, $devbench_link );

		return $links;
	}

	/**
	 * Renders the devbench page.
	 *
	 * @return void
	 */
	public function render_page(): void {
		wp_enqueue_script( self::SCREEN );

		wp_enqueue_script( self::SCREEN . 'dark-mode-wp-sync' );

		$current_user = wp_get_current_user();
		$user_role    = ! empty( $current_user->roles ) ? $current_user->roles[0] : 'wp_devbench_viewer';

		// Dev note, you could also preload any options here too instead of doing useEffect on init
		wp_localize_script(
			self::SCREEN,
			'wpDevBench',
			array(
				'apiUrl'        => rest_url( self::REST_ENDPOINT ),
				'baseApiUrl'    => untrailingslashit( rest_url() ),
				'currentBlogId' => get_current_blog_id(),
				'userName'      => $current_user->user_login,
				'userRole'      => $user_role,
				'nonce'         => wp_create_nonce( 'wp_rest' ),
			)
		);

		echo '<div class="wp-devbench-plugin-wrap">';
		echo '<div id="' . esc_attr( self::SCREEN ) . '"></div>';
		echo '</div>';
	}
}
