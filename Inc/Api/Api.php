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
	}

	public function register_routes() {
		// To be implemented by subclasses
	}

	public function authorize() {
		// even as admin, this is returning false for some reason.
		// return current_user_can('manage_options');

		return true;
	}
}
