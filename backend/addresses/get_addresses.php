<?php
// backend/addresses/get_addresses.php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT id, name, phone, address_line1, address_line2, city, state, pincode, is_default FROM user_addresses WHERE user_id = ? ORDER BY is_default DESC, id DESC");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

$addresses = [];
while ($r = $res->fetch_assoc()) {
    $addresses[] = $r;
}

json_success(["addresses" => $addresses]);
?>
