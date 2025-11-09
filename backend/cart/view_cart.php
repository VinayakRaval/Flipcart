<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

// Read user ID
$input = json_decode(file_get_contents("php://input"), true);
$user_id = intval($_GET['user_id'] ?? ($input['user_id'] ?? 0));
if ($user_id <= 0) $user_id = 999;

// Get cart
$sql = "SELECT 
          c.id AS cart_id,
          c.product_id,
          c.quantity,
          p.name,
          p.price,
          p.image,
          (p.price * c.quantity) AS subtotal
        FROM cart c
        JOIN products p ON p.id = c.product_id
        WHERE c.user_id = ?
        ORDER BY c.id DESC";

$stmt = $conn->prepare($sql);
if (!$stmt) json_error("SQL prepare failed: " . $conn->error);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$result = $stmt->get_result();

$cart = [];
$total = 0;

while ($row = $result->fetch_assoc()) {
    $row['image_url'] = "/flipcart/backend/uploads/" . $row['image'];
    $cart[] = $row;
    $total += floatval($row['subtotal']);
}

json_success([
    "cart" => $cart,
    "total" => $total,
    "count" => count($cart)
]);
