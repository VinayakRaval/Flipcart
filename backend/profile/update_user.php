<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$id = $_POST['id'] ?? '';
$name = trim($_POST['name'] ?? '');
$mobile = trim($_POST['mobile'] ?? '');
$address = trim($_POST['address'] ?? '');

if (!$id || !$name) {
    json_error("Missing required fields");
}

// Handle profile image upload
$profile_image = null;
if (!empty($_FILES['profile_image']['name'])) {
    $dir = __DIR__ . '/../uploads/profiles/';
    if (!is_dir($dir)) mkdir($dir, 0777, true);
    $ext = strtolower(pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION));
    $allowed = ['png', 'jpg', 'jpeg', 'webp'];
    if (!in_array($ext, $allowed)) json_error("Invalid image type");
    $profile_image = uniqid('user_') . '.' . $ext;
    move_uploaded_file($_FILES['profile_image']['tmp_name'], $dir . $profile_image);
}

// Update DB
$sql = "UPDATE users SET name=?, mobile=?, address=?";
$params = [$name, $mobile, $address];
$types = "sss";

if ($profile_image) {
    $sql .= ", profile_image=?";
    $params[] = $profile_image;
    $types .= "s";
}

$sql .= " WHERE id=?";
$params[] = $id;
$types .= "i";

$stmt = $conn->prepare($sql);
$stmt->bind_param($types, ...$params);

if ($stmt->execute()) {
    $result = $conn->query("SELECT id, name, email, mobile, address, profile_image FROM users WHERE id=$id");
    $user = $result->fetch_assoc();
    json_success(["message" => "Profile updated", "user" => $user]);
} else {
    json_error("Database update failed: " . $conn->error);
}
