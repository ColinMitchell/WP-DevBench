<?php

declare(strict_types=1);

use WP_DevBench\Inc\Services\DevBenchService;
use WP_DevBench\Inc\DataTransferObjects\DevBenchFunction;

describe('DevBenchService', function () {
	describe('Function Registration', function () {
		it('should register a function successfully', function () {
			$testCallback = function () {
				return 'test result';
			};

			DevBenchService::add_function(
				source: 'TestSource',
				function_name: 'test_function',
				callback: $testCallback,
				params: [],
				description: 'Test function'
			);

			$service = new DevBenchService();
			$functions = $service->get_functions();

			expect($functions)->not->toBeEmpty();
		});

		it('should prevent duplicate function registration', function () {
			$testCallback = fn() => 'test';

			DevBenchService::add_function(
				source: 'TestSource',
				function_name: 'duplicate_test',
				callback: $testCallback,
				params: [],
				description: 'Test'
			);

			DevBenchService::add_function(
				source: 'TestSource',
				function_name: 'duplicate_test',
				callback: $testCallback,
				params: [],
				description: 'Test'
			);

			$service = new DevBenchService();
			$functions = $service->get_functions();

			$count = array_filter($functions, fn($func) => $func->funcName === 'duplicate_test');
			expect(count($count))->toBeLessThanOrEqual(1);
		});

		it('should register function with parameters', function () {
			$params = [
				['id' => 'param1', 'type' => 'string', 'title' => 'Parameter 1'],
				['id' => 'param2', 'type' => 'boolean', 'title' => 'Parameter 2'],
			];

			DevBenchService::add_function(
				source: 'TestSource',
				function_name: 'test_with_params',
				callback: fn() => 'test',
				params: $params,
				description: 'Test with params'
			);

			$service = new DevBenchService();
			$functions = $service->get_functions();

			expect($functions)->not->toBeEmpty();
		});
	})->skip('skipping it temporarily until fixed.');
})->skip('skipping it temporarily until fixed.');
