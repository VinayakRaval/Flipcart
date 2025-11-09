<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');
require_once(__DIR__ . '/../includes/auth_guard.php');

require_admin();

$id = intval($_POST['id'] ?? 0);
$name = trim($_POST['name'] ?? '');
$category = trim($_POST['category'] ?? 'General');
$price = floatval($_POST['price'] ?? 0);
$stock = intval($_POST['stock'] ?? 0);
$desc = trim($_POST['description'] ?? '');
if ($id <= 0) json_error("Invalid ID");

$res = $conn->query("SELECT image FROM products WHERE id=$id");
$old = $res->fetch_assoc();
$image = $old['image'];

if (!empty($_FILES['image']['name'])) {
    $dir = __DIR__ . '/../uploads/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $ext = strtolower(pathinfo($_FILES['image']['name'], PATHINFO_EXTENSION));
    $allowed = ['png','jpg','jpeg','gif','webp'];
    if (!in_array($ext, $allowed)) json_error("Invalid image type");
    $image = uniqid('prod_') . '.' . $ext;
    move_uploaded_file($_FILES['image']['tmp_name'], $dir . $image);
    if ($old['image'] && file_exists($dir . $old['image'])) unlink($dir . $old['image']);
}

$stmt = $conn->prepare("UPDATE products SET name=?, category=?, price=?, stock=?, description=?, image=? WHERE id=?");
$stmt->bind_param("ssdissi", $name, $category, $price, $stock, $desc, $image, $id);
if ($stmt->execute()) json_success(["message" => "Product updated"]);
else json_error("Update failed: " . $conn->error);
