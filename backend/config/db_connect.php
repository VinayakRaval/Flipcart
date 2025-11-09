<?php
// backend/config/db_connect.php
// ✅ Central MySQL database connection (XAMPP compatible)

$DB_HOST = "localhost";       // usually localhost
$DB_USER = "root";            // default XAMPP username
$DB_PASS = "";                // default XAMPP has empty password
$DB_NAME = "flipcart";     // change if your database name differs

// Create MySQLi connection
$conn = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);

// Check connection
if ($conn->connect_error) {
    // return JSON error if helpers already loaded
    if (function_exists('json_error')) {
        json_error("Database connection failed: " . $conn->connect_error, 500);
    } else {
        die("Database connection failed: " . $conn->connect_error);
    }
}

// Optional: force UTF-8 encoding
$conn->set_charset("utf8mb4");
