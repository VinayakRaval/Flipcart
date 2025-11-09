<?php
// backend/includes/auth_guard.php
// ✅ Role-based access control for Admin/User

function require_login() {
    if (empty($_SESSION['user_id'])) {
        json_error("Unauthorized — Please log in first", 401);
    }
}

function require_admin() {
    require_login();
    if (empty($_SESSION['role']) || $_SESSION['role'] !== 'admin') {
        json_error("Access denied — Admin only", 403);
    }
}

function require_user() {
    require_login();
    if (empty($_SESSION['role']) || $_SESSION['role'] !== 'user') {
        json_error("Access denied — User only", 403);
    }
}
