<?php

declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
	http_response_code(204);
	exit;
}

$configPath = __DIR__ . '/config.php';

if (!is_file($configPath)) {
	http_response_code(500);
	echo json_encode([
		'ok' => false,
		'error' => 'Missing api/config.php'
	]);
	exit;
}

$config = require $configPath;

if (!is_array($config)) {
	http_response_code(500);
	echo json_encode([
		'ok' => false,
		'error' => 'Invalid api/config.php'
	]);
	exit;
}

function api_json_input(): array
{
	$raw = file_get_contents('php://input');

	if ($raw === false || $raw === '') {
		return [];
	}

	$data = json_decode($raw, true);

	return is_array($data) ? $data : [];
}

function api_fail(int $status, string $message): never
{
	http_response_code($status);
	echo json_encode([
		'ok' => false,
		'error' => $message
	]);
	exit;
}

function api_success(array $payload = []): never
{
	echo json_encode([
		'ok' => true,
		...$payload
	]);
	exit;
}

function api_allowed_table(array $config, string $table): array
{
	$tables = $config['tables'] ?? [];

	if (!isset($tables[$table]) || !is_array($tables[$table])) {
		api_fail(400, 'Table is not allowed');
	}

	return $tables[$table];
}

function api_request_value(string $key, mixed $default = null): mixed
{
	if (array_key_exists($key, $_POST)) {
		return $_POST[$key];
	}

	if (array_key_exists($key, $_GET)) {
		return $_GET[$key];
	}

	$input = api_json_input();

	return $input[$key] ?? $default;
}

try {
	$database = $config['database'] ?? [];
	$charset = $database['charset'] ?? 'utf8mb4';
	$dsn = sprintf(
		'mysql:host=%s;port=%s;dbname=%s;charset=%s',
		$database['host'] ?? '127.0.0.1',
		$database['port'] ?? '3306',
		$database['name'] ?? '',
		$charset
	);

	$pdo = new PDO(
		$dsn,
		$database['user'] ?? '',
		$database['password'] ?? '',
		[
			PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
			PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
			PDO::ATTR_EMULATE_PREPARES => false,
		]
	);
} catch (Throwable $exception) {
	api_fail(500, 'Database connection failed');
}
