<?php
declare( strict_types=1 );

if( ! function_exists( 'devbench_add_function' ) ) :
	/**
	 * Global wrapper function for registering DevBench functions.
	 * Useful for users without Composer.
	 *
	 * @param string   $class
	 * @param string   $function_name
	 * @param callable $callback
	 * @param array    $params
	 * @param string   $description
	 *
	 * @return void
	 * @throws \Exception
	 */
	function devbench_add_function( string $source, string $function_name, callable $callback, array $params = [], string $description = '' ): void {
		WP_DevBench\Inc\Services\DevBench::add_function(
			source: $source,
			function_name: $function_name,
			callback: $callback,
			params: $params,
			description: $description
		);
	}
endif;

/**
 * Hook into WordPress to allow third-party plugins to register functions.
 * This runs on 'init' with priority 15 (after DevBench::init at priority 20).
 */
add_action( 'init', function() {
	if ( class_exists( 'WP_DevBench\Inc\Services\DevBench' ) ) {
		( new WP_DevBench\Inc\Services\DevBench() )->load_functions();
	}
}, 15 );
