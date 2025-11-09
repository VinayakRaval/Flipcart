<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
// backend/admin/edit_product.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_admin();

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    json_error("POST required", 405);
}

$id = intval($_POST['id'] ?? 0);
if ($id <= 0) json_error("Product id required", 400);

// fetch existing
$check = $conn->prepare("SELECT image FROM products WHERE id = ?");
$check->bind_param("i", $id);
$check->execute();
$res = $check->get_result();
if ($res->num_rows === 0) json_error("Product not found", 404);
$row = $res->fetch_assoc();
$existingImage = $row['image'];

$name = trim($_POST['name'] ?? '');
$description = trim($_POST['description'] ?? '');
$price = floatval($_POST['price'] ?? 0);
$category = trim($_POST['category'] ?? '');
$stock = intval($_POST['stock'] ?? 0);

if (!$name || $price <= 0) json_error("Name and valid price required", 400);

// image optional update
$image_filename = $existingImage;
if (!empty($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
    $fileTmp = $_FILES['image']['tmp_name'];
    $origName = $_FILES['image']['name'];
    $safe = safe_filename(basename($origName));
    $ext = pathinfo($safe, PATHINFO_EXTENSION);
    $uniq = time() . "_" . bin2hex(random_bytes(4));
    $image_filename = $uniq . "." . $ext;
    $uploadDir = __DIR__ . "/../uploads/";
    if (!is_dir($uploadDir)) mkdir($uploadDir, 0755, true);
    $dest = $uploadDir . $image_filename;
    if (!move_uploaded_file($fileTmp, $dest)) {
        json_error("Image upload failed", 500);
    }
    // optionally delete old image
    if ($existingImage && file_exists(__DIR__ . "/../uploads/" . $existingImage)) {
        @unlink(__DIR__ . "/../uploads/" . $existingImage);
    }
}

$stmt = $conn->prepare("UPDATE products SET name=?, description=?, price=?, category=?, image=?, stock=? WHERE id=?");
$stmt->bind_param("ssdssii", $name, $description, $price, $category, $image_filename, $stock, $id);

if ($stmt->execute()) {
    json_success(["message" => "Product updated"]);
} else {
    json_error("Update failed: " . $stmt->error, 500);
}
?>
