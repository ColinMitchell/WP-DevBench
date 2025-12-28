<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin;

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
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init(): void {
		if ( ! isset( $this->dev_bench_page ) ) {
			$this->dev_bench_page = new DevBenchPage( $this->plugin );
		}
	}
}
