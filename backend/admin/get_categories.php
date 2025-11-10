<?php
// ✅ Flipcart — Get Categories API (Admin + Homepage use)
ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once(__DIR__ . '/../config/db_connect.php');

$sql = "SELECT id, name, emoji, icon, created_at FROM categories ORDER BY id DESC";
$result = $conn->query($sql);

if (!$result) {
    echo json_encode(["success" => false, "error" => "Database error: " . $conn->error]);
    exit;
}

$categories = [];
while ($row = $result->fetch_assoc()) {
    // ✅ Proper full image URL for frontend
    if (!empty($row['icon']) && file_exists(__DIR__ . '/../uploads/categories/' . $row['icon'])) {
        $row['icon_url'] = "http://localhost/flipcart/backend/uploads/categories/" . $row['icon'];
    } else {
        $row['icon_url'] = "http://localhost/flipcart/frontend/assets/icons/placeholder.png";
    }

    $categories[] = $row;
}

echo json_encode(["success" => true, "categories" => $categories]);
