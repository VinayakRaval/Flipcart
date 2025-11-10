<?php
header('Content-Type: application/json');
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');

// ✅ Get JSON input
$raw = file_get_contents("php://input");
if (!$raw) {
    echo json_encode(["success" => false, "error" => "No input received"]);
    exit;
}

$data = json_decode($raw, true);
$email = trim($data['email'] ?? '');
$new_password = trim($data['new_password'] ?? '');

if (!$email || !$new_password) {
    echo json_encode(["success" => false, "error" => "Email and new password are required"]);
    exit;
}

// ✅ Check DB connection
if (!isset($conn) || $conn->connect_error) {
    echo json_encode(["success" => false, "error" => "Database not connected"]);
    exit;
}

// ✅ Check if email exists
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$res = $stmt->get_result();

if ($res->num_rows === 0) {
    echo json_encode(["success" => false, "error" => "No user found with that email"]);
    exit;
}

// ✅ Update password
$new_hash = password_hash($new_password, PASSWORD_BCRYPT);
$update = $conn->prepare("UPDATE users SET password = ? WHERE email = ?");
$update->bind_param("ss", $new_hash, $email);
$ok = $update->execute();

if ($ok) {
    echo json_encode(["success" => true, "message" => "Password reset successful"]);
} else {
    echo json_encode(["success" => false, "error" => "Database update failed"]);
}
