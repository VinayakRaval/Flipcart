<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');
require_once(__DIR__ . '/../includes/auth_guard.php');

require_admin();

$name = trim($_POST['name'] ?? '');
$emoji = trim($_POST['emoji'] ?? '');
if (!$name) json_error("Category name required");

$icon_name = null;
if (!empty($_FILES['icon']['name'])) {
    $dir = __DIR__ . '/../uploads/categories/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $ext = strtolower(pathinfo($_FILES['icon']['name'], PATHINFO_EXTENSION));
    $allowed = ['png', 'jpg', 'jpeg', 'gif', 'webp'];
    if (!in_array($ext, $allowed)) json_error("Invalid image type");
    $icon_name = uniqid('cat_') . '.' . $ext;
    move_uploaded_file($_FILES['icon']['tmp_name'], $dir . $icon_name);
}

$stmt = $conn->prepare("INSERT INTO categories (name, emoji, icon) VALUES (?, ?, ?)");
$stmt->bind_param("sss", $name, $emoji, $icon_name);
if ($stmt->execute()) {
    json_success(["message" => "Category added successfully"]);
} else {
    json_error("DB Error: " . $conn->error);
}
