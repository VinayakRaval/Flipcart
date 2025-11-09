<?php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$data = json_decode(file_get_contents("php://input"), true);
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');

if (!$email || !$password) {
    json_error("Email and password are required", 400);
}

$hash = hash('sha256', $password);
$stmt = $conn->prepare("SELECT id, name, email, role FROM users WHERE email = ? AND password_hash = ?");
$stmt->bind_param("ss", $email, $hash);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    json_error("Invalid email or password", 401);
}

$user = $res->fetch_assoc();

// Set session
$_SESSION['user_id'] = $user['id'];
$_SESSION['role'] = $user['role'];

json_success(["user" => $user]);
?>
