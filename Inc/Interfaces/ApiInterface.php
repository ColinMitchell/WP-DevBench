<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Interfaces;

interface ApiInterface {
	public function register_routes(): void;
}
