<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\DataTransferObjects;

use AllowDynamicProperties;
use JetBrains\PhpStorm\Immutable;

#[AllowDynamicProperties]
#[Immutable]
/**
 * DTO - Starter class
 */
class Starter {

	public function __construct(
		int $id,
		string $name
	) {
		$this->id   = $id;
		$this->name = $id;

		// Any additional filtering can be done here
	}
}
