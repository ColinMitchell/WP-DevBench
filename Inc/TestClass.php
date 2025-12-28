<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc;

use WP_DevBench\Inc\Services\DevBenchService;

/**
 * Testing Class
 */
final class TestClass {
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init(): void {
		DevBenchService::add_function(
			source: get_class( $this ),
			function_name: 'test',
			callback: array( $this, 'test' ),
			params: array(
				array( // https://rjsf-team.github.io/react-jsonschema-form/docs/json-schema/arrays
					'id'    => 'param_one',
					'type'  => 'string',
					'default' => 'default value',
					'title' => 'Test Field 1',
				),
				array(
					'id'    => 'param_two',
					'type'  => 'boolean',
					'title' => 'Test Field 2',
				),
				array( // https://rjsf-team.github.io/react-jsonschema-form/docs/json-schema/arrays#multiple-choice-list
					'id'      => 'param_three',
					'type'    => 'string',
					'title'   => 'Select Dropdown',
					'choices' => array( 'Option 1', 'Option 2', 'Option 3' ), // by adding choices, it creates a select dropdown
				),
				array(
					'id'      => 'user_file',
					'type'    => 'file',
					'title'   => 'Upload CSV/xml File',
					'default' => null,
					'accept'  => '.csv,.xml',  // Optional: specify accepted file types
				),
			),
			description: 'Test Description for this function.'
		);

		DevBenchService::add_function(
			source: get_class( $this ),
			function_name: 'test_no_params',
			callback: array( $this, 'test_no_params' ),
			params: array(),
			description: 'Test Description for this function.'
		);
	}

	/**
	 * Test DevBench Function with Params
	 */
	public function test( $param_one, $param_two, $param_three, $user_file ): mixed {
		error_log( print_r( $param_one, true ) );
		error_log( print_r( $param_two, true ) );
		error_log( print_r( $param_three, true ) );
		error_log( print_r( $user_file, true ) );

		return array(
			$param_one,
			$param_two,
			$param_three,
			$user_file,
		);
	}

	public function test_no_params(): string {
		return 'test me no params';
	}
}
