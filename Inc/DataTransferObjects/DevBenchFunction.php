<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\DataTransferObjects;

use Exception;

/**
 * DTO - DevBenchFunction
 */
final class DevBenchFunction {
	public string $source;
	public string $funcName;
	public $callback;
	public ?array $params;
	public string $description;

	public function __construct( string $source, string $function_name, callable $callback, ?array $params = null, string $description = '' ) {
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

				if ( $param['type'] === 'file' ) {
					$schema['properties'][ $param['id'] ]['type'] = 'string';
					$schema['properties'][ $param['id'] ]['format'] = 'data-url';

					if ( ! empty( $param['accept'] ) ) {
						$schema['properties'][ $param['id'] ]['accept'] = $param['accept'];
					}
				}
			}

			$this->params = $schema;
		}
	}
}
