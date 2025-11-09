<?php
// backend/includes/helpers.php
// ✅ Global helper functions used by all backend files

// Force JSON output
function json_success($data = [], $code = 200) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(array_merge(['success' => true], $data), JSON_UNESCAPED_UNICODE);
    exit;
}

function json_error($message = 'Error', $code = 400) {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode(['success' => false, 'error' => $message], JSON_UNESCAPED_UNICODE);
    exit;
}

// Simple debug helper (optional)
function dd($data) {
    echo '<pre>';
    print_r($data);
    echo '</pre>';
    exit;
}
