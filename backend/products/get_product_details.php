<?php
// backend/products/get_product_details.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$id = intval($_GET['id'] ?? 0);
if ($id <= 0) json_error("Product id required", 400);

$stmt = $conn->prepare("SELECT id, name, description, price, category, image, stock FROM products WHERE id = ?");
$stmt->bind_param("i", $id);
$stmt->execute();
$res = $stmt->get_result();
if ($res->num_rows === 0) json_error("Product not found", 404);
$row = $res->fetch_assoc();
$row['image_url'] = $row['image'] ? "../uploads/" . $row['image'] : null;
json_success(["product" => $row]);
?>
