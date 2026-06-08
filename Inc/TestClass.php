<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc;

use WP_DevBench\Inc\Services\DevBenchService;

/**
 * Testing Class with DevBench Functions examples.
 */
final class TestClass {
	public function __construct() {
		add_action( 'init', array( $this, 'init' ), 20 );
	}

	public function init(): void {
		DevBenchService::add_function(
			source: get_class( $this ),
			function_name: 'analyze_post_categories',
			callback: array( $this, 'analyze_post_categories' ),
			params: array(
				array(
					'id'      => 'post_status',
					'type'    => 'string',
					'title'   => 'Post Status',
					'choices' => array( 'publish', 'draft', 'pending', 'private', 'any' ),
					'default' => 'draft',
				),
				array(
					'id'      => 'sort_by',
					'type'    => 'string',
					'title'   => 'Sort Results By',
					'choices' => array( 'post_count', 'category_name' ),
					'default' => 'post_count',
				),
				array(
					'id'      => 'include_empty',
					'type'    => 'boolean',
					'title'   => 'Include Empty Categories',
					'default' => false,
				),
			),
			description: 'Analyzes post distribution across categories. Returns detailed statistics including post counts, percentages, and category metadata.'
		);

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
	 * Analyze post categories based on provided parameters.
	 *
	 * @param string $post_status Post status to filter by.
	 * @param bool   $include_empty Whether to include empty categories.
	 * @param string $sort_by Sort order for results.
	 *
	 * @return mixed
	 */
	public function analyze_post_categories( string $post_status, bool $include_empty, string $sort_by ): mixed {
		// Get all categories
		$categories = get_categories( array(
			'hide_empty' => ! $include_empty,
		) );

		$results = array();
		$total_posts = 0;

		foreach ( $categories as $category ) {
			// Get actual posts in category
			$posts_in_cat = get_posts( array(
				'category'    => $category->term_id,
				'post_status' => $post_status,
				'numberposts' => -1,
				'fields'      => 'ids',
			) );

			$count = count( $posts_in_cat );
			$total_posts += $count;

			$results[] = array(
				'category_id'   => $category->term_id,
				'category_name' => $category->name,
				'category_slug' => $category->slug,
				'post_count'    => $count,
				'description'   => $category->description,
				'parent'        => $category->parent,
			);
		}

		// Calculate percentages
		foreach ( $results as &$result ) {
			$result['percentage'] = $total_posts > 0
				? round( ( $result['post_count'] / $total_posts ) * 100, 2 )
				: 0;
		}

		// Sort results
		if ( $sort_by === 'post_count' ) {
			usort( $results, function( $a, $b ) {
				return $b['post_count'] <=> $a['post_count'];
			} );
		} else {
			usort( $results, function( $a, $b ) {
				return strcasecmp( $a['category_name'], $b['category_name'] );
			} );
		}

		return array(
			'summary' => array(
				'total_categories' => count( $results ),
				'total_posts'      => $total_posts,
				'post_status'      => $post_status,
			),
			'categories' => $results,
		);
	}

	/**
	 * Test DevBench Function with Params
	 *
	 * @param string $param_one
	 * @param bool   $param_two
	 * @param string $param_three
	 * @param string $user_file
	 *
	 * @return mixed
	 */
	public function test( string $param_one, bool $param_two, string $param_three, string $user_file ): mixed {
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

	/**
	 * Test DevBench Function without Params
	 *
	 * @return string
	 */
	public function test_no_params(): string {
		return 'test me no params';
	}
}
