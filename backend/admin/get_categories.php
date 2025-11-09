<?php
/**
 * Flipcart Admin - get_categories.php (Final)
 * Returns all categories with correct icon URL
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$sql = "SELECT id, name, icon, created_at FROM categories ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) {
    json_error("Database error: " . $conn->error);
}

$categories = [];
while ($row = $result->fetch_assoc()) {
    // ✅ If icon file exists, create proper URL
    $row['icon_url'] = !empty($row['icon'])
        ? "/flipcart/backend/uploads/" . $row['icon']
        : "/flipcart/backend/uploads/default-category.png"; // fallback image
    $categories[] = $row;
}

json_success(["categories" => $categories]);
