<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\DataTransferObjects;

/**
 * DTO - DevBenchFunctionResult
 */
final class DevBenchFunctionResult {

	/**
	 * Whether the function executed successfully.
	 *
	 * @var bool
	 */
	public bool $success;

	/**
	 * Function result output.
	 *
	 * @var string|null
	 */
	public ?string $result;

	/**
	 * Error message, if any.
	 *
	 * @var string
	 */
	public string $error;

	/**
	 * Error or result code.
	 *
	 * @var string
	 */
	public string $code;

	/**
	 * HTTP-style status code.
	 *
	 * @var int
	 */
	public int $status_code;

	/**
	 * Debug log output.
	 *
	 * @var string
	 */
	public string $debug_log;

	/**
	 * Constructor.
	 *
	 * @param bool        $success     Whether the function succeeded.
	 * @param string|null $result      Result output.
	 * @param string      $error       Error message.
	 * @param string      $code        Error or result code.
	 * @param int         $status_code Status code.
	 * @param string|null $debug_log   Optional debug log.
	 */
	public function __construct(
		bool $success,
		?string $result,
		string $error,
		string $code,
		int $status_code,
		?string $debug_log = null
	) {
		$this->success     = $success;
		$this->result      = $result;
		$this->error       = $error;
		$this->code        = $code;
		$this->status_code = $status_code;
		$this->debug_log   = $debug_log ?? '';
	}
}
