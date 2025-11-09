<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');
require_once(__DIR__ . '/../includes/auth_guard.php');

require_admin();

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) json_error("Invalid ID");

$res = $conn->query("SELECT * FROM products WHERE id=$id");
if (!$res || !$res->num_rows) json_error("Not found");

$p = $res->fetch_assoc();
$p['image_url'] = $p['image'] ? "/flipcart/backend/uploads/" . $p['image'] : null;
json_success(["product" => $p]);
