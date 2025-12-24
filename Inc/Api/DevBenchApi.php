<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Api;

use WP_DevBench\Admin\Controllers\DevBench as DevBenchController;
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

	/**
	 * @var AdminGadgetsApi
	 */
	protected AdminGadgetsApi $admin_gadgets_api;

	public function __construct( protected Plugin $plugin ) {
		parent::__construct();

		// Initialize service
		$devbench_service = new DevBenchService();

		// Inject service into controller
		$this->devbench_controller = new DevBenchController( $devbench_service );
		$this->admin_gadgets_api   = new AdminGadgetsApi();
	}

	#[\Override]
	public function register_routes(): void {
		// DevBench sandbox routes
		// GET/POST: /wp-json/wp-devbench/v1/devbench/functions
		register_rest_route( parent::DEVBENCH_ENDPOINT, '/devbench/functions', [
			[
				'methods'             => 'GET',
				'callback'            => [ $this->devbench_controller, 'get' ],
				'permission_callback' => [ $this, 'authorize' ],
			],
			[
				'methods'             => 'POST',
				'callback'            => [ $this->devbench_controller, 'run' ],
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
			],
		] );
	}

	/**
	 * Example admin endpoint handler.
	 *
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_REST_Response
	 */
	public function admin_endpoint( $request ): \WP_REST_Response {
		return new \WP_REST_Response( [ 'message' => 'Admin endpoint response' ], 200 );
	}
}
