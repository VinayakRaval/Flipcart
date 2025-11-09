<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');
require_once(__DIR__ . '/../includes/auth_guard.php');

require_admin();

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id'] ?? 0);
if ($id <= 0) json_error("Invalid ID");

$res = $conn->query("SELECT icon FROM categories WHERE id=$id");
if ($res && $res->num_rows > 0) {
    $row = $res->fetch_assoc();
    if ($row['icon'] && file_exists(__DIR__ . '/../uploads/categories/' . $row['icon'])) {
        unlink(__DIR__ . '/../uploads/categories/' . $row['icon']);
    }
}

$conn->query("DELETE FROM categories WHERE id=$id");
json_success(["message" => "Category deleted"]);
