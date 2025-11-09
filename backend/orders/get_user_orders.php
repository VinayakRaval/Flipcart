<?php
// backend/orders/get_user_orders.php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$user_id = $_SESSION['user_id'];

$sql = "SELECT id AS order_id, total_amount, status, shipping_address, created_at
        FROM orders WHERE user_id = ? ORDER BY created_at DESC";
$stmt = $conn->prepare($sql);
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

$orders = [];
while ($o = $res->fetch_assoc()) {
  $itStmt = $conn->prepare(
    "SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image
     FROM order_items oi
     JOIN products p ON p.id = oi.product_id
     WHERE oi.order_id = ?"
  );
  $itStmt->bind_param("i", $o['order_id']);
  $itStmt->execute();
  $r2 = $itStmt->get_result();
  $items = [];
  while ($row = $r2->fetch_assoc()) {
    $row['image_url'] = $row['image'] ? "../uploads/" . $row['image'] : null;
    $items[] = $row;
  }
  $o['items'] = $items;
  $orders[] = $o;
}

json_success(["orders" => $orders]);
?>
