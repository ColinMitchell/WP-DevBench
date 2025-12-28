<?php
declare( strict_types=1 );

use WP_DevBench\Inc\DataTransferObjects\DevBenchFunction;

it('builds a function DTO with schema params', function () {
	$dto = new DevBenchFunction(
		'core',
		'test_function',
		fn () => 'ok',
		array(
			array(
				'id'      => 'limit',
				'type'    => 'number',
				'title'   => 'Limit',
				'default' => 10,
			),
		),
		'Test function'
	);

	expect($dto->funcName)->toBe('test_function');
	expect($dto->params['type'])->toBe('object');
	expect($dto->params['properties']['limit']['default'])->toBe(10);
});

it('throws when callback is not callable', function () {
	new DevBenchFunction(
		'core',
		'invalid',
		'not_a_function'
	);
})->throws(TypeError::class);
