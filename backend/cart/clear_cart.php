<?php
// backend/cart/clear_cart.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$user_id = $_SESSION['user_id'];
$del = $conn->prepare("DELETE FROM cart WHERE user_id = ?");
$del->bind_param("i", $user_id);
if ($del->execute()) json_success(["message" => "Cart cleared"]);
else json_error("Clear failed", 500);
?>
