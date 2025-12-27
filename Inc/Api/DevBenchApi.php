<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Api;

use WP_DevBench\Admin\Controllers\DevBench as DevBenchController;
use WP_DevBench\Inc\DataTransferObjects\DevBenchFunctionResult;
use WP_DevBench\Inc\Interfaces\ApiInterface;
use WP_DevBench\Inc\Plugin;
use WP_DevBench\Inc\Services\DevBench as DevBenchService;

/**
 * DevBench API route registration and initialization.
 */
final class DevBenchApi extends Api implements ApiInterface {

	/**
	 * @var DevBenchController
	 */
	private DevBenchController $devbench_controller;

	public function __construct( protected Plugin $plugin ) {
		parent::__construct();

		// Initialize service
		$devbench_service = new DevBenchService();

		$this->devbench_controller = new DevBenchController( $devbench_service );
	}

	#[\Override]
	public function register_routes(): void {
		// GET/POST: /wp-json/wp-devbench/v1/devbench/functions
		register_rest_route( parent::DEVBENCH_ENDPOINT, '/devbench/functions', [
			[
				'methods'             => 'GET',
				'callback'            => [ $this, 'get' ],
				'permission_callback' => [ $this, 'authorize' ],
				'schema'              => [ $this, 'get_functions_schema' ],
			],
			[
				'methods'             => 'POST',
				'callback'            => [ $this, 'run' ],
				'permission_callback' => [ $this, 'authorize' ],
				'args'                => [
					'funcName'  => [
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'description'       => 'Name of the function to execute',
					],
					'paramData' => [
						'required'    => false,
						'type'        => 'object',
						'default'     => [],
						'description' => 'Parameters to pass to the function',
					],
					'username'  => [
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_user',
						'description'       => 'Username to authenticate as',
					],
				],
				'schema'              => [ $this, 'run_function_schema' ],
			],
		] );
	}

	/**
	 * OpenAPI schema for GET /devbench/functions endpoint.
	 *
	 * @return array OpenAPI schema definition
	 */
	public function get_functions_schema(): array {
		return [
			'$schema'     => 'http://json-schema.org/draft-04/schema#',
			'title'       => 'DevBench Functions List',
			'description' => 'Retrieves a list of available DevBench functions',
			'type'        => 'object',
			'properties'  => [
				'functions' => [
					'description' => 'Array of available functions',
					'type'        => 'array',
					'items'       => [
						'type'       => 'object',
						'properties' => [
							'name'        => [
								'type'        => 'string',
								'description' => 'Function name',
							],
							'description' => [
								'type'        => 'string',
								'description' => 'Function description',
							],
							'parameters'  => [
								'type'        => 'array',
								'description' => 'Function parameters',
								'items'       => [
									'type'       => 'object',
									'properties' => [
										'name'     => [
											'type'        => 'string',
											'description' => 'Parameter name',
										],
										'type'     => [
											'type'        => 'string',
											'description' => 'Parameter type',
										],
										'required' => [
											'type'        => 'boolean',
											'description' => 'Whether parameter is required',
										],
									],
								],
							],
						],
					],
				],
			],
		];
	}

	/**
	 * OpenAPI schema for POST /devbench/functions endpoint.
	 *
	 * @return array OpenAPI schema definition
	 */
	public function run_function_schema(): array {
		return [
			'$schema'     => 'http://json-schema.org/draft-04/schema#',
			'title'       => 'DevBench Function Execution',
			'description' => 'Executes a DevBench function and returns the result',
			'type'        => 'object',
			'properties'  => [
				'success'     => [
					'description' => 'Whether the function execution was successful',
					'type'        => 'boolean',
					'readonly'    => true,
				],
				'result'      => [
					'description' => 'Function execution result data',
					'type'        => [ 'object', 'array', 'string', 'number', 'boolean', 'null' ],
					'readonly'    => true,
				],
				'error'       => [
					'description' => 'Error message if execution failed',
					'type'        => [ 'string', 'null' ],
					'readonly'    => true,
				],
				'code'        => [
					'description' => 'Error code if execution failed',
					'type'        => [ 'string', 'null' ],
					'readonly'    => true,
				],
				'status_code' => [
					'description' => 'HTTP status code',
					'type'        => 'integer',
					'readonly'    => true,
				],
				'debug_log'   => [
					'description' => 'Debug log entries from execution',
					'type'        => 'array',
					'items'       => [
						'type' => 'string',
					],
					'readonly'    => true,
				],
			],
			'required'    => [ 'success', 'status_code' ],
		];
	}

	/**
	 * Retrieves functions from the DevBench service.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function run( \WP_REST_Request $request ): \WP_Error|\WP_REST_Response {
		$function_name = $request->get_param( 'funcName' );
		$param_data    = $request->get_param( 'paramData' ) ?? [];
		$username      = $request->get_param( 'username' );

		if ( ! $function_name ) {
			return new \WP_Error( 'invalid_function_name', 'Function name is required.', array( 'status' => 400 ) );
		}

		if ( ! $username ) {
			return new \WP_Error( 'invalid_username', 'Username is required.', array( 'status' => 400 ) );
		}

		$data = $this->devbench_controller->run( $function_name, $param_data, $username );

		return new \WP_REST_Response( [
			'success'     => $data->success,
			'result'      => $data->result,
			'error'       => $data->error,
			'code'        => $data->code,
			'status_code' => $data->status_code,
			'debug_log'   => $data->debug_log,
		], $data->status_code );
	}

	/**
	 * Retrieves functions from the DevBench service.
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function get(): \WP_Error|\WP_REST_Response {
		$data = $this->devbench_controller->get();

		return new \WP_REST_Response( $data, 200 );
	}
}
