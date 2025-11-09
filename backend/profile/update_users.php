<?php
// backend/profile/update_users.php
ini_set('display_errors', 1);
error_reporting(E_ALL);

session_start();
require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

// Expected multipart/form-data POST
$id = intval($_POST['id'] ?? 0);
$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$mobile = trim($_POST['mobile'] ?? '');
$pincode = trim($_POST['pincode'] ?? '');
$address = trim($_POST['address'] ?? '');

if ($id <= 0) json_error("Invalid user id");
if (!$name || !$email) json_error("Name and email required");

// fetch existing profile_image if any
$res = $conn->query("SELECT profile_image FROM users WHERE id = " . intval($id));
$existing = null;
if ($res) {
    $row = $res->fetch_assoc();
    $existing = $row['profile_image'] ?? null;
}

// handle uploaded file
$profile_image = $existing;
if (!empty($_FILES['profile_image']['name'])) {
    $dir = __DIR__ . '/../uploads/profiles/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);

    $tmp = $_FILES['profile_image']['tmp_name'];
    $orig = $_FILES['profile_image']['name'];
    $ext = strtolower(pathinfo($orig, PATHINFO_EXTENSION));
    $allowed = ['jpg','jpeg','png','gif','webp'];

    if (!in_array($ext, $allowed)) {
        json_error("Invalid image type");
    }

    $newname = uniqid('user_') . '.' . $ext;
    $dest = $dir . $newname;

    if (!move_uploaded_file($tmp, $dest)) {
        json_error("Failed to save uploaded file");
    }

    // remove old file
    if ($existing && file_exists($dir . $existing)) {
        @unlink($dir . $existing);
    }

    $profile_image = $newname;
}

// Update DB
$stmt = $conn->prepare("UPDATE users SET name = ?, email = ?, mobile = ?, pincode = ?, address = ?, profile_image = ? WHERE id = ?");
if (!$stmt) json_error("DB prepare failed: " . $conn->error);
$stmt->bind_param("ssssssi", $name, $email, $mobile, $pincode, $address, $profile_image, $id);

if (!$stmt->execute()) {
    json_error("DB error: " . $stmt->error);
}

// Read back updated user (limit fields)
$result = $conn->query("SELECT id, name, email, mobile, pincode, address, profile_image, role FROM users WHERE id = " . intval($id));
if (!$result) json_error("DB error after update");

$user = $result->fetch_assoc();

// ensure fields are present (null => empty string)
$user['mobile'] = $user['mobile'] ?? '';
$user['pincode'] = $user['pincode'] ?? '';
$user['address'] = $user['address'] ?? '';
$user['profile_image'] = $user['profile_image'] ?? null;

json_success(["message" => "Profile updated successfully", "user" => $user]);
