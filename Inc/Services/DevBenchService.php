<?php
declare( strict_types=1 );

namespace WP_DevBench\Inc\Services;

use WP_DevBench\Inc\DataTransferObjects\DevBenchFunction;

/**
 * Service for managing and executing sandbox functions.
 */
final class DevBenchService {

	/** @var DevBenchFunction[] $functions */
	private static array $functions = array();

	public function __construct() {
	}

	/**
	 * Register a new DevBench function.
	 *
	 * @param string   $source
	 * @param string   $function_name
	 * @param callable $callback
	 * @param array    $params
	 * @param string   $description
	 *
	 * @return void
	 * @throws \Exception
	 */
	public static function add_function( string $source, string $function_name, callable $callback, array $params = array(), string $description = '' ): void {
		$key = sanitize_title( $source . $function_name );

		if ( isset( self::$functions[ $key ] ) ) {
			return;
		}

		self::$functions[ $key ] = new DevBenchFunction(
			source: $source,
			function_name: $function_name,
			callback: $callback,
			params: $params,
			description: $description
		);
	}

	/**
	 * Get all registered functions.
	 *
	 * @return DevBenchFunction[]
	 */
	public function get_functions(): array {
		self::$functions = apply_filters( 'wp_devbench_functions', self::$functions );

		return array_values( self::$functions );
	}

	/**
	 * Backwards compatibility: Allow registration via action hook.
	 *
	 * @return void
	 */
	public function load_functions(): void {
		do_action( 'wp_devbench_register_functions' );
	}

	/**
	 * Execute a sandbox function by name.
	 *
	 * @param string $function_name
	 * @param array  $param_data
	 * @param string $username
	 *
	 * @return string|bool|\WP_Error
	 */
	public function execute_function( string $function_name, array $param_data, string $username ): string|bool|\WP_Error {
		$functions = $this->get_functions();

		if ( empty( $functions ) ) {
			return new \WP_Error(
				'no_functions',
				'No sandbox functions registered.'
			);
		}

		$sandbox_function = $this->find_function( $function_name, $functions );

		if ( ! $sandbox_function ) {
			return new \WP_Error(
				'function_not_found',
				sprintf( 'Could not find function: %s', $function_name )
			);
		}

		// Authenticate user
		$auth_result = $this->authenticate_user( $username );

		if ( is_wp_error( $auth_result ) ) {
			return $auth_result;
		}

		return $this->run_function( $sandbox_function, $param_data );
	}

	/**
	 * Find a function by name.
	 *
	 * @param string             $function_name
	 * @param DevBenchFunction[] $functions
	 *
	 * @return DevBenchFunction|null
	 */
	private function find_function( string $function_name, array $functions ): ?DevBenchFunction {
		foreach ( $functions as $function ) {
			// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
			if ( $function->funcName === $function_name ) {
				return $function;
			}
		}

		return null;
	}

	/**
	 * Authenticate and set current user.
	 *
	 * @param string $username
	 *
	 * @return true|\WP_Error
	 */
	private function authenticate_user( string $username ): true|\WP_Error {
		$user = get_user_by( 'login', $username );

		if ( ! $user || ! $user->exists() ) {
			return new \WP_Error(
				'user_not_found',
				'User not found or not authorized.',
				array( 'status' => 401 )
			);
		}

		wp_clear_auth_cookie();
		wp_set_current_user( $user->ID );
		wp_set_auth_cookie( $user->ID );

		return true;
	}

	/**
	 * Execute a sandbox function with error handling.
	 *
	 * @param DevBenchFunction $sandbox_function
	 * @param array            $param_data
	 *
	 * @return string|\WP_Error
	 */
	private function run_function( DevBenchFunction $sandbox_function, array $param_data ): string|\WP_Error {
		// phpcs:disable WordPress.NamingConventions.ValidVariableName.UsedPropertyNotSnakeCase
		$function_name = $sandbox_function->funcName;

		$callback = $sandbox_function->callback;

		// Add custom error handler
		set_error_handler( array( $this, 'error_handler' ) );

		try {
			error_log( '🚀 DevBench: Executing → ' . $function_name );
			$result = call_user_func_array( $callback, $param_data );
			error_log( '✅ DevBench: Success → ' . $function_name );

			// If result is already a string, return as-is; otherwise JSON encode
			if ( is_string( $result ) ) {
				return $result;
			}
			return (string) json_encode( $result );
		} catch ( \Throwable $e ) {
			$this->log_exception( $function_name, $e );

			// note: a 500 error should be returned here, but to properly show the error/debug log in the UI, we keep as 200.
			return new \WP_Error(
				'execution_error',
				sprintf( 'Error executing %s: %s', $function_name, $e->getMessage() ),
				array( 'status' => 200 )
			);
		} finally {
			restore_error_handler();
		}
	}

