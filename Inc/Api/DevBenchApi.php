<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Api;

use WP_DevBench\Admin\Controllers\DevBenchController as DevBenchController;
use WP_DevBench\Inc\Interfaces\ApiInterface;
use WP_DevBench\Inc\Plugin;
use WP_DevBench\Inc\Services\DevBenchService as DevBenchService;

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

		$devbench_service = new DevBenchService();

		$this->devbench_controller = new DevBenchController( $devbench_service );
	}

	#[\Override]
	public function register_routes(): void {
		// GET/POST: /wp-json/wp-devbench/v1/devbench/functions
		register_rest_route( parent::DEVBENCH_ENDPOINT, '/devbench/functions', array(
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'get' ),
				'permission_callback' => array( $this, 'authorize' ),
				'schema'              => array( $this, 'get_functions_schema' ),
			),
			array(
				'methods'             => 'POST',
				'callback'            => array( $this, 'run' ),
				'permission_callback' => array( $this, 'authorize' ),
				'args'                => array(
					'funcName'  => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_text_field',
						'description'       => 'Name of the function to execute',
					),
					'paramData' => array(
						'required'    => false,
						'type'        => 'object',
						'default'     => array(),
						'description' => 'Parameters to pass to the function',
					),
					'username'  => array(
						'required'          => true,
						'type'              => 'string',
						'sanitize_callback' => 'sanitize_user',
						'description'       => 'Username to authenticate as',
					),
				),
				'schema'              => array( $this, 'run_function_schema' ),
			),
		) );
	}

	/**
	 * OpenAPI schema for GET /devbench/functions endpoint.
	 *
	 * @return array OpenAPI schema definition
	 */
	public function get_functions_schema(): array {
		return array(
			'$schema'     => 'http://json-schema.org/draft-04/schema#',
			'title'       => 'DevBench Functions List',
			'description' => 'Retrieves a list of available DevBench functions',
			'type'        => 'object',
			'properties'  => array(
				'functions' => array(
					'description' => 'Array of available functions',
					'type'        => 'array',
					'items'       => array(
						'type'       => 'object',
						'properties' => array(
							'name'        => array(
								'type'        => 'string',
								'description' => 'Function name',
							),
							'description' => array(
								'type'        => 'string',
								'description' => 'Function description',
							),
							'parameters'  => array(
								'type'        => 'array',
								'description' => 'Function parameters',
								'items'       => array(
									'type'       => 'object',
									'properties' => array(
										'name'     => array(
											'type'        => 'string',
											'description' => 'Parameter name',
										),
										'type'     => array(
											'type'        => 'string',
											'description' => 'Parameter type',
										),
										'required' => array(
											'type'        => 'boolean',
											'description' => 'Whether parameter is required',
										),
									),
								),
							),
						),
					),
				),
			),
		);
	}

	/**
	 * OpenAPI schema for POST /devbench/functions endpoint.
	 *
	 * @return array OpenAPI schema definition
	 */
	public function run_function_schema(): array {
		return array(
			'$schema'     => 'http://json-schema.org/draft-04/schema#',
			'title'       => 'DevBench Function Execution',
			'description' => 'Executes a DevBench function and returns the result',
			'type'        => 'object',
			'properties'  => array(
				'success'     => array(
					'description' => 'Whether the function execution was successful',
					'type'        => 'boolean',
					'readonly'    => true,
				),
				'result'      => array(
					'description' => 'Function execution result data',
					'type'        => array( 'object', 'array', 'string', 'number', 'boolean', 'null' ),
					'readonly'    => true,
				),
				'error'       => array(
					'description' => 'Error message if execution failed',
					'type'        => array( 'string', 'null' ),
					'readonly'    => true,
				),
				'code'        => array(
					'description' => 'Error code if execution failed',
					'type'        => array( 'string', 'null' ),
					'readonly'    => true,
				),
				'status_code' => array(
					'description' => 'HTTP status code',
					'type'        => 'integer',
					'readonly'    => true,
				),
				'debug_log'   => array(
					'description' => 'Debug log entries from execution',
					'type'        => 'array',
					'items'       => array(
						'type' => 'string',
					),
					'readonly'    => true,
				),
			),
			'required'    => array( 'success', 'status_code' ),
		);
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
		$param_data    = $request->get_param( 'paramData' ) ?? array();
		$username      = $request->get_param( 'username' );

		if ( ! $function_name ) {
			return new \WP_Error( 'invalid_function_name', 'Function name is required.', array( 'status' => 400 ) );
		}

		if ( ! $username ) {
			return new \WP_Error( 'invalid_username', 'Username is required.', array( 'status' => 400 ) );
		}

		$data = $this->devbench_controller->run( $function_name, $param_data, $username );

		return new \WP_REST_Response( array(
			'success'     => $data->success,
			'result'      => $data->result,
			'error'       => $data->error,
			'code'        => $data->code,
			'status_code' => $data->status_code,
			'debug_log'   => $data->debug_log,
		), $data->status_code );
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
