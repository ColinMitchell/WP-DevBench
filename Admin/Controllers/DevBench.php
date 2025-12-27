<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin\Controllers;

use WP_DevBench\Inc\DataTransferObjects\DevBenchFunctionResult;
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
	 * @param string     $function_name
	 * @param array|null $param_data
	 * @param string     $username
	 *
	 * @return DevBenchFunctionResult
	 */
	public function run( string $function_name, ?array $param_data, string $username ): DevBenchFunctionResult {

		// Validate required parameters
		if ( empty( $function_name ) ) {
			return new DevBenchFunctionResult(
				success: false,
				result: null,
				error: 'Function name is required.',
				code: 'missing_parameter',
				status_code: 400
			);
		}

		if ( empty( $username ) ) {
			return new DevBenchFunctionResult(
				success: false,
				result: null,
				error: 'Username is required.',
				code: 'missing_parameter',
				status_code: 400
			);
		}

		$result = $this->service->execute_function( $function_name, $param_data, $username );

		if ( is_wp_error( $result ) ) {
			$debug_log = $this->get_debug_log_tail();

			return new DevBenchFunctionResult(
				success: false,
				result: null,
				error: $result->get_error_message(),
				code: $result->get_error_code(),
				status_code: $result->get_error_data()['status'] ?? 500,
				debug_log: $debug_log
			);
		}

		return new DevBenchFunctionResult(
			success: true,
			result: $result,
			error: '',
			code: '',
			status_code: 200,
			debug_log: null
		);
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
		if ( empty( $file_content ) ) {
			return null;
		}

		// Get last N lines
		$log_lines  = explode( "\n", trim( $file_content ) );
		$tail_lines = array_slice( $log_lines, - $lines );

		return implode( "\n", $tail_lines );
	}
}
