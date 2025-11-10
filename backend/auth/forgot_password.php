<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? '');

if (!$email) {
    json_error("Email is required");
}

// Check user
$stmt = $conn->prepare("SELECT id FROM users WHERE email = ?");
$stmt->bind_param("s", $email);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) {
    json_error("Email not found");
}

$user = $result->fetch_assoc();
$user_id = $user['id'];

// Generate temporary password
$temp_pass = substr(md5(time()), 0, 8);
$hashed = password_hash($temp_pass, PASSWORD_DEFAULT);

// Update password in DB
$update = $conn->prepare("UPDATE users SET password=? WHERE id=?");
$update->bind_param("si", $hashed, $user_id);

if ($update->execute()) {
    // For testing in XAMPP — show new password directly (no email)
    json_success([
        "message" => "Password reset successful! Your new temporary password is: $temp_pass"
    ]);
} else {
    json_error("Failed to update password. Try again later.");
}
