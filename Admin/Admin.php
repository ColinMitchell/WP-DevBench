<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin;

use WP_DevBench\Admin\DevBenchPage;
use WP_DevBench\Inc\Plugin;

/**
 * Main plugin hooks for the Admin area.
 */
final class Admin {
	/**
	 * @var \WP_DevBench\Admin\DevBenchPage
	 */
	private DevBenchPage $dev_bench_page;

	public function __construct( protected Plugin $plugin ) {
		add_action( 'init', [ $this, 'init' ] );

		if ( WP_ENV === 'local' ) {
			add_filter( 'http_request_args', [ $this, 'disable_ssl_verification_for_wp_remote_get' ], 10, 2 );
		}

		// Enqueue Assets
		add_action( 'enqueue_block_editor_assets', [ $this, 'editor_assets' ] );
	}

	public function init(): void {
		if ( ! isset( $this->dev_bench_page ) ) {
			$this->dev_bench_page = new DevBenchPage( $this->plugin );
		}
	}


	/**
	 * Register assets
	 *
	 * @since 0.0.1
	 *
	 * @uses "admin_enqueue_scripts" action
	 */
	public function editor_assets(): void {
		$dependencies = [];
		$version = WP_DEVBENCH_VERSION;

		// Use asset file if it exists
		if ( file_exists( WP_DEVBENCH_DIR . 'build/editor.asset.php' ) ) {
			$asset_file   = include WP_DEVBENCH_DIR . 'build/editor.asset.php';
			// $dependencies = $asset_file['dependencies'];
			$version      = $asset_file['version'];
		}

		wp_register_script(
			handle: 'wp-devbench-editor-scripts',
			src: plugins_url( 'build/editor.js', WP_DEVBENCH_MAIN_FILE ),
			deps: array( 'wp-blocks', 'wp-dom-ready', 'wp-edit-post', 'acf-input' ),
			ver: $version
		);

		wp_enqueue_script( 'wp-devbench-editor-scripts' );
	}

	public function disable_ssl_verification_for_wp_remote_get( $args, $url ) {
		$args['sslverify'] = false;

		return $args;
	}
}
