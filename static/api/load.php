<?php

declare(strict_types=1);

require __DIR__ . '/bootstrap.php';

if ($_SERVER['REQUEST_METHOD'] !== 'GET') {
	api_fail(405, 'Method not allowed');
}

$table = (string) api_request_value('table', '');
$tableConfig = api_allowed_table($config, $table);
$allowedColumns = $tableConfig['columns'] ?? [];
$defaultOrderBy = $tableConfig['default_order_by'] ?? 'id';
$maxLimit = (int) ($tableConfig['max_limit'] ?? 100);
$limit = (int) api_request_value('limit', 25);

if ($limit < 1) {
	$limit = 1;
}

if ($limit > $maxLimit) {
	$limit = $maxLimit;
}

$orderBy = (string) api_request_value('order_by', $defaultOrderBy);

if (!in_array($orderBy, $allowedColumns, true)) {
	$orderBy = $defaultOrderBy;
}

$direction = strtoupper((string) api_request_value('direction', 'DESC'));
$direction = $direction === 'ASC' ? 'ASC' : 'DESC';

$sql = sprintf(
		'SELECT %s FROM `%s` ORDER BY `%s` %s LIMIT %d',
		implode(', ', array_map(static fn (string $column): string => sprintf('`%s`', $column), $allowedColumns)),
		$table,
		$orderBy,
		$direction,
		$limit
);

try {
	$statement = $pdo->query($sql);
	$rows = $statement->fetchAll();
	api_success([
		'table' => $table,
		'count' => count($rows),
		'rows' => $rows
	]);
} catch (Throwable $exception) {
	api_fail(500, 'Load query failed');
}
