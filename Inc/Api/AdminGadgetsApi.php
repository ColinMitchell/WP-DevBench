<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Api;

use WP_DevBench\Inc\Interfaces\ApiInterface;

use WP_DevBench\Admin\Controllers\AdminGadgets as AdminGadgetsController;

/**
 * The AdminGadgetsApi class handles the registration of REST API endpoints
 * and delegates functionality to the AdminGadgetsController.
 *
 * This class provides API functionality for managing admin-centric features,
 * such as synchronizing post-taxonomy associations, deleting posts, and deleting terms.
 *
 * It extends the base Api class and implements the ApiInterface for consistent API behavior.
 */
final class AdminGadgetsApi extends Api implements ApiInterface {

	/**
	 * @var AdminGadgetsController
	 */
	protected AdminGadgetsController $admin_gadgets;

	public function __construct() {
		$this->admin_gadgets = new AdminGadgetsController();
		parent::__construct();
	}

	#[\Override]
	public function register_routes(): void {
		register_rest_route( parent::DEVBENCH_ENDPOINT, '/admin-gadgets/post-taxonomy-sync', [
			[
				'methods' => 'POST',
				'callback' => [ $this, 'sync' ],
				'permission_callback' => [ $this, 'authorize' ],
				'args' => [
					'post_type' => [
						'required' => false,
						'type' => 'string',
					],
					'taxonomy' => [
						'required' => false,
						'type' => 'string',
					],
					'site_id' => [
						'required' => true,
						'type' => 'int',
					],
					'target_site_id' => [
						'required' => true,
						'type' => 'int',
					],
				],
			],
		] );

		register_rest_route( parent::DEVBENCH_ENDPOINT, '/admin-gadgets/delete-posts', [
			[
				'methods' => 'POST',
				'callback' => [ $this, 'delete_posts' ],
				'permission_callback' => [ $this, 'authorize' ],
				'args' => [
					'post_type' => [
						'required' => false,
						'type' => 'string',
					],
				],
			],
		] );

		register_rest_route( parent::DEVBENCH_ENDPOINT, '/admin-gadgets/delete-terms', [
			[
				'methods' => 'POST',
				'callback' => [ $this, 'delete_terms' ],
				'permission_callback' => [ $this, 'authorize' ],
				'args' => [
					'taxonomy' => [
						'required' => false,
						'type' => 'string',
					],
				],
			],
		] );
	}

	public function sync( \WP_REST_Request $request ): \WP_Error|\WP_REST_Response {

		$result = $this->admin_gadgets->post_taxonomy_sync(
			post_type: $request->get_param( 'post_type' ),
			taxonomy: $request->get_param( 'taxonomy' ),
			site_id: $request->get_param( 'site_id' ),
			target_site_id: $request->get_param( 'target_site_id' )
		);

		if ( ! $result ) {
			return new \WP_Error( 'admin_gadget_sync_failed', 'Admin Gadget "Network Post & Taxonomy Sync" Failed.', array( 'status' => 400 ) );
		}

		return new \WP_REST_Response( true, 200 );
	}

	public function delete_posts( \WP_REST_Request $request ): \WP_Error|\WP_REST_Response {

		$result = $this->admin_gadgets->delete_posts(
			post_type: $request->get_param( 'post_type' ),
		);

		if ( ! $result ) {
			return new \WP_Error( 'admin_gadget_sync_failed', 'Admin Gadget "Delete Posts" Failed.', array( 'status' => 400 ) );
		}

		return new \WP_REST_Response( true, 200 );
	}

	/**
	 * @param \WP_REST_Request $request
	 *
	 * @return \WP_Error|\WP_REST_Response
	 */
	public function delete_terms( \WP_REST_Request $request ): \WP_Error|\WP_REST_Response {

		$result = $this->admin_gadgets->delete_terms(
			taxonomy: $request->get_param( 'taxonomy' ),
		);

		if ( ! $result ) {
			return new \WP_Error( 'admin_gadget_sync_failed', 'Admin Gadget "Delete Terms" Failed.', array( 'status' => 400 ) );
		}

		return new \WP_REST_Response( true, 200 );
	}

	public function admin_endpoint( $request ): \WP_REST_Response {
		// Handle admin-specific request
		return new \WP_REST_Response( [ 'message' => 'Admin endpoint response' ], 200 );
	}
}
