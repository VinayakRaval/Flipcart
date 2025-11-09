<?php
/**
 * Flipcart — Place Order API
 * ---------------------------------------
 * Creates a new order, moves cart items to order_items, and clears the cart.
 */

ini_set('display_errors', 1);
error_reporting(E_ALL);
header('Content-Type: application/json');

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data['user_id'] ?? 0);
$shipping_address = trim($data['shipping_address'] ?? '');

if (!$user_id) json_error("Invalid user.");
if (!$shipping_address) json_error("Shipping address required.");

// ✅ Step 1: Fetch user cart
$cartQuery = $conn->prepare("SELECT c.product_id, c.quantity, p.price 
                             FROM cart c 
                             JOIN products p ON c.product_id = p.id 
                             WHERE c.user_id = ?");
$cartQuery->bind_param("i", $user_id);
$cartQuery->execute();
$cartResult = $cartQuery->get_result();

if ($cartResult->num_rows === 0) {
    json_error("Your cart is empty.");
}

// ✅ Step 2: Calculate total
$total_amount = 0;
$cart_items = [];
while ($row = $cartResult->fetch_assoc()) {
    $subtotal = $row['price'] * $row['quantity'];
    $total_amount += $subtotal;
    $cart_items[] = $row;
}

// ✅ Step 3: Create order
$orderQuery = $conn->prepare("INSERT INTO orders (user_id, total_amount, shipping_address, status) VALUES (?, ?, ?, 'pending')");
$orderQuery->bind_param("ids", $user_id, $total_amount, $shipping_address);

if (!$orderQuery->execute()) {
    json_error("Failed to create order: " . $conn->error);
}
$order_id = $conn->insert_id;

// ✅ Step 4: Insert order items
$itemQuery = $conn->prepare("INSERT INTO order_items (order_id, product_id, quantity, price) VALUES (?, ?, ?, ?)");
foreach ($cart_items as $item) {
    $itemQuery->bind_param("iiid", $order_id, $item['product_id'], $item['quantity'], $item['price']);
    $itemQuery->execute();
}

// ✅ Step 5: Clear cart
$delCart = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
$delCart->bind_param("i", $user_id);
$delCart->execute();

json_success([
    "message" => "Order placed successfully!",
    "order_id" => $order_id,
    "total" => $total_amount
]);
?>
