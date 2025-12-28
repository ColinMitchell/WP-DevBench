<?php
declare( strict_types=1 );


use WP_DevBench\Inc\DataTransferObjects\DevBenchFunctionResult;

it( 'creates a successful result', function () {
	$result = new DevBenchFunctionResult(
		true,
		'ok',
		'',
		'SUCCESS',
		200
	);

	expect( $result->success )->toBeTrue();
	expect( $result->result )->toBe( 'ok' );
	expect( $result->error )->toBe( '' );
	expect( $result->code )->toBe( 'SUCCESS' );
	expect( $result->status_code )->toBe( 200 );
	expect( $result->debug_log )->toBe( '' );
} );

it( 'fills debug log when provided', function () {
	$result = new DevBenchFunctionResult(
		false,
		null,
		'Something broke',
		'ERROR',
		500,
		'Stack trace here'
	);

	expect( $result->debug_log )->toBe( 'Stack trace here' );
} );
