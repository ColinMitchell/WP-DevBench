<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\DataTransferObjects;

use Exception;

/**
 * DTO - DevBenchFunction
 */
final class DevBenchFunction {
	/**
	 * Source identifier.
	 *
	 * @var string
	 */
	public string $source;

	/**
	 * Function name.
	 *
	 * @var string
	 */
	public string $funcName; // phpcs:ignore WordPress.NamingConventions.ValidVariableName.PropertyNotSnakeCase

	/**
	 * Callable function reference.
	 *
	 * @var callable
	 */
	public $callback;

	/**
	 * Parameter schema or null.
	 *
	 * @var array|null
	 */
	public ?array $params;

	/**
	 * Description of function.
	 *
	 * @var string
	 */
	public string $description;

	public function __construct( string $source, string $function_name, callable $callback, ?array $params = null, string $description = '' ) {
		$this->source = $source;
		// phpcs:ignore WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$this->funcName    = $function_name;
		$this->callback    = $callback;
		$this->params      = $params ? $params : null;
		$this->description = $description;

		if ( ! is_callable( $callback ) ) {
			throw new Exception( 'Function callback for function tags is not callable.' );
		}

		if ( ! empty( $this->params ) ) {
			$schema = array(
				'title'      => 'Function Params',
				'type'       => 'object',
				'properties' => array(),
			);

			foreach ( $this->params as $param ) {
				$schema['properties'][ $param['id'] ] = array(
					'type'    => $param['type'],
					'title'   => $param['title'],
					'default' => $param['default'] ?? null,
				);

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
