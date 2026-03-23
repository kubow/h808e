<?php

declare(strict_types=1);

return [
	'database' => [
		'host' => '127.0.0.1',
		'port' => '3306',
		'name' => 'your_database',
		'user' => 'your_user',
		'password' => 'your_password',
		'charset' => 'utf8mb4',
	],
	'tables' => [
		'notes' => [
			'columns' => ['id', 'title', 'body', 'created_at'],
			'insertable_columns' => ['title', 'body'],
			'default_order_by' => 'id',
			'max_limit' => 100,
		],
	],
];
