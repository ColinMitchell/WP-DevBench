<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\DataTransferObjects;

/**
 * DTO - DevBenchFunctionResult
 */
final class DevBenchFunctionResult {
	public bool $success;
	public ?string $result;
	public string $error;
	public string $code;
	public int $status_code;
	public string $debug_log;

	public function __construct( bool $success, ?string $result, string $error, string $code, int $status_code, ?string $debug_log = null ) {
		$this->success     = $success;
		$this->result      = $result;
		$this->error       = $error;
		$this->code        = $code;
		$this->status_code = $status_code;
		$this->debug_log   = $debug_log ?? '';
	}
}