	/**
	 * Log exception with formatted output.
	 *
	 * @param string     $function_name
	 * @param \Throwable $e
	 *
	 * @return void
	 */
	private function log_exception( string $function_name, \Throwable $e ): void {
		$border    = str_repeat( '═', 80 );
		$error_msg = sprintf(
			"\n%s\n║ 🚨 DEVBENCH EXCEPTION\n║ Function: %s\n║ Error: %s\n║ File: %s:%d\n%s\n║ STACK TRACE:\n%s\n%s\n",
			$border,
			$function_name,
			$e->getMessage(),
			basename( $e->getFile() ),
			$e->getLine(),
			$border,
			$this->format_stack_trace( $e->getTrace() ),
			$border
		);

		error_log( $error_msg );
	}

	/**
	 * Format stack trace for readability.
	 *
	 * @param array $trace
	 *
	 * @return string
	 */
	private function format_stack_trace( array $trace ): string {
		$formatted = '';
		foreach ( $trace as $i => $frame ) {
			$file     = isset( $frame['file'] ) ? basename( $frame['file'] ) : '[internal]';
			$line     = $frame['line'] ?? '??';
			$class    = isset( $frame['class'] ) ? $frame['class'] . $frame['type'] : '';
			$function = $frame['function'] ?? '';

			$formatted .= sprintf(
				"║ %2d. %s%s() at %s:%s\n",
				$i,
				$class,
				$function,
				$file,
				$line
			);
		}

		return rtrim( $formatted );
	}

	/**
	 * Custom error handler for function execution.
	 *
	 * @param int    $errno
	 * @param string $errstr
	 * @param string $errfile
	 * @param int    $errline
	 *
	 * @return bool
	 */
	public function error_handler( int $errno, string $errstr, string $errfile, int $errline ): bool {
		$error_types = array(
			E_ERROR             => '💀 Fatal Error',
			E_WARNING           => '⚠️  Warning',
			E_PARSE             => '📝 Parse Error',
			E_NOTICE            => 'ℹ️  Notice',
			E_CORE_ERROR        => '💀 Core Error',
			E_CORE_WARNING      => '⚠️  Core Warning',
			E_COMPILE_ERROR     => '📝 Compile Error',
			E_COMPILE_WARNING   => '⚠️  Compile Warning',
			E_USER_ERROR        => '💀 User Error',
			E_USER_WARNING      => '⚠️  User Warning',
			E_USER_NOTICE       => 'ℹ️  User Notice',
			E_STRICT            => '📋 Strict Notice',
			E_RECOVERABLE_ERROR => '🔄 Recoverable Error',
			E_DEPRECATED        => '📅 Deprecated',
			E_USER_DEPRECATED   => '📅 User Deprecated',
		);

		$error_type = $error_types[ $errno ] ?? '❓ Unknown Error';
		$border     = str_repeat( '─', 60 );

		error_log( sprintf(
			"\n%s\n│ DEVBENCH PHP ERROR\n│ %s: %s\n│ File: %s:%d\n%s",
			$border,
			$error_type,
			$errstr,
			basename( $errfile ),
			$errline,
			$border
		) );

		return true;
	}

	/**
	 * Capture output of a function and return it as a string.
	 *
	 * @param callable $callback
	 * @param mixed    ...$args
	 *
	 * @return string
	 */
	public static function capture_output( callable $callback, ...$args ): string {
		ob_start();

		try {
			$callback( ...$args );
		} catch ( \Throwable $e ) {
			error_log( '🚨 DevBench capture_output error: ' . $e->getMessage() );
			ob_end_clean();

			return 'Error: ' . $e->getMessage();
		}

		$output = ob_get_contents();
		ob_end_clean();

		return $output;
	}
}
