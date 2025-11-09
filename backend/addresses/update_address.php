<?php
// backend/addresses/update_address.php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$data = json_decode(file_get_contents("php://input"), true);
$addr_id = intval($data['id'] ?? 0);
$name = trim($data['name'] ?? '');
$phone = trim($data['phone'] ?? '');
$line1 = trim($data['address_line1'] ?? '');
$line2 = trim($data['address_line2'] ?? '');
$city = trim($data['city'] ?? '');
$state = trim($data['state'] ?? '');
$pincode = trim($data['pincode'] ?? '');
$is_default = isset($data['is_default']) ? intval($data['is_default']) : 0;

if ($addr_id <= 0 || !$name || !$phone || !$line1 || !$city || !$pincode) {
    json_error("Missing required fields", 400);
}

$user_id = $_SESSION['user_id'];

$conn->begin_transaction();
try {
    if ($is_default) {
        $u = $conn->prepare("UPDATE user_addresses SET is_default = 0 WHERE user_id = ?");
        $u->bind_param("i", $user_id);
        $u->execute();
    }

    $stmt = $conn->prepare("UPDATE user_addresses SET name=?, phone=?, address_line1=?, address_line2=?, city=?, state=?, pincode=?, is_default=? WHERE id=? AND user_id=?");
    $stmt->bind_param("ssssssiiii", $name, $phone, $line1, $line2, $city, $state, $pincode, $is_default, $addr_id, $user_id);
    $stmt->execute();

    $conn->commit();
    json_success(["message" => "Address updated"]);
} catch (Exception $e) {
    $conn->rollback();
    json_error("Update failed: " . $e->getMessage(), 500);
}
?>
