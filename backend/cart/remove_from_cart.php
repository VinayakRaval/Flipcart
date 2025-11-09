<?php
// backend/cart/remove_from_cart.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$data = json_decode(file_get_contents("php://input"), true);
$cart_id = intval($data['cart_id'] ?? 0);
$user_id = $_SESSION['user_id'];

if ($cart_id <= 0) json_error("cart_id required", 400);

// ensure ownership
$check = $conn->prepare("SELECT id FROM cart WHERE id = ? AND user_id = ?");
$check->bind_param("ii", $cart_id, $user_id);
$check->execute();
$res = $check->get_result();
if ($res->num_rows === 0) json_error("Cart item not found", 404);

$del = $conn->prepare("DELETE FROM cart WHERE id = ?");
$del->bind_param("i", $cart_id);
if ($del->execute()) json_success(["message" => "Removed from cart"]);
else json_error("Delete failed", 500);
?>
