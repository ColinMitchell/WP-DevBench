<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc;

use WP_DevBench\Inc\Services\DevBench;

/**
 * Testing Class
 */
final class TestClass {
	public function __construct() {
		add_action( 'init', array( $this, 'init' ) );
	}

	public function init(): void {
		DevBench::add_function(
			class: get_class( $this ),
			function_name: 'test',
			callback: [ $this, 'test' ],
			params: [
				[ // https://rjsf-team.github.io/react-jsonschema-form/docs/json-schema/arrays
					'id'    => 'param_one',
					'type'  => 'string',
					'title' => 'Test Field 1',
				],
				[
					'id'    => 'param_two',
					'type'  => 'boolean',
					'title' => 'Test Field 2',
				],
				[ // https://rjsf-team.github.io/react-jsonschema-form/docs/json-schema/arrays#multiple-choice-list
					'id'      => 'param_three',
					'type'    => 'string',
					'title'   => 'Select Dropdown',
					'choices' => [ 'Option 1', 'Option 2', 'Option 3' ], // by adding choices, it creates a select dropdown
				],
			],
			description: 'Test Description for this function.'
		);

		DevBench::add_function(
			class: get_class( $this ),
			function_name: 'test_no_params',
			callback: [ $this, 'test_no_params' ],
			params: [],
			description: 'Test Description for this function.'
		);
	}

	public function test( $param_one, $param_two, $param_three ): string {
		error_log( print_r( $param_one, true ) );
		error_log( print_r( $param_two, true ) );
		error_log( print_r( $param_three, true ) );
		return $param_one;
	}

	public function test_no_params(): string {
		return 'test me no params';
	}
}
