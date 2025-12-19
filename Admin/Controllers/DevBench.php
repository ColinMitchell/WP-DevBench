<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin\Controllers;

use WP_DevBench\Inc\Services\DevBench as DevBenchService;

/**
 * Controller for handling DevBench REST API requests.
 */
final class DevBench {

	private DevBenchService $service;

	public function __construct( DevBenchService $service ) {
		$this->service = $service;
	}

	/**
	 * Get all registered functions.
	 * Endpoint: GET /wp-json/wp-devbench/v1/functions
	 *
	 * @return array
	 */
	public function get(): array {
		return $this->service->get_functions();
	}

	/**
	 * Execute a DevBench function.
	 * Endpoint: POST /wp-json/wp-devbench/v1/functions/run
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return mixed
	 */
	public function run( \WP_REST_Request $request ): mixed {
		$function_name = $request->get_param( 'funcName' );
		$param_data    = $request->get_param( 'paramData' ) ?? [];
		$username      = $request->get_param( 'username' );

		// Validate required parameters
		if ( empty( $function_name ) ) {
			return new \WP_Error(
				'missing_parameter',
				'Function name is required.',
				[ 'status' => 400 ]
			);
		}

		if ( empty( $username ) ) {
			return new \WP_Error(
				'missing_parameter',
				'Username is required.',
				[ 'status' => 400 ]
			);
		}

		return $this->service->execute_function( $function_name, $param_data, $username );
	}
}