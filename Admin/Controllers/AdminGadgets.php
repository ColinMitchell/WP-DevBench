<?php
declare( strict_types=1 );

namespace WP_DevBench\Admin\Controllers;

use WP_Query;

/**
 * Controller for handling Admin Gadgets devbench page 'gadgets'.
 */
final class AdminGadgets {

	public function __construct() {
	}

	/**
	 * @param string $post_type
	 *
	 * @return bool
	 */
	public function delete_posts( string $post_type ): bool {
		$posts = new WP_Query( array(
			'post_type'      => $post_type,
			'posts_per_page' => - 1,
			'post_status'    => 'any',
		) );

		if ( empty( $posts->posts ) ) {
			return false;
		}

		foreach ( $posts->posts as $post ) {
			wp_delete_post( $post->ID, true );
		}

		return true;
	}

	/**
	 * @param string $taxonomy
	 *
	 * @return bool
	 */
	public function delete_terms( string $taxonomy ): bool {
		if ( ! taxonomy_exists( $taxonomy ) ) {
			error_log( "Taxonomy '{$taxonomy}' does not exist." );

			return false;
		}

		$terms = get_terms( [
			'taxonomy'   => $taxonomy,
			'hide_empty' => false, // Get all terms, even those not assigned to posts
		] );

		if ( is_wp_error( $terms ) || empty( $terms ) ) {
			error_log( "No terms found for taxonomy '{$taxonomy}'." );

			return false;
		}

		foreach ( $terms as $term ) {
			wp_delete_term( $term->term_id, $taxonomy );
		}

		error_log( "All terms for taxonomy '{$taxonomy}' have been deleted." );

		return true;
	}

	public function post_taxonomy_sync( string $post_type, string $taxonomy, int $site_id, int $target_site_id ): bool {
		ignore_user_abort( true );

		// 10 minutes
		set_time_limit( 2000 );

		// Always do taxonomy first.
		if ( ! empty( $taxonomy ) ) {
			error_log( "Starting taxonomy sync: {$taxonomy} from site {$site_id} to site {$target_site_id}" );

			$this->sync->taxonomy_sync( $taxonomy, $site_id, $target_site_id );

			error_log( 'Taxonomy sync completed successfully.' );
		}

		if ( ! empty( $post_type ) ) {
			error_log( "Starting post sync: {$post_type} from site {$site_id} to site {$target_site_id}" );

			$this->sync->post_type_sync( $post_type, $site_id, $target_site_id );

			error_log( 'Post sync completed successfully.' );
		}

		return true;
	}
}
