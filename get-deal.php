<?php
header('Content-Type: application/json');

$deal = [
    "product_name" => "Spinach",
    "original_price" => 10,
    "deal_price" => 5,
    "image" => "images/spinach.jpg", // path relative to your HTML page
    "deal_end" => date("Y-m-d H:i:s", strtotime("+7 days"))
];

echo json_encode($deal);
?>
