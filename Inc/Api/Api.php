<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Api;

/**
 * Abstract class representing a base API structure.
 * Provides constants for endpoint definitions, initialization logic,
 * and methods for route registration and authorization.
 */
abstract class Api extends \WP_REST_Controller {

	/**
	 * Defines the endpoint for the DevBench API.
	 */
	public const string DEVBENCH_ENDPOINT = 'wp-devbench/v1';

	public function __construct() {
		add_action( 'rest_api_init', [ $this, 'register_routes' ] );
		add_filter( 'rest_authentication_errors', [ $this, 'disable_cookie_auth' ], 99 );
	}

	/**
	 * Disables cookie authentication for the DevBench API.
	 */
	public function disable_cookie_auth( $result ): ?bool {
		if ( ! empty( $result ) ) {
			return $result;
		}

		$rest_route = $GLOBALS['wp']->query_vars['rest_route'] ?? '';

		if ( str_starts_with( $rest_route, '/' . self::DEVBENCH_ENDPOINT ) ) {
			return true;
		}

		return $result;
	}

	/**
	 * Registers the routes for the implementing class.
	 *
	 * @return void
	 */
	public function register_routes() {
		// To be implemented by subclasses
	}


	/**
	 * Handles authorization by verifying the presence of a nonce in the request headers.
	 *
	 * @return true|\WP_Error Returns true if the nonce is present and valid; otherwise, returns a WP_Error object.
	 */
	public function authorize(): true|\WP_Error {

		if ( ! isset( $_SERVER['HTTP_X_WP_NONCE'] ) ) {
			return new \WP_Error(
				'rest_invalid_nonce',
				'Nonce verification failed.',
				[ 'status' => 403 ]
			);
		}

		return true;
	}
}
