<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Services;

/**
 * WP_DevBench Service Starter Class
 */
final class Starter {
	// protected ServiceApi = $my_service_api;

	/**
	 * @var string
	 */
	private string $cache_key = 'my-cache-key-global';

	// private string $cache_key_per_site = "my-cache-key-%d"; // Use if you need cache per site

	/**
	 * @var string
	 */
	private string $json_backup_path = WP_DEVBENCH_DIR . 'backups/my-data-%s.json';

	/**
	 * @var int|float
	 */
	private int|float $cache_expiration;

	public function __construct() {
		add_action( 'init', array( $this, 'init' ), 20 );

		$this->cache_expiration = WEEK_IN_SECONDS;
	}

	public function init(): void {
		// $my_service_api = new ServiceApi( $this );
	}

	/**
	 * Fetch our cache (redis first, then gets backup json data)
	 *
	 * @return mixed
	 */
	public function get_cache(): mixed {
		$cache = wp_cache_get( sprintf( $this->cache_key, get_current_blog_id() ), 'wp-devbench' );

		if ( $cache ) {
			return $cache;
		} else if ( file_exists( sprintf( $this->json_backup_path, get_current_blog_id() ) ) ) {
			return json_decode( file_get_contents( sprintf( $this->json_backup_path, get_current_blog_id() ) ) );
		}

		return false;
	}

	/**
	 * Set our cache in Redis and Backups (json)
	 *
	 * @return void
	 */
	public function set_cache(): void {
		$data = array();

		// Set cache for current site
		// wp_cache_set( sprintf( $this->cache_key_per_site, get_current_blog_id() ), $data, 'wp-devbench', $this->cache_expiration );

		// Set cache for global
		wp_cache_set( $this->cache_key, $data, 'wp-devbench', $this->cache_expiration );

		// (Optional) - Set additional backup data in a .json file
		file_put_contents( sprintf( $this->json_backup_path, get_current_blog_id() ), json_encode( $data ) );
	}

	/**
	 * Clear Redis Cache Object
	 *
	 * @return void
	 */
	public function clear_cache(): void {
		wp_cache_delete( $this->cache_key, 'wp-devbench' );
	}
}
