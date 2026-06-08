<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin;

use WP_DevBench\Inc\Plugin;

/**
 * Main plugin hooks for the Admin area.
 */
final class Admin {
	/**
	 * @var DevBenchPage
	 */
	private DevBenchPage $dev_bench_page;

	public function __construct( protected Plugin $plugin ) {
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init(): void {
		$this->dev_bench_page = ! isset( $this->dev_bench_page ) ? new DevBenchPage( $this->plugin ) : $this->dev_bench_page;
	}
}
