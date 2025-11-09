<?php
/**
 * Flipcart Admin — get_stats.php
 * Returns total counts for dashboard cards
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

// ✅ Get total users
$users = 0;
$result = $conn->query("SELECT COUNT(*) AS total FROM users");
if ($result) {
    $row = $result->fetch_assoc();
    $users = (int) $row['total'];
}

// ✅ Get total products
$products = 0;
$result = $conn->query("SELECT COUNT(*) AS total FROM products");
if ($result) {
    $row = $result->fetch_assoc();
    $products = (int) $row['total'];
}

// ✅ Get total categories
$categories = 0;
if ($conn->query("SHOW TABLES LIKE 'categories'")->num_rows > 0) {
    $result = $conn->query("SELECT COUNT(*) AS total FROM categories");
    if ($result) {
        $row = $result->fetch_assoc();
        $categories = (int) $row['total'];
    }
}

// ✅ Get total orders (if table exists)
$orders = 0;
if ($conn->query("SHOW TABLES LIKE 'orders'")->num_rows > 0) {
    $result = $conn->query("SELECT COUNT(*) AS total FROM orders");
    if ($result) {
        $row = $result->fetch_assoc();
        $orders = (int) $row['total'];
    }
}

// ✅ Return JSON
json_success([
    "users" => $users,
    "products" => $products,
    "categories" => $categories,
    "orders" => $orders
]);
