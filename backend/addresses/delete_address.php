<?php
// backend/addresses/delete_address.php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$data = json_decode(file_get_contents("php://input"), true);
$addr_id = intval($data['id'] ?? 0);
if ($addr_id <= 0) json_error("Address id required", 400);

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("DELETE FROM user_addresses WHERE id = ? AND user_id = ?");
$stmt->bind_param("ii", $addr_id, $user_id);
if ($stmt->execute()) {
    json_success(["message" => "Address deleted"]);
} else {
    json_error("Delete failed", 500);
}
?>
