<?php
// backend/auth/reset_password.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$input = json_decode(file_get_contents("php://input"), true);
$email = trim($input['email'] ?? '');
$new = trim($input['new_password'] ?? '');

if(!$email || !$new) json_error("Email and new password required",400);

// hash using SHA256 to match project style
$hash = hash('sha256', $new);
$stmt = $conn->prepare("UPDATE users SET password_hash = ? WHERE email = ?");
$stmt->bind_param("ss", $hash, $email);
if($stmt->execute()){
  if($stmt->affected_rows > 0) json_success(["message"=>"Password updated"]);
  else json_error("No user with that email",404);
} else json_error("Update failed",500);
?>
