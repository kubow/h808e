<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
	api_fail(405, 'Method not allowed');
}

$table = (string) api_request_value('table', '');
$payload = api_request_value('data', []);

if (!is_array($payload) || $payload === []) {
	api_fail(400, 'Missing data payload');
}

$tableConfig = api_allowed_table($config, $table);
$allowedColumns = $tableConfig['columns'] ?? [];
$insertableColumns = $tableConfig['insertable_columns'] ?? $allowedColumns;
$filtered = [];

foreach ($payload as $column => $value) {
	if (in_array($column, $insertableColumns, true)) {
		$filtered[$column] = $value;
	}
}

if ($filtered === []) {
	api_fail(400, 'No allowed columns to insert');
}

$columns = array_keys($filtered);
$placeholders = array_map(static fn (string $column): string => ':' . $column, $columns);
$sql = sprintf(
	'INSERT INTO `%s` (%s) VALUES (%s)',
	$table,
	implode(', ', array_map(static fn (string $column): string => sprintf('`%s`', $column), $columns)),
	implode(', ', $placeholders)
);

try {
	$statement = $pdo->prepare($sql);

	foreach ($filtered as $column => $value) {
		$statement->bindValue(':' . $column, $value);
	}

	$statement->execute();

	api_success([
		'table' => $table,
		'id' => (int) $pdo->lastInsertId()
	]);
} catch (Throwable $exception) {
	api_fail(500, 'Insert failed');
}
