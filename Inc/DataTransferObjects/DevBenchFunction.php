<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\DataTransferObjects;

use AllowDynamicProperties;
use Exception;

/**
 * DTO - DevBenchFunction
 */
#[AllowDynamicProperties]
final class DevBenchFunction {

	public function __construct( string $source, string $function_name, callable $callback, array|null $params, string|null $description = '' ) {
		$this->source = $source;
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$this->funcName    = $function_name;
		$this->callback    = $callback;
		$this->params      = $params ?: null;
		$this->description = $description;

		if ( ! is_callable( $callback ) ) {
			throw new Exception( 'Function callback for function tags is not callable.' );
		}

		if ( ! empty( $this->params ) ) {
			$schema = [
				'title'      => 'Function Params',
				'type'       => 'object',
				'properties' => [],
			];

			foreach ( $this->params as $param ) {
				$schema['properties'][ $param['id'] ] = [
					'type'    => $param['type'],
					'title'   => $param['title'],
					'default' => $param['default'] ?? null,
				];

				// Handle choices for select dropdowns
				if ( ! empty( $param['choices'] ) ) {
					$schema['properties'][ $param['id'] ]['enum'] = $param['choices'];
				}
			}

			$this->params = $schema;
		}
	}
}
