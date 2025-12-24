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

	/**
	 * @var DevBenchApi
	 */
	private DevBenchApi $devbench_api;

	public function __construct( protected Plugin $plugin ) {
		if ( ! isset( $this->devbench_api ) ) {
			$this->devbench_api = new DevBenchApi( $this->plugin );
		}

		add_action( 'admin_menu', [ $this, 'add_page' ] );

		// This adds a link in the plugins list table
		add_action( 'plugin_action_links_' . plugin_basename( WP_DEVBENCH_MAIN_FILE ), [ $this, 'add_menu_page' ] );

		add_action( 'admin_enqueue_scripts', [ $this, 'register_assets' ] );

		// Filter used by the wp-openapi plugin to manage security
		add_filter( 'wp-openapi-filters-elements-props', [ $this, 'add_openai_nonce' ], 10, 1 );
	}

	/**
	 * Register assets
	 *
	 * @since 0.0.1
	 *
	 * @uses "admin_enqueue_scripts" action
	 */
	public function register_assets( $hook ): void {

		if( $hook !== "toplevel_page_wp-devbench" ) {
			return;
		}

		$dependencies = [];
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

		if ( file_exists( WP_DEVBENCH_DIR . 'build/dark-mode.asset.php' ) ) {
			$asset_file   = include WP_DEVBENCH_DIR . 'build/dark-mode.asset.php';
			$dependencies = $asset_file['dependencies'];
			$version      = $asset_file['version'];
		}

		wp_register_script( self::SCREEN . 'dark-mode', plugins_url( 'build/dark-mode.js', WP_DEVBENCH_MAIN_FILE ), $dependencies, $version );
	}

	/**
	 * Adds the devbench page to the Settings menu.
	 *
	 * @return void
	 * @since 0.0.1
	 */
	public function add_page(): void {
		// Add the top-level menu page
		add_menu_page(
			page_title: __( 'WP DevBench', 'wp-devbench-plugin' ),
			menu_title: __( 'WP DevBench', 'wp-devbench-plugin' ),
			capability: 'manage_options',
			menu_slug: self::SCREEN,
			callback: [ $this, 'render_page' ],
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
	 * @since 1.0.0
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
	 * @since 0.0.1
	 */
	public function render_page(): void {
		wp_enqueue_script( self::SCREEN );

		wp_enqueue_script( self::SCREEN . 'dark-mode' );

		$current_user = wp_get_current_user();
		$user_role    = ! empty( $current_user->roles ) ? $current_user->roles[0] : 'wp_devbench_viewer';

		// Dev note, you could also preload any options here too instead of doing useEffect on init
		wp_localize_script(
			self::SCREEN,
			'wpDevBench',
			[
				'apiUrl'        => rest_url( 'wp-devbench/v1' ),
				'baseApiUrl'    => untrailingslashit( rest_url() ),
				'currentBlogId' => get_current_blog_id(),
				'userName'      => $current_user->user_login,
				'userRole'      => $user_role,
				'nonce'         => wp_create_nonce( 'wp_rest' ),
			]
		);

		echo '<div class="wp-devbench-plugin-wrap">';
		echo '<div id="' . esc_attr( self::SCREEN ) . '"></div>';
		echo '<div class="wp-devbench-plugin-wrap">';
	}
}
