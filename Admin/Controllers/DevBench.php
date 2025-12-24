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
	public function run( \WP_REST_Request $request ): \WP_REST_Response {
		$function_name = $request->get_param( 'funcName' );
		$param_data    = $request->get_param( 'paramData' ) ?? [];
		$username      = $request->get_param( 'username' );

		// Validate required parameters
		if ( empty( $function_name ) ) {
			return new \WP_REST_Response( [
				'success'     => false,
				'error'       => 'Function name is required.',
				'code'        => 'missing_parameter',
				'status_code' => 400,
			], 400 );
		}

		if ( empty( $username ) ) {
			return new \WP_REST_Response( [
				'success'     => false,
				'error'       => 'Username is required.',
				'code'        => 'missing_parameter',
				'status_code' => 400,
			], 400 );
		}

		$result = $this->service->execute_function( $function_name, $param_data, $username );

		if ( is_wp_error( $result ) ) {
			$debug_log = $this->get_debug_log_tail();

			return new \WP_REST_Response( [
				'success'     => false,
				'error'       => $result->get_error_message(),
				'code'        => $result->get_error_code(),
				'status_code' => $result->get_error_data()['status'] ?? 500,
				'debug_log'   => $debug_log,
			], 200 );
		}

		return new \WP_REST_Response( [
			'success' => true,
			'result'  => $result,
		], 200 );
	}

	/**
	 * Retrieve the tail of debug.log if it exists.
	 *
	 * @param int $lines
	 *
	 * @return string|null
	 */
	private function get_debug_log_tail( int $lines = 50 ): ?string {
		$debug_log_path = WP_CONTENT_DIR . '/debug.log';

		if ( ! file_exists( $debug_log_path ) ) {
			return null;
		}

		$file_content = file_get_contents( $debug_log_path );
		if ( false === $file_content ) {
			return null;
		}

		// Get last N lines
		$log_lines  = explode( "\n", trim( $file_content ) );
		$tail_lines = array_slice( $log_lines, - $lines );

		return implode( "\n", $tail_lines );
	}
}
