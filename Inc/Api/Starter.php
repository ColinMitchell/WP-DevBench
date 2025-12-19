<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Api;

use WP_DevBench\Inc\Interfaces\ApiInterface;
use WP_Error;
use WP_REST_Request;
use WP_REST_Response;

/**
 * Starter Class for API Logic
 *
 * This is a template for creating new API endpoints with proper schema definitions,
 * validation, and documentation following WordPress REST API best practices.
 */
final class Starter extends Api implements ApiInterface {

	/**
	 * Constructor
	 *
	 * If you need to inject services, add them as constructor parameters:
	 * public function __construct( protected YourService $your_service ) {
	 */
	public function __construct() {
		parent::__construct();
	}

	#[\Override]
	public function register_routes(): void {
		/*register_rest_route( parent::PUBLIC_ENDPOINT, '/service/my-endpoint', [

			[
				'methods' => 'GET',
				'callback' => [ $this, 'get_data' ],
				'permission_callback' => [ $this, 'authorize' ],
			],
			[
				'methods' => 'POST',
				'callback' => [ $this, 'run' ],
				'permission_callback' => [ $this, 'authorize' ],
			],
			[
				'methods' => 'POST',
				'callback' => [  $this, 'update' ],
				'permission_callback' => [  $this->service, 'authorize' ],
				'args' => [
					'apiKey' => [
						'required' => true,
						'sanitize_callback' => 'sanitize_text_field',
						'type' => 'string',
						'description' => __( 'This is a description for the API Key param.', 'wp-devbench' ),
					]
				]
			],
			'schema' => [ $this, 'get_example_schema' ],
		] );*/
	}

	/*public function get_example_schema(): array {
		return [
			'$schema'    => 'http://json-schema.org/draft-04/schema#',
			'title'      => 'my-endpoint-schema',
			'type'       => [ 'object', 'boolean' ],
			'properties' => [
				'my_key'      => [
					'description' => 'This is an example description',
					'type'        => [ 'string', 'null' ],
					'format'      => 'date-time',
				],
			],
		];
	}*/

	/*
	public function get_data( \WP_REST_Request $request ): \WP_Error|\WP_REST_Response {
		if ( ! $result ) {
			return new \WP_Error( 'failure', 'My Failure Message', array( 'status' => 400 ) );
		}

		return new \WP_REST_Response( $result, 200 );
	}*/

	/*public function admin_endpoint( $request ) {
		return new \WP_REST_Response( [ 'message' => 'Admin endpoint response' ], 200 );
	}*/
}
