<?php
// backend/products/get_categories.php
require_once(__DIR__ . "/../config/db_connect.php");
require_once(__DIR__ . "/../includes/helpers.php");

$res = $conn->query("SELECT id, name, icon, emoji FROM categories ORDER BY name ASC");
$cats = [];
while ($r = $res->fetch_assoc()) {
  $r['icon_url'] = $r['icon'] ? "/flipcart/backend/uploads/categories/" . $r['icon'] : null;
  $cats[] = $r;
}
json_success(["categories" => $cats]);
?>
