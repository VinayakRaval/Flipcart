<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$id = intval($_POST['id'] ?? 0);
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$mobile = trim($_POST['mobile'] ?? '');
$address = trim($_POST['address'] ?? '');

if ($id <= 0) json_error("Invalid user ID");
if (!$name || !$email) json_error("Name and email required");

$image = null;

// Fetch existing
$res = $conn->query("SELECT profile_image FROM users WHERE id=$id");
$old = $res->fetch_assoc();
$existing = $old['profile_image'] ?? null;

// Handle new upload
if (!empty($_FILES['profile_image']['name'])) {
    $dir = __DIR__ . '/../uploads/profiles/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $ext = strtolower(pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','webp','gif'];
    if (!in_array($ext, $allowed)) json_error("Invalid file type");
    $image = uniqid('user_') . '.' . $ext;
    move_uploaded_file($_FILES['profile_image']['tmp_name'], $dir . $image);
    if ($existing && file_exists($dir . $existing)) unlink($dir . $existing);
} else {
    $image = $existing;
}

// Update user info
$stmt = $conn->prepare("UPDATE users SET name=?, email=?, mobile=?, address=?, profile_image=? WHERE id=?");
$stmt->bind_param("sssssi", $name, $email, $mobile, $address, $image, $id);
if ($stmt->execute()) {
    $result = $conn->query("SELECT id,name,email,mobile,address,profile_image FROM users WHERE id=$id");
    $user = $result->fetch_assoc();
    json_success(["message" => "Profile updated", "user" => $user]);
} else {
    json_error("DB Error: " . $conn->error);
}
