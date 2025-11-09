<?php
// backend/cart/checkout.php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$user_id = $_SESSION['user_id'];
$input = json_decode(file_get_contents("php://input"), true);

// optional address_id
$address_id = isset($input['address_id']) ? intval($input['address_id']) : 0;
$inline_address = $input['address'] ?? null;

// fetch cart items
$stmt = $conn->prepare("SELECT c.product_id, c.quantity, p.price, p.stock, p.name FROM cart c JOIN products p ON p.id = c.product_id WHERE c.user_id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

$items = [];
$total = 0.0;
while ($r = $res->fetch_assoc()) {
    if ($r['stock'] < $r['quantity']) {
        json_error("Product id {$r['product_id']} does not have enough stock", 400);
    }
    $items[] = $r;
    $total += $r['price'] * $r['quantity'];
}

if (count($items) === 0) json_error("Cart is empty", 400);

// Determine shipping address text
$shipping_text = "";
if ($address_id > 0) {
    $a = $conn->prepare("SELECT name, phone, address_line1, address_line2, city, state, pincode FROM user_addresses WHERE id = ? AND user_id = ?");
    $a->bind_param("ii", $address_id, $user_id);
    $a->execute();
    $ar = $a->get_result();
    if ($ar->num_rows === 0) json_error("Address not found", 400);
    $ad = $ar->fetch_assoc();
    $shipping_text = $ad['name'] . " | " . $ad['phone'] . " | " . $ad['address_line1'] . " " . ($ad['address_line2'] ?: '') . " | " . $ad['city'] . " | " . $ad['state'] . " | " . $ad['pincode'];
} elseif ($inline_address && is_array($inline_address)) {
    // minimal inline address expected
    $shipping_text = trim(($inline_address['name'] ?? '') . " | " . ($inline_address['phone'] ?? '') . " | " . ($inline_address['address_line1'] ?? '') . " " . ($inline_address['address_line2'] ?? '') . " | " . ($inline_address['city'] ?? '') . " | " . ($inline_address['state'] ?? '') . " | " . ($inline_address['pincode'] ?? ''));
    if (!$shipping_text) json_error("Invalid inline address", 400);
} else {
    json_error("Address required", 400);
}

// Place order (dummy): create orders + order_items, decrement stock, clear cart
$conn->begin_transaction();

try {
    $insOrder = $conn->prepare("INSERT INTO orders (user_id, total_amount, status, shipping_address, created_at) VALUES (?, ?, 'paid', ?, NOW())");
    $insOrder->bind_param("ids", $user_id, $total, $shipping_text);
    $insOrder->execute();
    $order_id = $insOrder->insert_id;

    $insItem = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
    $updStock = $conn->prepare("UPDATE products SET stock = stock - ? WHERE id = ?");

    foreach ($items as $it) {
        $insItem->bind_param("iiid", $order_id, $it['product_id'], $it['quantity'], $it['price']);
        $insItem->execute();

        $updStock->bind_param("ii", $it['quantity'], $it['product_id']);
        $updStock->execute();
    }

    // clear cart
    $clear = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
    $clear->bind_param("i", $user_id);
    $clear->execute();

    $conn->commit();
    json_success(["message" => "Order placed", "order_id" => $order_id]);
} catch (Exception $e) {
    $conn->rollback();
    json_error("Checkout failed: " . $e->getMessage(), 500);
}
?>
