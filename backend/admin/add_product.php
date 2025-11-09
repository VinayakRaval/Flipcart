<?php
// backend/admin/add_product.php
header("Content-Type: application/json");
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

// ✅ Capture POST data safely
$name       = trim($_POST['prodName'] ?? '');
$category   = trim($_POST['prodCategory'] ?? '');
$price      = trim($_POST['prodPrice'] ?? '');
$stock      = trim($_POST['prodStock'] ?? '0');
$description = trim($_POST['prodDesc'] ?? '');

// ✅ Validate
if ($name === '') json_error("Product name required");
if ($category === '') json_error("Category required");
if ($price === '' || !is_numeric($price)) json_error("Valid price required");

// ✅ Handle Image Upload
$image_name = null;
if (!empty($_FILES['prodImage']['name'])) {
    $upload_dir = __DIR__ . '/../uploads/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $ext = strtolower(pathinfo($_FILES['prodImage']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($ext, $allowed)) json_error("Invalid image type");

    $image_name = uniqid() . '_' . basename($_FILES['prodImage']['name']);
    $target = $upload_dir . $image_name;
    if (!move_uploaded_file($_FILES['prodImage']['tmp_name'], $target)) {
        json_error("Image upload failed");
    }
}

// ✅ Insert product
$stmt = $conn->prepare("INSERT INTO products (name, category, price, stock, description, image) VALUES (?, ?, ?, ?, ?, ?)");
$stmt->bind_param("ssdiss", $name, $category, $price, $stock, $description, $image_name);

if ($stmt->execute()) {
    json_success(["message" => "✅ Product added successfully"]);
} else {
    json_error("Database error: " . $conn->error);
}
?>
