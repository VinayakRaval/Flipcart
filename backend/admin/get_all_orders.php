<?php
// backend/admin/get_all_orders.php
session_start();
require_once("../config/db_connect.php");
require_once("../includes/helpers.php");
require_once("../includes/auth_guard.php");

require_admin();

// Fetch all orders
$sql = "SELECT o.id AS order_id, o.user_id, u.name AS user_name, u.email,
               o.total_amount, o.status, o.created_at
        FROM orders o
        JOIN users u ON u.id = o.user_id
        ORDER BY o.created_at DESC";

$res = $conn->query($sql);
$orders = [];

while ($order = $res->fetch_assoc()) {
    // Fetch order items
    $itemStmt = $conn->prepare("SELECT oi.product_id, oi.quantity, oi.price, p.name, p.image
                                FROM order_items oi
                                JOIN products p ON p.id = oi.product_id
                                WHERE oi.order_id = ?");
    $itemStmt->bind_param("i", $order['order_id']);
    $itemStmt->execute();
    $itemsRes = $itemStmt->get_result();
    $items = [];
    while ($it = $itemsRes->fetch_assoc()) {
        $it['image_url'] = $it['image'] ? "../uploads/" . $it['image'] : null;
        $items[] = $it;
    }
    $order['items'] = $items;
    $orders[] = $order;
}

json_success(["orders" => $orders]);
?>
