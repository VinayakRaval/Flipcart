<?php
session_start();
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$data = json_decode(file_get_contents("php://input"), true);
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = trim($data['password'] ?? '');
$role = $data['role'] ?? 'user';

if (!$name || !$email || !$password) {
    json_error("All fields are required", 400);
}

// check duplicate email
$chk = $conn->prepare("SELECT id FROM users WHERE email=?");
$chk->bind_param("s", $email);
$chk->execute();
$r = $chk->get_result();
if ($r->num_rows > 0) json_error("Email already exists", 409);

$hash = hash('sha256', $password);
$stmt = $conn->prepare("INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)");
$stmt->bind_param("ssss", $name, $email, $hash, $role);

if ($stmt->execute()) {
    json_success(["message" => "User registered successfully"]);
} else {
    json_error("Registration failed", 500);
}
?>
