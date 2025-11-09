<?php
/**
 * Flipcart – Add to Cart
 * Works for both logged-in users and guest user_id = 999
 */
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

// --- Read JSON ---
$data = json_decode(file_get_contents("php://input"), true);
$user_id = intval($data['user_id'] ?? 0);
$product_id = intval($data['product_id'] ?? 0);
$quantity = intval($data['quantity'] ?? 1);

if ($user_id <= 0) $user_id = 999; // allow guest mode

if ($product_id <= 0) {
    json_error("Invalid product_id");
}

// --- Check if product exists ---
$stmt = $conn->prepare("SELECT id, name, price, stock FROM products WHERE id=?");
$stmt->bind_param("i", $product_id);
$stmt->execute();
$product = $stmt->get_result()->fetch_assoc();

if (!$product) {
    json_error("Product not found");
}

// --- Check if product already in cart ---
$stmt = $conn->prepare("SELECT id, quantity FROM cart WHERE user_id=? AND product_id=?");
$stmt->bind_param("ii", $user_id, $product_id);
$stmt->execute();
$existing = $stmt->get_result()->fetch_assoc();

if ($existing) {
    // Update quantity
    $new_qty = $existing['quantity'] + $quantity;
    $stmt = $conn->prepare("UPDATE cart SET quantity=? WHERE id=?");
    $stmt->bind_param("ii", $new_qty, $existing['id']);
    $stmt->execute();
} else {
    // Insert new item
    $stmt = $conn->prepare("INSERT INTO cart (user_id, product_id, quantity) VALUES (?, ?, ?)");
    $stmt->bind_param("iii", $user_id, $product_id, $quantity);
    $stmt->execute();
}

json_success(["message" => "Product added to cart successfully"]);
