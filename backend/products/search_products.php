<?php
// backend/products/search_products.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$q = trim($_GET['q'] ?? '');
if ($q === '') json_error("Query required", 400);

$like = "%" . $q . "%";
$stmt = $conn->prepare("SELECT id, name, price, image FROM products WHERE name LIKE ? OR description LIKE ? LIMIT 50");
$stmt->bind_param("ss", $like, $like);
$stmt->execute();
$res = $stmt->get_result();

$items = [];
while ($r = $res->fetch_assoc()) {
    $r['image_url'] = $r['image'] ? "../uploads/" . $r['image'] : null;
    $items[] = $r;
}
json_success(["results" => $items]);
?>
