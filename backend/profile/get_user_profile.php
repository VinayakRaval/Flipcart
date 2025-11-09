<?php
// backend/profile/get_user.php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");
require_once(__DIR__ . "/../includes/auth_guard.php");

require_login();

$user_id = $_SESSION['user_id'];

$stmt = $conn->prepare("SELECT id, name, email, role, created_at FROM users WHERE id = ?");
$stmt->bind_param("i", $user_id);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    json_error("User not found", 404);
}

$user = $res->fetch_assoc();
json_success(["user" => $user]);
?>
