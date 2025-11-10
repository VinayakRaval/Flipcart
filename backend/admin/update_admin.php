<?php
/**
 * Flipcart Admin - Update Admin Profile (Final Version)
 */
ini_set('display_errors', 1);
error_reporting(E_ALL);

header('Content-Type: application/json');

require_once(__DIR__ . '/../config/db_connect.php');
require_once(__DIR__ . '/../includes/helpers.php');

$admin_id = $_POST['id'] ?? null;
$name = trim($_POST['name'] ?? '');

if (!$admin_id) json_error("Missing admin ID");
if ($name === "") json_error("Name is required");

// ✅ Fetch admin from users table
$stmt = $conn->prepare("SELECT id, email, profile_image FROM users WHERE id = ? AND role = 'admin' LIMIT 1");
$stmt->bind_param("i", $admin_id);
$stmt->execute();
$result = $stmt->get_result();

if ($result->num_rows === 0) json_error("Admin not found");
$admin = $result->fetch_assoc();

$profile_image = $admin['profile_image'] ?? null;

// ✅ Image Upload Handling
if (!empty($_FILES['profile_image']['name'])) {
    $upload_dir = __DIR__ . '/../uploads/admins/';
    if (!is_dir($upload_dir)) mkdir($upload_dir, 0777, true);

    $ext = strtolower(pathinfo($_FILES['profile_image']['name'], PATHINFO_EXTENSION));
    $allowed = ['jpg', 'jpeg', 'png', 'gif', 'webp'];
    if (!in_array($ext, $allowed)) json_error("Invalid image format");

    $new_filename = 'admin_' . time() . '_' . mt_rand(1000, 9999) . '.' . $ext;
    $target = $upload_dir . $new_filename;

    if (move_uploaded_file($_FILES['profile_image']['tmp_name'], $target)) {
        // Delete old image if exists
        if (!empty($profile_image) && file_exists($upload_dir . $profile_image)) {
            unlink($upload_dir . $profile_image);
        }
        $profile_image = $new_filename;
    } else {
        json_error("Image upload failed");
    }
}

// ✅ Update admin record
$update = $conn->prepare("UPDATE users SET name = ?, profile_image = ? WHERE id = ?");
$update->bind_param("ssi", $name, $profile_image, $admin_id);

if (!$update->execute()) {
    json_error("Database update failed: " . $conn->error);
}

// ✅ Return new data
json_success([
    "message" => "Profile updated successfully",
    "admin" => [
        "id" => $admin_id,
        "name" => $name,
        "email" => $admin['email'],
        "profile_image" => $profile_image
    ]
]);
