<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$sql = "SELECT id, name, category, price, stock, image FROM products ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) json_error("DB query failed: " . $conn->error);

$products = [];
while ($row = $result->fetch_assoc()) {
  $row['image_url'] = "/flipcart/backend/uploads/" . $row['image'];
  $products[] = $row;
}

json_success(["products" => $products]);
