<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');
require_once(__DIR__ . '/../includes/auth_guard.php');

require_admin();

$name = trim($_POST['name'] ?? '');
$category = trim($_POST['category'] ?? 'General');
$price = floatval($_POST['price'] ?? 0);
$stock = intval($_POST['stock'] ?? 0);
$desc = trim($_POST['description'] ?? '');

if (!$name) json_error("Product name required");

$image = null;
if (!empty($_FILES['image']['name'])) {
    $dir = __DIR__ . '/../uploads/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $allowed = ['png','jpg','jpeg','webp','gif'];
    if (!in_array($ext, $allowed)) json_error("Invalid image type");
    $image = uniqid('prod_') . '.' . $ext;
    move_uploaded_file($_FILES['image']['tmp_name'], $dir . $image);
}

$stmt = $conn->prepare("INSERT INTO products (name, category, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdi ss", $name, $category, $price, $stock, $desc, $image);
$stmt = $conn->prepare("INSERT INTO products (name, category, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdiss", $name, $category, $price, $stock, $desc, $image);

if ($stmt->execute()) json_success(["message" => "Product added"]);
else json_error("Error: " . $conn->error);
