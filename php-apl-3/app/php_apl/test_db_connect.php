<?php

echo "MYSQL_DATABASE" . getenv('MYSQL_DATABASE') . "\n";
echo "DB_USER" . getenv('DB_USER') . "\n";
echo "DB_PASSWORD" . getenv('DB_PASSWORD') . "\n";

$dsn = "mysql:host=mysql;port=3306;dbname=" . getenv('MYSQL_DATABASE');
$dbh = new PDO($dsn, getenv('DB_USER'),getenv('DB_PASSWORD'));



?>