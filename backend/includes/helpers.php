<?php
// =============================================================
// Global Helper Functions (used by all backend APIs)
// =============================================================

function json_success($data = [], $code = 200) {
    http_response_code($code);
    echo json_encode(array_merge(["success" => true], $data), JSON_UNESCAPED_SLASHES);
    exit;
}

function json_error($message = "Unknown error", $code = 400) {
    http_response_code($code);
    echo json_encode(["success" => false, "error" => $message], JSON_UNESCAPED_SLASHES);
    exit;
}
