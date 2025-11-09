<?php
// backend/auth/logout.php
session_start();
session_destroy();
echo json_encode(["message" => "Logged out successfully"]);
?>
