<?php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$category = $_GET['category'] ?? '';

if ($category) {
  $stmt = $conn->prepare("SELECT id, name, price, image, category FROM products WHERE category = ?");
  $stmt->bind_param("s", $category);
  $stmt->execute();
  $res = $stmt->get_result();
} else {
  $res = $conn->query("SELECT id, name, price, image, category FROM products");
}

$products = [];
while ($row = $res->fetch_assoc()) {
  $row['image_url'] = "../uploads/" . $row['image'];
  $products[] = $row;
}

json_success(["products" => $products]);
?>
